/** Synthetic market data for the practical modules.
 *
 *  Every company here is fictional. The names, sectors and numbers are modelled on how an
 *  Indian mid/large-cap universe behaves, but no figure describes a real listed company —
 *  fabricating fundamentals for real businesses would be misleading, and the teaching point
 *  works just as well on invented ones. Prices are in ₹, volumes in lakh shares, market cap
 *  in ₹ crore. Anything the learner sees should be labelled as synthetic in the UI. */

export type Trend = "Up" | "Sideways" | "Down";
export type Valuation = "Cheap" | "Fair" | "Rich";

export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  sma50: number;
  sma200: number;
  /** 20-day average traded quantity, in lakh shares. */
  avgVolumeLakh: number;
  marketCapCr: number;
  rsi: number;
  /** ATR as a percentage of price — the stock's ordinary daily travel. */
  atrPct: number;
  /** Distance below the 52-week high, as a negative percentage. */
  from52High: number;
  /** Today's volume divided by the 20-day average. */
  volumeRatio: number;
  /** Three-month return relative to the broad index, in percentage points. */
  relStrength3m: number;
  revenueGrowth: number;
  profitGrowth: number;
  debtToEquity: number;
  roe: number;
  valuation: Valuation;
  trend: Trend;
  /** What a reader should notice in this stock's favour. */
  strength: string;
  /** What the same reader should hold against it. Every candidate has one. */
  caution: string;
};

