import { allLessons } from "../lib/curriculum.ts";

const fields = ["hook", "explanation", "example", "question", "takeaway"] as const;
const duplicates = Object.fromEntries(fields.map((field) => {
  const counts = new Map<string, number>();
  for (const lesson of allLessons) counts.set(lesson.material[field], (counts.get(lesson.material[field]) ?? 0) + 1);
  return [field, [...counts.values()].filter((count) => count > 1).length];
}));

const levels = Object.fromEntries(["FND", "APP", "PRO"].map((code) => [code, allLessons.filter((lesson) => lesson.levelCode === code).length]));
const interactions = Object.fromEntries([...new Set(allLessons.map((lesson) => lesson.material.interaction))].map((kind) => [kind, allLessons.filter((lesson) => lesson.material.interaction === kind).length]));
const requiredIds = ["FND-MKT-008", "FND-WORK-004", "FND-WORK-005", "FND-WORK-006", "FND-CHART-004", "FND-IND-006", "APP-GRK-001", "APP-OI-001", "FND-RISK-007", "PRO-BT-014"];
const required = requiredIds.map((id) => {
  const lesson = allLessons.find((item) => item.id === id);
  return { id, title: lesson?.title, interaction: lesson?.material.interaction, question: lesson?.material.question };
});

const result = { total: allLessons.length, levels, duplicates, interactions, required };
console.log(JSON.stringify(result, null, 2));
if (allLessons.length !== 376 || Object.values(duplicates).some((count) => count > 0) || required.some((lesson) => !lesson.title)) process.exitCode = 1;
