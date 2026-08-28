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

const contentNames = ["foundations", "applied", "professional", "horizons", "screening", "swing", "intraday", "positional", "workflow", "candles", "patterns"];

const contentFiles = () => Promise.all(contentNames.map((name) =>
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
  // The mode switch ships in the shell; Content Review stays hidden until Review mode is chosen.
  assert.match(html, /User/);
  assert.match(html, /Lessons unlock in order/);
  assert.match(html, /138/);
  assert.match(html, /Risk Simulator/);
});

test("ships dedicated interactive lesson content", async () => {
  const [page, ...content] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    ...contentNames.map((name) => readFile(new URL(`../lib/content/${name}.ts`, import.meta.url), "utf8")),
  ]);
  for (const interaction of ["index-sim", "book-sim", "candle-sim", "rsi-sim", "contract-sim", "delta-sim", "expectancy-sim", "overfit-sim", "terms-sim", "sides-sim", "steps-sim"]) {
    assert.match(page, new RegExp(interaction));
  }
  for (const component of ["HorizonSim", "ScreenerSim", "RankingSim", "ReplaySim", "SwingSim", "WorkflowSim", "practicalLabs"]) {
    assert.match(page, new RegExp(component));
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
  assert.equal(plains.length, 575, "every lesson must author a plain-language opener");
  assert.equal(new Set(plains).size, 575, "no two lessons may share an opener");
  // The opener is what a beginner reads first, so it must be one short sentence in plain words.
  for (const plain of plains) assert.ok(plain.length <= 190, `opener too long to be the simplest statement: ${plain}`);
});

test("beginner lessons do not lean on index examples or ask for predictions", async () => {
  const [foundations] = await contentFiles();
  const niftyMentions = foundations.match(/NIFTY/g) ?? [];
  // Only the two index lessons (NIFTY 50, SENSEX) may name the index at Foundations level.
  assert.ok(niftyMentions.length <= 12, `Foundations mentions NIFTY ${niftyMentions.length} times`);
  assert.doesNotMatch(foundations, /flow: "judge"/, "Foundations must not use the prediction-based judge flow");
});

test("the practical modules are wired end to end", async () => {
  const [practice, curriculum, ...content] = await Promise.all([
    readFile(new URL("../app/practice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/curriculum.ts", import.meta.url), "utf8"),
    ...contentNames.map((name) => readFile(new URL(`../lib/content/${name}.ts`, import.meta.url), "utf8")),
  ]);
  // Every new lab has both a curriculum entry and a component behind it.
  for (const lab of ["Horizon Lab", "Screener Lab", "Swing Setup Lab", "Market Replay Lab", "Stock Selection Lab", "Trade Workflow Lab", "Pattern Lab"]) {
    assert.match(curriculum, new RegExp(lab), `${lab} missing from curriculum`);
    assert.match(practice, new RegExp(lab), `${lab} has no component`);
  }
  // The first and last lesson of each new module exists.
  const authored = content.join("\n");
  for (const id of ["FND-HZN-001", "FND-HZN-009", "FND-PICK-001", "FND-PICK-008", "APP-SCR-001", "APP-SCR-020",
    "APP-SWG-001", "APP-SWG-026", "APP-DAY-001", "APP-DAY-032", "APP-PSN-001", "APP-PSN-029",
    "APP-FIND-001", "APP-FIND-013", "PRO-SSCR-001", "PRO-SSCR-012", "PRO-PORT-001", "PRO-PORT-012"]) {
    assert.match(authored, new RegExp(id), `${id} has no authored content`);
  }
});

test("charts render as candles from real NIFTY data", async () => {
  const [chart, page, practice, nifty] = await Promise.all([
    readFile(new URL("../app/chart.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/practice.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/nifty-data.ts", import.meta.url), "utf8"),
  ]);
  // The bar-height renderer is gone from markup and styles alike.
  assert.doesNotMatch(page, /MiniMarket/, "MiniMarket must not come back");
  assert.doesNotMatch(practice, /MiniMarket/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /mini-market/, "dead .mini-market rules must not linger");
  // Candles must not be stretched out of shape by the viewBox.
  assert.doesNotMatch(chart, /<svg[^>]*preserveAspectRatio="none"/, "the svg must keep its aspect ratio");
  // A chart without numbers cannot be reasoned about.
  assert.match(chart, /niceStep/, "price gridlines must be computed");
  assert.match(chart, /fmtTime/, "time or date labels must be rendered");
  // The data is real NIFTY, and says so.
  assert.match(nifty, /Real NIFTY market data, not synthetic/);
  assert.match(nifty, /export const niftyPatterns/);
  assert.match(nifty, /export const niftyStructure/);
  assert.match(nifty, /export const niftySession/);
  assert.match(practice, /NIFTY · hourly/, "candlestick lessons must cite the real instance");
});

