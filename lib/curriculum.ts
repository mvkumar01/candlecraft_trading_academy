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

const modulePrimer: Record<string, string> = {
  "Financial Markets": "Financial markets connect capital seekers and capital providers through organised rules, venues and prices.",
  "How Trading Works": "Trading converts an instruction into an exchange transaction, then clearing, settlement and—where relevant—demat ownership.",
  "Orders and Execution": "An order expresses a price and quantity preference; execution depends on available liquidity and the order's priority.",
  "Reading Charts": "A chart compresses price observations by time; it shows recorded trades, not the intentions or path hidden inside each interval.",
  "Market Structure": "Market structure describes the sequence of swings and ranges that reveals whether price is trending, balancing or transitioning.",
  "Volume and Volatility": "Volume measures activity while volatility measures the size and dispersion of price movement; neither predicts direction alone.",
  "Indicators": "Indicators transform historical price or volume with a formula; they organise evidence but do not create new market information.",
  "Risk Management": "Risk management limits how much one uncertain outcome can damage capital, preserving the ability to keep following a process.",
  "Price Action": "Price action reads swings, acceptance, rejection and expansion in context instead of treating isolated candle patterns as signals.",
  "Multi-Timeframe Analysis": "Multiple timeframes separate broader structure from execution detail, but more charts do not automatically produce more clarity.",
  "Momentum Trading": "Momentum trading seeks persistence in strong relative price movement while defining where that persistence has failed.",
  "Mean Reversion": "Mean reversion tests whether an unusually stretched observation tends to move back toward a reference level in a particular regime.",
  "Derivatives": "A derivative gets its value from an underlying asset and transfers price, volatility or time risk between counterparties.",
  "Futures": "A futures contract creates a standardised obligation whose profit and loss changes with the underlying and is settled through margining.",
  "Options Fundamentals": "An option gives its buyer a right and its seller an obligation, producing asymmetric payoff and time-sensitive value.",
  "Option Greeks": "Greeks are local sensitivities of a modelled option value to spot, time and volatility; they change as market inputs change.",
  "Open Interest and Option Chain": "Open interest counts outstanding derivative contracts; option-chain interpretation also needs price, premium, change, expiry and regime context.",
  "Building a Trading Strategy": "A strategy turns a testable hypothesis into explicit entry, exit, sizing and risk rules that can be evaluated consistently.",
  "Advanced Open Interest": "Advanced OI analysis studies how outstanding positions change across strikes and time without treating them as certain directional forecasts.",
  "Option Positioning": "Positioning analysis infers possible exposures from price, premium and OI behaviour while recognising that participant identity is usually unknown.",
  "Volatility": "Volatility describes the magnitude and distribution of returns; implied volatility is the market price of option uncertainty, not a direction forecast.",
  "Option Strategy Engineering": "Combining option legs reshapes directional, volatility and time exposures into a deliberate payoff with explicit trade-offs.",
  "Greeks and Hedging": "Portfolio Greeks aggregate local sensitivities; hedging changes exposure but introduces basis, execution and rebalancing risk.",
  "Market Regimes": "A regime is a recurring market environment in which return, trend and volatility behaviour share useful characteristics.",
  "Systematic Trading": "Systematic trading expresses a hypothesis as repeatable rules, data, execution logic, monitoring and predefined failure controls.",
  "Backtesting": "A backtest applies fixed historical rules without using future information, including realistic costs and execution assumptions.",
  "Strategy Evaluation": "Strategy evaluation studies the distribution and path of results—not one headline metric—to judge edge, risk and robustness.",
  "Professional Risk Management": "Professional risk management controls interacting exposures across trades, strategies and portfolios, including liquidity and model failure.",
};

