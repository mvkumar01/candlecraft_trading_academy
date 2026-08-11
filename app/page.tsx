"use client";

import { useEffect, useMemo, useState } from "react";

type Prediction = "long" | "short" | "wait" | null;

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

const candles: Candle[] = [
  { open: 178.2, high: 179.4, low: 177.6, close: 178.9, volume: 34 },
  { open: 178.9, high: 180.2, low: 178.4, close: 179.8, volume: 41 },
  { open: 179.8, high: 180.4, low: 178.8, close: 179.1, volume: 32 },
  { open: 179.1, high: 180.8, low: 178.7, close: 180.3, volume: 46 },
  { open: 180.3, high: 181.1, low: 179.7, close: 180.7, volume: 37 },
  { open: 180.7, high: 181.3, low: 179.9, close: 180.1, volume: 31 },
  { open: 180.1, high: 181.5, low: 179.8, close: 181.2, volume: 44 },
  { open: 181.2, high: 182.3, low: 180.7, close: 181.9, volume: 48 },
  { open: 181.9, high: 182.4, low: 180.8, close: 181.2, volume: 35 },
  { open: 181.2, high: 182.8, low: 180.9, close: 182.4, volume: 52 },
  { open: 182.4, high: 183.1, low: 181.8, close: 182.1, volume: 40 },
  { open: 182.1, high: 183.4, low: 181.6, close: 183.0, volume: 55 },
  { open: 183.0, high: 183.7, low: 182.2, close: 182.7, volume: 39 },
  { open: 182.7, high: 184.0, low: 182.3, close: 183.6, volume: 51 },
  { open: 183.6, high: 184.2, low: 182.8, close: 183.1, volume: 36 },
  { open: 183.1, high: 184.3, low: 182.7, close: 183.9, volume: 47 },
  { open: 183.9, high: 184.5, low: 183.1, close: 183.4, volume: 34 },
  { open: 183.4, high: 184.6, low: 183.0, close: 184.1, volume: 45 },
  { open: 184.1, high: 184.7, low: 183.4, close: 183.7, volume: 38 },
  { open: 183.7, high: 184.8, low: 183.2, close: 184.3, volume: 49 },
  { open: 184.3, high: 184.9, low: 183.5, close: 183.9, volume: 43 },
  { open: 183.9, high: 185.0, low: 183.6, close: 184.6, volume: 58 },
  { open: 184.6, high: 187.2, low: 184.4, close: 186.8, volume: 92 },
  { open: 186.8, high: 188.1, low: 186.2, close: 187.5, volume: 84 },
  { open: 187.5, high: 188.0, low: 186.7, close: 187.1, volume: 60 },
  { open: 187.1, high: 189.0, low: 186.8, close: 188.6, volume: 76 },
  { open: 188.6, high: 189.4, low: 187.8, close: 188.1, volume: 64 },
  { open: 188.1, high: 190.2, low: 187.9, close: 189.7, volume: 82 },
  { open: 189.7, high: 190.1, low: 188.9, close: 189.3, volume: 53 },
  { open: 189.3, high: 191.2, low: 189.1, close: 190.8, volume: 71 },
];

const modules = [
  { icon: "⌁", title: "Price Action", lessons: "4 / 7", active: true },
  { icon: "◫", title: "Risk First", lessons: "2 / 6" },
  { icon: "↗", title: "Trend Systems", lessons: "0 / 8" },
  { icon: "◎", title: "Trade Psychology", lessons: "0 / 5" },
];

const lessonSteps = ["Read the setup", "Make a call", "Plan the trade", "Watch it play", "Review"];

