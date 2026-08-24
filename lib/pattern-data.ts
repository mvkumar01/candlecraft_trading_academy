import { buildSeries, type Candle, type Segment } from "./market-data.ts";

/** Synthetic pattern data. The candlestick shapes are hand-built so each one is exactly the
 *  pattern it claims to be; the chart patterns are generated from segment specs so they look
 *  like real charts rather than diagrams. Every pattern carries two futures — one where it
 *  works and one where it fails — because the shape does not decide which you get. */

// ── Candlestick patterns ────────────────────────────────────────────────────
export type CandlePattern = {
  id: string;
  name: string;
  bias: "bullish" | "bearish" | "neutral";
  /** The last `patternBars` candles form the pattern; the rest establish the prior move. */
  patternBars: number;
  candles: Candle[];
  reading: string;
  caution: string;
};

export const candlePatterns: CandlePattern[] = [
  { id: "doji", name: "Doji", bias: "neutral", patternBars: 1,
    candles: [{ o: 96, h: 99, l: 95.4, c: 98.6, v: 41 }, { o: 98.6, h: 101, l: 98, c: 100.4, v: 46 }, { o: 100.4, h: 103.2, l: 97.6, c: 100.5, v: 58 }],
    reading: "The period travelled a long way in both directions and finished where it started. Neither side could hold what it took.",
    caution: "Indecision describes one period, not a turning point. Trends contain plenty of them." },
  { id: "hammer", name: "Hammer", bias: "bullish", patternBars: 1,
    candles: [{ o: 106, h: 106.5, l: 103, c: 103.4, v: 52 }, { o: 103.4, h: 103.8, l: 100.2, c: 100.6, v: 61 }, { o: 100.6, h: 101.2, l: 95.4, c: 100.9, v: 88 }],
    reading: "Price fell hard inside the period and closed back near its high. Sellers reached 95.4 and could not keep it.",
    caution: "It only means anything after a decline. The same shape after a rise is a hanging man and reads the other way." },
  { id: "hanging-man", name: "Hanging man", bias: "bearish", patternBars: 1,
    candles: [{ o: 95, h: 98.6, l: 94.8, c: 98.2, v: 44 }, { o: 98.2, h: 101.4, l: 98, c: 101, v: 49 }, { o: 101, h: 101.6, l: 95.8, c: 101.3, v: 83 }],
    reading: "The identical shape to a hammer, arriving after a rise: selling appeared mid-period and was absorbed.",
    caution: "The shape is the same as a hammer. Only the preceding move separates them, which is the whole lesson." },
  { id: "shooting-star", name: "Shooting star", bias: "bearish", patternBars: 1,
    candles: [{ o: 94, h: 97.4, l: 93.6, c: 97, v: 47 }, { o: 97, h: 100.2, l: 96.8, c: 99.8, v: 55 }, { o: 99.8, h: 105.2, l: 99.4, c: 100.1, v: 91 }],
    reading: "Price pushed to 105.2 and gave all of it back, closing near where it opened. The high was reached and rejected.",
    caution: "A rejected high is one observation. Strong trends make and reject highs repeatedly on the way up." },
  { id: "bullish-engulfing", name: "Bullish engulfing", bias: "bullish", patternBars: 2,
    candles: [{ o: 104, h: 104.4, l: 101, c: 101.4, v: 50 }, { o: 101.4, h: 101.8, l: 98.6, c: 99.2, v: 57 }, { o: 98.8, h: 103.4, l: 98.4, c: 102.9, v: 96 }],
    reading: "The second candle opens below the first candle's close and closes above its open — one period undoing the whole of the last.",
    caution: "Engulfing compares bodies, not wicks. And large candles are common wherever volatility is rising." },
  { id: "bearish-engulfing", name: "Bearish engulfing", bias: "bearish", patternBars: 2,
    candles: [{ o: 96, h: 99.2, l: 95.8, c: 98.8, v: 45 }, { o: 98.8, h: 101.6, l: 98.4, c: 101.2, v: 53 }, { o: 101.8, h: 102.2, l: 97.9, c: 98.2, v: 94 }],
    reading: "The second candle opens above the first's close and closes below its open. The previous period's gain is entirely erased.",
    caution: "It records what one period did. Whether the sellers who did it have size left is not visible." },
  { id: "harami", name: "Harami", bias: "bullish", patternBars: 2,
    candles: [{ o: 106, h: 106.4, l: 105, c: 105.2, v: 48 }, { o: 105.2, h: 105.6, l: 99.4, c: 99.8, v: 79 }, { o: 101, h: 102.6, l: 100.6, c: 102.2, v: 38 }],
    reading: "A large body followed by a small one contained entirely inside it. The move stopped extending without reversing.",
    caution: "A pause is not a reversal. Harami reads as momentum fading, not as a reason to trade the other way." },
  { id: "morning-star", name: "Morning star", bias: "bullish", patternBars: 3,
    candles: [{ o: 108, h: 108.3, l: 104.6, c: 105, v: 55 }, { o: 105, h: 105.4, l: 100.4, c: 100.8, v: 72 }, { o: 100.2, h: 100.9, l: 98.9, c: 99.9, v: 34 }, { o: 100.6, h: 104.4, l: 100.2, c: 104, v: 98 }],
    reading: "A hard fall, then a small indecisive period, then a strong recovery closing back inside the first candle's body.",
    caution: "Three candles is three periods of evidence, not three times the reliability. Context still decides." },
  { id: "evening-star", name: "Evening star", bias: "bearish", patternBars: 3,
    candles: [{ o: 94.4, h: 99.2, l: 94, c: 98.8, v: 51 }, { o: 99, h: 103.6, l: 98.8, c: 103.2, v: 68 }, { o: 104, h: 104.8, l: 103.4, c: 103.8, v: 31 }, { o: 103.2, h: 103.5, l: 99.2, c: 99.6, v: 95 }],
    reading: "A strong advance, a stalling period at the high, then a decisive fall back into the body of the advance.",
    caution: "The middle candle's small body is the fragile part — slightly larger and this is not the pattern at all." },
];