export const universe: Stock[] = [
  { symbol: "SRVBNK", name: "Sarva Bank", sector: "Banking", price: 1180, sma50: 1142, sma200: 1050, avgVolumeLakh: 42, marketCapCr: 285000, rsi: 61, atrPct: 1.6, from52High: -3.2, volumeRatio: 1.4, relStrength3m: 9, revenueGrowth: 14, profitGrowth: 18, debtToEquity: 0.9, roe: 16, valuation: "Fair", trend: "Up",
    strength: "Steady uptrend on heavy liquidity, with profit growth ahead of revenue growth.", caution: "Large-cap banks move with rate policy — a macro surprise moves this whether or not the chart agrees." },
  { symbol: "INDFIN", name: "Indus Finserv", sector: "Banking", price: 742, sma50: 768, sma200: 795, avgVolumeLakh: 18, marketCapCr: 38000, rsi: 38, atrPct: 2.4, from52High: -22.5, volumeRatio: 0.8, relStrength3m: -14, revenueGrowth: 9, profitGrowth: -4, debtToEquity: 3.2, roe: 11, valuation: "Cheap", trend: "Down",
    strength: "Cheapest valuation in the lending group, and liquidity is adequate.", caution: "Below both averages with falling profits and heavy leverage — cheap for reasons the screen can see." },
  { symbol: "KAVTEC", name: "Kaveri Tech", sector: "IT", price: 1655, sma50: 1588, sma200: 1470, avgVolumeLakh: 26, marketCapCr: 168000, rsi: 64, atrPct: 1.8, from52High: -1.8, volumeRatio: 2.1, relStrength3m: 16, revenueGrowth: 12, profitGrowth: 15, debtToEquity: 0.05, roe: 27, valuation: "Rich", trend: "Up",
    strength: "Near its 52-week high on expanding volume, almost no debt, high return on equity.", caution: "Priced richly, so a single disappointing quarter has a long way to fall before it looks cheap." },
  { symbol: "NILSFT", name: "Nilgiri Software", sector: "IT", price: 418, sma50: 431, sma200: 452, avgVolumeLakh: 9, marketCapCr: 14500, rsi: 42, atrPct: 2.2, from52High: -18.4, volumeRatio: 0.7, relStrength3m: -8, revenueGrowth: 4, profitGrowth: 2, debtToEquity: 0.1, roe: 15, valuation: "Fair", trend: "Sideways",
    strength: "Clean balance sheet and a business that is still growing, if slowly.", caution: "Lagging its own sector by 8 points — there is no reason to own the laggard when the leader is available." },
  { symbol: "ARVPHM", name: "Aravali Pharma", sector: "Pharma", price: 962, sma50: 905, sma200: 838, avgVolumeLakh: 12, marketCapCr: 26500, rsi: 68, atrPct: 2.1, from52High: -0.9, volumeRatio: 2.6, relStrength3m: 22, revenueGrowth: 18, profitGrowth: 24, debtToEquity: 0.2, roe: 21, valuation: "Rich", trend: "Up",
    strength: "At a 52-week high with the strongest relative strength in the group and real earnings behind it.", caution: "RSI 68 and 2.6× volume means you are buying after the crowd arrived, not before." },
  { symbol: "GNGLIF", name: "Ganga Lifesciences", sector: "Pharma", price: 286, sma50: 292, sma200: 305, avgVolumeLakh: 3, marketCapCr: 6800, rsi: 44, atrPct: 2.8, from52High: -26.0, volumeRatio: 0.9, relStrength3m: -11, revenueGrowth: 6, profitGrowth: -8, debtToEquity: 0.6, roe: 9, valuation: "Cheap", trend: "Down",
    strength: "Trades at a discount to the sector and has stopped making new lows this month.", caution: "3 lakh shares a day cannot absorb a normal position — you would move the price getting out." },
  { symbol: "DECMOT", name: "Deccan Motors", sector: "Auto", price: 640, sma50: 612, sma200: 566, avgVolumeLakh: 34, marketCapCr: 92000, rsi: 63, atrPct: 2.0, from52High: -4.1, volumeRatio: 1.8, relStrength3m: 12, revenueGrowth: 16, profitGrowth: 21, debtToEquity: 0.4, roe: 18, valuation: "Fair", trend: "Up",
    strength: "Trend, liquidity, growth and valuation all point the same way — unusually few objections.", caution: "Auto demand is cyclical; the growth rate that justifies the price is the first thing a slowdown removes." },
  { symbol: "VNDAUT", name: "Vindhya Autoparts", sector: "Auto", price: 148, sma50: 139, sma200: 126, avgVolumeLakh: 7, marketCapCr: 4200, rsi: 66, atrPct: 3.1, from52High: -2.4, volumeRatio: 2.9, relStrength3m: 19, revenueGrowth: 21, profitGrowth: 26, debtToEquity: 0.7, roe: 17, valuation: "Fair", trend: "Up",
    strength: "Fastest growth in the auto group, breaking out on nearly three times normal volume.", caution: "A ₹4,200 crore company moving 3.1% a day needs a much smaller position for the same rupee risk." },
  { symbol: "KNKCEM", name: "Konkan Cement", sector: "Cement", price: 1104, sma50: 1086, sma200: 1042, avgVolumeLakh: 6, marketCapCr: 31000, rsi: 55, atrPct: 1.9, from52High: -8.6, volumeRatio: 1.1, relStrength3m: 3, revenueGrowth: 8, profitGrowth: 6, debtToEquity: 0.5, roe: 13, valuation: "Fair", trend: "Sideways",
    strength: "Above both averages with nothing obviously wrong anywhere in the numbers.", caution: "Nothing is compelling either — a candidate that passes every filter and inspires no thesis." },
  { symbol: "SATINF", name: "Satpura Infra", sector: "Infrastructure", price: 92, sma50: 88, sma200: 79, avgVolumeLakh: 22, marketCapCr: 3600, rsi: 62, atrPct: 3.6, from52High: -6.8, volumeRatio: 2.2, relStrength3m: 24, revenueGrowth: 27, profitGrowth: 31, debtToEquity: 1.6, roe: 12, valuation: "Cheap", trend: "Up",
    strength: "Order-book growth is showing up in profits, and the stock is outperforming heavily.", caution: "Leveraged small-cap at ₹92 — a price filter above ₹100 would remove it, and 3.6% daily travel is why." },
  { symbol: "MLWFDS", name: "Malwa Foods", sector: "FMCG", price: 2240, sma50: 2196, sma200: 2130, avgVolumeLakh: 4, marketCapCr: 122000, rsi: 53, atrPct: 1.2, from52High: -5.4, volumeRatio: 0.9, relStrength3m: -2, revenueGrowth: 7, profitGrowth: 9, debtToEquity: 0.2, roe: 34, valuation: "Rich", trend: "Sideways",
    strength: "Highest return on equity in the universe and the calmest chart — 1.2% daily travel.", caution: "Low volatility and flat relative strength means a swing trade here waits a long time for very little." },
  { symbol: "CHLCON", name: "Chola Consumer", sector: "FMCG", price: 508, sma50: 519, sma200: 534, avgVolumeLakh: 5, marketCapCr: 19000, rsi: 41, atrPct: 1.5, from52High: -15.2, volumeRatio: 0.8, relStrength3m: -9, revenueGrowth: 3, profitGrowth: 1, debtToEquity: 0.3, roe: 19, valuation: "Fair", trend: "Down",
    strength: "Good return on equity and a conservative balance sheet.", caution: "Growth has stalled and the price is below both averages — a quality business in a downtrend is still a downtrend." },
  { symbol: "ZNSMTL", name: "Zanskar Metals", sector: "Metals", price: 376, sma50: 352, sma200: 318, avgVolumeLakh: 28, marketCapCr: 27500, rsi: 69, atrPct: 3.4, from52High: -1.2, volumeRatio: 3.1, relStrength3m: 28, revenueGrowth: 19, profitGrowth: 34, debtToEquity: 0.8, roe: 15, valuation: "Cheap", trend: "Up",
    strength: "Strongest relative strength in the universe, at a high, on three times normal volume.", caution: "Metals earnings follow commodity prices — cheap valuation at a cyclical peak is the classic trap." },
  { symbol: "TPTSTL", name: "Tapti Steel", sector: "Metals", price: 84, sma50: 91, sma200: 98, avgVolumeLakh: 15, marketCapCr: 5100, rsi: 36, atrPct: 3.9, from52High: -31.5, volumeRatio: 0.6, relStrength3m: -19, revenueGrowth: -3, profitGrowth: -22, debtToEquity: 1.9, roe: 6, valuation: "Cheap", trend: "Down",
    strength: "Liquid enough to trade and priced at a fraction of its 52-week high.", caution: "Falling revenue, falling profit, heavy debt, below both averages — every piece of evidence agrees, and none of it is good." },
  { symbol: "RAVENR", name: "Ravi Energy", sector: "Energy", price: 1420, sma50: 1378, sma200: 1290, avgVolumeLakh: 19, marketCapCr: 210000, rsi: 59, atrPct: 1.7, from52High: -6.2, volumeRatio: 1.3, relStrength3m: 7, revenueGrowth: 11, profitGrowth: 13, debtToEquity: 0.6, roe: 14, valuation: "Fair", trend: "Up",
    strength: "Large, liquid and trending, with enough depth to hold a sizeable position.", caution: "Only 1.3× volume and 7 points of relative strength — a solid trend rather than an urgent one." },
  { symbol: "SUTPWR", name: "Sutlej Power", sector: "Energy", price: 214, sma50: 208, sma200: 196, avgVolumeLakh: 31, marketCapCr: 22000, rsi: 57, atrPct: 2.6, from52High: -9.4, volumeRatio: 1.6, relStrength3m: 11, revenueGrowth: 13, profitGrowth: 10, debtToEquity: 1.4, roe: 12, valuation: "Fair", trend: "Up",
    strength: "Highly liquid mid-cap in an uptrend, with volume beginning to expand.", caution: "Debt-to-equity of 1.4 in a capital-heavy sector means rate moves hit the business as well as the price." },
  { symbol: "PLRCHM", name: "Palar Chemicals", sector: "Chemicals", price: 655, sma50: 690, sma200: 728, avgVolumeLakh: 2, marketCapCr: 7400, rsi: 34, atrPct: 2.9, from52High: -34.8, volumeRatio: 0.7, relStrength3m: -26, revenueGrowth: -6, profitGrowth: -31, debtToEquity: 0.9, roe: 8, valuation: "Cheap", trend: "Down",
    strength: "Down 35% from its high, which some readers will call an opportunity.", caution: "2 lakh shares a day, collapsing profits, worst relative strength here — the discount is the market's opinion, not a gift." },
  { symbol: "MRWRLT", name: "Marwar Realty", sector: "Realty", price: 318, sma50: 296, sma200: 262, avgVolumeLakh: 11, marketCapCr: 16500, rsi: 71, atrPct: 4.2, from52High: -0.6, volumeRatio: 3.4, relStrength3m: 37, revenueGrowth: 24, profitGrowth: 41, debtToEquity: 1.1, roe: 16, valuation: "Rich", trend: "Up",
    strength: "The most extended move in the universe: at its high, 37 points of relative strength, 3.4× volume.", caution: "RSI 71 and 4.2% daily travel means the stop that respects this chart is very wide, so the position must be very small." },
];

