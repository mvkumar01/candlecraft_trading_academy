import assert from 'node:assert/strict';
import test from 'node:test';
import { optionModel, expiryProfit, futuresHedge, sampleMetrics } from '../lib/advanced-math.ts';

test('option model obeys parity and local Greek differences',()=>{
  for(const spot of [24400,25000,25600])for(const days of [1,21,45])for(const iv of [10,18,35]){
    const call=optionModel(spot,25000,days,iv),put=optionModel(spot,25000,days,iv,true);
    assert.ok(Math.abs(call.premium-put.premium-(spot-25000))<1e-7);
    assert.ok(call.premium>=Math.max(0,spot-25000)-.01);
    assert.ok(put.delta<0&&call.delta>0&&call.gamma>=0&&call.vega>=0);
    const finiteDelta=(optionModel(spot+.1,25000,days,iv).premium-optionModel(spot-.1,25000,days,iv).premium)/.2;
    assert.ok(Math.abs(finiteDelta-call.delta)<.001);
  }
});
test('named structures derive bounded expiry profit from explicit legs',()=>{
  assert.equal(expiryProfit('bull',25000),-120);
  assert.equal(expiryProfit('bull',25400),280);
  assert.equal(expiryProfit('bear',24600),270);
  assert.equal(expiryProfit('condor',25000),180);
  assert.equal(expiryProfit('condor',24000),-220);
  assert.equal(expiryProfit('butterfly',25000),90);
  assert.equal(expiryProfit('butterfly',25200),-110);
  assert.equal(expiryProfit('straddle',25000),-260);
  assert.equal(expiryProfit('strangle',25000),-160);
  assert.equal(expiryProfit('strangle',25360),0);
});
test('linear futures hedge changes only Delta',()=>{
  const base=futuresHedge(0);
  for(let n=-8;n<=8;n++){
    const h=futuresHedge(n);
    assert.equal(h.delta,420-n*65);
    for(const greek of ['gamma','theta','vega'])assert.equal(h[greek],base[greek]);
  }
});
test('recovery uses rupees and preserves negative profit',()=>{
  const m=sampleMetrics(50,2000,1000,60,8000);
  assert.equal(m.expectancy,500);assert.equal(m.recovery,3.75);assert.equal(m.profitFactor,2);
  assert.ok(sampleMetrics(20,1000,2000,60,8000).recovery<0);
});
