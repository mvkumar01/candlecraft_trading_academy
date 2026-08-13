import { foundationsContent } from "./content/foundations.ts";
import { appliedContent } from "./content/applied.ts";
import { professionalContent } from "./content/professional.ts";
import { horizonsContent } from "./content/horizons.ts";
import { screeningContent } from "./content/screening.ts";
import { swingContent } from "./content/swing.ts";
import { intradayContent } from "./content/intraday.ts";
import { positionalContent } from "./content/positional.ts";
import { workflowContent } from "./content/workflow.ts";

export const PRODUCT_NAME = "Trading Academy";

export type LessonStatus = "Draft" | "Review" | "Approved";
export type BlockType = "concept" | "text" | "callout" | "visual" | "quiz" | "true_false" | "scenario" | "slider" | "chart" | "chart_question" | "calculation" | "option_chain" | "simulation" | "matching" | "sequence" | "prediction" | "reveal" | "summary" | "challenge";

export type LessonBlock = { type: BlockType; title?: string; body?: string; prompt?: string };

/** How a lesson is taught. Each flow produces a different block sequence and a different
 *  kind of interaction, so a definition lesson does not look like a judgement lesson.
 *  `plan` is the longest shape: work the model, plan a trade, commit to a call, then see
 *  what actually happened — used for the practical capstones. */
export type FlowKind = "define" | "compare" | "build" | "calculate" | "classify" | "sequence" | "cause" | "judge" | "plan";

/** The interactive element a lesson uses. Chosen per concept, not per module. */
export type InteractionKind =
  | "terms" | "steps" | "sides" | "index" | "order_book" | "candle" | "rsi" | "contracts"
  | "delta" | "expectancy" | "overfitting" | "payoff" | "pnl" | "risk" | "classification" | "scenario"
  | "horizon" | "screener" | "ranking" | "replay" | "swing" | "workflow";

/** Authored lesson content. Every lesson has its own; nothing here is generated from a template.
 *  `plain` is deliberately the first thing a learner reads: the simplest true sentence about
 *  this specific concept, in words a beginner already knows. */
export type Authored = {
  plain: string;
  detail: string;
  example: string;
  interaction: InteractionKind;
  flow: FlowKind;
  question: string;
  choices: string[];
  correct: number;
  correctFeedback: string;
  incorrectFeedback: string;
  takeaway: string;
  /** Ordered steps, for `sequence` flow lessons. */
  steps?: string[];
  /** Two-column comparison, for `compare` flow lessons. */
  sides?: { left: string; right: string; rows: [string, string][] };
};

export type LessonMaterial = Authored & { exampleTitle: string };

export type Lesson = {
  id: string;
  title: string;
  description: string;
  level: string;
  levelCode: "FND" | "APP" | "PRO";
  module: string;
  moduleCode: string;
  order: number;
  estimatedMinutes: number;
  prerequisites: string[];
  masteryTags: string[];
  status: LessonStatus;
  track: Track;
  blocks: LessonBlock[];
  assessment: { prompt: string; applicationFirst: boolean };
  xp: number;
  material: LessonMaterial;
};

export type CourseModule = { code: string; title: string; description: string; lab?: string; track: Track; lessons: Lesson[] };
export type CourseLevel = { code: "FND" | "APP" | "PRO"; number: number; title: string; subtitle: string; assessment: string; modules: CourseModule[] };

/** `practical` marks the trade-craft modules — screening, swing, intraday, positional selection
 *  and the find-a-trade workflow — so Content Review can filter them for individual sign-off. */
export type Track = "core" | "practical";

type ModuleSeed = {
  code: string; title: string; blurb: string; lab?: string; lessons: string[];
  track?: Track;
  /** Cross-module prerequisites attached to this module's first lesson. */
  requires?: string[];
};

