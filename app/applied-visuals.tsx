"use client";

import { useState } from "react";

type Props = { lessonId: string; moduleCode: string; title: string };
const money = (value: number) => `${value < 0 ? "−" : "+"}₹${Math.abs(Math.round(value)).toLocaleString("en-IN")}`;

function Frame({ eyebrow, title, children, note }: { eyebrow: string; title: string; children: React.ReactNode; note: string }) {
  return <div className="lesson-sim app-sim"><div className="app-head"><div><small>{eyebrow}</small><h3>{title}</h3></div><span>CHANGE THE INPUTS</span></div>{children}<p className="app-note">{note}</p></div>;
}

function AppBars({ tone, count }: { tone: string; count: number }) {
  return <div className={`app-bars ${tone}`}>{Array.from({length:count},(_,i)=><i key={i} style={{height:`${28 + ((i*17 + (tone === "up" ? i*7 : tone === "down" ? (count-i)*7 : i%3*12))%62)}%`}}/>)}</div>;
}

function MultiTimeframeVisual() {
  const [weekly, setWeekly] = useState<"up"|"range"|"down">("up");
  const [daily, setDaily] = useState<"up"|"range"|"down">("down");
  const aligned = weekly === daily && weekly !== "range";
  const decision = aligned ? (weekly === "up" ? "Trend environment supports long setups" : "Trend environment supports short setups") : weekly === "range" ? "No directional advantage from the higher timeframe" : "Conflict: wait, reduce size, or skip";
  return <Frame eyebrow="TWO CHARTS · TWO JOBS" title="Resolve timeframe agreement" note="The higher timeframe defines the environment. The lower timeframe times the entry; it does not overrule the environment.">
    <div className="mtf-grid"><section><b>WEEKLY · ENVIRONMENT</b><AppBars tone={weekly} count={12}/><div className="app-tabs">{(["up","range","down"] as const).map(v=><button key={v} className={weekly===v?"active":""} onClick={()=>setWeekly(v)}>{v}</button>)}</div></section><section><b>DAILY · EXECUTION</b><AppBars tone={daily} count={18}/><div className="app-tabs">{(["up","range","down"] as const).map(v=><button key={v} className={daily===v?"active":""} onClick={()=>setDaily(v)}>{v}</button>)}</div></section></div>
    <div className={`app-verdict ${aligned?"good":"warn"}`}><span>{aligned?"ALIGNED":"NOT ALIGNED"}</span><b>{decision}</b></div>
  </Frame>;
}

function FuturesVisual({ lessonId }: { lessonId: string }) {
  const entry=25000, [d1,setD1]=useState(24920), [d2,setD2]=useState(25040), [d3,setD3]=useState(24880);
  const lot=65, margin=125000, closes=[entry,d1,d2,d3];
  const rows=closes.slice(1).map((close,i)=>({day:i+1,close,points:close-closes[i],cash:(close-closes[i])*lot}));
  const total=(d3-entry)*lot, balance=margin+total;
  return <Frame eyebrow={`NIFTY FUTURES · CURRENT EXAMPLE LOT ${lot}`} title={lessonId.includes("006")||lessonId.includes("007")||lessonId.includes("012")?"Follow the daily cash settlement":"Move the contract and inspect exposure"} note="The 65-unit lot is an August 2026 teaching snapshot. Exchange lot sizes and broker margin requirements change; always check the live contract specification.">
    <div className="fut-summary"><span>ENTRY<b>{entry.toLocaleString("en-IN")}</b></span><span>NOTIONAL EXPOSURE<b>₹{(entry*lot).toLocaleString("en-IN")}</b></span><span>DEPOSIT (EXAMPLE)<b>₹{margin.toLocaleString("en-IN")}</b></span></div>
    <div className="mtm-ledger"><div><b>DAY</b><b>SETTLEMENT</b><b>POINTS</b><b>CASH FLOW</b></div>{rows.map((r,i)=><label key={r.day}><span>D{r.day}</span><input aria-label={`Day ${r.day} settlement`} type="range" min="24500" max="25500" step="10" value={r.close} onChange={e=>[setD1,setD2,setD3][i](Number(e.target.value))}/><b>{r.close.toLocaleString("en-IN")}</b><em className={r.cash>=0?"positive":"negative"}>{r.points>0?"+":""}{r.points} · {money(r.cash)}</em></label>)}</div>
    <div className={`app-verdict ${balance>margin*.65?"good":"warn"}`}><span>AFTER DAILY MTM</span><b>Balance ₹{balance.toLocaleString("en-IN")} · total {money(total)}</b></div>
  </Frame>;
}

