import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { allLessons } from "../lib/curriculum.ts";

// Transpile the actual client components for an initial-state render, without
// creating generated source files or adding a second build configuration.
const cache = new Map();
function loadSource(filename) {
  if (cache.has(filename)) return cache.get(filename).exports;
  const loadedModule = { exports: {} };
  cache.set(filename, loadedModule);
  const nativeRequire = createRequire(filename);
  const requireSource = (specifier) => {
    if (!specifier.startsWith(".")) return nativeRequire(specifier);
    const target = resolve(dirname(filename), specifier);
    const found = extname(target) ? target : [target + ".tsx", target + ".ts", target + ".js"].find(existsSync);
    if (!found) throw new Error(`Cannot resolve ${specifier} from ${filename}`);
    return loadSource(found);
  };
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } });
  new Function("require", "module", "exports", compiled.outputText)(requireSource, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const root = fileURLToPath(new URL("../", import.meta.url));
const { FoundationVisual } = loadSource(resolve(root, "app/foundation-visuals.tsx"));
const { MarketFoundationsVisual } = loadSource(resolve(root, "app/market-foundations.tsx"));
const { TradingWorksVisual } = loadSource(resolve(root, "app/trading-works.tsx"));
const { CandlePatternSim } = loadSource(resolve(root, "app/practice.tsx"));

test("all 138 Level 1 lesson visual initial states render with valid controls", () => {
  const lessons = allLessons.filter(lesson => lesson.levelCode === "FND");
  assert.equal(lessons.length, 138);
  for (const lesson of lessons) {
    const Component = lesson.moduleCode === "MKT" ? MarketFoundationsVisual : lesson.moduleCode === "WORK" ? TradingWorksVisual : lesson.moduleCode === "CANDLE" ? CandlePatternSim : FoundationVisual;
    const html = renderToStaticMarkup(React.createElement(Component, { lessonId: lesson.id, moduleCode: lesson.moduleCode }));
    assert.ok(html.length > 300, `${lesson.id}: visual must not be empty`);
    assert.doesNotMatch(html, /NaN|undefined|Infinity/, `${lesson.id}: invalid displayed result`);
    for (const input of html.matchAll(/<input\b[^>]*type="range"[^>]*>/g)) {
      const attribute = name => Number(input[0].match(new RegExp(`${name}="([^"]+)"`))?.[1]);
      assert.ok(attribute("value") >= attribute("min") && attribute("value") <= attribute("max"), `${lesson.id}: slider starts within its stated bounds`);
      assert.match(input[0], /aria-label=/, `${lesson.id}: slider has an accessible name`);
    }
  }
});
