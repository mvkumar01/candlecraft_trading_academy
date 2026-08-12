import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the Trading Academy application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Trading Academy/);
  assert.match(html, /Build skill/);
  assert.match(html, /Protect capital/);
  assert.doesNotMatch(html, /Content Review/);
  assert.match(html, /Development Mode/);
  assert.match(html, /107/);
  assert.match(html, /Risk Simulator/);
});

test("ships dedicated interactive lesson content", async () => {
  const [page, curriculum] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/curriculum.ts", import.meta.url), "utf8"),
  ]);
  for (const interaction of ["index-sim", "book-sim", "candle-sim", "rsi-sim", "contract-sim", "delta-sim", "expectancy-sim", "overfit-sim"]) {
    assert.match(page, new RegExp(interaction));
  }
  for (const lessonId of ["FND-MKT-008", "FND-WORK-006", "FND-CHART-004", "FND-IND-006", "FND-RISK-007", "APP-GRK-001", "APP-OI-001", "PRO-BT-014"]) {
    assert.match(curriculum, new RegExp(lessonId));
  }
  assert.match(curriculum, /Dataset A/);
  assert.match(curriculum, /unseen Dataset B/);
});