export const sectors = [...new Set(universe.map((stock) => stock.sector))].sort();

export type ScreenFilter =
  | "priceAbove100" | "liquid" | "aboveSma50" | "aboveSma200" | "rsiBand"
  | "near52High" | "volumeExpansion" | "largeCap" | "lowVolatility" | "positiveRs";

export const screenFilters: { id: ScreenFilter; label: string; detail: string; test: (stock: Stock) => boolean }[] = [
  { id: "priceAbove100", label: "Price > ₹100", detail: "Removes very low-priced shares where a one-tick move is a large percentage.", test: (s) => s.price > 100 },
  { id: "liquid", label: "Avg volume > 5 lakh", detail: "You must be able to leave. This is the filter to apply first.", test: (s) => s.avgVolumeLakh > 5 },
  { id: "aboveSma50", label: "Price > SMA 50", detail: "Above the medium-term average — evidence of a trend, not a reason to buy.", test: (s) => s.price > s.sma50 },
  { id: "aboveSma200", label: "Price > SMA 200", detail: "Above the long-term average. Keeps you on the side the market has been favouring.", test: (s) => s.price > s.sma200 },
  { id: "rsiBand", label: "RSI between 40 and 70", detail: "Excludes the exhausted and the collapsing. Also excludes some of the strongest movers.", test: (s) => s.rsi >= 40 && s.rsi <= 70 },
  { id: "near52High", label: "Within 10% of 52-week high", detail: "Stocks making highs have no trapped supply above them.", test: (s) => s.from52High >= -10 },
  { id: "volumeExpansion", label: "Volume > 1.5× average", detail: "Something changed today. It does not say what, or in which direction.", test: (s) => s.volumeRatio > 1.5 },
  { id: "largeCap", label: "Market cap > ₹50,000 cr", detail: "Larger companies move less and absorb larger positions.", test: (s) => s.marketCapCr > 50000 },
  { id: "lowVolatility", label: "ATR < 2.5% of price", detail: "Calmer charts allow tighter stops — and offer smaller moves.", test: (s) => s.atrPct < 2.5 },
  { id: "positiveRs", label: "Outperforming the index (3M)", detail: "Keeps the leaders and drops the laggards.", test: (s) => s.relStrength3m > 0 },
];