const exactConcept: Record<string, string> = {
  "Why do financial markets exist?": "They move savings toward productive uses, let investors transfer ownership, provide liquidity and create observable prices through competing orders.",
  "What is a company share?": "A share is a unit of ownership in a company. Its holder has an economic claim defined by the share class, but no guaranteed return.",
  "Why do companies issue shares?": "Companies issue shares to raise permanent capital for growth, investment or balance-sheet needs in exchange for giving investors ownership.",
  "Primary vs secondary markets": "In the primary market, newly issued securities raise money for the issuer. In the secondary market, investors trade existing securities with one another.",
  "What are NSE and BSE?": "NSE and BSE are regulated Indian exchanges that provide electronic systems, rules and surveillance for trading listed securities.",
  "What is an index?": "An index is a rules-based basket and calculation designed to summarise the performance of a defined market segment.",
  "What is NIFTY 50?": "NIFTY 50 is an NSE benchmark representing 50 large, liquid Indian companies selected and weighted under published index rules.",
  "What is SENSEX?": "SENSEX is BSE's benchmark index of 30 established, liquid companies selected under its methodology.",
  "Index vs individual stock": "An index diversifies company-specific movement across a basket; one stock reflects the risks and performance of a single company.",
  "Buyers and sellers": "Every executed trade has both a buyer and seller. Price changes when participants compete for limited liquidity at different marginal prices.",
  "How prices are discovered": "Price discovery occurs as bids and offers compete and transactions move to prices where available liquidity can meet urgent demand.",
  "What does a broker do?": "A broker routes client orders to permitted venues, maintains trading access and records, and supports clearing and settlement obligations.",
  "Trading account vs demat account": "A trading account is used to place transactions; a demat account holds eligible securities in electronic form after settlement.",
  "What happens when you press Buy?": "The broker validates the order, routes it to the exchange, and the matching engine executes it only if a compatible sell order is available.",
  "Bid price": "The bid is the highest displayed price at which a buyer is currently willing to trade a stated quantity.",
  "Ask price": "The ask is the lowest displayed price at which a seller is currently willing to trade a stated quantity.",
  "Bid-ask spread": "The spread is the difference between the best ask and best bid; it is one component of immediate execution cost.",
  "Market depth": "Market depth displays queued quantities at several bid and ask prices, offering a partial view of visible liquidity.",
  "Liquidity": "Liquidity is the ability to trade meaningful quantity quickly with limited price impact and execution uncertainty.",
  "Slippage": "Slippage is the difference between the expected decision price and the actual average execution price.",
  "Settlement": "Settlement is the post-trade exchange of cash and securities through the clearing and depository system.",
  "Market orders": "A market order prioritises immediate execution against available prices; it does not guarantee the displayed price.",
  "Limit orders": "A limit order sets the worst acceptable price, controlling price but not guaranteeing execution.",
  "Stop-loss orders": "A stop-loss activates after a trigger is reached; once activated, liquidity still determines the actual fill.",
  "Stop-limit orders": "A stop-limit activates a limit order at the trigger, adding price control but increasing non-execution risk.",
  "What is a price chart?": "A price chart places market prices on one axis and time or sequence on the other so changes and structure can be inspected visually.",
  "Timeframes": "A timeframe defines how much trading time each bar aggregates; changing it changes the visible detail, not the underlying transactions.",
  "OHLC": "OHLC records the first, highest, lowest and last traded prices in an interval. These four observations summarise the interval but not the sequence of trades inside it.",
  "Candlestick anatomy": "A candle body spans open to close; upper and lower wicks extend to the interval's high and low.",
  "Trend": "A trend is sustained directional progress visible through price structure, not simply one large candle.",
  "Support": "Support is an area where buying interest has previously absorbed selling; it is a zone of evidence, not a guaranteed floor.",
  "Resistance": "Resistance is an area where selling interest has previously absorbed buying; it can break or shift as conditions change.",
  "Breakouts": "A breakout is movement beyond a recognised boundary; follow-through and acceptance help distinguish it from a temporary excursion.",
  "What is volume?": "Volume counts units or contracts traded during an interval. It measures participation, not the number of buyers versus sellers.",
  "What is volatility?": "Volatility measures how widely and rapidly returns vary, without specifying whether the movement is upward or downward.",
  "What is an indicator?": "An indicator is a mathematical transformation of market data used to summarise a feature such as trend, momentum or volatility.",
  "Moving averages": "A moving average continuously recalculates the average price over a rolling lookback, smoothing noise while introducing lag.",
  "RSI": "RSI compares the magnitude of recent gains with recent losses and maps that momentum balance onto a 0–100 scale.",
  "Overbought and oversold": "These labels describe unusually strong recent directional momentum relative to a lookback; they do not guarantee reversal.",
  "Position sizing": "Position sizing converts a predefined capital loss limit and stop distance into a quantity: risk amount divided by risk per unit.",
  "Risk/reward": "Reward-to-risk compares planned upside with planned loss, but it says nothing about the probability of either outcome.",
  "Win rate": "Win rate is winning trades divided by total trades; it must be considered with average wins, average losses and costs.",
  "Expectancy introduction": "Expectancy is average win probability times average win minus loss probability times average loss, after costs.",
  "Drawdown": "Drawdown measures the decline from a previous equity peak to a subsequent trough.",
  "Leverage": "Leverage controls exposure larger than committed capital, magnifying both gains and losses.",
  "Risk of ruin": "Risk of ruin is the chance that losses reduce capital beyond the point where the strategy can continue or recover practically.",
  "What is a derivative?": "A derivative is a contract whose value depends on an underlying asset, rate, index or event.",
  "Futures contract": "A futures contract is a standardised exchange-traded obligation to settle an underlying exposure under defined contract terms.",
  "What is an option?": "An option gives its buyer a right—but not an obligation—to transact under specified terms; the seller carries the corresponding obligation.",
  "Calls": "A call gives its buyer the right to buy the underlying at the strike by or at expiry, depending on contract terms.",
  "Puts": "A put gives its buyer the right to sell the underlying at the strike by or at expiry, depending on contract terms.",
  "Strike price": "The strike is the contract price used to determine exercise value and moneyness.",
  "Intrinsic value": "Intrinsic value is the favourable difference between spot and strike, floored at zero for the option holder.",
  "Time value": "Time value is the option premium above intrinsic value, reflecting remaining uncertainty and time to expiry.",
  "What is Delta?": "Delta estimates the local change in option value for a one-unit change in the underlying, with other inputs held constant.",
  "What is Gamma?": "Gamma estimates how much Delta changes for a one-unit move in the underlying. High Gamma means the option's directional sensitivity can change quickly.",
  "What is Theta?": "Theta estimates the local change in option value as time passes, with other model inputs held constant.",
  "What is Vega?": "Vega estimates the local change in option value for a change in implied volatility.",
  "What is Open Interest?": "Open interest is the number of derivative contracts that remain open at a point in time; it differs from trading volume.",
  "OI vs volume": "Volume counts contracts traded during a period; OI counts contracts still open after opening, closing and transfer activity.",
  "What is a market regime?": "A market regime is a persistent environment—such as trend, range or high volatility—in which strategies can behave differently.",
  "What is backtesting?": "Backtesting applies predefined strategy rules to historical data to estimate past behaviour without using information unavailable at each decision time.",
  "Look-ahead bias": "Look-ahead bias occurs when a historical test uses information that would not have been known at the simulated decision time.",
  "Survivorship bias": "Survivorship bias excludes instruments that disappeared or failed, making historical results appear stronger than the investable universe was.",
  "Overfitting": "Overfitting happens when rules capture noise specific to the research sample instead of a relationship likely to generalise.",
  "Profit factor": "Profit factor is gross profit divided by gross loss; it omits the sequence, sample size and capital path of returns.",
  "Maximum drawdown": "Maximum drawdown is the largest peak-to-trough equity decline observed over the evaluation period.",
  "Sharpe ratio": "The Sharpe ratio compares average excess return with return variability; its usefulness depends on assumptions and the return distribution.",
  "Why traders lose money": "Traders can lose through negative expectancy, excessive size, uncontrolled costs, poor execution or abandoning a valid process. A loss alone does not prove the decision was poor; repeated unmanaged loss does.",
  "Reading price in context": "Context asks where current price sits within broader structure, volatility and liquidity. The same candle can mean different things near a range edge, inside a trend or during a transition.",
  "Why timeframe matters": "A timeframe changes how transactions are grouped and which swings appear important. Higher timeframes show broader structure; lower timeframes expose execution detail and noise.",
  "What is momentum?": "Momentum is the persistence and strength of recent directional price movement. It can continue or fail, so a momentum trade needs a defined invalidation point.",
  "What is mean reversion?": "Mean reversion is the tendency of a measured variable to move back toward a reference level after an extreme, under conditions where that relationship has historically held.",
  "OI distributions": "An OI distribution shows how outstanding contracts are spread across strikes. Concentration and migration can reveal positioning changes, but not participant intent with certainty.",
  "Understanding participant positioning": "Participant positioning describes the directional, volatility and time exposures that market participants may hold. Public data supports inference, not perfect identification of who owns each position.",
  "Realised volatility": "Realised volatility estimates how variable the underlying's observed returns were over a historical window. It changes with the lookback and sampling method.",
  "Why combine options?": "Multiple option legs can cap risk, reduce premium, isolate a volatility view or reshape the payoff. Each benefit is purchased by giving up something elsewhere in the payoff.",
  "Portfolio Delta": "Portfolio Delta adds the signed Delta exposure of each position after quantity and contract multiplier. It approximates small-move directional sensitivity, not the portfolio's worst-case loss.",
  "Discretionary vs systematic": "Discretionary trading allows judgement within the decision process; systematic trading encodes decisions as explicit repeatable rules. Both still require hypotheses, risk limits and review.",
  "Total return": "Total return measures the cumulative gain or loss over a period, including the chosen treatment of cash flows. It does not reveal the path, drawdown or risk required to earn it.",
  "Risk per strategy": "Risk per strategy limits the capital or loss budget assigned to one return process. It must account for correlated positions and changing volatility, not merely add trade-level stops.",
};

function conceptFor(title: string, moduleTitle: string) {
  if (exactConcept[title]) return exactConcept[title];
  const primer = modulePrimer[moduleTitle];
  const cleaned = title.replace(/[?]/g, "").toLowerCase();
  if (title.startsWith("Why ")) return `${primer} This lesson explains ${cleaned}, which trade-off it addresses, and when that reasoning can fail.`;
  if (title.startsWith("How ")) return `${primer} Here, ${cleaned} means tracing the mechanism step by step rather than memorising an outcome.`;
  if (title.includes(" vs ")) return `${title} compares two related ideas by purpose, inputs, payoff and failure mode. ${primer}`;
  if (title.startsWith("What is ") || title.startsWith("What are ")) return `${primer} This lesson defines ${cleaned.replace(/^what (is|are) /, "")} precisely, shows how it is observed, and separates it from common misconceptions.`;
  return `${title} focuses on one practical part of ${moduleTitle.toLowerCase()}. ${primer} The useful question is how it changes evidence, action or risk—not whether it guarantees an outcome.`;
}

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
      { type: "visual", title: content?.conceptTitle ?? `Understanding ${title.replace("?", "")}`, body: content?.conceptBody ?? conceptFor(title, seed.title) },
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
