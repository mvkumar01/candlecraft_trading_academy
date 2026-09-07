/** Small, deterministic calculations for labelled practice data, not market forecasts. */
export type PracticeBar = { open: number; high: number; low: number; close: number };

export function aggregateBars(bars: PracticeBar[], size: number): PracticeBar[] {
  if (!Number.isInteger(size) || size < 1) throw new RangeError("Bucket size must be a positive integer");
  const result: PracticeBar[] = [];
  for (let index = 0; index < bars.length; index += size) {
    const group = bars.slice(index, index + size);
    result.push({ open: group[0].open, high: Math.max(...group.map(bar => bar.high)), low: Math.min(...group.map(bar => bar.low)), close: group[group.length - 1].close });
  }
  return result;
}

export function trueRange(high: number, low: number, previousClose: number) {
  return Math.max(high - low, Math.abs(high - previousClose), Math.abs(low - previousClose));
}

export function movingAverage(prices: number[], periods: number, exponential = false): (number | null)[] {
  if (!Number.isInteger(periods) || periods < 1) throw new RangeError("Periods must be a positive integer");
  let previous = 0;
  return prices.map((price, index) => {
    if (index < periods - 1) return null;
    const simple = prices.slice(index - periods + 1, index + 1).reduce((sum, value) => sum + value, 0) / periods;
    previous = exponential && index >= periods ? price * (2 / (periods + 1)) + previous * (1 - 2 / (periods + 1)) : simple;
    return previous;
  });
}

export function fillAsks(quantity: number, asks: readonly (readonly [number, number])[]) {
  let remaining = quantity, cost = 0;
  const rows = asks.map(([price, available]) => {
    const take = Math.min(remaining, available);
    remaining -= take;
    cost += price * take;
    return { price, available, take };
  });
  const filled = quantity - remaining;
  return { rows, filled, remaining, average: filled ? cost / filled : null };
}