test("practical company data is fictional and labelled", async () => {
  const [data, practice] = await Promise.all([
    readFile(new URL("../lib/market-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/practice.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(data, /Every company here is fictional/);
  // The learner must be told the universe is synthetic wherever the data is shown.
  assert.match(practice, /Fictional companies, synthetic data/);
  assert.match(practice, /synthetic/i);
});

test("Review mode unlocks every lesson and User mode does not", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  // Both modes exist and are persisted.
  assert.match(page, /type Mode = "user" \| "review"/);
  assert.match(page, /mode: Mode/);
  // Sessions saved under the old devMode flag keep their setting.
  assert.match(page, /parsed\.devMode \? "review" : "user"/);
  // Every gate reads the derived review flag rather than a separate switch.
  assert.match(page, /function levelUnlocked\(level: CourseLevel, completed: Set<string>, review: boolean\) \{ return review \|\|/);
  assert.match(page, /review \|\| lessonIndex === 0/);
  assert.match(page, /\(!review && !priorComplete\)/);
  // Content Review is reachable only in Review mode.
  assert.match(page, /\{review && <button className=\{`review-entry/);
  // Dropping back to User mode cannot strand you somewhere User mode can't reach.
  assert.match(page, /if\(page==="content"\) setPage\("home"\)/);
  assert.match(page, /!lessonUnlocked\(lesson,new Set\(state\.completed\)\)/);
});

test("Financial Markets module is scoped, applied and position-balanced", async () => {
  const [foundations, visual, page, css] = await Promise.all([
    readFile(new URL("../lib/content/foundations.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/market-foundations.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const moduleText = foundations.split("// ── Financial Markets")[1].split("// ── How Trading Works")[0];
  const ids = [...moduleText.matchAll(/"(FND-MKT-\d{3})":/g)].map(match => match[1]);
  assert.deepEqual(ids, Array.from({ length: 15 }, (_, index) => `FND-MKT-${String(index + 1).padStart(3, "0")}`));
  assert.equal((moduleText.match(/interaction: "market_foundations"/g) ?? []).length, 15);
  for (const phrase of ["capital formation, liquidity, price discovery and risk transfer", "free-float market capitalisation", "Diversification reduces company-specific risk; it does not remove market risk", "executed buy quantity equals executed sell quantity", "price-time priority"])
    assert.match(moduleText, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  for (const stale of ["company gets nothing", "never more buyers than sellers", "Nobody calculates it", "required to stay invested", "works the same way as any index"])
    assert.doesNotMatch(moduleText, new RegExp(stale, "i"));
  const positions = [...moduleText.matchAll(/correct: (\d),/g)].map(match => Number(match[1]));
  assert.equal(positions.length, 15);
  assert.equal(new Set(positions).size, 4, "all four answer positions should be used");
  for (const id of ids) assert.match(visual, new RegExp(id));
  assert.match(page, /MarketFoundationsVisual/);
  for (const asset of ["Shares", "Bonds", "Currencies", "Commodities", "Derivatives"]) assert.match(visual, new RegExp(`label: "${asset}"`));
  assert.match(visual, /role="tablist" aria-label="Financial asset types"/);
  assert.match(visual, /role="tabpanel"/);
  assert.doesNotMatch(visual, /mf-chip/, "static chips must not look like interactive controls");
  assert.match(visual, /aria-label="Incoming market buy quantity"/);
  assert.match(visual, /aria-label="Percentage of shares available to public investors"/);
  assert.match(css, /\.mf-flow>div b[^}]*font-size:10px/, "ecosystem headings need an explicit compact size");
  assert.match(css, /\.mf-flow>div span[^}]*font-size:9px/, "ecosystem descriptions need an explicit readable size");
  assert.match(css, /\.mf-asset-panel b\{[^}]*font-size:8px/, "asset labels must not fall back to browser-default text size");
});

test("Financial Markets order-book scenarios reset and stay isolated", async () => {
  const [visual, page] = await Promise.all([
    readFile(new URL("../app/market-foundations.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);
  // A lesson-keyed visual remount gives every lesson an independent state container.
  assert.match(page, /MarketFoundationsVisual key=\{lesson\.id\}/);
  assert.match(visual, /const discovery=lessonId === "FND-MKT-012"/);
  assert.match(visual, /const maxQuantity=discovery\?100:120/);
  assert.match(visual, /const asks=\[\[100\.10,100\],\[100\.20,300\],\[100\.30,200\]\]/);
  assert.match(visual, /best ask ₹100\.10; latest execution is/);
  assert.doesNotMatch(visual, /250 shares filled|100\.16/);
});
