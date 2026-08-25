"""Extract real NIFTY OHLC data from the alphaIMB project into lib/nifty-data.ts.

The Trading Academy ships the generated TypeScript file, so the app never depends on
alphaIMB at runtime. Re-run this only when you want to refresh or re-pick the windows:

    python scripts/extract-nifty-data.py [path-to-alphaIMB]

Sources (all real NIFTY market data, not synthetic):
  research/candlestick_patterns/nifty_60min_candles.csv  - hourly spot bars with pattern flags
  research/candlestick_patterns/nifty_15min_candles.csv  - 15-minute spot bars, aggregated to daily
  data/nifty_fut/*.csv                                   - 1-minute NIFTY futures with real volume
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

ALPHA = Path(sys.argv[1] if len(sys.argv) > 1 else r"C:\Users\vipin\alphaIMB")
OUT = Path(__file__).resolve().parent.parent / "lib" / "nifty-data.ts"

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def pretty_date(iso: str) -> str:
    y, m, d = iso[:10].split("-")
    return f"{int(d)} {MONTHS[int(m) - 1]} {y}"


def read_candles(name):
    rows = []
    with open(ALPHA / "research" / "candlestick_patterns" / name, encoding="utf-8") as fh:
        for r in csv.DictReader(fh):
            try:
                rows.append({
                    "t": r["timestamp"],
                    "o": float(r["open"]), "h": float(r["high"]),
                    "l": float(r["low"]), "c": float(r["close"]),
                    "flags": {k: v == "True" for k, v in r.items() if k.startswith("pat_")},
                })
            except (ValueError, KeyError):
                continue
    return rows


def bar(row, with_volume=False):
    out = {"t": row["t"][:16].replace("T", " "), "o": round(row["o"], 2), "h": round(row["h"], 2),
           "l": round(row["l"], 2), "c": round(row["c"], 2)}
    if with_volume:
        out["v"] = int(row.get("v", 0))
    return out


# ── 1. Candlestick pattern examples ─────────────────────────────────────────
# Each entry: the flag to look for, how many bars form the pattern, and whether the
# preceding move must be down or up (a hammer after a rise is a hanging man).
PATTERNS = [
    ("doji", "Doji", "neutral", "pat_doji", 1, None),
    ("hammer", "Hammer", "bullish", "pat_hammer", 1, "down"),
    ("hanging-man", "Hanging man", "bearish", "pat_hanging_man", 1, "up"),
    ("shooting-star", "Shooting star", "bearish", "pat_shooting_star", 1, "up"),
    ("bullish-engulfing", "Bullish engulfing", "bullish", "pat_bull_engulfing", 2, "down"),
    ("bearish-engulfing", "Bearish engulfing", "bearish", "pat_bear_engulfing", 2, "up"),
    ("harami", "Harami", "bullish", "pat_bull_harami", 2, "down"),
    ("morning-star", "Morning star", "bullish", "pat_morning_star", 3, "down"),
    ("evening-star", "Evening star", "bearish", "pat_evening_star", 3, "up"),
]

CONTEXT = 4  # bars of preceding move shown before the pattern


def pick_pattern(rows, flag, pattern_bars, prior):
    """Score every real occurrence and return the clearest one.

    Clearest means: the preceding move actually goes the right way, the pattern bars are
    large relative to their neighbours (so the shape is visible), and the whole window
    fits on one screen without one giant bar flattening the rest."""
    best, best_score = None, -1e9
    for i, row in enumerate(rows):
        if not row["flags"].get(flag):
            continue
        start = i - pattern_bars + 1 - CONTEXT
        if start < 0 or i + 2 >= len(rows):
            continue
        window = rows[start:i + 2]
        lead = window[:CONTEXT]
        drift = lead[-1]["c"] - lead[0]["o"]
        if prior == "down" and drift >= 0:
            continue
        if prior == "up" and drift <= 0:
            continue
        span = max(w["h"] for w in window) - min(w["l"] for w in window)
        if span <= 0:
            continue
        pattern = window[CONTEXT:CONTEXT + pattern_bars]
        pattern_range = max(p["h"] for p in pattern) - min(p["l"] for p in pattern)
        biggest = max(w["h"] - w["l"] for w in window)
        # Reward a clear preceding move and a pattern that occupies a good share of the
        # window; penalise any single bar that dwarfs everything else.
        score = (abs(drift) / span) * 1.4 + (pattern_range / span) - (biggest / span) * 0.8
        if score > best_score:
            best, best_score = window, score
    return best


def build_pattern_examples(rows):
    out = []
    for pid, name, bias, flag, nbars, prior in PATTERNS:
        window = pick_pattern(rows, flag, nbars, prior)
        if not window:
            print(f"  ! no clean instance found for {pid}")
            continue
        anchor = window[CONTEXT + nbars - 1]
        out.append({
            "id": pid, "name": name, "bias": bias,
            "patternBars": nbars,
            "highlightFrom": CONTEXT,
            "bars": [bar(w) for w in window],
            "when": f"{pretty_date(anchor['t'])}, {anchor['t'][11:16]}",
        })
        print(f"  {pid:<20} {anchor['t'][:16]}")
    return out


# ── 2. Daily bars, aggregated from 15-minute spot ───────────────────────────
def build_daily(rows):
    days = defaultdict(list)
    for r in rows:
        days[r["t"][:10]].append(r)
    daily = []
    for date in sorted(days):
        bars = days[date]
        daily.append({"t": date, "o": bars[0]["o"], "h": max(b["h"] for b in bars),
                      "l": min(b["l"] for b in bars), "c": bars[-1]["c"]})
    return daily


def swings(bars, width=2):
    """Swing highs and lows: a bar whose high (low) is the extreme of its neighbourhood."""
    highs, lows = [], []
    for i in range(width, len(bars) - width):
        window = bars[i - width:i + width + 1]
        if bars[i]["h"] >= max(w["h"] for w in window):
            highs.append(i)
        if bars[i]["l"] <= min(w["l"] for w in window):
            lows.append(i)
    return highs, lows


def classify_window(bars):
    """Label a window by its actual swing structure, the same way the course teaches it."""
    highs, lows = swings(bars)
    if len(highs) < 2 or len(lows) < 2:
        return None
    hh = bars[highs[-1]]["h"] > bars[highs[0]]["h"]
    hl = bars[lows[-1]]["l"] > bars[lows[0]]["l"]
    lh = bars[highs[-1]]["h"] < bars[highs[0]]["h"]
    ll = bars[lows[-1]]["l"] < bars[lows[0]]["l"]
    span = max(b["h"] for b in bars) - min(b["l"] for b in bars)
    net = abs(bars[-1]["c"] - bars[0]["o"])
    if hh and hl and net / span > 0.45:
        return "uptrend"
    if lh and ll and net / span > 0.45:
        return "downtrend"
    if net / span < 0.22:
        return "range"
    return None


def build_structure(daily, length=34):
    """One clean example each of uptrend, range and downtrend, from real daily bars."""
    found = {}
    scored = defaultdict(list)
    for start in range(0, len(daily) - length):
        window = daily[start:start + length]
        label = classify_window(window)
        if not label:
            continue
        span = max(b["h"] for b in window) - min(b["l"] for b in window)
        net = abs(window[-1]["c"] - window[0]["o"])
        strength = net / span if label != "range" else 1 - net / span
        scored[label].append((strength, start, window))
    for label, entries in scored.items():
        entries.sort(key=lambda e: -e[0])
        _, start, window = entries[0]
        found[label] = {
            "id": label,
            "bars": [bar(b) for b in window],
            "when": f"{pretty_date(window[0]['t'])} to {pretty_date(window[-1]['t'])}",
        }
        print(f"  {label:<20} {window[0]['t']} .. {window[-1]['t']}")
    return [found[k] for k in ("uptrend", "range", "downtrend") if k in found]


# ── 3. Intraday session from NIFTY futures (real traded volume) ─────────────
def build_session():
    files = sorted((ALPHA / "data" / "nifty_fut").glob("*_NIFTY_futures_1min.csv"))
    best, best_score = None, -1
    for path in files:
        rows = []
        with open(path, encoding="utf-8") as fh:
            for r in csv.DictReader(fh):
                try:
                    rows.append({"t": r["timestamp"], "o": float(r["open"]), "h": float(r["high"]),
                                 "l": float(r["low"]), "c": float(r["close"]), "v": int(float(r["volume"]))})
                except (ValueError, KeyError):
                    continue
        if len(rows) < 360:
            continue
        span = max(r["h"] for r in rows) - min(r["l"] for r in rows)
        opening = rows[:30]
        or_span = max(r["h"] for r in opening) - min(r["l"] for r in opening)
        # Want a session that ranges well beyond its opening range — that is the one with
        # something to read. A day that never leaves its opening range teaches nothing.
        score = span / max(1.0, or_span)
        if score > best_score:
            best, best_score = (path, rows), score
    path, rows = best
    five = []
    for i in range(0, len(rows) - 4, 5):
        chunk = rows[i:i + 5]
        five.append({"t": chunk[0]["t"], "o": chunk[0]["o"], "h": max(c["h"] for c in chunk),
                     "l": min(c["l"] for c in chunk), "c": chunk[-1]["c"],
                     "v": sum(c["v"] for c in chunk)})
    date = rows[0]["t"][:10]
    opening = five[:6]
    print(f"  session {date}  {len(five)} five-minute bars  range {best_score:.1f}x opening range")
    return {
        "date": date,
        "label": pretty_date(date),
        "bars": [bar(b, with_volume=True) for b in five],
        "openingHigh": round(max(b["h"] for b in opening), 2),
        "openingLow": round(min(b["l"] for b in opening), 2),
        "symbol": path.name.split("_")[1] + " futures",
    }


def ts(value):
    return json.dumps(value, ensure_ascii=False)


def main():
    print("Reading alphaIMB…")
    hourly = read_candles("nifty_60min_candles.csv")
    fifteen = read_candles("nifty_15min_candles.csv")
    print(f"  {len(hourly)} hourly bars, {len(fifteen)} 15-minute bars")

    print("Picking candlestick pattern instances (60-minute bars):")
    patterns = build_pattern_examples(hourly)

    daily = build_daily(fifteen)
    print(f"Aggregated {len(daily)} daily bars {daily[0]['t']} .. {daily[-1]['t']}")
    print("Picking market-structure windows (daily bars):")
    structure = build_structure(daily)

    print("Picking an intraday session (NIFTY futures, 1-minute -> 5-minute):")
    session = build_session()

    header = f'''/* GENERATED by scripts/extract-nifty-data.py — do not edit by hand.
 *
 * Real NIFTY market data, not synthetic. Hourly and 15-minute bars are NIFTY spot from
 * the alphaIMB research set ({daily[0]['t']} to {daily[-1]['t']}); the intraday session is
 * NIFTY futures with real traded volume. Candlestick pattern instances were selected by
 * the pattern flags already computed in that data set, then ranked for legibility.
 *
 * Spot bars carry no volume — an index has no traded quantity — so `v` appears only on
 * the futures session. */

export type NiftyBar = {{ t: string; o: number; h: number; l: number; c: number; v?: number }};

export const niftyCoverage = {{ from: {ts(pretty_date(daily[0]['t']))}, to: {ts(pretty_date(daily[-1]['t']))}, days: {len(daily)} }};
'''

    parts = [header]

    parts.append("\nexport type NiftyPattern = { id: string; name: string; bias: \"bullish\" | \"bearish\" | \"neutral\"; patternBars: number; highlightFrom: number; bars: NiftyBar[]; when: string };\n")
    parts.append("\n/** Genuine occurrences on the NIFTY hourly chart, with the date they happened. */\nexport const niftyPatterns: NiftyPattern[] = [\n")
    for p in patterns:
        parts.append(f"  {{ id: {ts(p['id'])}, name: {ts(p['name'])}, bias: {ts(p['bias'])}, patternBars: {p['patternBars']}, highlightFrom: {p['highlightFrom']}, when: {ts(p['when'])},\n    bars: {ts(p['bars'])} }},\n")
    parts.append("];\n")
    parts.append("\nexport const niftyPatternById = (id: string) => niftyPatterns.find((p) => p.id === id) ?? niftyPatterns[0];\n")

    parts.append("\nexport type NiftyStructure = { id: string; bars: NiftyBar[]; when: string };\n")
    parts.append("\n/** Real daily windows, labelled by their own swing structure rather than by eye. */\nexport const niftyStructure: NiftyStructure[] = [\n")
    for s in structure:
        parts.append(f"  {{ id: {ts(s['id'])}, when: {ts(s['when'])},\n    bars: {ts(s['bars'])} }},\n")
    parts.append("];\n")

    parts.append(f"\n/** One real session, 5-minute bars aggregated from 1-minute futures data. */\nexport const niftySession = {{\n")
    parts.append(f"  date: {ts(session['date'])}, label: {ts(session['label'])}, symbol: {ts(session['symbol'])},\n")
    parts.append(f"  openingHigh: {session['openingHigh']}, openingLow: {session['openingLow']},\n")
    parts.append(f"  bars: {ts(session['bars'])} as NiftyBar[],\n")
    parts.append("};\n")

    parts.append(f"\n/** Daily NIFTY bars for swing and pattern work. */\nexport const niftyDaily: NiftyBar[] = {ts([bar(b) for b in daily])};\n")

    OUT.write_text("".join(parts), encoding="utf-8")
    size = OUT.stat().st_size
    print(f"\nWrote {OUT} ({size // 1024} KB)")


if __name__ == "__main__":
    main()