function OptionPayoffVisual({ lessonId, title }: { lessonId: string; title: string }) {
  const [spot,setSpot]=useState(25000), [strike,setStrike]=useState(25000), [premium,setPremium]=useState(180), [side,setSide]=useState<"buyer"|"seller">("buyer");
  const isPut=/put/i.test(title)||lessonId.endsWith("003"), intrinsic=isPut?Math.max(0,strike-spot):Math.max(0,spot-strike);
  const buyer=intrinsic-premium, pnl=side==="buyer"?buyer:-buyer, breakeven=isPut?strike-premium:strike+premium;
  return <Frame eyebrow={`${isPut?"PUT":"CALL"} · EXPIRY PROFIT`} title="Separate payoff from profit" note="Profit includes premium but excludes brokerage, taxes and slippage. Before expiry, implied volatility and remaining time also affect the option price.">
    <div className="app-tabs wide"><button className={side==="buyer"?"active":""} onClick={()=>setSide("buyer")}>Buyer · right</button><button className={side==="seller"?"active":""} onClick={()=>setSide("seller")}>Seller · obligation</button></div>
    <div className="option-controls"><label>Underlying at expiry <input type="range" min="24000" max="26000" step="25" value={spot} onChange={e=>setSpot(Number(e.target.value))}/><b>{spot.toLocaleString("en-IN")}</b></label><label>Strike <input type="range" min="24500" max="25500" step="50" value={strike} onChange={e=>setStrike(Number(e.target.value))}/><b>{strike.toLocaleString("en-IN")}</b></label><label>Premium <input type="range" min="20" max="400" step="10" value={premium} onChange={e=>setPremium(Number(e.target.value))}/><b>₹{premium}</b></label></div>
    <div className="fut-summary"><span>INTRINSIC / PAYOFF<b>₹{intrinsic}</b></span><span>BREAK-EVEN<b>{breakeven.toLocaleString("en-IN")}</b></span><span>PROFIT PER UNIT<b className={pnl>=0?"positive":"negative"}>{money(pnl)}</b></span></div>
    <div className="payoff-axis"><i style={{left:`${Math.max(0,Math.min(100,(spot-24000)/20))}%`}}/><span>24,000</span><b>{isPut?"PUT VALUE RISES ←":"→ CALL VALUE RISES"}</b><span>26,000</span></div>
  </Frame>;
}