function MarketChart({ revealed, prediction }: { revealed: number; prediction: Prediction }) {
  const min = 176;
  const max = 192;
  const visible = candles.slice(0, revealed);

  return (
    <div className="chart-shell" aria-label={`Candlestick chart with ${revealed} visible candles`}>
      <div className="chart-toolbar">
        <div className="ticker-id">
          <span className="ticker-mark">N</span>
          <div><strong>NOVA</strong><small>Nova Energy · 15m</small></div>
        </div>
        <div className="quote"><strong>${visible.at(-1)?.close.toFixed(2)}</strong><span>+1.28%</span></div>
        <div className="chart-tools" aria-hidden="true"><span>＋</span><span>⌖</span><span>▦</span></div>
      </div>

      <div className="plot-area">
        <div className="price-grid">
          {[192, 188, 184, 180, 176].map((price) => <span key={price}>${price}</span>)}
        </div>
        <div className="level-line resistance"><b>RESISTANCE</b><span>$185.00</span></div>
        <div className="level-line support"><b>SUPPORT</b><span>$179.80</span></div>
        {prediction && <div className={`prediction-flag ${prediction}`}>{prediction === "long" ? "YOUR CALL ↑" : prediction === "short" ? "YOUR CALL ↓" : "YOUR CALL · WAIT"}</div>}
        <div className="candles">
          {visible.map((candle, index) => {
            const up = candle.close >= candle.open;
            const top = ((max - candle.high) / (max - min)) * 100;
            const height = ((candle.high - candle.low) / (max - min)) * 100;
            const bodyTop = ((max - Math.max(candle.open, candle.close)) / (max - min)) * 100;
            const bodyHeight = Math.max(((Math.abs(candle.close - candle.open)) / (max - min)) * 100, 1.2);
            const style = { "--wick-top": `${top}%`, "--wick-height": `${height}%`, "--body-top": `${bodyTop}%`, "--body-height": `${bodyHeight}%`, "--volume": `${candle.volume}%` } as React.CSSProperties;
            return <div className={`candle-column ${up ? "up" : "down"} ${index >= 22 ? "revealed" : ""}`} style={style} key={index}><i className="wick"/><i className="body"/><i className="volume"/></div>;
          })}
          {revealed === 22 && <div className="future-mask"><span>?</span><small>FUTURE HIDDEN</small></div>}
        </div>
        <div className="time-axis"><span>10:00</span><span>11:30</span><span>13:00</span><span>14:30</span></div>
      </div>
    </div>
  );
}

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction>(null);
  const [confidence, setConfidence] = useState(60);
  const [risk, setRisk] = useState(1);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState(22);
  const [xp, setXp] = useState(1240);
  const [completed, setCompleted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("candlecraft-progress");
      if (saved) {
        const data = JSON.parse(saved) as { xp?: number; completed?: boolean };
        if (data.xp) setXp(data.xp);
        if (data.completed) setCompleted(true);
      }
    } catch { /* local progress is optional */ }
  }, []);

  const entry = 184.6;
  const stop = 182.75;
  const riskAmount = 10000 * (risk / 100);
  const shares = Math.floor(riskAmount / (entry - stop));
  const currentPrice = candles[Math.max(21, revealed - 1)].close;
  const pnl = locked ? (currentPrice - entry) * shares : 0;
  const score = prediction === "long" ? 100 : prediction === "wait" ? 45 : 15;

  const learningNote = useMemo(() => {
    if (!locked) return null;
    if (prediction === "long") return { title: "Sharp read — the volume confirmed it.", text: "Price compressed below resistance while lows kept rising. The breakout candle closed above $185 with nearly 2× average volume: a higher-quality signal than a wick alone." };
    if (prediction === "wait") return { title: "Safe, but a little too cautious.", text: "Waiting protected capital, but the rising lows and expanding volume were useful evidence. A small, defined-risk position would have been justified after the close above $185." };
    return { title: "Good thesis, wrong evidence.", text: "Repeated resistance can reject price, but rising lows showed buyers accepting higher prices. Before shorting, wait for a lower high or a close back below support." };
  }, [locked, prediction]);

  function lockPrediction() {
    if (!prediction || locked) return;
    setLocked(true);
    setRevealed(24);
    const earned = prediction === "long" ? 40 : prediction === "wait" ? 20 : 10;
    setXp((value) => value + earned);
  }

  function revealNext() {
    if (revealed < candles.length) {
      setRevealed((value) => Math.min(value + 2, candles.length));
      return;
    }
    if (!completed) {
      const nextXp = xp + 60;
      setXp(nextXp);
      setCompleted(true);
      localStorage.setItem("candlecraft-progress", JSON.stringify({ xp: nextXp, completed: true }));
    }
  }

  function restart() {
    setPrediction(null);
    setLocked(false);
    setRevealed(22);
    setCompleted(false);
  }

  return (
    <main className="app-frame">
      <aside className={`side-nav ${navOpen ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">C</span><div>Candle<span>craft</span></div></div>
        <button className="close-nav" onClick={() => setNavOpen(false)} aria-label="Close navigation">×</button>
        <nav aria-label="Primary navigation">
          <a className="nav-link active" href="#lesson"><span>⌂</span> Learn</a>
          <a className="nav-link" href="#practice"><span>⌁</span> Practice</a>
          <a className="nav-link" href="#journal"><span>▤</span> Journal</a>
          <a className="nav-link" href="#leaderboard"><span>♜</span> League</a>
        </nav>
        <div className="nav-section-label">YOUR PATH</div>
        <div className="module-list">
          {modules.map((module) => (
            <button className={`module-item ${module.active ? "active" : ""}`} key={module.title}>
              <span className="module-icon">{module.icon}</span><span><b>{module.title}</b><small>{module.lessons} lessons</small></span>
            </button>
          ))}
        </div>
        <div className="daily-card">
          <div className="daily-head"><span>DAILY GOAL</span><strong>3 / 5</strong></div>
          <div className="progress-track"><i style={{ width: "60%" }}/></div>
          <small>2 exercises to keep your streak</small>
        </div>
        <div className="profile-row"><span className="avatar">VK</span><div><b>Market Rookie</b><small>Level 6</small></div><button aria-label="Profile settings">•••</button></div>
      </aside>

      <section className="workspace" id="lesson">
        <header className="topbar">
          <button className="menu-button" onClick={() => setNavOpen(true)} aria-label="Open navigation">☰</button>
          <div className="lesson-breadcrumb"><span>PRICE ACTION</span><b>Lesson 5 of 7</b></div>
          <div className="stats-row"><span className="stat fire">◆ <b>12</b><small>day streak</small></span><span className="stat xp">✦ <b>{xp.toLocaleString()}</b><small>total XP</small></span><button className="sound-button" aria-label="Toggle sound">◖))</button></div>
        </header>

        <div className="lesson-progress" aria-label="Lesson progress">
          {lessonSteps.map((step, index) => <div className={`${index === 1 && !locked ? "current" : ""} ${index < 1 || locked ? "done" : ""}`} key={step}><i>{index < 1 || locked ? "✓" : index + 1}</i><span>{step}</span></div>)}
        </div>

        <div className="content-grid">
          <section className="lesson-column">
            <div className="eyebrow"><span>INTERACTIVE LESSON</span><b>+100 XP</b></div>
            <h1>Can you spot the <em>pressure?</em></h1>
            <p className="lesson-intro">NOVA has tested the same ceiling four times. But look closer: buyers are changing the shape of every pullback.</p>

            <div className="coach-prompt">
              <span className="coach-face">CC</span>
              <div><b>Coach says</b><p>Don’t predict yet. Trace the swing lows from left to right. What are buyers quietly doing?</p></div>
              <button aria-label="Replay coach tip">↻</button>
            </div>

            <MarketChart revealed={revealed} prediction={locked ? prediction : null}/>

            {!locked ? (
              <div className="decision-panel">
                <div className="decision-copy"><span>YOUR READ</span><h2>What happens after the next candle?</h2></div>
                <div className="choice-grid">
                  <button className={prediction === "long" ? "selected long" : ""} onClick={() => setPrediction("long")}><i>↗</i><span><b>Breakout</b><small>Buyers push above $185</small></span><kbd>1</kbd></button>
                  <button className={prediction === "short" ? "selected short" : ""} onClick={() => setPrediction("short")}><i>↘</i><span><b>Rejection</b><small>Sellers defend the level</small></span><kbd>2</kbd></button>
                  <button className={prediction === "wait" ? "selected wait" : ""} onClick={() => setPrediction("wait")}><i>•</i><span><b>Not enough data</b><small>Wait for confirmation</small></span><kbd>3</kbd></button>
                </div>
                <div className="confidence-row"><label htmlFor="confidence">Confidence <b>{confidence}%</b></label><input id="confidence" type="range" min="20" max="100" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))}/><span>Unsure</span><span>Conviction</span></div>
                <button className="primary-action" disabled={!prediction} onClick={lockPrediction}>Lock in my prediction <span>→</span></button>
              </div>
            ) : (
              <div className={`feedback-panel score-${score}`}>
                <div className="feedback-score"><span>{score}</span><small>READ SCORE</small></div>
                <div><span className="feedback-label">MARKET FEEDBACK</span><h2>{learningNote?.title}</h2><p>{learningNote?.text}</p><div className="feedback-tags"><span>Rising lows ✓</span><span>Volume expansion ✓</span><span>Close above level ✓</span></div></div>
              </div>
            )}
          </section>

          <aside className="sim-column" id="practice">
            <div className="sim-header"><div><span>PAPER TRADING LAB</span><h2>Plan the trade</h2></div><span className="live-dot">SIMULATED</span></div>
            <div className="account-strip"><span>Account equity<b>$10,000.00</b></span><span>Buying power<b>$20,000.00</b></span></div>

            <div className="ticket-section">
              <div className="order-toggle"><button className="active">LONG</button><button>SHORT</button></div>
              <label className="field-label">Entry trigger <span>Break & close above</span></label>
              <div className="price-field"><span>$</span><strong>{entry.toFixed(2)}</strong><small>LIMIT</small></div>
              <label className="field-label" htmlFor="risk-slider">Risk per trade <b>{risk.toFixed(1)}%</b></label>
              <input id="risk-slider" className="risk-slider" type="range" min="0.5" max="2.5" step="0.5" value={risk} onChange={(event) => setRisk(Number(event.target.value))}/>
              <div className="risk-labels"><span>Conservative</span><span>Aggressive</span></div>
              <div className="ticket-grid"><span>Stop loss<b>${stop.toFixed(2)}</b></span><span>Risk amount<b>${riskAmount.toFixed(0)}</b></span><span>Position size<b>{shares} shares</b></span><span>Target · 2R<b>${(entry + 2 * (entry - stop)).toFixed(2)}</b></span></div>
              <div className="rr-meter"><span>RISK <b>${riskAmount.toFixed(0)}</b></span><div><i/><i/><i/></div><span>REWARD <b>${(riskAmount * 2).toFixed(0)}</b></span></div>
            </div>

            <div className={`position-card ${locked ? "active" : ""}`}>
              <div className="position-head"><span>{locked ? "OPEN POSITION" : "TRADE PREVIEW"}</span><b className={pnl >= 0 ? "profit" : "loss"}>{locked ? `${pnl >= 0 ? "+" : "-"}$${Math.abs(pnl).toFixed(2)}` : "$0.00"}</b></div>
              <div className="position-price"><small>MARKET PRICE</small><strong>${currentPrice.toFixed(2)}</strong><span className={currentPrice >= entry ? "profit" : "loss"}>{currentPrice >= entry ? "▲" : "▼"} {Math.abs(((currentPrice-entry)/entry)*100).toFixed(2)}%</span></div>
              <div className="mini-track"><i className="stop-marker"/><i className="entry-marker"/><i className="target-marker"/><span>STOP</span><span>ENTRY</span><span>TARGET</span></div>
            </div>

            {locked ? <button className="sim-action" onClick={revealNext}>{revealed < candles.length ? "Reveal next candles" : completed ? "Lesson complete ✓" : "Bank lesson XP"}<span>▶</span></button> : <div className="locked-note"><span>⌁</span><p><b>Make your market call first.</b>Your trade plan will activate after you lock in a prediction.</p></div>}

            {completed && <div className="completion-card"><span>✦</span><div><b>Lesson mastered!</b><small>+100 XP · Accuracy logged</small></div><button onClick={restart}>Practice again</button></div>}
            <p className="disclaimer">Practice environment · No real money · Educational use only</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
