"use client";

import { useMemo, useState } from "react";
import {
  replaySession, runScreen, screenFilters, sectors, swingScenarios, universe,
  type Candle, type ScreenFilter, type Stock,
} from "../lib/market-data";
import { candlePatternById, chartPatternById, chartPatterns, type ChartPattern } from "../lib/pattern-data";

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const sizeFor = (budget: number, entry: number, stop: number) => Math.max(0, Math.floor(budget / Math.max(0.05, entry - stop)));

/** Shared candle renderer. `visible` truncates the series so a replay can hide the future —
 *  the scale is computed from the visible bars only, otherwise the axis leaks the outcome. */
function CandleChart({ candles, visible, levels = [], height = 190, marker, minSlots = 20, highlightFrom }: {
  candles: Candle[]; visible?: number; levels?: { price: number; label: string; tone?: "stop" | "entry" | "target" }[]; height?: number; marker?: number;
  /** Lower this so a three-candle pattern fills the frame instead of hiding in a corner. */
  minSlots?: number;
  /** Index from which candles are the pattern itself rather than the context before it. */
  highlightFrom?: number;
}) {
  const shown = candles.slice(0, visible ?? candles.length);
  if (!shown.length) return null;
  const prices = [...shown.flatMap((c) => [c.h, c.l]), ...levels.map((l) => l.price)];
  const top = Math.max(...prices), bottom = Math.min(...prices);
  const pad = (top - bottom) * 0.08 || 1;
  const hi = top + pad, lo = bottom - pad;
  const width = 640;
  const step = width / Math.max(minSlots, candles.length);
  const y = (price: number) => ((hi - price) / (hi - lo)) * height;
  return (
    <svg className="candle-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="Synthetic price chart">
      {levels.map((level) => (
        <g key={level.label}>
          <line x1={0} x2={width} y1={y(level.price)} y2={y(level.price)} stroke={level.tone === "stop" ? "#ff7466" : level.tone === "target" ? "#43d39c" : "#efb74d"} strokeWidth={1} strokeDasharray="5 4" />
          <text x={4} y={y(level.price) - 4} fill={level.tone === "stop" ? "#ff7466" : level.tone === "target" ? "#43d39c" : "#efb74d"} fontSize={9}>{level.label}</text>
        </g>
      ))}
      {shown.map((candle, index) => {
        const x = index * step + step / 2;
        const up = candle.c >= candle.o;
        const colour = up ? "#43d39c" : "#ff7466";
        const bodyTop = y(Math.max(candle.o, candle.c));
        const bodyHeight = Math.max(1, y(Math.min(candle.o, candle.c)) - bodyTop);
        return (
          <g key={index}>
            {highlightFrom !== undefined && index >= highlightFrom && <rect x={x - step * 0.46} y={0} width={step * 0.92} height={height} fill="#c6f05f" opacity={0.09} />}
            <line x1={x} x2={x} y1={y(candle.h)} y2={y(candle.l)} stroke={colour} strokeWidth={minSlots < 12 ? 2 : 0.9} />
            <rect x={x - step * 0.32} y={bodyTop} width={step * 0.64} height={bodyHeight} fill={colour} />
          </g>
        );
      })}
      {marker !== undefined && <line x1={marker * step} x2={marker * step} y1={0} y2={height} stroke="#6799ff" strokeWidth={1} />}
    </svg>
  );
}

// ── Lesson interactions ─────────────────────────────────────────────────────
const horizons = [
  { name: "Intraday", hold: "Minutes to hours", chart: "1 to 5 minute", stop: "₹3–6", size: "Largest", cost: "Paid many times a week", events: "Almost none — flat by the close", watch: "Continuous" },
  { name: "Swing", hold: "Days to weeks", chart: "Daily, weekly for context", stop: "₹25–60", size: "Moderate", cost: "Paid a few times a month", events: "One announcement, sometimes", watch: "Once a day" },
  { name: "Positional", hold: "Weeks to months", chart: "Weekly, daily for entry", stop: "₹70–150", size: "Small", cost: "Paid a few times a year", events: "Two or three announcements", watch: "Once a week" },
  { name: "Investing", hold: "Months to years", chart: "Weekly and monthly", stop: "No price stop", size: "Portfolio weight", cost: "Almost irrelevant", events: "All of them", watch: "Quarterly" },
];

export function HorizonSim() {
  const [pick, setPick] = useState(1);
  const chosen = horizons[pick];
  return (
    <div className="lesson-sim horizon-sim">
      <div className="horizon-tabs">{horizons.map((horizon, index) => (
        <button key={horizon.name} className={index === pick ? "active" : ""} onClick={() => setPick(index)}>{horizon.name}</button>
      ))}</div>
      <dl>
        <div><dt>Holding period</dt><dd>{chosen.hold}</dd></div>
        <div><dt>Main chart</dt><dd>{chosen.chart}</dd></div>
        <div><dt>Typical stop</dt><dd>{chosen.stop}</dd></div>
        <div><dt>Position size</dt><dd>{chosen.size}</dd></div>
        <div><dt>Cost impact</dt><dd>{chosen.cost}</dd></div>
        <div><dt>Event exposure</dt><dd>{chosen.events}</dd></div>
        <div><dt>Monitoring</dt><dd>{chosen.watch}</dd></div>
      </dl>
      <p>Same ₹5,000 of risk in every column. Only the stop distance changes — and it changes everything else.</p>
    </div>
  );
}

