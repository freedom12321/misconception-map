import assert from "node:assert/strict";
import test from "node:test";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { AnalysisResultSchema, AnalyzeRequestSchema } from "../lib/schema";
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

test("limits live analysis requests to 60 concise responses", () => {
  const tooMany = Array.from({ length: 61 }, (_, index) => ({
    studentId: `S${index + 1}`,
    response: "A short explanation.",
  }));
  assert.equal(
    AnalyzeRequestSchema.safeParse({ assignment: demoAssignment, responses: tooMany }).success,
    false,
  );
  assert.equal(
    AnalyzeRequestSchema.safeParse({
      assignment: demoAssignment,
      responses: [{ studentId: "S01", response: "x".repeat(3_001) }],
    }).success,
    false,
  );
});
