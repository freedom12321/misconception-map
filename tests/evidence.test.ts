import assert from "node:assert/strict";
import test from "node:test";
import { verifyAnalysisEvidence } from "../lib/evidence";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { demoAssignment, demoResponses } from "../lib/sampleData";

test("keeps quotes that are exact substrings of the original response", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  const verified = verifyAnalysisEvidence(result, demoResponses);

  assert.equal(verified.verification.verified, true);
  assert.ok(verified.verification.checkedQuotes > 0);
  assert.equal(verified.verification.removedQuotes, 0);
  for (const cluster of verified.result.misconceptions) {
    for (const evidence of cluster.evidenceQuotes) {
      const original = demoResponses.find((item) => item.studentId === evidence.studentId);
      assert.equal(original?.response.includes(evidence.quote), true);
    }
  }
});

test("removes fabricated evidence and never marks that verification as passed", () => {
  const result = createMockAnalysis(demoAssignment, demoResponses);
  result.misconceptions[0].evidenceQuotes.push({
    studentId: "S02",
    quote: "This sentence was never submitted.",
  });
  result.students[0].response = "A model-altered response.";

  const verified = verifyAnalysisEvidence(result, demoResponses);

  assert.equal(verified.verification.verified, false);
  assert.equal(verified.verification.removedQuotes, 1);
  assert.equal(
    verified.result.misconceptions[0].evidenceQuotes.some(
      (item) => item.quote === "This sentence was never submitted.",
    ),
    false,
  );
  assert.equal(verified.result.students[0].response, demoResponses[0].response);
});
