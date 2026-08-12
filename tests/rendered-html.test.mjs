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

const contentFiles = () => Promise.all(["foundations", "applied", "professional"].map((name) =>
  readFile(new URL(`../lib/content/${name}.ts`, import.meta.url), "utf8")));

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
  const [page, ...content] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    ...["foundations", "applied", "professional"].map((name) => readFile(new URL(`../lib/content/${name}.ts`, import.meta.url), "utf8")),
  ]);
  for (const interaction of ["index-sim", "book-sim", "candle-sim", "rsi-sim", "contract-sim", "delta-sim", "expectancy-sim", "overfit-sim", "terms-sim", "sides-sim", "steps-sim"]) {
    assert.match(page, new RegExp(interaction));
  }
  const authored = content.join("\n");
  for (const lessonId of ["FND-MKT-008", "FND-WORK-006", "FND-CHART-004", "FND-IND-006", "FND-RISK-007", "APP-GRK-001", "APP-OI-001", "PRO-BT-014"]) {
    assert.match(authored, new RegExp(lessonId));
  }
  assert.match(authored, /Dataset A/);
  assert.match(authored, /unseen Dataset B/);
});

test("every lesson opens on its own plain-language explanation", async () => {
  const authored = (await contentFiles()).join("\n");
  const plains = [...authored.matchAll(/^\s{4}plain: "((?:[^"\\]|\\.)*)"/gm)].map((match) => match[1]);
  assert.equal(plains.length, 376, "every lesson must author a plain-language opener");
  assert.equal(new Set(plains).size, 376, "no two lessons may share an opener");
  // The opener is what a beginner reads first, so it must be one short sentence in plain words.
  for (const plain of plains) assert.ok(plain.length <= 190, `opener too long to be the simplest statement: ${plain}`);
});

test("beginner lessons do not lean on index examples or ask for predictions", async () => {
  const [foundations] = await contentFiles();
  const niftyMentions = foundations.match(/NIFTY/g) ?? [];
  // Only the two index lessons (NIFTY 50, SENSEX) may name the index at Foundations level.
  assert.ok(niftyMentions.length <= 8, `Foundations mentions NIFTY ${niftyMentions.length} times`);
  assert.doesNotMatch(foundations, /flow: "judge"/, "Foundations must not use the prediction-based judge flow");
});