export function runScreen(active: ScreenFilter[], sector: string) {
  const tests = screenFilters.filter((filter) => active.includes(filter.id));
  return universe.filter((stock) => (sector === "All" || stock.sector === sector) && tests.every((filter) => filter.test(stock)));
}

// ── Synthetic price series ──────────────────────────────────────────────────
export type Candle = { o: number; h: number; l: number; c: number; v: number };
export type Segment = { bars: number; drift: number; vol: number; volume: number };

/** Small deterministic PRNG so every learner sees the same "market" and reloads are stable. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSeries(seed: number, start: number, segments: Segment[]): Candle[] {
  const random = seeded(seed);
  const candles: Candle[] = [];
  let last = start;
  for (const segment of segments) {
    for (let bar = 0; bar < segment.bars; bar += 1) {
      const open = last;
      const shock = (random() - 0.5) * 2 * segment.vol;
      const close = Math.max(1, open + segment.drift + shock);
      const wick = segment.vol * (0.4 + random() * 0.9);
      const high = Math.max(open, close) + wick * random();
      const low = Math.min(open, close) - wick * random();
      candles.push({
        o: Number(open.toFixed(2)), h: Number(high.toFixed(2)), l: Number(low.toFixed(2)), c: Number(close.toFixed(2)),
        v: Math.round(segment.volume * (0.6 + random() * 0.8)),
      });
      last = close;
    }
  }
  return candles;
}

// ── Intraday replay checkpoints ─────────────────────────────────────────────
export type ReplayCheckpoint = { index: number; time: string; question: string; choices: string[]; correct: number; feedback: string };

/** Checkpoints for the real NIFTY session in `nifty-data.ts` (8 July 2026, 5-minute bars).
 *  `index` is the bar the question fires on, so each one asks about what is actually on
 *  screen at that moment and nothing after it. The session genuinely ran: opening range,
 *  a long quiet midday, then a breakdown on roughly fifteen times the midday volume. */