const foundations: ModuleSeed[] = [
  { code: "MKT", title: "Financial Markets", blurb: "What a market is, who is in it and where prices come from.", lessons: ["What is a financial market?", "Why do financial markets exist?", "What is a company share?", "Why do companies issue shares?", "Primary vs secondary markets", "What are NSE and BSE?", "What is an index?", "What is NIFTY 50?", "What is SENSEX?", "Index vs individual stock", "Buyers and sellers", "How prices are discovered", "Who participates in markets?", "Retail vs institutional participants", "Investor vs trader"] },
  { code: "WORK", title: "How Trading Works", blurb: "What happens between pressing Buy and owning something.", lab: "Order Book Lab", lessons: ["What does a broker do?", "Trading account vs demat account", "What happens when you press Buy?", "Bid price", "Ask price", "Bid-ask spread", "Market depth", "Liquidity", "Slippage", "Settlement", "Intraday vs delivery", "Long positions", "Short positions", "Profit and loss", "Brokerage and transaction costs"] },
  { code: "ORD", title: "Orders and Execution", blurb: "The instructions you can give, and what each one trades away.", lab: "Order Book Lab", lessons: ["Market orders", "Limit orders", "Stop-loss orders", "Stop-limit orders", "Entry orders", "Exit orders", "Stop-loss vs target", "Partial fills", "Slippage during volatility", "Why execution matters"] },
  { code: "CHART", title: "Reading Charts", blurb: "How a chart stores price, and what it quietly leaves out.", lab: "Candlestick Lab", lessons: ["What is a price chart?", "Timeframes", "OHLC", "Candlestick anatomy", "Bullish candles", "Bearish candles", "Candle body", "Wicks", "What a candle tells you", "What a candle does NOT tell you", "Line charts vs candlestick charts", "Choosing timeframes"] },
  { code: "HZN", title: "Trading Horizons", blurb: "How long you intend to hold, and everything that follows from it.", lab: "Horizon Lab", track: "practical", requires: ["FND-CHART-012", "FND-WORK-015"], lessons: ["What is a trading horizon?", "Intraday: minutes to hours", "Swing: days to weeks", "Positional: weeks to months", "Investing: months to years", "How horizon changes the chart you read", "How horizon changes stop distance and size", "How horizon changes costs and event exposure", "Choosing a horizon that fits your life"] },
  { code: "STRUCT", title: "Market Structure", blurb: "Reading a chart as a sequence of highs and lows.", lab: "Market Structure Lab", lessons: ["Trend", "Uptrend", "Downtrend", "Range", "Higher highs", "Higher lows", "Lower highs", "Lower lows", "Support", "Resistance", "Breakouts", "False breakouts", "Trend reversal", "Market context"] },
  { code: "VOL", title: "Volume and Volatility", blurb: "How much trading happened, and how far price moved.", lab: "Volatility Lab", lessons: ["What is volume?", "Why volume matters", "Volume expansion", "Volume contraction", "What is volatility?", "High-volatility markets", "Low-volatility markets", "ATR introduction", "Volatility and stop losses", "Why volatility changes"] },
  { code: "IND", title: "Indicators", blurb: "Formulas that re-describe price — and what they cannot add.", lab: "RSI Lab", lessons: ["What is an indicator?", "Indicators are derived from price", "Moving averages", "SMA", "EMA", "RSI", "RSI calculation conceptually", "Overbought and oversold", "Why RSI below 30 does NOT automatically mean Buy", "ATR", "Indicator lag", "Combining indicators", "Indicators vs market structure"] },
  { code: "PICK", title: "Finding Stocks to Trade", blurb: "Turning a market of thousands into a list you can actually read.", lab: "Screener Lab", track: "practical", requires: ["FND-IND-013", "FND-HZN-009"], lessons: ["Where trade ideas come from", "Why liquidity comes first", "Filtering a long list", "Price and volume filters", "A shortlist is not a trade", "Market and sector context", "Comparing two candidates", "Why most candidates are rejected"] },
  { code: "RISK", title: "Risk Management", blurb: "Deciding how much you can lose before you find out if you are right.", lab: "Risk Simulator", lessons: ["Why traders lose money", "Risk per trade", "Position sizing", "Stop losses", "Risk/reward", "Win rate", "Expectancy introduction", "Losing streaks", "Drawdown", "Compounding", "Leverage", "Risk of ruin", "Daily loss limits", "Capital preservation", "Trading psychology", "Revenge trading", "Overconfidence", "Following a process"] },
];