export const candlePatternById = (id: string) => candlePatterns.find((pattern) => pattern.id === id) ?? candlePatterns[0];

// ── Classical chart patterns ────────────────────────────────────────────────
export type ChartPattern = {
  id: string;
  name: string;
  kind: "continuation" | "reversal";
  /** Which way the pattern completes, if it completes at all. */
  direction: "up" | "down";
  history: Candle[];
  /** Two futures from the same base, drawn from the same shape on purpose. */
  worked: Candle[];
  failed: Candle[];
  trigger: number;
  invalidation: number;
  shape: string;
  captures: string;
  breaks: string;
};

type PatternSpec = {
  id: string; name: string; kind: "continuation" | "reversal"; direction: "up" | "down";
  seed: number; start: number; segments: Segment[];
  shape: string; captures: string; breaks: string;
};

const patternSpecs: PatternSpec[] = [
  { id: "rectangle", name: "Rectangle", kind: "continuation", direction: "up", seed: 3101, start: 92,
    segments: [{ bars: 8, drift: 1.1, vol: 1.4, volume: 30 }, { bars: 5, drift: -1.35, vol: 1.2, volume: 22 }, { bars: 5, drift: 1.3, vol: 1.2, volume: 21 }, { bars: 5, drift: -1.35, vol: 1.1, volume: 19 }, { bars: 5, drift: 1.28, vol: 1.0, volume: 18 }],
    shape: "Highs stopping at roughly one level and lows at roughly another, several times each.",
    captures: "The resolution of a stalemate: once a boundary gives way, the orders resting there are gone.",
    breaks: "Boundaries are consumed by being tested. One that has held four times has less resting interest left than one that has held twice." },
  { id: "symmetrical-triangle", name: "Symmetrical triangle", kind: "continuation", direction: "up", seed: 3102, start: 90,
    segments: [{ bars: 7, drift: 1.6, vol: 1.5, volume: 34 }, { bars: 5, drift: -1.5, vol: 1.3, volume: 26 }, { bars: 5, drift: 1.2, vol: 1.0, volume: 22 }, { bars: 5, drift: -0.9, vol: 0.8, volume: 18 }, { bars: 5, drift: 0.6, vol: 0.5, volume: 14 }],
    shape: "Lower highs and higher lows converging, with the range narrowing bar by bar.",
    captures: "Compression resolving into expansion — narrowing disagreement is a genuine observation.",
    breaks: "The apex is not a deadline and the direction is not implied. Symmetrical triangles resolve both ways about as often." },
  { id: "ascending-triangle", name: "Ascending triangle", kind: "continuation", direction: "up", seed: 3103, start: 88,
    segments: [{ bars: 7, drift: 1.7, vol: 1.4, volume: 33 }, { bars: 4, drift: -1.9, vol: 1.2, volume: 25 }, { bars: 4, drift: 2.0, vol: 1.0, volume: 24 }, { bars: 4, drift: -1.2, vol: 0.9, volume: 19 }, { bars: 4, drift: 1.3, vol: 0.7, volume: 20 }, { bars: 4, drift: -0.5, vol: 0.5, volume: 15 }],
    shape: "A flat ceiling tested repeatedly, with each pullback stopping higher than the last.",
    captures: "Buyers paying up sooner each time, against a fixed block of supply at one price.",
    breaks: "Rising lows can simply run out. The flat ceiling is where every stop sits, which is what makes it worth probing." },
  { id: "descending-triangle", name: "Descending triangle", kind: "continuation", direction: "down", seed: 3104, start: 112,
    segments: [{ bars: 7, drift: -1.7, vol: 1.4, volume: 32 }, { bars: 4, drift: 1.8, vol: 1.2, volume: 24 }, { bars: 4, drift: -2.0, vol: 1.0, volume: 26 }, { bars: 4, drift: 1.1, vol: 0.9, volume: 18 }, { bars: 4, drift: -1.3, vol: 0.7, volume: 21 }, { bars: 4, drift: 0.4, vol: 0.5, volume: 14 }],
    shape: "A flat floor tested repeatedly, with each rally failing lower than the last.",
    captures: "Sellers accepting less each time, against a fixed block of demand at one price.",
    breaks: "In a strong broader uptrend the flat floor often holds and the pattern simply dissolves." },
  { id: "bull-flag", name: "Bull flag", kind: "continuation", direction: "up", seed: 3105, start: 86,
    segments: [{ bars: 9, drift: 2.6, vol: 1.3, volume: 46 }, { bars: 8, drift: -0.55, vol: 0.7, volume: 17 }],
    shape: "A steep advance, then a shallow drift lower on visibly lighter volume.",
    captures: "A pause inside a strong move: profit-taking that never attracts enough selling to reverse anything.",
    breaks: "If the drift lower deepens past about half the advance, it has stopped being a pause." },
  { id: "pennant", name: "Pennant", kind: "continuation", direction: "up", seed: 3106, start: 87,
    segments: [{ bars: 9, drift: 2.5, vol: 1.3, volume: 48 }, { bars: 4, drift: -0.8, vol: 0.9, volume: 20 }, { bars: 4, drift: 0.5, vol: 0.6, volume: 15 }, { bars: 4, drift: -0.3, vol: 0.35, volume: 12 }],
    shape: "A steep advance, then a small converging coil rather than a straight drift.",
    captures: "The same pause a flag captures, with the range contracting instead of sloping.",
    breaks: "A pennant is small by definition, so the stop is close and ordinary noise reaches it easily." },
  { id: "rising-wedge", name: "Rising wedge", kind: "reversal", direction: "down", seed: 3107, start: 92,
    segments: [{ bars: 6, drift: 2.2, vol: 1.3, volume: 42 }, { bars: 5, drift: -1.0, vol: 1.0, volume: 24 }, { bars: 5, drift: 1.7, vol: 0.9, volume: 30 }, { bars: 5, drift: -0.75, vol: 0.7, volume: 20 }, { bars: 5, drift: 1.25, vol: 0.5, volume: 22 }, { bars: 3, drift: -0.9, vol: 0.5, volume: 18 }],
    shape: "Price still rising, but each push smaller than the last and the range narrowing as it goes.",
    captures: "An advance running out of energy — progress continuing while the effort behind it shrinks.",
    breaks: "Slowing is not stopping. Wedges persist far longer than they look able to." },
  { id: "falling-wedge", name: "Falling wedge", kind: "reversal", direction: "up", seed: 3108, start: 110,
    segments: [{ bars: 6, drift: -2.2, vol: 1.3, volume: 40 }, { bars: 5, drift: 1.1, vol: 1.0, volume: 23 }, { bars: 5, drift: -1.7, vol: 0.9, volume: 28 }, { bars: 5, drift: 1.0, vol: 0.7, volume: 19 }, { bars: 5, drift: -1.0, vol: 0.5, volume: 21 }],
    shape: "Price still falling, but each leg down shorter than the last and the range tightening.",
    captures: "A decline losing force — sellers still in control but achieving less with each attempt.",
    breaks: "A decline that decelerates can still resume. Nothing about the shape puts a floor under it." },
  { id: "head-shoulders", name: "Head and shoulders", kind: "reversal", direction: "down", seed: 3109, start: 88,
    segments: [{ bars: 7, drift: 1.6, vol: 1.2, volume: 36 }, { bars: 5, drift: -1.5, vol: 1.1, volume: 25 }, { bars: 7, drift: 1.9, vol: 1.2, volume: 44 }, { bars: 6, drift: -1.9, vol: 1.1, volume: 30 }, { bars: 6, drift: 1.75, vol: 1.0, volume: 22 }, { bars: 5, drift: -1.9, vol: 1.0, volume: 27 }],
    shape: "Three peaks with the middle one highest, and the two troughs between them at roughly one level.",
    captures: "A trend failing in stages: the second rally cannot beat the first, which is a change from what came before.",
    breaks: "The neckline is the most watched line in charting, which is why price so often trades through it and comes straight back." },
  { id: "inverse-head-shoulders", name: "Inverse head and shoulders", kind: "reversal", direction: "up", seed: 3110, start: 112,
    segments: [{ bars: 7, drift: -1.6, vol: 1.2, volume: 35 }, { bars: 5, drift: 1.5, vol: 1.1, volume: 24 }, { bars: 7, drift: -1.9, vol: 1.2, volume: 43 }, { bars: 6, drift: 2.0, vol: 1.1, volume: 31 }, { bars: 6, drift: -1.1, vol: 1.0, volume: 21 }, { bars: 5, drift: 1.4, vol: 1.0, volume: 28 }],
    shape: "Three troughs with the middle one deepest, and the two peaks between them at roughly one level.",
    captures: "A decline failing in stages — the second low is not matched, so supply is being absorbed earlier.",
    breaks: "The same as its mirror: everyone can see the neckline, so probes through it are routine." },
  { id: "double-top", name: "Double top", kind: "reversal", direction: "down", seed: 3111, start: 90,
    segments: [{ bars: 9, drift: 1.9, vol: 1.3, volume: 40 }, { bars: 6, drift: -1.8, vol: 1.2, volume: 27 }, { bars: 8, drift: 1.35, vol: 1.1, volume: 33 }, { bars: 5, drift: -1.6, vol: 1.1, volume: 26 }],
    shape: "Two peaks at roughly the same level with a clear trough between them.",
    captures: "A level that stopped price once stopping it again — the second failure says the supply was not a one-off.",
    breaks: "Two touches is a small sample. Plenty of levels are cleared on the third attempt." },
  { id: "double-bottom", name: "Double bottom", kind: "reversal", direction: "up", seed: 3112, start: 110,
    segments: [{ bars: 9, drift: -1.9, vol: 1.3, volume: 39 }, { bars: 6, drift: 1.8, vol: 1.2, volume: 26 }, { bars: 8, drift: -1.62, vol: 1.1, volume: 32 }, { bars: 5, drift: 1.6, vol: 1.1, volume: 27 }],
    shape: "Two troughs at roughly the same level with a clear peak between them.",
    captures: "Buyers appearing at the same price twice — the level held once by accident and once on purpose.",
    breaks: "A second test that holds says nothing about a third. Support is spent by being used." },
  { id: "cup-handle", name: "Cup and handle", kind: "continuation", direction: "up", seed: 3113, start: 104,
    segments: [{ bars: 6, drift: -1.9, vol: 1.1, volume: 32 }, { bars: 5, drift: -0.9, vol: 0.8, volume: 22 }, { bars: 5, drift: 0.1, vol: 0.6, volume: 16 }, { bars: 5, drift: 0.9, vol: 0.8, volume: 23 }, { bars: 6, drift: 1.9, vol: 1.0, volume: 34 }, { bars: 5, drift: -0.7, vol: 0.6, volume: 15 }],
    shape: "A rounded decline and recovery back toward the old high, then a small drift lower before the retest.",
    captures: "Supply from the old high being worked through gradually, with the handle showing what is left of it.",
    breaks: "The handle is the fragile part. A deep one means the supply was never absorbed, and the cup means nothing without it." },
];