export const sessionCheckpoints: ReplayCheckpoint[] = [
  { index: 5, time: "09:45", question: "Thirty minutes in. What do you actually know?",
    choices: ["The trend for the day is down", "An opening range has formed and nothing has resolved", "A breakout is about to happen", "The gap will be filled"],
    correct: 1,
    feedback: "The first half hour built a range between roughly 24,235 and 24,320 on the heaviest volume of the morning. Those two numbers are what the rest of the day gets measured against — the range itself is not a signal." },
  { index: 23, time: "11:15", question: "Price has drifted back to the top of the opening range on falling volume. What does the volume add?",
    choices: ["It confirms a breakout is coming", "Fewer participants are involved than during the open, so the move up carries less weight", "It means the range will break down", "Volume is irrelevant intraday"],
    correct: 1,
    feedback: "Volume has fallen from around 265,000 at the open to under 25,000. Price reaching the top of the range on a fraction of the participation is a weaker test than the same level on heavy volume." },
  { index: 41, time: "12:50", question: "Two hours of overlapping candles in a narrow band. What kind of day is this behaving like so far?",
    choices: ["A trend day", "A range day — and midday is where ranges are most common", "A reversal day", "An expiry day"],
    correct: 1,
    feedback: "Midday is reliably the quietest stretch of the session. Applying trend tactics to a midday range is one of the most dependable ways to bleed money." },
  { index: 53, time: "13:40", question: "Price is near the bottom of the day's range. Would you short the break, and where would you be wrong?",
    choices: ["Yes, with a stop above the day's high", "Yes, with a stop above the recent swing high near 24,272", "No — nothing has broken yet", "Yes, with no stop"],
    correct: 2,
    feedback: "Nothing has broken at this point. The honest answer is that there is no trade yet — the level is being approached, not cleared. Deciding in advance where you would be wrong is the useful half of the question." },
  { index: 56, time: "13:55", question: "The range has broken and volume has jumped to roughly fifteen times the midday level. What changed?",
    choices: ["Nothing — volume is noise", "Participation returned at the moment the level gave way, which is what a real break looks like", "The day is now guaranteed to close lower", "The move must reverse"],
    correct: 1,
    feedback: "This is the distinction the volume lessons make: a level giving way on a fraction of normal participation is a poke, and one that draws in fifteen times the recent volume is a different event. It still does not guarantee the close." },
  { index: 65, time: "14:40", question: "Price has fallen roughly 400 points from the range and it is 14:40. What does the clock add?",
    choices: ["Nothing — the setup is the setup", "Less time remains for anything new to work, and intraday positions must be flat by the close", "Late moves are always strongest", "Volatility falls after 14:30"],
    correct: 1,
    feedback: "An intraday position has a hard deadline. A fresh entry at 14:40 has under an hour to work, which makes it a different trade from the identical setup at 10:40." },
];

