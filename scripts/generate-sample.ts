import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { demoAssignment, demoResponses } from "../lib/sampleData";

const outputPath = resolve("sample-data/fractions-analysis.json");
await writeFile(
  outputPath,
  `${JSON.stringify(createMockAnalysis(demoAssignment, demoResponses), null, 2)}\n`,
  "utf8",
);

