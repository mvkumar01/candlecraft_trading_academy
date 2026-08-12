export const PRODUCT_NAME = "Trading Academy";

export type LessonStatus = "Draft" | "Review" | "Approved";
export type BlockType = "concept" | "text" | "callout" | "visual" | "quiz" | "true_false" | "scenario" | "slider" | "chart" | "chart_question" | "calculation" | "option_chain" | "simulation" | "matching" | "sequence" | "prediction" | "reveal" | "summary" | "challenge";

export type LessonBlock = { type: BlockType; title?: string; body?: string; prompt?: string };
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
  learningObjectives: string[];
  prerequisites: string[];
  masteryTags: string[];
  status: LessonStatus;
  blocks: LessonBlock[];
  assessment: { prompt: string; applicationFirst: true };
  xp: number;
};

export type CourseModule = { code: string; title: string; description: string; lab?: string; lessons: Lesson[] };
export type CourseLevel = { code: "FND" | "APP" | "PRO"; number: number; title: string; subtitle: string; assessment: string; modules: CourseModule[] };

type ModuleSeed = { code: string; title: string; lab?: string; lessons: string[] };

const foundations: ModuleSeed[] = [
  { code: "MKT", title: "Financial Markets", lessons: ["What is a financial market?", "Why do financial markets exist?", "What is a company share?", "Why do companies issue shares?", "Primary vs secondary markets", "What are NSE and BSE?", "What is an index?", "What is NIFTY 50?", "What is SENSEX?", "Index vs individual stock", "Buyers and sellers", "How prices are discovered", "Who participates in markets?", "Retail vs institutional participants", "Investor vs trader"] },
  { code: "WORK", title: "How Trading Works", lab: "Order Book Lab", lessons: ["What does a broker do?", "Trading account vs demat account", "What happens when you press Buy?", "Bid price", "Ask price", "Bid-ask spread", "Market depth", "Liquidity", "Slippage", "Settlement", "Intraday vs delivery", "Long positions", "Short positions", "Profit and loss", "Brokerage and transaction costs"] },
  { code: "ORD", title: "Orders and Execution", lab: "Order Book Lab", lessons: ["Market orders", "Limit orders", "Stop-loss orders", "Stop-limit orders", "Entry orders", "Exit orders", "Stop-loss vs target", "Partial fills", "Slippage during volatility", "Why execution matters"] },
  { code: "CHART", title: "Reading Charts", lab: "Candlestick Lab", lessons: ["What is a price chart?", "Timeframes", "OHLC", "Candlestick anatomy", "Bullish candles", "Bearish candles", "Candle body", "Wicks", "What a candle tells you", "What a candle does NOT tell you", "Line charts vs candlestick charts", "Choosing timeframes"] },
  { code: "STRUCT", title: "Market Structure", lab: "Market Structure Lab", lessons: ["Trend", "Uptrend", "Downtrend", "Range", "Higher highs", "Higher lows", "Lower highs", "Lower lows", "Support", "Resistance", "Breakouts", "False breakouts", "Trend reversal", "Market context"] },
  { code: "VOL", title: "Volume and Volatility", lab: "Volatility Lab", lessons: ["What is volume?", "Why volume matters", "Volume expansion", "Volume contraction", "What is volatility?", "High-volatility markets", "Low-volatility markets", "ATR introduction", "Volatility and stop losses", "Why volatility changes"] },
  { code: "IND", title: "Indicators", lab: "RSI Lab", lessons: ["What is an indicator?", "Indicators are derived from price", "Moving averages", "SMA", "EMA", "RSI", "RSI calculation conceptually", "Overbought and oversold", "Why RSI below 30 does NOT automatically mean Buy", "ATR", "Indicator lag", "Combining indicators", "Indicators vs market structure"] },
  { code: "RISK", title: "Risk Management", lab: "Risk Simulator", lessons: ["Why traders lose money", "Risk per trade", "Position sizing", "Stop losses", "Risk/reward", "Win rate", "Expectancy introduction", "Losing streaks", "Drawdown", "Compounding", "Leverage", "Risk of ruin", "Daily loss limits", "Capital preservation", "Trading psychology", "Revenge trading", "Overconfidence", "Following a process"] },
];