const applied: ModuleSeed[] = [
  { code: "PA", title: "Price Action", blurb: "Reading swings and rejection in the context around them.", lab: "Market Structure Lab", lessons: ["Reading price in context", "Swing highs and lows", "Break of structure", "Trend continuation", "Trend exhaustion", "Compression", "Expansion", "Rejection", "Failed breakouts", "Price action traps", "Context before pattern"] },
  { code: "MTF", title: "Multi-Timeframe Analysis", blurb: "Using two timeframes for two different jobs.", lessons: ["Why timeframe matters", "Higher timeframe structure", "Lower timeframe execution", "Conflicting timeframes", "Trend alignment", "When multiple timeframes confuse rather than help", "Building a timeframe framework"] },
  { code: "MOM", title: "Momentum Trading", blurb: "Trading continuation, and defining where it has failed.", lab: "RSI Lab", lessons: ["What is momentum?", "Momentum continuation", "Breakout momentum", "Relative strength", "Momentum indicators", "Momentum failure", "Entries", "Stops", "Exits", "Momentum strategy example"] },
  { code: "MR", title: "Mean Reversion", blurb: "Trading the snap-back — and knowing when it stops working.", lab: "RSI Lab", lessons: ["What is mean reversion?", "Trend vs mean reversion", "Statistical intuition", "RSI and mean reversion", "Moving-average distance", "Volatility extremes", "Failed mean reversion", "Regime dependence", "Entry logic", "Exit logic"] },
  { code: "SCR", title: "Stock Screening", blurb: "Filters that produce candidates — and never produce trades.", lab: "Screener Lab", track: "practical", requires: ["FND-PICK-008", "APP-MTF-007"], lessons: ["What is a stock screener?", "Why screen thousands of stocks?", "Screening vs selecting a trade", "Fundamental screeners", "Technical screeners", "Liquidity filters", "Price filters", "Volume filters", "Market-cap filters", "Volatility filters", "Moving-average filters", "RSI filters", "Breakout filters", "Relative-strength filters", "52-week high and low screens", "Unusual volume", "Combining multiple filters", "Over-filtering", "False positives", "From candidates to a decision"] },
  { code: "SWG", title: "Swing Trading", blurb: "Holding for days to weeks: setups, stops and the overnight gap.", lab: "Swing Setup Lab", track: "practical", requires: ["APP-SCR-020", "FND-HZN-003"], lessons: ["What is swing trading?", "Typical holding periods", "Swing trading vs intraday trading", "Swing trading vs investing", "Identifying trending stocks", "Breakout setups", "Pullback setups", "Support and resistance setups", "Relative strength in swing selection", "Volume confirmation", "Moving-average setups", "RSI in swing trading", "Multi-timeframe swing analysis", "Gap behaviour", "Volatility and ATR", "Entry selection", "Stop-loss placement", "Trailing stops", "Profit targets", "Risk and reward in swing trades", "Swing position sizing", "Managing overnight risk", "Earnings and event risk", "Failed breakouts", "When not to take a swing trade", "Planning a complete swing trade"] },
  { code: "DAY", title: "Intraday Trading", blurb: "One session, no overnight risk, and a hard deadline.", lab: "Market Replay Lab", track: "practical", requires: ["APP-SWG-026", "FND-HZN-002"], lessons: ["What is intraday trading?", "Intraday vs swing trading", "Market open behaviour", "The opening range", "Trend days", "Range days", "Intraday breakouts", "Intraday pullbacks", "VWAP", "Moving averages intraday", "Intraday momentum", "Intraday volume", "Intraday volatility", "Intraday support and resistance", "Previous-day high and low", "Gap-up and gap-down behaviour", "Multi-timeframe intraday analysis", "Choosing liquid stocks", "Trading the index intraday", "Entry timing", "Intraday stop placement", "Intraday targets", "Intraday trailing stops", "Intraday position sizing", "Slippage intraday", "Overtrading", "The revenge-trading spiral", "Time-of-day effects", "When to stop trading for the day", "Intraday loss limits", "Why intraday leverage is dangerous", "Reading a session without hindsight"] },
  { code: "PSN", title: "Positional Trading", blurb: "Weeks to months: market, sector, stock, structure and fundamental context together.", lab: "Stock Selection Lab", track: "practical", requires: ["APP-SWG-026", "FND-HZN-004"], lessons: ["What is positional trading?", "Positional trading vs investing", "Starting with the market trend", "Sector strength", "Relative strength over months", "Liquidity for larger positions", "Market capitalisation", "Revenue growth", "Earnings growth", "Profitability", "Debt", "Return ratios", "Valuation awareness", "Corporate events", "Institutional activity", "52-week highs", "Long-term price structure", "SMA 50 and SMA 200", "Base formation", "Breakouts from long consolidations", "Volume expansion on breakouts", "Trend continuation over months", "Avoiding structurally weak stocks", "Positional position sizing", "Wider stops for longer holds", "Gap and event risk", "Portfolio concentration", "Correlation between positions", "Building a positional shortlist"] },
  { code: "FIND", title: "Finding a Trade", blurb: "The whole chain from market regime to a sized position with an exit plan.", lab: "Trade Workflow Lab", track: "practical", requires: ["APP-PSN-029", "APP-DAY-032"], lessons: ["Trading is a process, not a signal", "Step 1: read the market", "Step 2: read the sector", "Step 3: screen for candidates", "Step 4: build the shortlist", "Step 5: read the chart", "Step 6: name the setup", "Step 7: choose the entry", "Step 8: define invalidation", "Step 9: place the stop", "Step 10: size the position", "Step 11: plan the exit", "Running the whole workflow"] },
  { code: "DER", title: "Derivatives", blurb: "Contracts whose value comes from something else.", lessons: ["What is a derivative?", "Underlying asset", "Futures", "Options", "Expiry", "Contracts", "Lot size", "Margin", "Leverage", "Settlement", "Why derivatives exist", "Hedging vs speculation"] },
  { code: "FUT", title: "Futures", blurb: "An obligation to settle, marked to market every day.", lab: "Futures Simulator", lessons: ["Futures contract", "NIFTY futures", "Futures pricing", "Long futures", "Short futures", "Margin", "Mark-to-market", "Leverage", "Futures basis", "Expiry", "Hedging with futures", "Futures risk"] },
  { code: "OPT", title: "Options Fundamentals", blurb: "A right for the buyer, an obligation for the seller.", lab: "Options Basics Lab", lessons: ["What is an option?", "Calls", "Puts", "Strike price", "Expiry", "Option buyer", "Option seller", "Premium", "ATM", "ITM", "OTM", "Intrinsic value", "Time value", "Option payoff", "Limited vs unlimited risk", "Why options expire", "Moneyness"] },
  { code: "GRK", title: "Option Greeks", blurb: "How premium responds to spot, time and volatility.", lab: "Greeks Lab", lessons: ["What is Delta?", "Delta intuition", "Call Delta", "Put Delta", "Delta and moneyness", "Delta changes", "What is Gamma?", "Gamma changes Delta", "Gamma near expiry", "What is Theta?", "Time decay", "Theta near expiry", "What is Vega?", "IV changes and option premium", "Greeks interact", "Why Greeks are dynamic", "Greeks for buyers", "Greeks for sellers"] },
  { code: "OI", title: "Open Interest and Option Chain", blurb: "Counting contracts that are still open, and reading the chain.", lab: "Option Chain Lab", lessons: ["What is Open Interest?", "OI vs volume", "How OI increases", "How OI decreases", "Change in OI", "Long buildup", "Short buildup", "Short covering", "Long unwinding", "Reading an option chain", "Call OI", "Put OI", "Change in Call OI", "Change in Put OI", "PCR", "Strike positioning", "Why high Call OI is NOT automatically resistance", "Why high Put OI is NOT automatically support", "OI in context", "OI limitations"] },
  { code: "STR", title: "Building a Trading Strategy", blurb: "Turning an idea into rules you can actually follow.", lab: "Strategy Builder", lessons: ["Trading idea vs strategy", "Hypothesis", "Entry rule", "Exit rule", "Stop rule", "Target", "Filters", "Position sizing", "Time filters", "Instrument selection", "Strategy consistency", "Strategy documentation", "Measuring results", "When rules become overcomplicated"] },
];

