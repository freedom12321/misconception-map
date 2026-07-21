import type { AnalysisResult, StudentResponse } from "./schema";

export type EvidenceVerification = {
  verified: boolean;
  checkedQuotes: number;
  removedQuotes: number;
};

export function verifyAnalysisEvidence(
  result: AnalysisResult,
  originalResponses: StudentResponse[],
): { result: AnalysisResult; verification: EvidenceVerification } {
  const originals = new Map(
    originalResponses.map((item) => [item.studentId, item.response]),
  );
  let checkedQuotes = 0;
  let removedQuotes = 0;

  const misconceptions = result.misconceptions.map((misconception) => ({
    ...misconception,
    evidenceQuotes: misconception.evidenceQuotes.filter((evidence) => {
      checkedQuotes += 1;
      const original = originals.get(evidence.studentId);
      const isExactSubstring = Boolean(
        original && evidence.quote && original.includes(evidence.quote),
      );
      if (!isExactSubstring) removedQuotes += 1;
      return isExactSubstring;
    }),
  }));

  const students = result.students.map((student) => ({
    ...student,
    response: originals.get(student.studentId) ?? student.response,
  }));

  return {
    result: { ...result, misconceptions, students },
    verification: {
      verified: checkedQuotes > 0 && removedQuotes === 0,
      checkedQuotes,
      removedQuotes,
    },
  };
}