const applied: ModuleSeed[] = [
  { code: "PA", title: "Price Action", lab: "Market Structure Lab", lessons: ["Reading price in context", "Swing highs and lows", "Break of structure", "Trend continuation", "Trend exhaustion", "Compression", "Expansion", "Rejection", "Failed breakouts", "Price action traps", "Context before pattern"] },
  { code: "MTF", title: "Multi-Timeframe Analysis", lessons: ["Why timeframe matters", "Higher timeframe structure", "Lower timeframe execution", "Conflicting timeframes", "Trend alignment", "When multiple timeframes confuse rather than help", "Building a timeframe framework"] },
  { code: "MOM", title: "Momentum Trading", lab: "RSI Lab", lessons: ["What is momentum?", "Momentum continuation", "Breakout momentum", "Relative strength", "Momentum indicators", "Momentum failure", "Entries", "Stops", "Exits", "Momentum strategy example"] },
  { code: "MR", title: "Mean Reversion", lab: "RSI Lab", lessons: ["What is mean reversion?", "Trend vs mean reversion", "Statistical intuition", "RSI and mean reversion", "Moving-average distance", "Volatility extremes", "Failed mean reversion", "Regime dependence", "Entry logic", "Exit logic"] },
  { code: "DER", title: "Derivatives", lessons: ["What is a derivative?", "Underlying asset", "Futures", "Options", "Expiry", "Contracts", "Lot size", "Margin", "Leverage", "Settlement", "Why derivatives exist", "Hedging vs speculation"] },
  { code: "FUT", title: "Futures", lab: "Futures Simulator", lessons: ["Futures contract", "NIFTY futures", "Futures pricing", "Long futures", "Short futures", "Margin", "Mark-to-market", "Leverage", "Futures basis", "Expiry", "Hedging with futures", "Futures risk"] },
  { code: "OPT", title: "Options Fundamentals", lab: "Options Basics Lab", lessons: ["What is an option?", "Calls", "Puts", "Strike price", "Expiry", "Option buyer", "Option seller", "Premium", "ATM", "ITM", "OTM", "Intrinsic value", "Time value", "Option payoff", "Limited vs unlimited risk", "Why options expire", "Moneyness"] },
  { code: "GRK", title: "Option Greeks", lab: "Greeks Lab", lessons: ["What is Delta?", "Delta intuition", "Call Delta", "Put Delta", "Delta and moneyness", "Delta changes", "What is Gamma?", "Gamma changes Delta", "Gamma near expiry", "What is Theta?", "Time decay", "Theta near expiry", "What is Vega?", "IV changes and option premium", "Greeks interact", "Why Greeks are dynamic", "Greeks for buyers", "Greeks for sellers"] },
  { code: "OI", title: "Open Interest and Option Chain", lab: "Option Chain Lab", lessons: ["What is Open Interest?", "OI vs volume", "How OI increases", "How OI decreases", "Change in OI", "Long buildup", "Short buildup", "Short covering", "Long unwinding", "Reading an option chain", "Call OI", "Put OI", "Change in Call OI", "Change in Put OI", "PCR", "Strike positioning", "Why high Call OI is NOT automatically resistance", "Why high Put OI is NOT automatically support", "OI in context", "OI limitations"] },
  { code: "STR", title: "Building a Trading Strategy", lab: "Strategy Builder", lessons: ["Trading idea vs strategy", "Hypothesis", "Entry rule", "Exit rule", "Stop rule", "Target", "Filters", "Position sizing", "Time filters", "Instrument selection", "Strategy consistency", "Strategy documentation", "Measuring results", "When rules become overcomplicated"] },
];