function GreeksVisual({ lessonId, title }: { lessonId: string; title: string }) {
  const [spot,setSpot]=useState(25000),[days,setDays]=useState(21),[iv,setIv]=useState(18);
  const focus=/gamma/i.test(title)||["005","006","007","008"].some(n=>lessonId.endsWith(n))?"Gamma":/theta|time decay/i.test(title)||["009","010","011","012"].some(n=>lessonId.endsWith(n))?"Theta":/vega|volatility/i.test(title)||["013","014","015","016"].some(n=>lessonId.endsWith(n))?"Vega":"Delta";
  const distance=(spot-25000)/100, delta=Math.max(.04,Math.min(.96,.5+distance*.13)), gamma=Math.max(.00008,.0018-Math.abs(distance)*.00022)*(30/(days+9)), theta=-(5+190/(days+5))*(iv/18), vega=Math.max(2,18-Math.abs(distance)*2.2)*Math.sqrt(days/30), premium=Math.max(4,180+delta*(spot-25000)+(iv-18)*vega+theta*(21-days));
  const value={Delta:delta.toFixed(2),Gamma:gamma.toFixed(4),Theta:`₹${theta.toFixed(1)}/day`,Vega:`₹${vega.toFixed(1)}/IV pt`}[focus];
  return <Frame eyebrow="GREEKS · LOCAL SENSITIVITIES" title={`Experiment with ${focus}`} note="Illustrative sensitivities, not a trading quote. Each Greek changes when spot, time or implied volatility changes; move one input at a time to isolate its effect.">
    <div className="greek-focus"><span>LESSON FOCUS<b>{focus}</b></span><span>MODELLED PREMIUM<b>₹{Math.round(premium)}</b></span><span>CURRENT VALUE<b>{value}</b></span></div>
    <div className="option-controls"><label>Spot <input type="range" min="24400" max="25600" step="25" value={spot} onChange={e=>setSpot(Number(e.target.value))}/><b>{spot.toLocaleString("en-IN")}</b></label><label>Days remaining <input type="range" min="1" max="45" value={days} onChange={e=>setDays(Number(e.target.value))}/><b>{days}</b></label><label>Implied volatility <input type="range" min="10" max="35" value={iv} onChange={e=>setIv(Number(e.target.value))}/><b>{iv}%</b></label></div>
    <div className="greek-strip">{[["DELTA",delta.toFixed(2)],["GAMMA",gamma.toFixed(4)],["THETA",theta.toFixed(1)],["VEGA",vega.toFixed(1)]].map(([k,v])=><span className={focus.toUpperCase()===k?"active":""} key={k}>{k}<b>{v}</b></span>)}</div>
  </Frame>;
}

function OpenInterestVisual({ lessonId }: { lessonId: string }) {
  const [selected,setSelected]=useState(25000),[priceMove,setPriceMove]=useState(1),[oiMove,setOiMove]=useState(1);
  const chain=[{k:24600,c:32,p:78,cc:4,pc:11},{k:24800,c:48,p:61,cc:7,pc:16},{k:25000,c:92,p:95,cc:19,pc:22},{k:25200,c:76,p:51,cc:23,pc:9},{k:25400,c:59,p:37,cc:14,pc:5}];
  const classification=priceMove>0?(oiMove>0?"Long buildup":"Short covering"):(oiMove>0?"Short buildup":"Long unwinding");
  return <Frame eyebrow="OPTION CHAIN · ANONYMOUS CONTRACTS" title={lessonId.endsWith("001")||lessonId.endsWith("002")?"See what volume and OI actually count":"Read concentration with context"} note="High call OI is not automatically resistance and high put OI is not automatically support. OI cannot reveal who initiated a trade or whether it is one leg of a hedge or spread.">
    <div className="oi-context"><div className="app-tabs"><button className={priceMove>0?"active":""} onClick={()=>setPriceMove(1)}>Price ↑</button><button className={priceMove<0?"active":""} onClick={()=>setPriceMove(-1)}>Price ↓</button></div><div className="app-tabs"><button className={oiMove>0?"active":""} onClick={()=>setOiMove(1)}>OI ↑</button><button className={oiMove<0?"active":""} onClick={()=>setOiMove(-1)}>OI ↓</button></div><b>{classification}<small>classification, not forecast</small></b></div>
    <div className="option-chain"><div><b>CALL OI</b><b>CALL ΔOI</b><b>STRIKE</b><b>PUT ΔOI</b><b>PUT OI</b></div>{chain.map(r=><button key={r.k} className={selected===r.k?"active":""} onClick={()=>setSelected(r.k)}><span>{r.c}k</span><em>+{r.cc}k</em><b>{r.k.toLocaleString("en-IN")}</b><em>+{r.pc}k</em><span>{r.p}k</span></button>)}</div>
    <div className="app-verdict"><span>SELECTED STRIKE {selected.toLocaleString("en-IN")}</span><b>Concentration observed; participant intent remains unknown.</b></div>
  </Frame>;
}