// ── Swing scenarios ─────────────────────────────────────────────────────────
export type SwingScenario = {
  id: string;
  symbol: string;
  name: string;
  history: Candle[];
  future: Candle[];
  atr: number;
  trend: Trend;
  setup: string;
  trigger: number;
  invalidation: number;
  outcome: string;
  lesson: string;
};

const kaveri = buildSeries(710, 1452, [
  { bars: 14, drift: 3.4, vol: 14, volume: 24 },
  { bars: 22, drift: 0.2, vol: 11, volume: 15 },
  { bars: 6, drift: 7.5, vol: 15, volume: 41 },
]);
const marwar = buildSeries(913, 268, [
  { bars: 16, drift: 1.5, vol: 7, volume: 12 },
  { bars: 18, drift: 0.1, vol: 6, volume: 8 },
  { bars: 6, drift: 4.2, vol: 9, volume: 29 },
]);
const deccan = buildSeries(455, 548, [
  { bars: 20, drift: 2.6, vol: 6, volume: 30 },
  { bars: 12, drift: 1.9, vol: 5, volume: 26 },
  { bars: 6, drift: -2.4, vol: 6, volume: 19 },
]);

export const swingScenarios: SwingScenario[] = [
  {
    id: "breakout-follows",
    symbol: "KAVTEC", name: "Kaveri Tech",
    history: kaveri, future: buildSeries(711, kaveri[kaveri.length - 1].c, [{ bars: 8, drift: 9.5, vol: 17, volume: 38 }, { bars: 10, drift: 2.2, vol: 14, volume: 22 }]),
    atr: 31, trend: "Up",
    setup: "A six-week base under a clear ceiling, resolving upward on the heaviest volume of the base.",
    trigger: 1595, invalidation: 1540,
    outcome: "The breakout held and extended over the following three weeks, with the first pullback stopping above the breakout level.",
    lesson: "This is what a breakout looks like when it works. It was not knowable in advance — the same chart, with the same volume, fails often enough that the stop is what made the trade takeable.",
  },
  {
    id: "breakout-fails",
    symbol: "MRWRLT", name: "Marwar Realty",
    history: marwar, future: buildSeries(914, marwar[marwar.length - 1].c, [{ bars: 4, drift: 1.1, vol: 8, volume: 24 }, { bars: 14, drift: -4.6, vol: 10, volume: 31 }]),
    atr: 13, trend: "Up",
    setup: "The same shape: a base, a ceiling, an upward resolution on expanding volume.",
    trigger: 322, invalidation: 297,
    outcome: "The breakout ran for four sessions, then reversed back through the base and kept going. Everyone who bought the breakout was underwater within two weeks.",
    lesson: "The setup was not worse than the one that worked — it was the same setup with a different outcome. This is why the position size and the stop are the parts you control.",
  },
  {
    id: "pullback-continues",
    symbol: "DECMOT", name: "Deccan Motors",
    history: deccan, future: buildSeries(456, deccan[deccan.length - 1].c, [{ bars: 5, drift: 1.4, vol: 5, volume: 22 }, { bars: 13, drift: 3.6, vol: 6, volume: 28 }]),
    atr: 13, trend: "Up",
    setup: "An established uptrend giving back part of its last push, holding above the previous swing low.",
    trigger: 641, invalidation: 612,
    outcome: "The pullback ended within a week and the trend resumed, reaching a new high about three weeks later.",
    lesson: "Pullback entries buy a better price for a lower probability that the trend is still intact. The prior swing low is what tells you which it was.",
  },
];
