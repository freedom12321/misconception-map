import assert from "node:assert/strict";
import test from "node:test";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { AnalysisResultSchema } from "../lib/schema";
import { demoAssignment, demoResponses } from "../lib/sampleData";

test("validates a complete analysis result", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  assert.equal(AnalysisResultSchema.safeParse(result).success, true);
});

test("rejects confidence outside the allowed range", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  const invalid = structuredClone(result);
  invalid.misconceptions[0].confidence = 1.2;
  assert.equal(AnalysisResultSchema.safeParse(invalid).success, false);
});

