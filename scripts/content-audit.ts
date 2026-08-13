import { allLessons, course, labs, missingContent, type Lesson } from "../lib/curriculum.ts";

/** Strip a lesson's own title and module out of a string. Two lessons whose text collapses to
 *  the same skeleton are the same sentence with the nouns swapped — the templated-phrasing
 *  failure this audit exists to catch. */
const skeleton = (lesson: Lesson, text: string) =>
  text
    .replaceAll(lesson.title, "«T»").replaceAll(lesson.title.toLowerCase(), "«T»")
    .replaceAll(lesson.title.replace("?", ""), "«T»")
    .replaceAll(lesson.module, "«M»").replaceAll(lesson.module.toLowerCase(), "«M»");

const fields = ["plain", "detail", "example", "question", "takeaway", "correctFeedback", "incorrectFeedback"] as const;

const templated = fields.map((field) => {
  const counts = new Map<string, string[]>();
  for (const lesson of allLessons) {
    const key = skeleton(lesson, lesson.material[field]);
    counts.set(key, [...(counts.get(key) ?? []), lesson.id]);
  }
  const worst = [...counts.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  return { field, distinct: counts.size, largestGroup: worst[1].length, example: worst[1].slice(0, 3) };
});

const fnd = allLessons.filter((lesson) => lesson.levelCode === "FND");
const fndNifty = fnd.filter((lesson) => JSON.stringify(lesson.material).includes("NIFTY")).map((lesson) => lesson.id);
const fndPrediction = fnd.filter((lesson) => lesson.blocks.some((block) => block.type === "prediction")).map((lesson) => lesson.id);

const shapes = new Map<string, number>();
for (const lesson of allLessons) {
  const shape = lesson.blocks.map((block) => block.type).join(" → ");
  shapes.set(shape, (shapes.get(shape) ?? 0) + 1);
}

const byFlow = Object.fromEntries([...new Set(allLessons.map((l) => l.material.flow))].map((flow) => [flow, allLessons.filter((l) => l.material.flow === flow).length]));
const byInteraction = Object.fromEntries([...new Set(allLessons.map((l) => l.material.interaction))].map((kind) => [kind, allLessons.filter((l) => l.material.interaction === kind).length]));

// Structural checks on the authored data itself.
const badChoices = allLessons.filter((l) => l.material.choices.length < 3 || new Set(l.material.choices).size !== l.material.choices.length).map((l) => l.id);
const badCorrect = allLessons.filter((l) => l.material.correct < 0 || l.material.correct >= l.material.choices.length).map((l) => l.id);
const answerPositions = Object.fromEntries([0, 1, 2, 3].map((i) => [i, allLessons.filter((l) => l.material.correct === i).length]));
const missingSides = allLessons.filter((l) => l.material.flow === "compare" && !l.material.sides).map((l) => l.id);
const missingSteps = allLessons.filter((l) => l.material.flow === "sequence" && !l.material.steps).map((l) => l.id);

const practical = allLessons.filter((lesson) => lesson.track === "practical");
const crossModulePrereqs = allLessons.filter((lesson) => lesson.order === 1 && lesson.prerequisites.length);
const danglingPrereqs = allLessons.flatMap((lesson) => lesson.prerequisites.filter((id) => !allLessons.some((other) => other.id === id)).map((id) => `${lesson.id} → ${id}`));
const labsWithoutModule = labs.filter((lab) => !course.some((level) => level.modules.some((module) => module.lab === lab)));

const result = {
  total: allLessons.length,
  levels: Object.fromEntries(["FND", "APP", "PRO"].map((code) => [code, allLessons.filter((l) => l.levelCode === code).length])),
  missingContent,
  templated,
  blockShapes: Object.fromEntries(shapes),
  byFlow,
  byInteraction,
  fndNiftyMentions: fndNifty,
  fndPredictionBlocks: fndPrediction,
  answerPositions,
  badChoices,
  badCorrect,
  missingSides,
  missingSteps,
  practicalLessons: practical.length,
  practicalModules: course.flatMap((level) => level.modules).filter((module) => module.track === "practical").map((module) => `${module.code} (${module.lessons.length})`),
  crossModulePrereqs: crossModulePrereqs.map((lesson) => `${lesson.id} ← ${lesson.prerequisites.join(", ")}`),
  danglingPrereqs,
  labsWithoutModule,
  allDraft: allLessons.every((lesson) => lesson.status === "Draft"),
};

console.log(JSON.stringify(result, null, 2));

const failures: string[] = [];
if (allLessons.length !== 537) failures.push(`expected 537 lessons, found ${allLessons.length}`);
if (missingContent.length) failures.push(`${missingContent.length} lessons without authored content: ${missingContent.slice(0, 5).join(", ")}…`);
// No sentence skeleton may be shared by more than 3 lessons — beyond that it reads as generated.
for (const entry of templated) if (entry.largestGroup > 3) failures.push(`${entry.field}: ${entry.largestGroup} lessons share one phrasing skeleton (${entry.example.join(", ")})`);
// Beginner lessons must not lean on index examples or ask for predictions.
if (fndNifty.length > 3) failures.push(`${fndNifty.length} Foundations lessons mention NIFTY (allowed: the index lessons only)`);
if (fndPrediction.length) failures.push(`${fndPrediction.length} Foundations lessons contain a prediction block`);
// A curriculum where every lesson has the same shape is one lesson repeated.
if (shapes.size < 6) failures.push(`only ${shapes.size} distinct block sequences across the course`);
if (badChoices.length) failures.push(`malformed choices: ${badChoices.join(", ")}`);
// A prerequisite pointing at a lesson that does not exist would silently lock a module forever.
if (danglingPrereqs.length) failures.push(`prerequisites referencing unknown lessons: ${danglingPrereqs.join(", ")}`);
// Practical labs must be reachable from the module that teaches them. (Three older labs —
// Position Sizing, Delta, Overfitting — are reachable only from the Labs page; left as found.)
const practicalLabs = ["Horizon Lab", "Screener Lab", "Swing Setup Lab", "Market Replay Lab", "Stock Selection Lab", "Trade Workflow Lab"];
const orphanedPracticalLabs = practicalLabs.filter((lab) => labsWithoutModule.includes(lab));
if (orphanedPracticalLabs.length) failures.push(`practical labs not attached to a module: ${orphanedPracticalLabs.join(", ")}`);
if (!allLessons.every((lesson) => lesson.status === "Draft")) failures.push("some lessons are not marked Draft");
if (badCorrect.length) failures.push(`correct index out of range: ${badCorrect.join(", ")}`);
if (missingSides.length) failures.push(`compare-flow lessons without a comparison table: ${missingSides.join(", ")}`);
if (missingSteps.length) failures.push(`sequence-flow lessons without steps: ${missingSteps.join(", ")}`);
// If one slot holds most of the answers, the quiz can be passed without reading it.
for (const [slot, count] of Object.entries(answerPositions)) if (count / allLessons.length > 0.45) failures.push(`${count} of ${allLessons.length} correct answers sit in slot ${slot}`);

if (failures.length) {
  console.error("\nCONTENT AUDIT FAILED:");
  for (const failure of failures) console.error(`  · ${failure}`);
  process.exitCode = 1;
} else {
  console.error("\nContent audit passed.");
}
