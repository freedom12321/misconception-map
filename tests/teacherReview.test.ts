import assert from "node:assert/strict";
import test from "node:test";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { demoAssignment, demoResponses } from "../lib/sampleData";
import { reassignStudent, TEACHER_REVIEW } from "../lib/teacherReview";

const reference = createMockAnalysis(demoAssignment, demoResponses);

test("teacher reassignment recalculates clusters, percentages, and small groups locally", () => {
  const reviewed = reassignStudent(reference, reference, "S02", "conversion-error");
  const addAcross = reviewed.misconceptions.find((item) => item.id === "add-across");
  const conversion = reviewed.misconceptions.find((item) => item.id === "conversion-error");

  assert.deepEqual(addAcross?.studentIds, ["S08", "S15"]);
  assert.deepEqual(conversion?.studentIds, ["S02", "S03", "S16", "S18"]);
  assert.equal(addAcross?.percentOfClass, 11.1);
  assert.equal(conversion?.percentOfClass, 22.2);
  assert.equal(reviewed.students.find((item) => item.studentId === "S02")?.misconceptionId, "conversion-error");

  const groupsWithStudent = reviewed.reteachingPlan.smallGroups.filter((group) =>
    group.studentIds.includes("S02"),
  );
  assert.equal(groupsWithStudent.length, 1);
  assert.equal(groupsWithStudent[0].studentIds.includes("S03"), true);
});

test("Needs teacher review removes stale cluster and small-group membership", () => {
  const reviewed = reassignStudent(reference, reference, "S02", TEACHER_REVIEW);
  const student = reviewed.students.find((item) => item.studentId === "S02");
  const validStudentIds = new Set(reviewed.students.map((item) => item.studentId));
  const allGroupIds = reviewed.reteachingPlan.smallGroups.flatMap((group) => group.studentIds);

  assert.equal(student?.status, "unclear");
  assert.equal(student?.misconceptionId, null);
  assert.equal(reviewed.overview.unclearCount, reference.overview.unclearCount + 1);
  assert.equal(reviewed.misconceptions.some((item) => item.studentIds.includes("S02")), false);
  assert.equal(allGroupIds.filter((id) => id === "S02").length, 1);
  assert.equal(
    reviewed.reteachingPlan.smallGroups.some(
      (group) => group.groupName === "Needs teacher review" && group.studentIds.includes("S02") && group.studentIds.includes("S13"),
    ),
    true,
  );
  assert.equal(allGroupIds.every((id) => validStudentIds.has(id)), true);
  assert.equal(new Set(allGroupIds).size, allGroupIds.length);
});
