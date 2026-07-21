import type { AnalysisResult } from "./schema";

export const TEACHER_REVIEW = "teacher-review";
export const SECURE_REASONING = "secure";

export function studentPlacement(
  student: AnalysisResult["students"][number],
): string {
  if (student.misconceptionId) return student.misconceptionId;
  if (student.status === "unclear") return TEACHER_REVIEW;
  return SECURE_REASONING;
}

function groupForPlacement(
  placement: string,
  result: AnalysisResult,
): AnalysisResult["reteachingPlan"]["smallGroups"][number] {
  if (placement === TEACHER_REVIEW) {
    return {
      groupName: "Needs teacher review",
      studentIds: [],
      focus: "Gather more evidence through a brief student conference.",
      activity: "Ask the student to explain one example with a visual model before assigning a pattern.",
    };
  }
  if (placement === SECURE_REASONING) {
    return {
      groupName: "Secure reasoning · extension",
      studentIds: [],
      focus: "Extend secure reasoning without turning accuracy into a fixed label.",
      activity: "Create and justify a new example that would reveal the target concept.",
    };
  }
  const misconception = result.misconceptions.find((item) => item.id === placement);
  return {
    groupName: `${misconception?.shortLabel ?? "Teacher-selected"} group`,
    studentIds: [],
    focus: misconception?.description ?? "Review the teacher-selected reasoning pattern.",
    activity: misconception?.teacherMove ?? "Use a visual model and ask the student to explain each step.",
  };
}

function rebuildSmallGroups(
  result: AnalysisResult,
  referenceResult: AnalysisResult,
): AnalysisResult["reteachingPlan"]["smallGroups"] {
  const referenceStudents = new Map(
    referenceResult.students.map((student) => [student.studentId, student]),
  );
  const groupNameByPlacement = new Map<string, string>();
  const groupTemplates = new Map(
    referenceResult.reteachingPlan.smallGroups.map((group) => [
      group.groupName,
      { ...group, studentIds: [] as string[] },
    ]),
  );

  for (const group of referenceResult.reteachingPlan.smallGroups) {
    for (const studentId of group.studentIds) {
      const student = referenceStudents.get(studentId);
      if (student) groupNameByPlacement.set(studentPlacement(student), group.groupName);
    }
  }

  const groupsByName = new Map<string, AnalysisResult["reteachingPlan"]["smallGroups"][number]>();
  for (const student of result.students) {
    const placement = studentPlacement(student);
    const preferredName = placement === TEACHER_REVIEW
      ? undefined
      : groupNameByPlacement.get(placement);
    const template = preferredName ? groupTemplates.get(preferredName) : undefined;
    const fallback = groupForPlacement(placement, result);
    const groupName = template?.groupName ?? fallback.groupName;
    const group = groupsByName.get(groupName) ?? { ...(template ?? fallback), studentIds: [] };
    if (!group.studentIds.includes(student.studentId)) group.studentIds.push(student.studentId);
    groupsByName.set(groupName, group);
  }

  const referenceOrder = referenceResult.reteachingPlan.smallGroups.map((group) => group.groupName);
  return [...groupsByName.values()].sort((a, b) => {
    const aIndex = referenceOrder.indexOf(a.groupName);
    const bIndex = referenceOrder.indexOf(b.groupName);
    return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
      (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex);
  });
}

export function reassignStudent(
  result: AnalysisResult,
  referenceResult: AnalysisResult,
  studentId: string,
  placement: string,
): AnalysisResult {
  const students = result.students.map((student) => {
    if (student.studentId !== studentId) return student;
    if (placement === TEACHER_REVIEW) {
      return { ...student, status: "unclear" as const, misconceptionId: null };
    }
    if (placement === SECURE_REASONING) {
      return { ...student, status: "near_correct" as const, misconceptionId: null };
    }
    return { ...student, status: "misconception" as const, misconceptionId: placement };
  });
  const totalResponses = students.length;
  const misconceptions = result.misconceptions.map((misconception) => {
    const studentIds = students
      .filter((student) => student.misconceptionId === misconception.id)
      .map((student) => student.studentId);
    return {
      ...misconception,
      studentIds,
      percentOfClass: totalResponses
        ? Number(((studentIds.length / totalResponses) * 100).toFixed(1))
        : 0,
      evidenceQuotes: misconception.evidenceQuotes.filter((evidence) =>
        studentIds.includes(evidence.studentId),
      ),
    };
  });
  const topMisconception = [...misconceptions]
    .filter((item) => item.studentIds.length > 0)
    .sort((a, b) => b.studentIds.length - a.studentIds.length)[0];
  const overview = {
    ...result.overview,
    totalResponses,
    correctCount: students.filter((student) => student.status === "correct").length,
    nearCorrectCount: students.filter((student) => student.status === "near_correct").length,
    misconceptionCount: students.filter((student) => student.status === "misconception").length,
    unclearCount: students.filter((student) => student.status === "unclear").length,
    topMisconceptionId: topMisconception?.id ?? null,
    oneSentenceSummary: topMisconception
      ? `Teacher-reviewed map: ${topMisconception.studentIds.length} students are currently grouped around ${topMisconception.shortLabel.toLowerCase()}.`
      : "Teacher-reviewed map: no shared misconception cluster currently needs priority reteaching.",
  };
  const nextResult: AnalysisResult = { ...result, students, misconceptions, overview };

  return {
    ...nextResult,
    reteachingPlan: {
      ...result.reteachingPlan,
      smallGroups: rebuildSmallGroups(nextResult, referenceResult),
    },
  };
}