const professional: ModuleSeed[] = [
  { code: "AOI", title: "Advanced Open Interest", blurb: "How outstanding positions move across strikes and time.", lab: "OI Classification Lab", lessons: ["OI distributions", "Change in OI across strikes", "OI migration", "Unwinding", "New writing", "Strike battles", "OI walls", "OI concentration", "OI and spot movement", "OI and premium movement", "Dynamic positioning", "Intraday vs positional OI", "OI regime changes", "OI false signals"] },
  { code: "POS", title: "Option Positioning", blurb: "Inferring exposure from public data, with honest uncertainty.", lab: "Option Chain Lab", lessons: ["Understanding participant positioning", "Call writing", "Put writing", "Call unwinding", "Put unwinding", "Short covering", "Long buildup", "Positioning around ATM", "Positioning around expiry", "Strike migration", "Dealer hedging intuition", "Reading positioning probabilistically"] },
  { code: "VOL", title: "Volatility", blurb: "Pricing the size of uncertainty, not its direction.", lab: "Volatility Lab", lessons: ["Realised volatility", "Implied volatility", "IV vs realised volatility", "IV expansion", "IV contraction", "IV crush", "Volatility smile", "Volatility skew", "Term structure", "Event volatility", "Volatility regime", "Volatility risk"] },
  { code: "OSE", title: "Option Strategy Engineering", blurb: "Combining legs to shape a payoff on purpose.", lab: "Payoff Builder", lessons: ["Why combine options?", "Vertical spreads", "Bull Call Spread", "Bear Put Spread", "Credit spreads", "Debit spreads", "Straddles", "Strangles", "Iron Condor", "Butterfly", "Calendar spreads", "Directional vs volatility trades", "Defined risk", "Payoff engineering", "Strategy selection"] },
  { code: "HEDGE", title: "Greeks and Hedging", blurb: "Aggregating exposure, and what a hedge does not remove.", lab: "Hedging Lab", lessons: ["Portfolio Delta", "Portfolio Gamma", "Portfolio Theta", "Portfolio Vega", "Delta-neutral", "Delta hedging", "Dynamic hedging", "Gamma exposure", "Vega exposure", "Why neutral doesn't mean risk-free"] },
  { code: "REG", title: "Market Regimes", blurb: "Naming the environment a strategy was built for.", lab: "Market Regime Lab", lessons: ["What is a market regime?", "Trending regime", "Range regime", "High volatility", "Low volatility", "Momentum regime", "Mean-reversion regime", "Regime transitions", "Strategy-regime mismatch", "Detecting regimes", "Why strategies stop working"] },
  { code: "SSCR", title: "Systematic Screening", blurb: "Ranking a universe on a schedule instead of filtering it by hand.", lab: "Screener Lab", track: "practical", requires: ["PRO-REG-011", "APP-FIND-013"], lessons: ["From screening to ranking", "Defining the universe", "Ranking instead of filtering", "Composite scores", "Rebalancing the shortlist", "Regime-conditional screens", "Turnover and cost", "Screen decay", "Testing a screen honestly", "Capacity and liquidity limits", "Data quality in screening", "Retiring a screen"] },
  { code: "SYS", title: "Systematic Trading", blurb: "Rules, data and controls that run without you.", lab: "Strategy Builder", lessons: ["Discretionary vs systematic", "Hypothesis", "Signal", "Rules", "Inputs", "Filters", "Entry", "Exit", "Position sizing", "Execution", "State machines", "Strategy lifecycle", "Research workflow", "Monitoring", "Kill switches"] },
  { code: "BT", title: "Backtesting", blurb: "Testing rules on history without cheating.", lab: "Backtesting Lab", lessons: ["What is backtesting?", "Historical data", "Data quality", "Signal generation", "Trade simulation", "Transaction costs", "Slippage", "Look-ahead bias", "Survivorship bias", "In-sample testing", "Out-of-sample testing", "Walk-forward testing", "Parameter optimisation", "Overfitting", "Curve fitting", "Robustness", "Sample size"] },
  { code: "EVAL", title: "Strategy Evaluation", blurb: "Judging results by distribution and path, not one number.", lab: "Strategy Comparison Lab", lessons: ["Total return", "Win rate", "Average win", "Average loss", "Payoff ratio", "Expectancy", "Profit factor", "Maximum drawdown", "Recovery factor", "Sharpe ratio", "Consistency", "Number of trades", "Distribution of returns", "Losing streaks", "Why one metric is never enough"] },
  { code: "RISK", title: "Professional Risk Management", blurb: "Controlling exposures that fail together.", lab: "Risk Simulator", lessons: ["Risk per strategy", "Portfolio risk", "Correlation", "Exposure", "Concentration", "Daily loss limit", "Weekly loss limit", "Drawdown limits", "Volatility-adjusted sizing", "Risk of ruin", "Tail risk", "Liquidity risk", "Execution risk", "Model risk", "Kill switches", "Strategy suspension", "Capital allocation"] },
  { code: "PORT", title: "Portfolio Construction", blurb: "Assembling sized positions into a book that behaves the way you intended.", lab: "Stock Selection Lab", track: "practical", requires: ["PRO-RISK-017", "PRO-SSCR-012"], lessons: ["From trades to a portfolio", "How many positions", "Sizing across positions", "Sector caps", "Correlation-aware selection", "Cash as a position", "Scaling in", "Scaling out", "Replacing a position", "Rebalancing discipline", "Measuring the portfolio, not the trade", "When to reduce everything"] },
];