const professional: ModuleSeed[] = [
  { code: "AOI", title: "Advanced Open Interest", lab: "OI Classification Lab", lessons: ["OI distributions", "Change in OI across strikes", "OI migration", "Unwinding", "New writing", "Strike battles", "OI walls", "OI concentration", "OI and spot movement", "OI and premium movement", "Dynamic positioning", "Intraday vs positional OI", "OI regime changes", "OI false signals"] },
  { code: "POS", title: "Option Positioning", lab: "Option Chain Lab", lessons: ["Understanding participant positioning", "Call writing", "Put writing", "Call unwinding", "Put unwinding", "Short covering", "Long buildup", "Positioning around ATM", "Positioning around expiry", "Strike migration", "Dealer hedging intuition", "Reading positioning probabilistically"] },
  { code: "VOL", title: "Volatility", lab: "Volatility Lab", lessons: ["Realised volatility", "Implied volatility", "IV vs realised volatility", "IV expansion", "IV contraction", "IV crush", "Volatility smile", "Volatility skew", "Term structure", "Event volatility", "Volatility regime", "Volatility risk"] },
  { code: "OSE", title: "Option Strategy Engineering", lab: "Payoff Builder", lessons: ["Why combine options?", "Vertical spreads", "Bull Call Spread", "Bear Put Spread", "Credit spreads", "Debit spreads", "Straddles", "Strangles", "Iron Condor", "Butterfly", "Calendar spreads", "Directional vs volatility trades", "Defined risk", "Payoff engineering", "Strategy selection"] },
  { code: "HEDGE", title: "Greeks and Hedging", lab: "Hedging Lab", lessons: ["Portfolio Delta", "Portfolio Gamma", "Portfolio Theta", "Portfolio Vega", "Delta-neutral", "Delta hedging", "Dynamic hedging", "Gamma exposure", "Vega exposure", "Why neutral doesn't mean risk-free"] },
  { code: "REG", title: "Market Regimes", lab: "Market Regime Lab", lessons: ["What is a market regime?", "Trending regime", "Range regime", "High volatility", "Low volatility", "Momentum regime", "Mean-reversion regime", "Regime transitions", "Strategy-regime mismatch", "Detecting regimes", "Why strategies stop working"] },
  { code: "SYS", title: "Systematic Trading", lab: "Strategy Builder", lessons: ["Discretionary vs systematic", "Hypothesis", "Signal", "Rules", "Inputs", "Filters", "Entry", "Exit", "Position sizing", "Execution", "State machines", "Strategy lifecycle", "Research workflow", "Monitoring", "Kill switches"] },
  { code: "BT", title: "Backtesting", lab: "Backtesting Lab", lessons: ["What is backtesting?", "Historical data", "Data quality", "Signal generation", "Trade simulation", "Transaction costs", "Slippage", "Look-ahead bias", "Survivorship bias", "In-sample testing", "Out-of-sample testing", "Walk-forward testing", "Parameter optimisation", "Overfitting", "Curve fitting", "Robustness", "Sample size"] },
  { code: "EVAL", title: "Strategy Evaluation", lab: "Strategy Comparison Lab", lessons: ["Total return", "Win rate", "Average win", "Average loss", "Payoff ratio", "Expectancy", "Profit factor", "Maximum drawdown", "Recovery factor", "Sharpe ratio", "Consistency", "Number of trades", "Distribution of returns", "Losing streaks", "Why one metric is never enough"] },
  { code: "RISK", title: "Professional Risk Management", lab: "Risk Simulator", lessons: ["Risk per strategy", "Portfolio risk", "Correlation", "Exposure", "Concentration", "Daily loss limit", "Weekly loss limit", "Drawdown limits", "Volatility-adjusted sizing", "Risk of ruin", "Tail risk", "Liquidity risk", "Execution risk", "Model risk", "Kill switches", "Strategy suspension", "Capital allocation"] },
];

const masteryFor = (title: string, moduleTitle: string) => {
  const text = `${title} ${moduleTitle}`.toLowerCase();
  const tags = [
    ["risk", "risk"], ["position", "position sizing"], ["candle", "candlesticks"], ["chart", "charts"], ["structure", "market structure"],
    ["rsi", "RSI"], ["volatil", "volatility"], ["future", "futures"], ["option", "options"], ["delta", "Delta"], ["gamma", "Gamma"],
    ["theta", "Theta"], ["vega", "Vega"], ["open interest", "OI"], ["oi ", "OI"], ["backtest", "backtesting"], ["drawdown", "drawdown"],
    ["expectancy", "expectancy"], ["system", "systematic trading"], ["regime", "market regimes"], ["order", "orders"], ["volume", "volume"],
  ].filter(([needle]) => text.includes(needle)).map(([, tag]) => tag);
  return tags.length ? [...new Set(tags)].slice(0, 3) : [moduleTitle.toLowerCase()];
};

const lessonContent: Record<string, { description: string; conceptTitle: string; conceptBody: string; takeaway: string; assessment: string }> = {
  "FND-MKT-001": {
    description: "Before charts, orders or strategies, understand the system that connects people who need capital with people willing to provide it.",
    conceptTitle: "A financial market is a system for exchanging financial assets.",
    conceptBody: "It brings buyers and sellers together under shared rules so they can trade assets such as shares, bonds, currencies and derivatives. The market may once have been a physical floor, but modern markets such as NSE and BSE are largely electronic networks.",
    takeaway: "A financial market is the organised system—not a single building—where financial assets are issued, bought and sold under shared rules.",
    assessment: "Which description best captures what a financial market is?",
  },
};

