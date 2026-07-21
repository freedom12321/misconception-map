import assert from "node:assert/strict";
import test from "node:test";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { demoAssignment, demoResponses } from "../lib/sampleData";

test("deterministic analyzer returns the expected misconception clusters", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  const clusters = new Map(result.misconceptions.map((item) => [item.id, item]));

  assert.deepEqual(clusters.get("add-across")?.studentIds, ["S02", "S08", "S15"]);
  assert.deepEqual(clusters.get("conversion-error")?.studentIds, ["S03", "S16", "S18"]);
  assert.deepEqual(clusters.get("component-confusion")?.studentIds, ["S05", "S09", "S10"]);
  assert.deepEqual(clusters.get("magnitude-confusion")?.studentIds, ["S06", "S12", "S13"]);
  assert.equal(result.overview.correctCount, 6);
  assert.equal(result.overview.totalResponses, 18);
});

test("every major demo cluster cites at least two original responses", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  for (const cluster of result.misconceptions) {
    assert.ok(cluster.evidenceQuotes.length >= 2);
    for (const evidence of cluster.evidenceQuotes) {
      assert.equal(
        demoResponses.find((item) => item.studentId === evidence.studentId)?.response,
        evidence.quote,
      );
    }
  }
});