const masteryFor = (title: string, moduleTitle: string) => {
  const text = `${title} ${moduleTitle}`.toLowerCase();
  const tags = [
    ["risk", "risk"], ["position", "position sizing"], ["candle", "candlesticks"], ["chart", "charts"], ["structure", "market structure"],
    ["rsi", "RSI"], ["volatil", "volatility"], ["future", "futures"], ["option", "options"], ["delta", "Delta"], ["gamma", "Gamma"],
    ["theta", "Theta"], ["vega", "Vega"], ["open interest", "OI"], ["oi ", "OI"], ["backtest", "backtesting"], ["drawdown", "drawdown"],
    ["expectancy", "expectancy"], ["system", "systematic trading"], ["regime", "market regimes"], ["order", "orders"], ["volume", "volume"],
    // Practical modules are tagged from their module title, which cannot collide with a lesson title.
    ["trading horizons", "trading horizons"], ["finding stocks to trade", "screening"], ["stock screening", "screening"],
    ["systematic screening", "screening"], ["swing trading", "swing trading"], ["intraday trading", "intraday trading"],
    ["positional trading", "positional trading"], ["finding a trade", "trade workflow"], ["portfolio construction", "portfolio construction"],
  ].filter(([needle]) => text.includes(needle)).map(([, tag]) => tag);
  return tags.length ? [...new Set(tags)].slice(0, 3) : [moduleTitle.toLowerCase()];
};

