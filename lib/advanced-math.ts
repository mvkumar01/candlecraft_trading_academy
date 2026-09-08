/** Teaching models, not quotes. European options, zero rates/dividends,
 * constant volatility and 365 calendar days. All values are per unit. */
const normalCDF = (x: number) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const tail = Math.exp(-x*x/2) / Math.sqrt(2*Math.PI) * t *
    (0.319381530 + t*(-0.356563782 + t*(1.781477937 + t*(-1.821255978 + t*1.330274429))));
  return x >= 0 ? 1-tail : tail;
};
export function optionModel(spot: number, strike: number, days: number, iv: number, put = false) {
  if (spot <= 0 || strike <= 0 || days <= 0 || iv <= 0) throw new RangeError("Model inputs must be positive");
  const time = days/365, sigma = iv/100, root = Math.sqrt(time);
  const d1 = (Math.log(spot/strike) + sigma*sigma*time/2)/(sigma*root), d2 = d1-sigma*root;
  const density = Math.exp(-d1*d1/2)/Math.sqrt(2*Math.PI);
  const call = spot*normalCDF(d1)-strike*normalCDF(d2);
  return {
    premium: put ? call-spot+strike : call,
    delta: normalCDF(d1)-(put?1:0),
    gamma: density/(spot*sigma*root),
    theta: -spot*density*sigma/(2*root*365),
    vega: spot*density*root/100,
  };
}
export type Structure = "bull" | "bear" | "condor" | "butterfly" | "straddle" | "strangle";
export type Leg = { kind: "call" | "put"; strike: number; quantity: number };
export const structures: Record<Structure, {label: string; debit: number; legs: Leg[]}> = {
  bull: {label:"Bull call spread",debit:120,legs:[{kind:"call",strike:25000,quantity:1},{kind:"call",strike:25400,quantity:-1}]},
  bear: {label:"Bear put spread",debit:130,legs:[{kind:"put",strike:25000,quantity:1},{kind:"put",strike:24600,quantity:-1}]},
  condor: {label:"Iron condor",debit:-180,legs:[{kind:"put",strike:24400,quantity:1},{kind:"put",strike:24800,quantity:-1},{kind:"call",strike:25200,quantity:-1},{kind:"call",strike:25600,quantity:1}]},
  butterfly: {label:"Long call butterfly",debit:110,legs:[{kind:"call",strike:24800,quantity:1},{kind:"call",strike:25000,quantity:-2},{kind:"call",strike:25200,quantity:1}]},
  straddle: {label:"Long straddle",debit:260,legs:[{kind:"call",strike:25000,quantity:1},{kind:"put",strike:25000,quantity:1}]},
  strangle: {label:"Long strangle",debit:160,legs:[{kind:"put",strike:24800,quantity:1},{kind:"call",strike:25200,quantity:1}]},
};
export function expiryProfit(structure: Structure, spot: number) {
  const {legs,debit} = structures[structure];
  return legs.reduce((sum,leg)=>sum + leg.quantity*Math.max(0,leg.kind==="call"?spot-leg.strike:leg.strike-spot),-debit);
}
export function futuresHedge(contracts: number, lot = 65) {
  return {delta:420-contracts*lot,gamma:-0.018,theta:860,vega:-125};
}
export function sampleMetrics(winPercent:number, averageWin:number, averageLoss:number, trades:number, drawdownRupees:number) {
  const expectancy = winPercent/100*averageWin-(1-winPercent/100)*averageLoss;
  return {expectancy,profitFactor:winPercent*averageWin/((100-winPercent)*averageLoss),recovery:expectancy*trades/drawdownRupees};
}