function buildPattern(spec: PatternSpec): ChartPattern {
  const history = buildSeries(spec.seed, spec.start, spec.segments);
  // The trigger is the boundary the whole pattern body has been respecting, so it is read from
  // a wide tail. The invalidation is the *most recent* swing against it — for a head and
  // shoulders that is the right shoulder, not the head — so it is read from a tighter window.
  const tail = history.slice(Math.floor(history.length * 0.55));
  const recent = history.slice(Math.floor(history.length * 0.72));
  const high = Math.max(...tail.map((candle) => candle.h));
  const low = Math.min(...tail.map((candle) => candle.l));
  const last = history[history.length - 1].c;
  const up = spec.direction === "up";
  const push = (Math.abs(high - low) / 9) * (up ? 1 : -1);
  return {
    id: spec.id, name: spec.name, kind: spec.kind, direction: spec.direction,
    history,
    trigger: Number((up ? high : low).toFixed(1)),
    invalidation: Number((up ? Math.min(...recent.map((c) => c.l)) : Math.max(...recent.map((c) => c.h))).toFixed(1)),
    worked: buildSeries(spec.seed + 1, last, [{ bars: 5, drift: push * 1.6, vol: 1.2, volume: 52 }, { bars: 11, drift: push * 0.9, vol: 1.0, volume: 33 }]),
    failed: buildSeries(spec.seed + 2, last, [{ bars: 4, drift: push * 0.7, vol: 1.1, volume: 44 }, { bars: 12, drift: -push * 1.1, vol: 1.2, volume: 38 }]),
    shape: spec.shape, captures: spec.captures, breaks: spec.breaks,
  };
}

export const chartPatterns: ChartPattern[] = patternSpecs.map(buildPattern);
export const chartPatternById = (id: string) => chartPatterns.find((pattern) => pattern.id === id) ?? chartPatterns[0];