const authored: Record<string, Authored> = {
  ...foundationsContent, ...appliedContent, ...professionalContent,
  ...horizonsContent, ...screeningContent, ...swingContent, ...intradayContent, ...positionalContent, ...workflowContent,
};

/** Lessons still waiting for authored content. The content audit fails while this is non-empty. */
export const missingContent: string[] = [];

const flowMinutes: Record<FlowKind, number> = { define: 3, compare: 4, build: 5, calculate: 5, classify: 4, sequence: 4, cause: 4, judge: 5, plan: 7 };

/** Blocks a lesson uses, by flow. Two lessons only share a shape when they teach the same
 *  kind of thing — a definition, a comparison, a construction, a calculation, a judgement call. */
function blocksFor(m: Authored): LessonBlock[] {
  const plain: LessonBlock = { type: "text", title: "In plain words", body: m.plain };
  const quiz: LessonBlock = { type: "quiz", title: "Check yourself", prompt: m.question };
  const carry: LessonBlock = { type: "summary", title: "Worth remembering", body: m.takeaway };
  switch (m.flow) {
    case "define":
      return [plain, { type: "visual", title: "A closer look", body: m.detail }, quiz, carry];
    case "compare":
      return [plain, { type: "matching", title: "Side by side", body: m.detail }, quiz, carry];
    case "build":
      return [plain, { type: "simulation", title: "Build it yourself", body: m.detail }, { type: "challenge", title: "Now try this", prompt: m.example }, quiz, carry];
    case "calculate":
      return [plain, { type: "calculation", title: "Work the number", body: m.detail }, quiz, carry];
    case "classify":
      return [plain, { type: "chart", title: "Look at the market", body: m.detail }, { type: "chart_question", title: "Name what you see", prompt: m.question }, carry];
    case "sequence":
      return [plain, { type: "sequence", title: "Put it in order", body: m.detail }, quiz, carry];
    case "cause":
      return [plain, { type: "scenario", title: "What actually happens", body: m.example }, { type: "reveal", title: "Why it works that way", body: m.detail }, quiz, carry];
    case "judge":
      return [{ type: "scenario", title: "The situation", body: m.example }, { type: "prediction", title: "Make the call", prompt: m.question }, { type: "reveal", title: "What the evidence supports", body: m.detail }, carry];
    case "plan":
      return [plain, { type: "simulation", title: "Work the chart", body: m.detail }, { type: "challenge", title: "Plan the trade", prompt: m.example }, { type: "prediction", title: "Commit to the call", prompt: m.question }, { type: "reveal", title: "What happened next", body: m.detail }, carry];
  }
}

