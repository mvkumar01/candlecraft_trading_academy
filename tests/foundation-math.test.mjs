import assert from "node:assert/strict";
import test from "node:test";
import { aggregateBars, fillAsks, movingAverage, trueRange } from "../lib/foundation-math.ts";

test("larger candles keep the first open, all extremes and final close", () => {
  const bars = [{ open: 100, high: 105, low: 98, close: 103 }, { open: 103, high: 108, low: 102, close: 106 }, { open: 106, high: 107, low: 99, close: 101 }];
  assert.deepEqual(aggregateBars(bars, 3), [{ open: 100, high: 108, low: 98, close: 101 }]);
  assert.deepEqual(aggregateBars(bars, 1), bars);
  assert.equal(aggregateBars(bars, 2)[1].close, 101);
  assert.throws(() => aggregateBars(bars, 0), RangeError);
});

test("true range includes gaps in either direction", () => {
  assert.equal(trueRange(108, 104, 100), 8);
  assert.equal(trueRange(108, 104, 112), 8);
  assert.equal(trueRange(108, 104, 106), 4);
});

test("market fills preserve paise and partial fills preserve unfilled quantity", () => {
  const fill = fillAsks(300, [[100.10, 100], [100.20, 300], [100.30, 200]]);
  assert.equal(fill.filled, 300);
  assert.equal(fill.remaining, 0);
  assert.ok(Math.abs(fill.average - 100.1666666667) < 0.000001);
  const partial = fillAsks(300, [[100.10, 180]]);
  assert.equal(partial.filled, 180);
  assert.equal(partial.remaining, 120);
  // Actual execution prices already incorporate the spread and price impact.
  assert.ok(Math.abs((101.10 - fill.average) * fill.filled - 40 - 240) < 0.000001);
});

test("SMA and seeded EMA are distinct series, not a fixed line", () => {
  const prices = [100, 100, 100, 110, 110];
  assert.deepEqual(movingAverage(prices, 3), [null, null, 100, 310 / 3, 320 / 3]);
  assert.deepEqual(movingAverage(prices, 3, true), [null, null, 100, 105, 107.5]);
});