function StrategyBuilderVisual() {
  const [universe,setUniverse]=useState("Liquid NIFTY 200 shares"),[entry,setEntry]=useState("Close above prior-day high"),[exit,setExit]=useState("2R target"),[risk,setRisk]=useState(1),[filter,setFilter]=useState("Above 50-day average");
  const specific=![universe,entry,exit,filter].some(v=>/looks|good|strong$/i.test(v.trim()));
  return <Frame eyebrow="RULE COMPOSER" title="Turn an idea into a reproducible strategy" note="A strategy is testable only when two people applying the same rules would place the same trades. This builder checks specificity, not profitability.">
    <div className="rule-builder"><label>Universe<input value={universe} onChange={e=>setUniverse(e.target.value)}/></label><label>Entry<input value={entry} onChange={e=>setEntry(e.target.value)}/></label><label>Exit<input value={exit} onChange={e=>setExit(e.target.value)}/></label><label>Filter<input value={filter} onChange={e=>setFilter(e.target.value)}/></label><label>Risk per trade<input type="range" min="1" max="30" value={risk*10} onChange={e=>setRisk(Number(e.target.value)/10)}/><b>{risk.toFixed(1)}%</b></label></div>
    <div className={`app-verdict ${specific?"good":"warn"}`}><span>{specific?"TESTABLE DRAFT":"TOO SUBJECTIVE"}</span><b>{specific?`${universe} → ${entry} → ${exit} · risk ${risk.toFixed(1)}%`:`Replace words such as “looks good” or “strong” with checkable conditions.`}</b></div>
  </Frame>;
}

function MarketBehaviourVisual({ moduleCode, title }: { moduleCode: string; title: string }) {
  const [regime,setRegime]=useState<"trend"|"range">("trend"),[strength,setStrength]=useState(62),[decision,setDecision]=useState<"follow"|"fade"|"wait">("wait");
  const isMomentum=moduleCode==="MOM", isMean=moduleCode==="MR";
  const stretched=strength>72, valid=isMomentum?(regime==="trend"&&decision==="follow"):(isMean?(regime==="range"&&stretched&&decision==="fade"):decision==="wait");
  const bars=Array.from({length:18},(_,i)=>regime==="trend"?28+i*3+(i%4)*5:52+Math.sin(i*1.4)*18+(stretched&&i>14?i*5:0));
  return <Frame eyebrow={`${moduleCode} · CONTEXT BEFORE SIGNAL`} title={title} note={isMomentum?"Momentum asks whether movement is persisting and accelerating—not merely whether price is up.":isMean?"A stretched reading is a condition, not an entry. Reversion logic is most fragile when a strong trend is still intact.":"Price action becomes evidence only in context. The same candle can mean continuation, rejection, or nothing at all."}>
    <div className="behaviour-chart"><div className="behaviour-mean"/><div className="behaviour-bars">{bars.map((v,i)=><i key={i} className={i===17?"last":""} style={{height:`${Math.max(12,Math.min(95,v))}%`}}/>)}</div><span>{regime==="trend"?"STRUCTURE: HIGHER HIGHS / HIGHER LOWS":"STRUCTURE: ROTATION AROUND A MEAN"}</span></div>
    <div className="app-tabs wide"><button className={regime==="trend"?"active":""} onClick={()=>setRegime("trend")}>Trending regime</button><button className={regime==="range"?"active":""} onClick={()=>setRegime("range")}>Ranging regime</button></div>
    <label className="behaviour-slider">Move strength / distance from mean<input type="range" min="20" max="90" value={strength} onChange={e=>setStrength(Number(e.target.value))}/><b>{strength}</b></label>
    <div className="app-tabs">{(["follow","fade","wait"] as const).map(v=><button key={v} className={decision===v?"active":""} onClick={()=>setDecision(v)}>{v}</button>)}</div>
    <div className={`app-verdict ${valid?"good":"warn"}`}><span>{valid?"DECISION FITS CONTEXT":"CHECK THE REGIME"}</span><b>{valid?"The action matches the market condition shown.":isMomentum?"Following momentum needs persistent structure; otherwise wait.":isMean?"Fading strength inside a trend is not mean reversion—it is counter-trend risk.":"Do not turn one visible shape into a forecast without location and confirmation."}</b></div>
  </Frame>;
}