function placeholderFor(id: string, title: string): Authored {
  missingContent.push(id);
  return {
    plain: `${title}: plain-language explanation not written yet.`,
    detail: "This lesson is awaiting authored content.",
    example: "—",
    interaction: "terms",
    flow: "define",
    question: `Content for ${id} has not been written.`,
    choices: ["Awaiting content", "Awaiting content"],
    correct: 0,
    correctFeedback: "—",
    incorrectFeedback: "—",
    takeaway: "—",
  };
}

/** Authoring naturally puts the right answer in a habitual slot. Rotate each lesson's choices by a
 *  stable amount derived from its id, so the answer position is spread and cannot be guessed from
 *  layout. No choice text refers to its own position, so rotation is safe. */
function rotateChoices(id: string, choices: string[], correct: number) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) % 100003;
  const shift = hash % choices.length;
  return {
    choices: choices.map((_, index) => choices[(index + shift) % choices.length]),
    correct: (correct - shift + choices.length) % choices.length,
  };
}

function makeLesson(seed: ModuleSeed, title: string, order: number, levelCode: "FND" | "APP" | "PRO", levelTitle: string): Lesson {
  const id = `${levelCode}-${seed.code}-${String(order + 1).padStart(3, "0")}`;
  const content = authored[id] ?? placeholderFor(id, title);
  const rotated = rotateChoices(id, content.choices, content.correct);
  const material: LessonMaterial = { ...content, ...rotated, exampleTitle: content.flow === "judge" ? "The situation" : content.flow === "calculate" ? "Work the number" : content.flow === "build" ? "Build it yourself" : "For example" };
  return {
    id, title,
    description: content.plain,
    level: levelTitle, levelCode, module: seed.title, moduleCode: seed.code, order: order + 1,
    estimatedMinutes: flowMinutes[content.flow],
    prerequisites: order ? [`${levelCode}-${seed.code}-${String(order).padStart(3, "0")}`] : (seed.requires ?? []),
    masteryTags: masteryFor(title, seed.title), status: "Draft", xp: 10, track: seed.track ?? "core",
    blocks: blocksFor(content),
    assessment: { prompt: content.question, applicationFirst: content.flow === "judge" || content.flow === "classify" },
    material,
  };
}

