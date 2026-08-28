"use client";

import { useState, type ReactNode } from "react";

const Chip = ({ children, active = false }: { children: ReactNode; active?: boolean }) =>
  <span className={active ? "mf-chip active" : "mf-chip"}>{children}</span>;

const choices = {
  "FND-MKT-002": [
    ["Capital formation", "Savings fund businesses and projects."],
    ["Liquidity", "Owners can transfer an asset without waiting for the issuer."],
    ["Price discovery", "Competing orders reveal the price available now."],
    ["Risk transfer", "Risk can move to someone more willing or able to carry it."],
  ],
  "FND-MKT-013": [
    ["Risk takers", "Retail traders, funds, insurers, banks, firms and hedgers take investment or trading risk."],
    ["Intermediaries", "Brokers and depository participants help clients transact or hold assets."],
    ["Infrastructure", "Exchanges, clearing corporations and depositories run core market systems."],
    ["Regulator", "SEBI writes and enforces the regulatory framework."],
  ],
} as const;

export function MarketFoundationsVisual({ lessonId }: { lessonId: string }) {
  const [tab, setTab] = useState(0);
  const [a, setA] = useState(50);
  const [b, setB] = useState(55);
  const [c, setC] = useState(40);

  if (lessonId === "FND-MKT-001") {
    const nodes = [
      ["Saver / investor", "Provides capital or accepts financial risk"],
      ["Market + intermediaries", "Connects orders under rules"],
      ["Capital user", "Company, government or another participant"],
    ];
    return <div className="lesson-sim mf-sim"><div className="mf-flow">{nodes.map((node, i) => <button key={node[0]} className={tab === i ? "active" : ""} onClick={() => setTab(i)}><b>{node[0]}</b><span>{node[1]}</span></button>)}</div><div className="mf-assets"><Chip active>Shares</Chip><Chip>Bonds</Chip><Chip>Currencies</Chip><Chip>Commodities</Chip><Chip>Derivatives</Chip></div><p>A stock exchange is one organised venue inside this wider ecosystem. It is not the whole financial market.</p></div>;
  }

  if (lessonId === "FND-MKT-002" || lessonId === "FND-MKT-013") {
    const items = choices[lessonId];
    return <div className="lesson-sim mf-sim"><div className="mf-function-grid">{items.map((item, i) => <button key={item[0]} className={tab === i ? "active" : ""} onClick={() => setTab(i)}><b>{item[0]}</b><span>{item[1]}</span></button>)}</div><p>{lessonId === "FND-MKT-002" ? "Organised markets scale these functions; bank loans, private capital and bonds remain other funding routes." : "A participant can fit more than one role, but the role tells you what responsibility it carries in that transaction."}</p></div>;
  }

  if (lessonId === "FND-MKT-003") {
    const held = a;
    return <div className="lesson-sim mf-sim"><label className="mf-slider">Shares held out of 100 <input aria-label="Shares held out of one hundred" type="range" min="5" max="100" step="5" value={a} onChange={e => setA(Number(e.target.value))}/><b>{held}% interest</b></label><div className="mf-share-grid">{Array.from({length:20},(_,i)=><i key={i} className={i < held/5 ? "owned" : ""}/>)}</div><div className="mf-three"><Chip active>Possible dividend</Chip><Chip active>Price may rise</Chip><Chip>Loss is possible</Chip></div><p>You own an interest in the company, not {held}% of each desk, factory or bank account. Rights can also differ by share class.</p></div>;
  }

  if (lessonId === "FND-MKT-004") {
    const debt = tab === 0;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={debt ? "active" : ""} onClick={()=>setTab(0)}>Debt</button><button className={!debt ? "active" : ""} onClick={()=>setTab(1)}>Equity</button></div><div className="mf-ledger"><b>{debt ? "Borrowed capital" : "New ownership capital"}</b><span>{debt ? "Contractual interest and repayment obligations" : "Normally no fixed repayment obligation"}</span><span>{debt ? "No ownership dilution" : "Existing owners hold a smaller percentage"}</span><span>{debt ? "Can strain cash flow" : "Can affect voting control"}</span></div><p>Companies choose a mix depending on expansion plans, acquisitions, balance-sheet strength, employee compensation and existing investor needs.</p></div>;
  }

  if (lessonId === "FND-MKT-005") {
    const primary = tab === 0;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={primary ? "active" : ""} onClick={()=>setTab(0)}>New issue / IPO</button><button className={!primary ? "active" : ""} onClick={()=>setTab(1)}>Later exchange trade</button></div><div className="mf-route"><b>{primary ? "Investor" : "Buyer"}</b><i>₹</i><b>{primary ? "Company issuing new shares" : "Existing shareholder"}</b></div><p>{primary ? "The issuer receives the issue proceeds and new shares enter investors’ hands." : "The company does not receive the proceeds from this particular trade. Liquidity still helps its shares remain easier to own, value and use in future fundraising."}</p></div>;
  }

  if (lessonId === "FND-MKT-006") {
    const chain = ["Investor", "Broker", "NSE / BSE", "Clearing corporation", "Depository"];
    return <div className="lesson-sim mf-sim"><div className="mf-chain">{chain.map((item,i)=><button key={item} className={tab===i?"active":""} onClick={()=>setTab(i)}><i>{i+1}</i><b>{item}</b></button>)}</div><div className="mf-overseer"><span>SEBI · regulator and overseer</span></div><p>{["Starts an order through a registered broker.","Checks and routes the order.","Provides rules, matching, data and surveillance.","Manages clearing obligations and settlement risk.","Records securities held and transferred electronically."][tab]}</p></div>;
  }

  if (lessonId === "FND-MKT-007") {
    const weights=[50,30,20], vals=[a,b,c], bases=[50,55,40], setters=[setA,setB,setC];
    const move=vals.reduce((sum,v,i)=>sum+(v-bases[i])*weights[i]/100,0);
    return <div className="lesson-sim mf-sim mf-index"><div className="sim-caption"><b>SIMPLIFIED MARKET-CAP-WEIGHTED MODEL</b><span>{move>=0?"+":""}{move.toFixed(1)}%</span></div>{vals.map((value,i)=><label key={i}><span>Company {String.fromCharCode(65+i)}<small>{weights[i]}% weight</small></span><input aria-label={`Company ${String.fromCharCode(65+i)} price move`} type="range" min={bases[i]-20} max={bases[i]+20} value={value} onChange={e=>setters[i](Number(e.target.value))}/><b>{value-bases[i]>=0?"+":""}{value-bases[i]}%</b></label>)}<p>Real indices follow published rules. Some use free-float market capitalisation, some equal weights, and others different methods.</p></div>;
  }

  if (lessonId === "FND-MKT-008") {
    const publicShares=a;
    return <div className="lesson-sim mf-sim"><label className="mf-slider">Shares available to public investors <input aria-label="Percentage of shares available to public investors" type="range" min="10" max="90" value={publicShares} onChange={e=>setA(Number(e.target.value))}/><b>{publicShares}% free float</b></label><div className="mf-float"><i style={{width:`${100-publicShares}%`}}>Strategic / promoter</i><i className="free" style={{width:`${publicShares}%`}}>Free float</i></div><p>NIFTY 50 contains 50 eligible NSE companies, is periodically reviewed, and weights constituents by free-float market capitalisation—not by total company size or one vote each.</p></div>;
  }

  if (lessonId === "FND-MKT-009") {
    const nifty=tab===0;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={nifty?"active":""} onClick={()=>setTab(0)}>NIFTY 50</button><button className={!nifty?"active":""} onClick={()=>setTab(1)}>SENSEX</button></div><div className="mf-ledger"><b>{nifty?"NSE equity benchmark":"BSE equity benchmark"}</b><span>{nifty?"50 constituents":"30 constituents"}</span><span>Free-float market-cap weighted</span><span>Own published eligibility and review methodology</span></div><p>They often move similarly because large-company and sector exposure overlaps—not because either index is derived from the other.</p></div>;
  }

  if (lessonId === "FND-MKT-010") {
    const broad=tab===1;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={!broad?"active":""} onClick={()=>setTab(0)}>One-company event</button><button className={broad?"active":""} onClick={()=>setTab(1)}>Market-wide event</button></div><div className="mf-risk-bars">{[70,62,76,68,72].map((v,i)=><i key={i} style={{height:`${broad?v-35:i===2?20:v}%`}}><span>{String.fromCharCode(65+i)}</span></i>)}</div><p>{broad?"A systemic shock can pull many constituents down together, so the index can fall sharply.":"One constituent’s problem is diluted inside a diversified basket according to its weight."}</p><b className="mf-rule">Diversification reduces company-specific risk; it does not remove market risk.</b></div>;
  }

  if (lessonId === "FND-MKT-011" || lessonId === "FND-MKT-012") {
    const size=Math.max(50,Math.round(a/10)*50), asks=[[100.10,100],[100.20,300],[100.30,200]]; let left=size,cost=0,filled=0;
    for(const [price,qty] of asks){const take=Math.min(left,qty);cost+=take*price;filled+=take;left-=take;if(!left)break;}
    return <div className="lesson-sim mf-sim mf-book"><div><span>BIDS · WAITING BUY QTY</span>{[[99.90,120],[99.80,250],[99.70,400]].map(x=><b key={x[0]}>₹{x[0].toFixed(2)} <i>{x[1]}</i></b>)}</div><div><span>OFFERS · WAITING SELL QTY</span>{asks.map(x=><b key={x[0]}>₹{x[0].toFixed(2)} <i>{x[1]}</i></b>)}</div><label>Incoming market-buy quantity <input aria-label="Incoming market buy quantity" type="range" min="10" max="120" value={a} onChange={e=>setA(Number(e.target.value))}/><b>{size}</b></label><p>{left?`${filled} shares fill in the visible offers; ${left} wait for more liquidity.`:`The order lifts offers and fills ${filled} shares at an average ₹${(cost/filled).toFixed(2)}.`} Every executed share still has one buyer and one seller.</p></div>;
  }

  if (lessonId === "FND-MKT-014") {
    const institutional=tab===1;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={!institutional?"active":""} onClick={()=>setTab(0)}>Retail tendency</button><button className={institutional?"active":""} onClick={()=>setTab(1)}>Institutional tendency</button></div><div className="mf-ledger"><b>{institutional?"Organisation deploying substantial capital":"Individual deploying personal capital"}</b><span>{institutional?"Mandate, regulation and reporting constraints":"Flexible mandate and usually smaller orders"}</span><span>{institutional?"More research and execution resources":"Can enter or exit without much market impact"}</span><span>{institutional?"Capital may be pooled, beneficiary, corporate or proprietary":"Small size is a genuine execution advantage"}</span></div><p>These are tendencies, not rules. Neither label guarantees better information, discipline or results.</p></div>;
  }

  if (lessonId === "FND-MKT-015") {
    const trader=tab===1;
    return <div className="lesson-sim mf-sim"><div className="mf-tabs"><button className={!trader?"active":""} onClick={()=>setTab(0)}>Investor thesis</button><button className={trader?"active":""} onClick={()=>setTab(1)}>Trader setup</button></div><div className="mf-ledger"><b>{trader?"Return sought from a defined price move":"Return sought from long-term business economics"}</b><span>{trader?"Planned entry, invalidation and exit horizon":"Business quality, cash flows and valuation"}</span><span>{trader?"Turnover and transaction costs matter frequently":"Usually lower turnover, but price and risk still matter"}</span><span>Charts and fundamental information can inform either approach</span></div><p>Investor and trader are ends of a spectrum. The intention and process matter more than a single holding-period cut-off.</p></div>;
  }

  return null;
}