function DerivativeAnatomyVisual({ title }: { title: string }) {
  const [purpose,setPurpose]=useState<"hedge"|"speculate">("hedge"),[contracts,setContracts]=useState(1); const lot=65,spot=25000, exposure=contracts*lot*spot;
  return <Frame eyebrow="CONTRACT ANATOMY · NIFTY EXAMPLE" title={title} note="Current teaching snapshot: NIFTY index contracts use exchange-defined lots and Tuesday expiries. Specifications and margin can change; verify the live NSE contract before trading.">
    <div className="contract-flow"><span><small>UNDERLYING</small><b>NIFTY 50</b><em>Index level 25,000</em></span><i>→</i><span><small>STANDARD CONTRACT</small><b>{lot} units</b><em>European / cash settled</em></span><i>→</i><span><small>EXPOSURE</small><b>₹{exposure.toLocaleString("en-IN")}</b><em>not the margin deposit</em></span></div>
    <label className="behaviour-slider">Number of whole contracts<input type="range" min="1" max="5" value={contracts} onChange={e=>setContracts(Number(e.target.value))}/><b>{contracts}</b></label>
    <div className="app-tabs wide"><button className={purpose==="hedge"?"active":""} onClick={()=>setPurpose("hedge")}>Offset existing risk</button><button className={purpose==="speculate"?"active":""} onClick={()=>setPurpose("speculate")}>Create new exposure</button></div>
    <div className="app-verdict"><span>{purpose==="hedge"?"HEDGE":"SPECULATION"}</span><b>{purpose==="hedge"?"Judge the contract by how well it offsets the exposure already held.":"Judge the position by its complete payoff, costs, margin and maximum loss."}</b></div>
  </Frame>;
}

function PositionalVisual({ title }: { title: string }) {
  const [quality,setQuality]=useState(70),[growth,setGrowth]=useState(58),[trend,setTrend]=useState(76),[weight,setWeight]=useState(18);
  const score=Math.round(quality*.35+growth*.25+trend*.4), concentration=weight>25;
  return <Frame eyebrow="THESIS SCORECARD · NOT A BUY SIGNAL" title={title} note="A score organizes evidence; it does not turn accounting data or chart strength into certainty. Record the thesis, invalidation and portfolio contribution separately.">
    <div className="thesis-grid">{[["Business resilience",quality,setQuality],["Multi-year growth",growth,setGrowth],["Price structure",trend,setTrend]] .map(([label,value,setter])=><label key={String(label)}><span>{label}</span><input type="range" min="10" max="95" value={value as number} onChange={e=>(setter as (n:number)=>void)(Number(e.target.value))}/><b>{value}</b></label>)}</div>
    <div className="score-ring" style={{"--score":`${score*3.6}deg`} as React.CSSProperties}><div><b>{score}</b><span>EVIDENCE SCORE</span></div></div>
    <label className="behaviour-slider">Proposed portfolio weight<input type="range" min="2" max="40" value={weight} onChange={e=>setWeight(Number(e.target.value))}/><b>{weight}%</b></label>
    <div className={`app-verdict ${concentration?"warn":"good"}`}><span>{concentration?"CONCENTRATION CHECK":"PORTFOLIO CHECK"}</span><b>{concentration?"A strong standalone thesis can still create excessive portfolio risk.":"Now define the invalidation event and what this position adds to the existing book."}</b></div>
  </Frame>;
}

export function AppliedVisual({ lessonId, moduleCode, title }: Props) {
  if(["PA","MOM","MR"].includes(moduleCode)) return <MarketBehaviourVisual moduleCode={moduleCode} title={title}/>;
  if(moduleCode==="MTF") return <MultiTimeframeVisual/>;
  if(moduleCode==="DER") return <DerivativeAnatomyVisual title={title}/>;
  if(moduleCode==="FUT") return <FuturesVisual lessonId={lessonId}/>;
  if(moduleCode==="OPT") return <OptionPayoffVisual lessonId={lessonId} title={title}/>;
  if(moduleCode==="GRK") return <GreeksVisual lessonId={lessonId} title={title}/>;
  if(moduleCode==="OI") return <OpenInterestVisual lessonId={lessonId}/>;
  if(moduleCode==="STR") return <StrategyBuilderVisual/>;
  if(moduleCode==="PSN") return <PositionalVisual title={title}/>;
  return null;
}