const makeModules = (seeds: ModuleSeed[], levelCode: "FND" | "APP" | "PRO", levelTitle: string): CourseModule[] => seeds.map((seed) => ({
  code: seed.code, title: seed.title, lab: seed.lab, description: seed.blurb, track: seed.track ?? "core",
  lessons: seed.lessons.map((title, index) => makeLesson(seed, title, index, levelCode, levelTitle)),
}));

export const course: CourseLevel[] = [
  { code: "FND", number: 1, title: "Trading Foundations", subtitle: "Plain-language market mechanics, charts and capital protection", assessment: "Foundations Assessment", modules: makeModules(foundations, "FND", "Trading Foundations") },
  { code: "APP", number: 2, title: "Applied Trading", subtitle: "Setups, derivatives and strategy design", assessment: "Applied Trading Assessment", modules: makeModules(applied, "APP", "Applied Trading") },
  { code: "PRO", number: 3, title: "Professional Trading", subtitle: "Positioning, research and systematic risk", assessment: "Professional Trading Assessment", modules: makeModules(professional, "PRO", "Professional Trading") },
];

export const allLessons = course.flatMap((level) => level.modules.flatMap((module) => module.lessons));

export const labs = [
  "Candlestick Lab", "Order Book Lab", "Market Structure Lab", "RSI Lab", "Position Sizing Lab", "Risk Simulator", "Futures Simulator", "Options Basics Lab", "Delta Lab", "Greeks Lab", "Option Chain Lab", "OI Classification Lab", "Volatility Lab", "Payoff Builder", "Hedging Lab", "Market Regime Lab", "Strategy Builder", "Backtesting Lab", "Overfitting Lab", "Strategy Comparison Lab",
  "Horizon Lab", "Screener Lab", "Swing Setup Lab", "Market Replay Lab", "Stock Selection Lab", "Trade Workflow Lab",
];

export const masteryTopics = ["market basics", "orders", "charts", "candlesticks", "market structure", "volume", "volatility", "RSI", "risk", "position sizing", "futures", "options", "Delta", "Gamma", "Theta", "Vega", "OI", "option chain", "strategy construction", "market regimes", "backtesting", "expectancy", "drawdown", "systematic trading", "trading horizons", "screening", "swing trading", "intraday trading", "positional trading", "trade workflow", "portfolio construction"];

export const badges = ["Market Explorer", "Chart Reader", "Risk First", "Market Structure Analyst", "Futures Explorer", "Options Explorer", "Greeks Apprentice", "Greeks Master", "OI Analyst", "Volatility Analyst", "Strategy Builder", "Backtester", "Risk Manager", "Systematic Trader"];

export const supportedBlockTypes: BlockType[] = ["text", "visual", "matching", "simulation", "challenge", "calculation", "chart", "chart_question", "sequence", "scenario", "reveal", "prediction", "quiz", "summary"];

export const flowKinds: FlowKind[] = ["define", "compare", "build", "calculate", "classify", "sequence", "cause", "judge", "plan"];