function makeLesson(seed: ModuleSeed, title: string, order: number, levelCode: "FND" | "APP" | "PRO", levelTitle: string): Lesson {
  const id = `${levelCode}-${seed.code}-${String(order + 1).padStart(3, "0")}`;
  const tags = masteryFor(title, seed.title);
  const content = lessonContent[id];
  return {
    id, title,
    description: content?.description ?? `Build a practical, context-aware understanding of ${title.toLowerCase()} using an Indian-market scenario.`,
    level: levelTitle, levelCode, module: seed.title, moduleCode: seed.code, order: order + 1,
    estimatedMinutes: 4 + (order % 3),
    learningObjectives: [`Explain ${title.toLowerCase()} in plain language`, `Apply the idea to a NIFTY market scenario`, "Separate evidence from prediction"],
    prerequisites: order ? [`${levelCode}-${seed.code}-${String(order).padStart(3, "0")}`] : [],
    masteryTags: tags, status: "Draft", xp: 10,
    blocks: [
      { type: "concept", title: "Start with the decision", body: `What would change in your next decision if you understood ${title.toLowerCase()} correctly?` },
      { type: "visual", title: content?.conceptTitle ?? "See it in market context", body: content?.conceptBody ?? `Use the NIFTY scenario to connect ${title.toLowerCase()} with price, liquidity and risk.` },
      { type: "prediction", prompt: "Choose the interpretation that respects uncertainty and market context." },
      { type: "challenge", prompt: `Apply ${title.toLowerCase()} without turning it into a deterministic trading rule.` },
      { type: "summary", title: "Carry forward", body: content?.takeaway ?? `Treat ${title.toLowerCase()} as evidence inside a process—not a guarantee.` },
    ],
    assessment: { prompt: content?.assessment ?? `Which action best applies ${title.toLowerCase()} while controlling risk?`, applicationFirst: true },
  };
}

const makeModules = (seeds: ModuleSeed[], levelCode: "FND" | "APP" | "PRO", levelTitle: string): CourseModule[] => seeds.map((seed) => ({
  code: seed.code, title: seed.title, lab: seed.lab,
  description: levelCode === "FND" ? "Build intuition through short market decisions." : levelCode === "APP" ? "Apply the concept to setups, execution and risk." : "Reason probabilistically, test hypotheses and manage portfolios.",
  lessons: seed.lessons.map((title, index) => makeLesson(seed, title, index, levelCode, levelTitle)),
}));

export const course: CourseLevel[] = [
  { code: "FND", number: 1, title: "Trading Foundations", subtitle: "Intuition, execution and capital protection", assessment: "Foundations Assessment", modules: makeModules(foundations, "FND", "Trading Foundations") },
  { code: "APP", number: 2, title: "Applied Trading", subtitle: "Setups, derivatives and strategy design", assessment: "Applied Trading Assessment", modules: makeModules(applied, "APP", "Applied Trading") },
  { code: "PRO", number: 3, title: "Professional Trading", subtitle: "Positioning, research and systematic risk", assessment: "Professional Trading Assessment", modules: makeModules(professional, "PRO", "Professional Trading") },
];

export const allLessons = course.flatMap((level) => level.modules.flatMap((module) => module.lessons));

export const labs = [
  "Candlestick Lab", "Order Book Lab", "Market Structure Lab", "RSI Lab", "Position Sizing Lab", "Risk Simulator", "Futures Simulator", "Options Basics Lab", "Delta Lab", "Greeks Lab", "Option Chain Lab", "OI Classification Lab", "Volatility Lab", "Payoff Builder", "Hedging Lab", "Market Regime Lab", "Strategy Builder", "Backtesting Lab", "Overfitting Lab", "Strategy Comparison Lab",
];

export const masteryTopics = ["market basics", "orders", "charts", "candlesticks", "market structure", "volume", "volatility", "RSI", "risk", "position sizing", "futures", "options", "Delta", "Gamma", "Theta", "Vega", "OI", "option chain", "strategy construction", "market regimes", "backtesting", "expectancy", "drawdown", "systematic trading"];

export const badges = ["Market Explorer", "Chart Reader", "Risk First", "Market Structure Analyst", "Futures Explorer", "Options Explorer", "Greeks Apprentice", "Greeks Master", "OI Analyst", "Volatility Analyst", "Strategy Builder", "Backtester", "Risk Manager", "Systematic Trader"];

export const supportedBlockTypes: BlockType[] = ["concept", "text", "callout", "visual", "quiz", "true_false", "scenario", "slider", "chart", "chart_question", "calculation", "option_chain", "simulation", "matching", "sequence", "prediction", "reveal", "summary", "challenge"];
