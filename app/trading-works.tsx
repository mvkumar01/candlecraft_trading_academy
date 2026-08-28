"use client";

import { useState } from "react";

const bids: [number, number][] = [[99.90, 120], [99.80, 250], [99.70, 400]];
const asks: [number, number][] = [[100.10, 100], [100.20, 300], [100.30, 200]];

function fill(levels: [number, number][], quantity: number) {
  let remaining = quantity, cost = 0, filled = 0;
  const rows = levels.map(([price, available]) => {
    const taken = Math.min(remaining, available);
    remaining -= taken; filled += taken; cost += taken * price;
    return { price, available, taken };
  });
  return { rows, remaining, filled, average: filled ? cost / filled : 0 };
}

function Metric({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return <div className={`work-metric ${tone}`}><span>{label}</span><b>{value}</b></div>;
}

function Range({ label, value, min, max, step = 1, setValue, suffix = "" }: { label: string; value: number; min: number; max: number; step?: number; setValue: (value: number) => void; suffix?: string }) {
  return <label className="work-range"><span>{label}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={(event) => setValue(Number(event.target.value))}/><b>{value}{suffix}</b></label>;
}

function Book({ side, quantity }: { side: "buy" | "sell"; quantity: number }) {
  const levels = side === "buy" ? asks : bids;
  const result = fill(levels, quantity);
  return <div className="work-book-wrap">
    <div className="work-book-head"><span>{side === "buy" ? "SELLERS YOU BUY FROM" : "BUYERS YOU SELL TO"}</span><b>{side === "buy" ? "ASKS" : "BIDS"}</b></div>
    <div className={`work-book ${side}`}>
      {result.rows.map((row) => <div key={row.price} className={row.taken ? "taken" : ""}><span>₹{row.price.toFixed(2)}</span><span>{row.available} available</span><b>{row.taken ? `${row.taken} filled` : "waiting"}</b></div>)}
    </div>
    <div className="work-metrics"><Metric label="FILLED" value={`${result.filled}/${quantity}`}/><Metric label="AVERAGE PRICE" value={`₹${result.average.toFixed(2)}`}/>{result.remaining > 0 && <Metric label="BEYOND VISIBLE BOOK" value={`${result.remaining}`}/>}</div>
  </div>;
}

export function TradingWorksVisual({ lessonId }: { lessonId: string }) {
  const lesson = Number(lessonId.slice(-3));
  const [quantity, setQuantity] = useState(50);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"intraday" | "delivery">("intraday");
  const [price, setPrice] = useState(250);
  const [exit, setExit] = useState(253);
  const [costs, setCosts] = useState(110);
  const [trades, setTrades] = useState(20);
  const [bid, setBid] = useState(99.9);
  const [ask, setAsk] = useState(100.1);

  if (lesson <= 3) {
    const journeys = lesson === 1
      ? [["Investor", "Chooses the order"], ["Broker", "Checks and routes it"], ["Exchange", "Matches buyers and sellers"], ["Clearing", "Calculates obligations"], ["Bank + demat", "Move money and ownership"]]
      : lesson === 2
        ? [["Trading account", "Sends buy and sell instructions"], ["Broker + exchange", "Route and match the order"], ["Demat account", "Records shares you own"]]
        : [["Validated", "Broker checks funds and order rules"], ["Queued", "Order waits at the exchange"], ["Matched", "A compatible seller is found"], ["Settled", "Money and shares are delivered"]];
    const current = journeys[Math.min(step, journeys.length - 1)];
    return <div className="lesson-sim work-sim work-journey"><div className="work-stage" aria-live="polite"><small>STEP {step + 1} OF {journeys.length}</small><b>{current[0]}</b><p>{current[1]}</p></div><div className="work-path">{journeys.map(([name], index) => <button key={name} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} aria-label={`Show step ${index + 1}: ${name}`}><i>{index < step ? "✓" : index + 1}</i><span>{name}</span></button>)}</div><p className="work-note">{lesson === 3 ? "Pressing Buy starts this journey. It does not guarantee a match or immediate ownership." : "Select each step to see who does what."}</p></div>;
  }

  if (lesson === 4 || lesson === 5 || lesson === 7 || lesson === 9) {
    const side = lesson === 4 ? "sell" : "buy";
    const q = lesson === 4 || lesson === 5 ? Math.min(quantity, 300) : quantity;
    const result = fill(side === "buy" ? asks : bids, q);
    const reference = side === "buy" ? asks[0][0] : bids[0][0];
    const perShare = side === "buy" ? result.average - reference : reference - result.average;
    return <div className="lesson-sim work-sim"><div className="work-action-head"><div><small>{lesson === 4 ? "SELL INTO BIDS" : lesson === 9 ? "EXPECTED VS ACTUAL" : "BUY FROM ASKS"}</small><h3>{lesson === 7 ? "How far will your order travel?" : lesson === 9 ? "Measure the hidden execution cost" : "Take the waiting price"}</h3></div><Metric label={side === "buy" ? "BEST ASK" : "BEST BID"} value={`₹${reference.toFixed(2)}`}/></div><Range label={`${side === "buy" ? "Buy" : "Sell"} quantity`} value={q} min={50} max={lesson === 4 || lesson === 5 ? 300 : 600} step={50} setValue={setQuantity}/><Book side={side} quantity={q}/>{lesson === 9 && <div className="work-slippage"><Metric label="EXPECTED" value={`₹${reference.toFixed(2)}`}/><span>→</span><Metric label="ACTUAL AVERAGE" value={`₹${result.average.toFixed(2)}`}/><Metric label="BUY-SIDE SLIPPAGE" value={`₹${perShare.toFixed(2)} × ${result.filled} = ₹${(perShare * result.filled).toFixed(2)}`} tone="warn"/></div>}</div>;
  }

  if (lesson === 6) {
    const safeAsk = Math.max(ask, bid + .05); const spread = safeAsk - bid;
    return <div className="lesson-sim work-sim"><div className="work-action-head"><div><small>SPREAD LAB</small><h3>Move the quotes. Watch the trading cost.</h3></div><Metric label="SPREAD" value={`₹${spread.toFixed(2)}`} tone={spread > .25 ? "warn" : ""}/></div><Range label="Best bid" value={bid} min={99.5} max={100} step={.05} setValue={setBid}/><Range label="Best ask" value={safeAsk} min={99.95} max={100.5} step={.05} setValue={setAsk}/><div className="work-equation"><span>₹{safeAsk.toFixed(2)} ask</span><b>−</b><span>₹{bid.toFixed(2)} bid</span><b>= ₹{spread.toFixed(2)}</b></div><p className="work-note">An immediate buy and sell of 100 shares crosses this gap: about ₹{(spread * 100).toFixed(0)} before other charges.</p></div>;
  }

  if (lesson === 8) {
    const deep: [number, number][] = [[100.10, 400], [100.15, 500], [100.20, 700]];
    const thin: [number, number][] = [[100.10, 50], [100.60, 100], [101.20, 250]];
    const deepFill = fill(deep, quantity), thinFill = fill(thin, quantity);
    return <div className="lesson-sim work-sim"><div className="work-action-head"><div><small>LIQUIDITY COMPARISON</small><h3>Same order. Very different impact.</h3></div></div><Range label="Market-buy quantity" value={quantity} min={50} max={400} step={50} setValue={setQuantity}/><div className="liquidity-grid"><div><small>DEEP BOOK</small><b>Avg ₹{deepFill.average.toFixed(2)}</b><span>Impact ₹{(deepFill.average - deep[0][0]).toFixed(2)}/share</span></div><div className="thin"><small>THIN BOOK</small><b>Avg ₹{thinFill.average.toFixed(2)}</b><span>Impact ₹{(thinFill.average - thin[0][0]).toFixed(2)}/share</span></div></div><p className="work-note">Liquidity is not just volume. It is available quantity near the current price—and it can disappear.</p></div>;
  }

  if (lesson === 10) {
    const stages = [["T · TRADE", "Order matches; price and quantity are agreed"], ["T · CLEARING", "The clearing corporation calculates what each side owes"], ["T+1 · PAY-IN / PAYOUT", "Funds and securities move on the normal rolling cycle"], ["DIRECT PAYOUT", "Purchased securities are credited directly to the client demat account"]];
    return <div className="lesson-sim work-sim work-timeline">{stages.map(([title, copy], index) => <button key={title} className={step === index ? "active" : ""} onClick={() => setStep(index)}><i>{index + 1}</i><span><b>{title}</b><small>{copy}</small></span></button>)}<p className="work-note">India’s normal equity settlement is T+1. An optional T+0 facility is available for eligible securities and participants; it does not replace T+1 for every trade.</p></div>;
  }

  if (lesson === 11) return <div className="lesson-sim work-sim"><div className="work-toggle" role="tablist" aria-label="Position type"><button role="tab" aria-selected={mode === "intraday"} className={mode === "intraday" ? "active" : ""} onClick={() => setMode("intraday")}>Intraday</button><button role="tab" aria-selected={mode === "delivery"} className={mode === "delivery" ? "active" : ""} onClick={() => setMode("delivery")}>Delivery</button></div><div className="work-position"><small>{mode.toUpperCase()} POSITION</small><h3>{mode === "intraday" ? "Plan to close it in the same session" : "Keep the shares beyond today"}</h3><div className="work-path compact"><span>OPEN</span><b>→</b><span>{mode === "intraday" ? "CLOSE BEFORE PRODUCT CUTOFF" : "T+1 SETTLEMENT"}</span><b>→</b><span>{mode === "intraday" ? "NO HOLDING" : "DEMAT HOLDING"}</span></div><p>{mode === "intraday" ? "If you do not close it, treatment depends on the broker’s product, cutoff and risk-management policy. Auto-squareoff is common, not guaranteed." : "A delivery purchase remains open and, after settlement, is recorded in your demat account."}</p></div></div>;

  if (lesson >= 12 && lesson <= 14) {
    const isShort = lesson === 13; const current = lesson === 14 ? exit : price;
    const qty = quantity; const gross = (isShort ? 250 - current : current - 250) * qty; const net = gross - (lesson === 14 ? costs : 0);
    return <div className="lesson-sim work-sim"><div className="work-action-head"><div><small>{lesson === 12 ? "LONG STOCK" : lesson === 13 ? "SHORT STOCK" : "GROSS TO NET"}</small><h3>{isShort ? "Sell first, then buy back" : "Entry ₹250 per share"}</h3></div><Metric label={lesson === 14 ? "NET P&L" : "UNREALISED P&L"} value={`${net >= 0 ? "+" : "−"}₹${Math.abs(net).toFixed(0)}`} tone={net < 0 ? "warn" : "good"}/></div><Range label="Quantity" value={qty} min={50} max={500} step={50} setValue={setQuantity}/><Range label={lesson === 14 ? "Exit price" : "Current price"} value={current} min={220} max={280} setValue={lesson === 14 ? setExit : setPrice} suffix=""/>{lesson === 14 && <Range label="Total transaction costs" value={costs} min={0} max={300} step={10} setValue={setCosts} suffix=""/>}<div className="work-equation"><span>{isShort ? "(₹250 − current)" : "(current − ₹250)"}</span><b>× {qty}</b>{lesson === 14 && <b>− ₹{costs}</b>}<b>= {net >= 0 ? "+" : "−"}₹{Math.abs(net).toFixed(0)}</b></div>{isShort && <p className="work-note">In India, naked short selling is prohibited. Delivery obligations still apply, and borrowing through SLB is the formal route for delivery-based short positions.</p>}</div>;
  }

  const total = 85 * trades;
  return <div className="lesson-sim work-sim"><div className="work-action-head"><div><small>COST STACK</small><h3>The break-even line rises with every trade.</h3></div><Metric label="MONTHLY HURDLE" value={`₹${total.toLocaleString("en-IN")}`} tone="warn"/></div><Range label="Round trips per month" value={trades} min={1} max={40} setValue={setTrades}/><div className="cost-stack"><span style={{ flex: 40 }}>Brokerage / platform<b>₹40</b></span><span style={{ flex: 25 }}>Taxes + exchange fees<b>₹25</b></span><span style={{ flex: 20 }}>Spread crossed<b>₹20</b></span></div><p className="work-note">Illustrative round trip: ₹85. Actual brokerage and statutory or exchange charges depend on the broker, instrument, trade value and current fee schedule.</p></div>;
}