export function ScreenerSim() {
  const [active, setActive] = useState<ScreenFilter[]>(["liquid"]);
  const results = runScreen(active, "All");
  const toggle = (id: ScreenFilter) => setActive((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return (
    <div className="lesson-sim screener-sim">
      <div className="screen-count"><b>{results.length}</b><span>of {universe.length} candidates</span></div>
      <div className="screen-filters">{screenFilters.slice(0, 7).map((filter) => (
        <button key={filter.id} className={active.includes(filter.id) ? "active" : ""} onClick={() => toggle(filter.id)}>{filter.label}</button>
      ))}</div>
      <ul className="screen-results">{results.map((stock) => <li key={stock.symbol}><b>{stock.symbol}</b><span>{stock.sector}</span></li>)}
        {!results.length && <li className="screen-empty">Nothing survives. Over-filtering is a real outcome.</li>}
      </ul>
      <p>Fictional companies, synthetic data. Passing every filter makes a name a candidate, never a trade.</p>
    </div>
  );
}

const rankMeasures = [
  { key: "relStrength3m", label: "Relative strength", suffix: "" },
  { key: "volumeRatio", label: "Volume ratio", suffix: "×" },
  { key: "profitGrowth", label: "Profit growth", suffix: "%" },
  { key: "atrPct", label: "Daily travel", suffix: "%" },
] as const;

export function RankingSim() {
  const [measure, setMeasure] = useState(0);
  const key = rankMeasures[measure].key;
  const ranked = useMemo(() => [...universe].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, 8), [key]);
  return (
    <div className="lesson-sim ranking-sim">
      <div className="rank-tabs">{rankMeasures.map((item, index) => (
        <button key={item.key} className={index === measure ? "active" : ""} onClick={() => setMeasure(index)}>{item.label}</button>
      ))}</div>
      <ol className="rank-list">{ranked.map((stock, index) => (
        <li key={stock.symbol}><i>{index + 1}</i><b>{stock.symbol}</b><span>{stock.sector}</span><em>{(stock[key] as number).toFixed(1)}{rankMeasures[measure].suffix}</em></li>
      ))}</ol>
      <p>Change the measure and the leaders change. A ranking is an opinion about which measure matters.</p>
    </div>
  );
}

export function ReplaySim() {
  const [bar, setBar] = useState(12);
  const candles = replaySession.candles;
  const shown = candles.slice(0, bar);
  const high = Math.max(...shown.map((c) => c.h)), low = Math.min(...shown.map((c) => c.l));
  return (
    <div className="lesson-sim replay-sim">
      <div className="replay-head"><b>{replaySession.symbol} · {replaySession.interval}</b><span>{replaySession.timeAt(bar)}</span></div>
      <CandleChart candles={candles} visible={bar} height={150} />
      <div className="replay-stats">
        <span>LAST<b>₹{shown[shown.length - 1].c.toFixed(2)}</b></span>
        <span>SESSION HIGH<b>₹{high.toFixed(2)}</b></span>
        <span>SESSION LOW<b>₹{low.toFixed(2)}</b></span>
      </div>
      <div className="replay-controls">
        <button onClick={() => setBar(Math.max(6, bar - 1))} disabled={bar <= 6}>← Back</button>
        <button onClick={() => setBar(Math.min(candles.length, bar + 1))} disabled={bar >= candles.length}>Next candle →</button>
      </div>
      <p>The candles after {replaySession.timeAt(bar)} have not been drawn. That is the only honest way to read a session.</p>
    </div>
  );
}

export function SwingSim({ scenarioId }: { scenarioId?: string }) {
  const scenario = swingScenarios.find((item) => item.id === scenarioId) ?? swingScenarios[0];
  const [revealed, setRevealed] = useState(false);
  const all = [...scenario.history, ...scenario.future];
  return (
    <div className="lesson-sim swing-sim">
      <div className="swing-head"><b>{scenario.symbol} · daily</b><span>ATR ₹{scenario.atr}</span></div>
      <CandleChart candles={revealed ? all : scenario.history} visible={revealed ? all.length : scenario.history.length} height={160}
        levels={[{ price: scenario.trigger, label: `trigger ${scenario.trigger}`, tone: "entry" }, { price: scenario.invalidation, label: `invalid ${scenario.invalidation}`, tone: "stop" }]} />
      <p className="swing-setup">{scenario.setup}</p>
      {revealed ? <p className="swing-outcome"><b>What happened:</b> {scenario.outcome} <em>{scenario.lesson}</em></p>
        : <button className="swing-reveal" onClick={() => setRevealed(true)}>Reveal what happened next →</button>}
    </div>
  );
}

const workflowStages = [
  { name: "Market regime", output: "Position count and size multiplier", note: "Trending or ranging, volatility expanding or contracting." },
  { name: "Sector", output: "A reduced universe", note: "Rank sectors; work from the leaders." },
  { name: "Screener", output: "Candidates", note: "Liquidity first, then trend conditions. Keep it generous." },
  { name: "Shortlist", output: "A handful, with rejection reasons", note: "Events, extension, no usable level, too thin." },
  { name: "Chart", output: "Structure", note: "Trend above, swings and levels on your own timeframe." },
  { name: "Setup", output: "One sentence that can be wrong", note: "Breakout, pullback, or reaction at a level." },
  { name: "Entry", output: "A trigger price", note: "Breakout, retest or anticipation — pick one style." },
  { name: "Invalidation", output: "The price the idea dies at", note: "Comes from the setup sentence, not from comfort." },
  { name: "Stop", output: "An order, just beyond invalidation", note: "A buffer past the level where everyone else's sits." },
  { name: "Position size", output: "A number of shares", note: "Risk budget ÷ (entry − stop), adjusted by the market read." },
  { name: "Exit plan", output: "Target, trail and time limit", note: "Written before entry, while nothing is at stake." },
];

export function WorkflowSim() {
  const [stage, setStage] = useState(0);
  const current = workflowStages[stage];
  return (
    <div className="lesson-sim workflow-sim">
      <div className="workflow-rail">{workflowStages.map((item, index) => (
        <button key={item.name} className={index === stage ? "active" : index < stage ? "done" : ""} onClick={() => setStage(index)} title={item.name}>
          <i>{index + 1}</i>
        </button>
      ))}</div>
      <div className="workflow-body">
        <span>STEP {stage + 1} OF {workflowStages.length}</span>
        <h4>{current.name}</h4>
        <p>{current.note}</p>
        <div className="workflow-output"><b>Output</b><span>{current.output}</span></div>
      </div>
      <div className="workflow-nav">
        <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={!stage}>←</button>
        <button onClick={() => setStage(Math.min(workflowStages.length - 1, stage + 1))} disabled={stage === workflowStages.length - 1}>Next step →</button>
      </div>
    </div>
  );
}

// ── Labs ────────────────────────────────────────────────────────────────────
export function HorizonLab() {
  const [budget, setBudget] = useState(5000);
  const [entry] = useState(640);
  const rows = [
    { name: "Intraday", stop: 3, chart: "5-minute", hold: "Hours", events: "None" },
    { name: "Swing", stop: 28, chart: "Daily", hold: "2–20 sessions", events: "Sometimes one" },
    { name: "Positional", stop: 74, chart: "Weekly", hold: "1–5 months", events: "Two or three" },
  ];
  return (
    <div className="lab-workbench">
      <section className="lab-controls">
        <h2>Same idea, three horizons</h2>
        <label>Risk budget <b>{money(budget)}</b><input type="range" min="1000" max="20000" step="500" value={budget} onChange={(e) => setBudget(Number(e.target.value))} /></label>
        <div className="lab-note"><b>Entry ₹{entry} in every row.</b><p>Only the holding period changes. Watch the stop distance rewrite the position and the exposure.</p></div>
      </section>
      <section className="lab-output">
        <div className="horizon-table">
          <div className="horizon-row head"><span>Horizon</span><span>Stop</span><span>Shares</span><span>Exposure</span><span>Chart</span><span>Events</span></div>
          {rows.map((row) => {
            const shares = sizeFor(budget, entry, entry - row.stop);
            return <div className="horizon-row" key={row.name}><span><b>{row.name}</b><small>{row.hold}</small></span><span>₹{row.stop}</span><span>{shares.toLocaleString("en-IN")}</span><span>{money(shares * entry)}</span><span>{row.chart}</span><span>{row.events}</span></div>;
          })}
        </div>
        <div className="lab-note"><b>Identical rupee risk in all three rows.</b><p>The intraday row holds many times more stock than the positional one. That is the tight stop working, and it is also why an ignored intraday stop is so expensive.</p></div>
      </section>
    </div>
  );
}

export function ScreenerLab() {
  const [active, setActive] = useState<ScreenFilter[]>([]);
  const [sector, setSector] = useState("All");
  const [inspect, setInspect] = useState<Stock | null>(null);
  const results = runScreen(active, sector);
  const toggle = (id: ScreenFilter) => setActive((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const funnel = active.reduce<{ label: string; count: number }[]>((steps, id, index) => {
    const label = screenFilters.find((filter) => filter.id === id)!.label;
    return [...steps, { label, count: runScreen(active.slice(0, index + 1), sector).length }];
  }, [{ label: "Starting universe", count: runScreen([], sector).length }]);
  return (
    <div className="lab-workbench screener-lab">
      <section className="lab-controls">
        <h2>Filters</h2>
        <label className="lab-select">Sector<select value={sector} onChange={(e) => { setSector(e.target.value); setInspect(null); }}><option>All</option>{sectors.map((item) => <option key={item}>{item}</option>)}</select></label>
        <div className="filter-list">{screenFilters.map((filter) => (
          <button key={filter.id} className={active.includes(filter.id) ? "active" : ""} onClick={() => { toggle(filter.id); setInspect(null); }}>
            <b>{filter.label}</b><small>{filter.detail}</small>
          </button>
        ))}</div>
        <div className="lab-note"><b>SCREENER → CANDIDATES → ANALYSIS → SETUP → RISK → TRADE</b><p>Never screener → buy. The filters below produce the first arrow only.</p></div>
      </section>
      <section className="lab-output">
        <div className="funnel">{funnel.map((step, index) => (
          <div key={`${step.label}-${index}`} className="funnel-step"><span>{step.label}</span><i style={{ width: `${(step.count / universe.length) * 100}%` }} /><b>{step.count}</b></div>
        ))}</div>
        <div className="candidate-grid">
          {results.map((stock) => (
            <button key={stock.symbol} className={inspect?.symbol === stock.symbol ? "selected" : ""} onClick={() => setInspect(stock)}>
              <b>{stock.symbol}</b><small>{stock.name}</small>
              <span>{stock.sector} · ₹{stock.price} · RSI {stock.rsi}</span>
              <em>{stock.relStrength3m > 0 ? "+" : ""}{stock.relStrength3m} vs index</em>
            </button>
          ))}
          {!results.length && <p className="screen-empty">No candidates. A screen that returns nothing most days is over-filtered, not thorough.</p>}
        </div>
        {inspect && (
          <div className="inspect-card">
            <div><span>ANALYSIS · {inspect.symbol}</span><h3>{inspect.name}</h3></div>
            <div className="inspect-metrics">
              <span>Trend<b>{inspect.trend}</b></span><span>ATR<b>{inspect.atrPct}%</b></span>
              <span>From 52w high<b>{inspect.from52High}%</b></span><span>Volume<b>{inspect.volumeRatio}×</b></span>
              <span>Revenue<b>{inspect.revenueGrowth}%</b></span><span>Profit<b>{inspect.profitGrowth}%</b></span>
              <span>Debt/Equity<b>{inspect.debtToEquity}</b></span><span>Valuation<b>{inspect.valuation}</b></span>
            </div>
            <p className="inspect-for"><b>In its favour</b> {inspect.strength}</p>
            <p className="inspect-against"><b>Against it</b> {inspect.caution}</p>
            <p className="inspect-next">Next: read the chart, find the level where this idea would be wrong, and size from that distance. Only then is there a trade.</p>
          </div>
        )}
        {!inspect && !!results.length && <p className="inspect-prompt">Select a candidate to inspect it. Passing the filters was the easy part.</p>}
      </section>
    </div>
  );
}

const swingSteps = [
  { key: "trend", question: "1. What is the trend on this chart?", options: ["Uptrend", "Range", "Downtrend"] },
  { key: "setup", question: "2. What setup is forming?", options: ["Breakout from a base", "Pullback in a trend", "Reversal at a level"] },
  { key: "entry", question: "3. Where would you enter?", options: ["On the break of the level", "On a retest after the break", "In anticipation, before the break"] },
  { key: "stop", question: "4. Where does the stop belong?", options: ["Back inside the base", "One ATR below entry", "At a round number"] },
  { key: "invalid", question: "5. What would make the thesis wrong?", options: ["A close back inside the base", "Two red candles", "RSI dropping below 50"] },
];

export function SwingSetupLab() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [risk, setRisk] = useState(5000);
  const [revealed, setRevealed] = useState(false);
  const scenario = swingScenarios[index];
  const shares = sizeFor(risk, scenario.trigger, scenario.invalidation);
  const done = swingSteps.every((step) => answers[step.key]);
  const pick = (key: string, value: string) => setAnswers((current) => ({ ...current, [key]: value }));
  const nextScenario = () => { setIndex((index + 1) % swingScenarios.length); setAnswers({}); setRevealed(false); };
  return (
    <div className="lab-workbench swing-lab">
      <section className="lab-controls">
        <h2>Plan the trade</h2>
        {swingSteps.map((step) => (
          <div className="plan-step" key={step.key}>
            <span>{step.question}</span>
            <div>{step.options.map((option) => (
              <button key={option} className={answers[step.key] === option ? "active" : ""} onClick={() => pick(step.key, option)}>{option}</button>
            ))}</div>
          </div>
        ))}
        <label>6. Risk budget <b>{money(risk)}</b><input type="range" min="1000" max="20000" step="500" value={risk} onChange={(e) => setRisk(Number(e.target.value))} /></label>
        <div className="lab-note"><b>Position: {shares.toLocaleString("en-IN")} shares</b><p>{money(risk)} ÷ ₹{(scenario.trigger - scenario.invalidation).toFixed(0)} of risk per share. The chart set the distance; you set the budget.</p></div>
      </section>
      <section className="lab-output">
        <div className="lab-title-row"><span>{scenario.symbol} · {scenario.name} · daily · synthetic</span><b>ATR ₹{scenario.atr}</b></div>
        <CandleChart candles={revealed ? [...scenario.history, ...scenario.future] : scenario.history} height={230}
          levels={[{ price: scenario.trigger, label: `entry ${scenario.trigger}`, tone: "entry" }, { price: scenario.invalidation, label: `stop ${scenario.invalidation}`, tone: "stop" }]} />
        {!revealed && <button className="button-primary" disabled={!done} onClick={() => setRevealed(true)}>{done ? "Reveal what happened next →" : "Answer all six steps first"}</button>}
        {revealed && (
          <div className="reveal-card">
            <b>What happened next</b>
            <p>{scenario.outcome}</p>
            <p className="reveal-lesson">{scenario.lesson}</p>
            <p className="reveal-note">There was no single correct entry here. A breakout entry, a retest entry and an anticipatory entry were all defensible — they simply produced different risk per share, and therefore different position sizes.</p>
            <button className="button-primary" onClick={nextScenario}>Next scenario →</button>
          </div>
        )}
      </section>
    </div>
  );
}

export function MarketReplayLab() {
  const [bar, setBar] = useState(6);
  const [answered, setAnswered] = useState<Record<number, number>>({});
  const candles = replaySession.candles;
  const checkpoint = replaySession.checkpoints.find((item) => item.index === bar - 1);
  const shown = candles.slice(0, bar);
  const high = Math.max(...shown.map((c) => c.h)), low = Math.min(...shown.map((c) => c.l));
  const openingHigh = Math.max(...candles.slice(0, 6).map((c) => c.h)), openingLow = Math.min(...candles.slice(0, 6).map((c) => c.l));
  const answeredThis = checkpoint ? answered[checkpoint.index] : undefined;
  const blocked = Boolean(checkpoint) && answeredThis === undefined;
  return (
    <div className="lab-workbench replay-lab">
      <section className="lab-controls">
        <h2>{replaySession.name}</h2>
        <div className="replay-clock"><span>SESSION TIME</span><b>{replaySession.timeAt(bar)}</b><small>{bar} of {candles.length} candles · {replaySession.interval}</small></div>
        <div className="replay-levels">
          <span>Previous close<b>₹{replaySession.previousClose.toFixed(2)}</b></span>
          <span>Opening range<b>₹{openingLow.toFixed(2)} – ₹{openingHigh.toFixed(2)}</b></span>
          <span>Session high<b>₹{high.toFixed(2)}</b></span>
          <span>Session low<b>₹{low.toFixed(2)}</b></span>
        </div>
        <div className="replay-buttons">
          <button onClick={() => setBar(Math.min(candles.length, bar + 1))} disabled={bar >= candles.length || blocked}>Next candle →</button>
          <button onClick={() => setBar(Math.min(candles.length, bar + 6))} disabled={bar >= candles.length || blocked}>+30 minutes →</button>
        </div>
        <div className="lab-note"><b>The future is not drawn.</b><p>{blocked ? "Answer the checkpoint before advancing." : "Nothing to the right of the last candle exists yet. Decide before you look."}</p></div>
      </section>
      <section className="lab-output">
        <div className="lab-title-row"><span>{replaySession.symbol} · {replaySession.interval} · synthetic session</span><b>₹{shown[shown.length - 1].c.toFixed(2)}</b></div>
        <CandleChart candles={candles} visible={bar} height={250} levels={[{ price: openingHigh, label: "OR high", tone: "target" }, { price: openingLow, label: "OR low", tone: "stop" }]} />
        {checkpoint && (
          <div className="checkpoint-card">
            <span>CHECKPOINT · {checkpoint.time}</span>
            <h3>{checkpoint.question}</h3>
            <div className="checkpoint-choices">{checkpoint.choices.map((choice, choiceIndex) => (
              <button key={choice} className={answeredThis === choiceIndex ? (choiceIndex === checkpoint.correct ? "correct" : "incorrect") : ""}
                onClick={() => setAnswered((current) => ({ ...current, [checkpoint.index]: choiceIndex }))} disabled={answeredThis !== undefined}>
                {choice}
              </button>
            ))}</div>
            {answeredThis !== undefined && <p className="checkpoint-feedback">{checkpoint.feedback}</p>}
          </div>
        )}
        {bar >= candles.length && <div className="reveal-card"><b>Session complete</b><p>Scroll back through the chart now that the whole day is visible. Every decision you made looks different with the right-hand side of the chart filled in — which is exactly why reviewing charts after the close overstates what you could have seen.</p></div>}
      </section>
    </div>
  );
}

const selectionQuestions = [
  { key: "why", label: "Why this stock?", options: ["Trend and relative strength", "Growth and profitability", "Cheap valuation", "Volume expansion"] },
  { key: "setup", label: "What is the setup?", options: ["Breakout from a base", "Pullback in an uptrend", "Reversal from a low", "No setup yet — watching"] },
  { key: "invalid", label: "What invalidates it?", options: ["Close below the last weekly swing low", "A 5% fall", "One bad quarter", "RSI below 40"] },
  { key: "risk", label: "Where is the risk?", options: ["Event or results risk", "Liquidity and exit risk", "Sector or macro risk", "Valuation risk"] },
  { key: "horizon", label: "Intended holding period?", options: ["Days to weeks", "Weeks to months", "Months to years"] },
];

export function StockSelectionLab() {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, Record<string, string>>>({});
  const [revealed, setRevealed] = useState(false);
  const toggle = (symbol: string) => setShortlist((current) =>
    current.includes(symbol) ? current.filter((item) => item !== symbol) : current.length >= 3 ? current : [...current, symbol]);
  const setNote = (symbol: string, key: string, value: string) =>
    setNotes((current) => ({ ...current, [symbol]: { ...(current[symbol] ?? {}), [key]: value } }));
  const complete = shortlist.length === 3 && shortlist.every((symbol) => selectionQuestions.every((question) => notes[symbol]?.[question.key]));
  return (
    <div className="selection-lab">
      <div className="selection-head">
        <div><span>STEP 1 · SHORTLIST</span><h2>Choose three candidates from eighteen</h2><p>Fictional companies, synthetic figures. Every one has something in its favour and something against it.</p></div>
        <b>{shortlist.length} / 3</b>
      </div>
      <div className="selection-table">
        <div className="selection-row head"><span>Stock</span><span>Sector</span><span>Trend</span><span>RS 3M</span><span>SMA 50/200</span><span>52w</span><span>Vol</span><span>Rev</span><span>Profit</span><span>D/E</span><span>Val</span><span>ATR</span></div>
        {universe.map((stock) => (
          <button key={stock.symbol} className={`selection-row ${shortlist.includes(stock.symbol) ? "picked" : ""}`} onClick={() => toggle(stock.symbol)}>
            <span><b>{stock.symbol}</b><small>{stock.name}</small></span>
            <span>{stock.sector}</span>
            <span className={stock.trend === "Up" ? "up" : stock.trend === "Down" ? "down" : ""}>{stock.trend}</span>
            <span className={stock.relStrength3m > 0 ? "up" : "down"}>{stock.relStrength3m > 0 ? "+" : ""}{stock.relStrength3m}</span>
            <span>{stock.price > stock.sma50 ? "▲" : "▼"}/{stock.price > stock.sma200 ? "▲" : "▼"}</span>
            <span>{stock.from52High}%</span>
            <span>{stock.avgVolumeLakh}L</span>
            <span>{stock.revenueGrowth}%</span>
            <span className={stock.profitGrowth > 0 ? "up" : "down"}>{stock.profitGrowth}%</span>
            <span>{stock.debtToEquity}</span>
            <span>{stock.valuation}</span>
            <span>{stock.atrPct}%</span>
          </button>
        ))}
      </div>
      {shortlist.length === 3 && (
        <div className="selection-notes">
          <div className="selection-head"><div><span>STEP 2 · THESIS</span><h2>Say what each one is</h2><p>A shortlist without a thesis, an invalidation and a horizon is just three names you liked.</p></div></div>
          {shortlist.map((symbol) => {
            const stock = universe.find((item) => item.symbol === symbol)!;
            return (
              <article key={symbol}>
                <h3>{stock.symbol} · {stock.name}</h3>
                {selectionQuestions.map((question) => (
                  <div className="note-row" key={question.key}>
                    <span>{question.label}</span>
                    <div>{question.options.map((option) => (
                      <button key={option} className={notes[symbol]?.[question.key] === option ? "active" : ""} onClick={() => setNote(symbol, question.key, option)}>{option}</button>
                    ))}</div>
                  </div>
                ))}
              </article>
            );
          })}
          {!revealed && <button className="button-primary" disabled={!complete} onClick={() => setRevealed(true)}>{complete ? "Compare with an analyst read →" : "Answer every question for all three"}</button>}
        </div>
      )}
      {revealed && (
        <div className="selection-reveal">
          <div className="selection-head"><div><span>STEP 3 · AN ANALYST READ</span><h2>One reading, not the answer</h2><p>There is no objectively correct three. What follows is what an experienced reader would say for and against each name you chose.</p></div></div>
          {shortlist.map((symbol) => {
            const stock = universe.find((item) => item.symbol === symbol)!;
            return (
              <article key={symbol}>
                <h3>{stock.symbol}</h3>
                <p className="inspect-for"><b>In its favour</b> {stock.strength}</p>
                <p className="inspect-against"><b>Against it</b> {stock.caution}</p>
              </article>
            );
          })}
          <p className="selection-footer">Notice that every stock in this universe — including the ones you rejected — has a defensible case and a real objection. Selection is the work of weighing those, not of finding the one with no objection.</p>
        </div>
      )}
    </div>
  );
}

export function TradeWorkflowLab() {
  const [stage, setStage] = useState(0);
  const [regime, setRegime] = useState<"trending" | "ranging">("trending");
  const [sector, setSector] = useState("Auto");
  const [risk, setRisk] = useState(5000);
  const [entryStyle, setEntryStyle] = useState<"breakout" | "retest">("breakout");
  const scenario = swingScenarios[2];
  const multiplier = regime === "trending" ? 1 : 0.5;
  const budget = risk * multiplier;
  const entry = entryStyle === "breakout" ? scenario.trigger : scenario.trigger - 12;
  const shares = sizeFor(budget, entry, scenario.invalidation);
  const candidates = runScreen(["liquid", "aboveSma50", "aboveSma200"], sector);
  const stages = [
    { name: "Market regime", body: (
      <div className="stage-choice"><p>Is the broad market trending or ranging? This sets your exposure, not your stock.</p>
        <div>{(["trending", "ranging"] as const).map((option) => <button key={option} className={regime === option ? "active" : ""} onClick={() => setRegime(option)}>{option}</button>)}</div>
        <b>Size multiplier: {multiplier}×  →  risk budget {money(budget)}</b></div>
    ) },
    { name: "Sector", body: (
      <div className="stage-choice"><p>Work from the leading groups. Everything outside them is excluded for a reason you can state.</p>
        <div className="sector-picker">{sectors.map((item) => <button key={item} className={sector === item ? "active" : ""} onClick={() => setSector(item)}>{item}</button>)}</div>
        <b>{candidates.length} names in {sector} pass liquidity and both averages</b></div>
    ) },
    { name: "Screen & shortlist", body: (
      <div className="stage-choice"><p>Liquidity, then trend. Generous conditions — the rejecting happens at the chart.</p>
        <ul className="stage-list">{candidates.map((stock) => <li key={stock.symbol}><b>{stock.symbol}</b><span>{stock.name}</span><em>{stock.relStrength3m > 0 ? "+" : ""}{stock.relStrength3m} vs index</em></li>)}
          {!candidates.length && <li>Nothing in this sector qualifies. That is a result, not a failure.</li>}</ul></div>
    ) },
    { name: "Chart & setup", body: (
      <div className="stage-choice"><p><b>{scenario.symbol}:</b> {scenario.setup}</p>
        <CandleChart candles={scenario.history} height={180} levels={[{ price: scenario.trigger, label: `trigger ${scenario.trigger}`, tone: "entry" }, { price: scenario.invalidation, label: `invalid ${scenario.invalidation}`, tone: "stop" }]} />
        <b>Setup sentence: &ldquo;Uptrend pulling back to prior structure; I expect the trend to resume above {scenario.trigger}.&rdquo;</b></div>
    ) },
    { name: "Entry & invalidation", body: (
      <div className="stage-choice"><p>The stop is fixed by structure at ₹{scenario.invalidation}. Your entry choice decides the risk per share.</p>
        <div>{(["breakout", "retest"] as const).map((option) => <button key={option} className={entryStyle === option ? "active" : ""} onClick={() => setEntryStyle(option)}>{option === "breakout" ? `Break of ${scenario.trigger}` : `Retest at ${scenario.trigger - 12}`}</button>)}</div>
        <b>Entry ₹{entry} · invalidation ₹{scenario.invalidation} · risk ₹{(entry - scenario.invalidation).toFixed(0)} per share</b></div>
    ) },
    { name: "Size & exit plan", body: (
      <div className="stage-choice">
        <label>Base risk budget <b>{money(risk)}</b><input type="range" min="1000" max="20000" step="500" value={risk} onChange={(e) => setRisk(Number(e.target.value))} /></label>
        <div className="ticket">
          <div><span>Instrument</span><b>{scenario.symbol}</b></div>
          <div><span>Entry</span><b>₹{entry}</b></div>
          <div><span>Stop</span><b>₹{scenario.invalidation}</b></div>
          <div><span>Risk / share</span><b>₹{(entry - scenario.invalidation).toFixed(0)}</b></div>
          <div><span>Regime multiplier</span><b>{multiplier}×</b></div>
          <div><span>Adjusted budget</span><b>{money(budget)}</b></div>
          <div><span>Position</span><b>{shares.toLocaleString("en-IN")} shares</b></div>
          <div><span>Exposure</span><b>{money(shares * entry)}</b></div>
        </div>
        <b>Exit plan: first target at the prior high, trail below each new swing low, close if flat after four weeks.</b></div>
    ) },
  ];
  return (
    <div className="lab-workbench workflow-lab">
      <section className="lab-controls">
        <h2>The chain</h2>
        <ol className="workflow-stages">{stages.map((item, index) => (
          <li key={item.name}><button className={index === stage ? "active" : index < stage ? "done" : ""} onClick={() => setStage(index)}><i>{index + 1}</i>{item.name}</button></li>
        ))}</ol>
        <div className="lab-note"><b>Each step feeds the next.</b><p>The market read reaches the position through the size multiplier. The chart reaches it through the stop distance. Nothing here is optional.</p></div>
      </section>
      <section className="lab-output">
        <div className="lab-title-row"><span>STAGE {stage + 1} OF {stages.length}</span><b>{stages[stage].name}</b></div>
        {stages[stage].body}
        <div className="stage-nav">
          <button onClick={() => setStage(Math.max(0, stage - 1))} disabled={!stage}>← Previous stage</button>
          <button className="button-primary" onClick={() => setStage(Math.min(stages.length - 1, stage + 1))} disabled={stage === stages.length - 1}>Next stage →</button>
        </div>
      </section>
    </div>
  );
}


// ── Pattern interactions ────────────────────────────────────────────────────
/** Which pattern each lesson illustrates. Explicit rather than derived from the title, so
 *  renaming a lesson cannot silently swap the chart underneath it. */
const candleForLesson: Record<string, [string, string?]> = {
  "FND-CANDLE-001": ["hammer"], "FND-CANDLE-002": ["doji"], "FND-CANDLE-003": ["hammer"],
  "FND-CANDLE-004": ["shooting-star"], "FND-CANDLE-005": ["bullish-engulfing"], "FND-CANDLE-006": ["bearish-engulfing", "bullish-engulfing"],
  "FND-CANDLE-007": ["harami", "bullish-engulfing"], "FND-CANDLE-008": ["morning-star"], "FND-CANDLE-009": ["evening-star"],
  "FND-CANDLE-010": ["hammer", "hanging-man"], "FND-CANDLE-011": ["shooting-star"], "FND-CANDLE-012": ["hammer"],
  "FND-CANDLE-013": ["bullish-engulfing"], "FND-CANDLE-014": ["doji"],
};

const chartForLesson: Record<string, string> = {
  "APP-PAT-001": "ascending-triangle", "APP-PAT-002": "rectangle", "APP-PAT-003": "bull-flag", "APP-PAT-004": "rectangle",
  "APP-PAT-005": "symmetrical-triangle", "APP-PAT-006": "ascending-triangle", "APP-PAT-007": "descending-triangle",
  "APP-PAT-008": "bull-flag", "APP-PAT-009": "pennant", "APP-PAT-010": "rising-wedge", "APP-PAT-011": "falling-wedge",
  "APP-PAT-012": "head-shoulders", "APP-PAT-013": "inverse-head-shoulders", "APP-PAT-014": "double-top",
  "APP-PAT-015": "double-bottom", "APP-PAT-016": "cup-handle", "APP-PAT-017": "rectangle", "APP-PAT-018": "bull-flag",
  "APP-PAT-019": "rectangle", "APP-PAT-020": "rectangle", "APP-PAT-021": "head-shoulders", "APP-PAT-022": "rectangle",
  "APP-PAT-023": "head-shoulders", "APP-PAT-024": "ascending-triangle",
};

export function CandlePatternSim({ lessonId }: { lessonId: string }) {
  const [primary, alternate] = candleForLesson[lessonId] ?? ["hammer"];
  const [showAlternate, setShowAlternate] = useState(false);
  const [face, setFace] = useState<"records" | "cannot">("records");
  const pattern = candlePatternById(showAlternate && alternate ? alternate : primary);
  return (
    <div className="lesson-sim candle-pattern-sim">
      <div className="cp-head"><b>{pattern.name}</b><span>{pattern.bias}</span></div>
      <CandleChart candles={pattern.candles} height={150} minSlots={pattern.candles.length + 1}
        highlightFrom={pattern.candles.length - pattern.patternBars} />
      {alternate && (
        <button className="cp-swap" onClick={() => setShowAlternate(!showAlternate)}>
          Compare with {candlePatternById(showAlternate ? primary : alternate).name} →
        </button>
      )}
      <div className="cp-tabs">
        <button className={face === "records" ? "active" : ""} onClick={() => setFace("records")}>What it records</button>
        <button className={face === "cannot" ? "active" : ""} onClick={() => setFace("cannot")}>What it cannot</button>
      </div>
      <p>{face === "records" ? pattern.reading : pattern.caution}</p>
    </div>
  );
}

export function ChartPatternSim({ lessonId }: { lessonId: string }) {
  const pattern = chartPatternById(chartForLesson[lessonId] ?? "rectangle");
  const [outcome, setOutcome] = useState<"forming" | "worked" | "failed">("forming");
  const candles = outcome === "forming" ? pattern.history
    : [...pattern.history, ...(outcome === "worked" ? pattern.worked : pattern.failed)];
  return (
    <div className="lesson-sim chart-pattern-sim">
      <div className="cp-head"><b>{pattern.name}</b><span>{pattern.kind}</span></div>
      <CandleChart candles={candles} height={155}
        levels={[{ price: pattern.trigger, label: `trigger ${pattern.trigger}`, tone: "entry" }, { price: pattern.invalidation, label: `invalid ${pattern.invalidation}`, tone: "stop" }]} />
      <div className="cp-outcomes">
        {(["forming", "worked", "failed"] as const).map((option) => (
          <button key={option} className={outcome === option ? "active" : ""} onClick={() => setOutcome(option)}>
            {option === "forming" ? "Forming" : option === "worked" ? "If it works" : "If it fails"}
          </button>
        ))}
      </div>
      <p>{outcome === "forming" ? pattern.shape : outcome === "worked" ? pattern.captures : pattern.breaks}</p>
      {outcome !== "forming" && <p className="cp-note">Same shape, same volume, two futures. Which one you get is not in the chart.</p>}
    </div>
  );
}

// ── Pattern Lab ─────────────────────────────────────────────────────────────
/** Deterministic distractors, so the same pattern always offers the same four names. */
function nameOptions(pattern: ChartPattern) {
  const others = chartPatterns.filter((item) => item.id !== pattern.id);
  const picks = [0, 1, 2].map((offset) => others[(pattern.name.length * 3 + offset * 5) % others.length].name);
  return [...new Set([pattern.name, ...picks])].slice(0, 4).sort();
}

export function PatternLab() {
  const [index, setIndex] = useState(0);
  const [kind, setKind] = useState<string | null>(null);
  const [named, setNamed] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<"worked" | "failed" | null>(null);
  const pattern = chartPatterns[index % chartPatterns.length];
  const options = nameOptions(pattern);
  const answered = kind !== null && named !== null;
  const next = () => { setIndex(index + 1); setKind(null); setNamed(null); setOutcome(null); };
  return (
    <div className="lab-workbench pattern-lab">
      <section className="lab-controls">
        <h2>Read the chart</h2>
        <div className="plan-step">
          <span>1. Continuation or reversal?</span>
          <div>{["continuation", "reversal"].map((option) => (
            <button key={option} className={kind === option ? "active" : ""} onClick={() => setKind(option)} disabled={outcome !== null}>{option}</button>
          ))}</div>
        </div>
        <div className="plan-step">
          <span>2. What is this pattern called?</span>
          <div>{options.map((option) => (
            <button key={option} className={named === option ? "active" : ""} onClick={() => setNamed(option)} disabled={outcome !== null}>{option}</button>
          ))}</div>
        </div>
        {answered && outcome === null && (
          <div className="lab-note">
            <b>{kind === pattern.kind ? "Kind: correct" : `Kind: it is a ${pattern.kind}`} · {named === pattern.name ? "Name: correct" : `Name: ${pattern.name}`}</b>
            <p>{pattern.shape}</p>
          </div>
        )}
        {answered && (
          <div className="plan-step">
            <span>3. Now pick a future — both are real possibilities from here.</span>
            <div>
              <button className={outcome === "worked" ? "active" : ""} onClick={() => setOutcome("worked")}>It completes</button>
              <button className={outcome === "failed" ? "active" : ""} onClick={() => setOutcome("failed")}>It fails</button>
            </div>
          </div>
        )}
        <div className="lab-note"><b>Fictional companies, synthetic data.</b><p>Naming the shape is the easy half. What it is trying to capture, and what breaks it, is the half that matters.</p></div>
      </section>
      <section className="lab-output">
        <div className="lab-title-row"><span>PATTERN {(index % chartPatterns.length) + 1} OF {chartPatterns.length} · daily · synthetic</span><b>{answered ? pattern.name : "Unnamed"}</b></div>
        <CandleChart height={240}
          candles={outcome === null ? pattern.history : [...pattern.history, ...(outcome === "worked" ? pattern.worked : pattern.failed)]}
          levels={answered ? [{ price: pattern.trigger, label: `trigger ${pattern.trigger}`, tone: "entry" }, { price: pattern.invalidation, label: `invalid ${pattern.invalidation}`, tone: "stop" }] : []} />
        {!answered && <p className="inspect-prompt">Answer both questions before the levels are drawn. Reading the shape first is the point.</p>}
        {outcome !== null && (
          <div className="reveal-card">
            <b>{outcome === "worked" ? "This time it completed" : "This time it failed"}</b>
            <p>{outcome === "worked" ? pattern.captures : pattern.breaks}</p>
            <p className="reveal-note">Both futures were generated from this same base. Nothing in the shape, the volume or the levels chose between them — which is why the trigger, the stop and the size are the parts of a pattern trade you actually control.</p>
            <button className="button-primary" onClick={next}>Next pattern →</button>
          </div>
        )}
      </section>
    </div>
  );
}

export const practicalLabs: Record<string, () => React.JSX.Element> = {
  "Horizon Lab": HorizonLab,
  "Screener Lab": ScreenerLab,
  "Swing Setup Lab": SwingSetupLab,
  "Market Replay Lab": MarketReplayLab,
  "Stock Selection Lab": StockSelectionLab,
  "Trade Workflow Lab": TradeWorkflowLab,
  "Pattern Lab": PatternLab,
};
