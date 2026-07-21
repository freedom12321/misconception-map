import type { AnalysisResult } from "./schema";

function csvCell(value: string | number) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportFeedbackCsv(result: AnalysisResult): string {
  const header = [
    "student_id",
    "original_response",
    "status",
    "misconception_cluster",
    "small_group",
    "confidence_percent",
    "teacher_note",
    "student_friendly_feedback",
    "next_step",
  ];
  const misconceptionLabels = new Map(
    result.misconceptions.map((item) => [item.id, item.title]),
  );
  const groupNames = new Map(
    result.reteachingPlan.smallGroups.flatMap((group) =>
      group.studentIds.map((studentId) => [studentId, group.groupName] as const),
    ),
  );
  const rows = result.students.map((student) => [
    student.studentId,
    student.response,
    student.status,
    student.misconceptionId
      ? misconceptionLabels.get(student.misconceptionId) ?? student.misconceptionId
      : "",
    groupNames.get(student.studentId) ?? "Needs teacher review",
    Math.round(student.confidence * 100),
    student.teacherNote,
    student.studentFeedback,
    student.nextStep,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function exportPlanningSummary(result: AnalysisResult): string {
  const topPriority = result.misconceptions.find(
    (item) => item.id === result.overview.topMisconceptionId,
  );
  const prioritySentence = topPriority
    ? `The current top teaching priority is ${topPriority.title.toLowerCase()}, a pattern assigned to ${topPriority.studentIds.length} students after teacher review.`
    : "No shared misconception pattern is currently assigned as the top teaching priority.";
  return `This Grade 5–8 math exit-ticket review is based on ${result.overview.totalResponses} anonymized submitted responses. ${result.overview.misconceptionCount} responses are currently grouped into misconception patterns and ${result.overview.unclearCount} need further teacher review. ${prioritySentence} These groupings are instructional hypotheses, not grades or diagnoses, and require teacher review before use.`;
}

export function exportTeacherMarkdown(result: AnalysisResult): string {
  const topPriority = result.misconceptions.find(
    (item) => item.id === result.overview.topMisconceptionId,
  ) ?? result.misconceptions[0];
  const lines = [
    "# Misconception Map — Teacher Report",
    "",
    `**Subject:** ${result.assignmentSummary.subject}`,
    `**Grade:** ${result.assignmentSummary.gradeLevel}`,
    `**Learning objective:** ${result.assignmentSummary.learningObjective}`,
    `**Question:** ${result.assignmentSummary.question}`,
    `**Rubric:** ${result.assignmentSummary.rubricSummary}`,
    "",
    "## Class overview",
    "",
    result.overview.oneSentenceSummary,
    "",
    `- Responses analyzed: ${result.overview.totalResponses}`,
    `- Correct or mostly correct: ${result.overview.correctCount + result.overview.nearCorrectCount}`,
    `- Responses showing a misconception: ${result.overview.misconceptionCount}`,
    `- Unclear responses: ${result.overview.unclearCount}`,
    "",
    "## Top teaching priority",
    "",
    topPriority ? `### ${topPriority.title}` : "No priority pattern identified.",
    "",
    ...(topPriority
      ? [
          `${topPriority.studentIds.length} students (${topPriority.percentOfClass}% of class) showed this pattern.`,
          "",
          `**Why teach this first:** ${topPriority.instructionalRisk}`,
          `**First teacher move:** ${topPriority.teacherMove}`,
          "",
          "**Evidence from student work**",
          "",
          ...topPriority.evidenceQuotes.slice(0, 3).map(
            (evidence) => `- ${evidence.studentId}: “${evidence.quote}”`,
          ),
          "",
        ]
      : []),
    "## Misconception patterns",
    "",
  ];

  for (const item of result.misconceptions) {
    lines.push(
      `### ${item.title} (${item.percentOfClass}% of class)`,
      "",
      item.description,
      "",
      `**Students:** ${item.studentIds.join(", ")}`,
      `**Likely reasoning:** ${item.likelyReasoning}`,
      `**Why this matters:** ${item.instructionalRisk}`,
      `**Suggested teacher move:** ${item.teacherMove}`,
      `**Confidence:** ${Math.round(item.confidence * 100)}%`,
      "",
      "**Evidence from student work**",
      "",
      ...item.evidenceQuotes.map(
        (evidence) => `- ${evidence.studentId}: “${evidence.quote}”`,
      ),
      "",
      "**Targeted practice**",
      "",
      ...item.practiceQuestions.map(
        (practice, index) =>
          `${index + 1}. ${practice.question} — Answer: ${practice.expectedAnswer} (${practice.purpose})`,
      ),
      "",
    );
  }

  lines.push(
    "## Tomorrow's plan",
    "",
    result.reteachingPlan.tomorrowPlan,
    "",
    "### 10-minute mini lesson",
    "",
    `**Objective:** ${result.reteachingPlan.tenMinuteMiniLesson.objective}`,
    `**Board example:** ${result.reteachingPlan.tenMinuteMiniLesson.boardExample}`,
    "",
    ...result.reteachingPlan.tenMinuteMiniLesson.teacherScript.map(
      (step, index) => `${index + 1}. ${step}`,
    ),
    "",
    `**Check for understanding:** ${result.reteachingPlan.tenMinuteMiniLesson.checkForUnderstanding}`,
    "",
    "### Small groups",
    "",
    ...result.reteachingPlan.smallGroups.flatMap((group) => [
      `#### ${group.groupName}`,
      "",
      `- **Students:** ${group.studentIds.join(", ")}`,
      `- **Focus:** ${group.focus}`,
      `- **Activity:** ${group.activity}`,
      "",
    ]),
    "### Common wrong answers to watch for",
    "",
    ...result.reteachingPlan.commonWrongAnswers.map((item) => `- ${item}`),
    "",
    "### Exit ticket",
    "",
    result.reteachingPlan.exitTicket.prompt,
    "",
    `**Answer:** ${result.reteachingPlan.exitTicket.correctAnswer}`,
    "",
    "**Look-fors:**",
    "",
    ...result.reteachingPlan.exitTicket.lookFors.map((item) => `- ${item}`),
    "",
    "## Shareable planning summary",
    "",
    exportPlanningSummary(result),
    "",
    "## Guardrails",
    "",
    ...result.limitations.map((item) => `- ${item}`),
    "",
    "_Generated by Misconception Map. Teacher review required._",
  );

  return lines.join("\n");
}
