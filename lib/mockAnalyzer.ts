import { AnalysisResultSchema } from "./schema";
import type { AnalysisResult, Assignment, StudentResponse } from "./schema";

type ClusterSeed = Omit<
  AnalysisResult["misconceptions"][number],
  "studentIds" | "percentOfClass" | "evidenceQuotes"
> & {
  studentIds: string[];
};

const clusterSeeds: ClusterSeed[] = [
  {
    id: "add-across",
    title: "Adding numerator and denominator straight across",
    shortLabel: "Add across",
    severity: "high",
    studentIds: ["S02", "S08", "S15"],
    description:
      "Students are treating a fraction like two separate whole numbers, adding both the numerators and denominators to produce 2/5.",
    likelyReasoning:
      "The addition sign is being applied to every visible number. Students may not yet see the denominator as the size of the parts.",
    instructionalRisk:
      "This rule can feel consistent and may persist into subtraction and algebra unless students reconnect the notation to equal-size parts.",
    teacherMove:
      "Use two same-size fraction bars to show that halves and thirds cannot be counted together until the pieces are renamed as sixths.",
    miniLessonSuggestion:
      "Place 1/2 and 1/3 on bars above a 0–1 number line, then ask whether 2/5 is greater or less than 1/2 before calculating.",
    practiceQuestions: [
      {
        question: "Without calculating exactly, should 1/2 + 1/4 be greater or less than 1/2? Explain.",
        expectedAnswer: "Greater than 1/2, because a positive fourth is being added.",
        purpose: "Use magnitude to challenge the add-across answer 2/6.",
      },
      {
        question: "Use a fraction bar to solve 1/3 + 1/6.",
        expectedAnswer: "3/6 or 1/2.",
        purpose: "Connect equal-size pieces to a common denominator.",
      },
      {
        question: "A student says 2/3 + 1/4 = 3/7. What question would you ask them?",
        expectedAnswer: "Answers should probe whether thirds and fourths are the same-size parts.",
        purpose: "Make the hidden reasoning rule visible.",
      },
    ],
    confidence: 0.98,
  },
  {
    id: "conversion-error",
    title: "Common denominator selected, but numerator conversion is incorrect",
    shortLabel: "Conversion slip",
    severity: "medium",
    studentIds: ["S03", "S16", "S18"],
    description:
      "Students recognize 6 as a useful denominator but do not scale each numerator and denominator by the same factor.",
    likelyReasoning:
      "The common-denominator procedure is partly remembered, while the equivalence relationship—multiplying by one—is not secure.",
    instructionalRisk:
      "A procedural fix may produce occasional correct answers without building the equivalence students need for later fraction operations.",
    teacherMove:
      "Have students complete paired multiplication statements: 1/2 × 3/3 = 3/6 and 1/3 × 2/2 = 2/6, then verify each on a model.",
    miniLessonSuggestion:
      "Use a 'same value, new name' routine: shade 1/3, partition each third in two, and count the shaded sixths.",
    practiceQuestions: [
      {
        question: "Complete: 1/4 = __/12. Explain what happened to both numbers.",
        expectedAnswer: "3/12; multiply numerator and denominator by 3.",
        purpose: "Practice preserving equivalence.",
      },
      {
        question: "Which is equivalent to 2/3: 4/6, 3/6, or 4/5? How do you know?",
        expectedAnswer: "4/6.",
        purpose: "Distinguish scaling both parts from changing only one part.",
      },
      {
        question: "Solve 1/4 + 1/6 by naming each fraction in twelfths.",
        expectedAnswer: "3/12 + 2/12 = 5/12.",
        purpose: "Apply equivalent-fraction conversion in context.",
      },
    ],
    confidence: 0.94,
  },
  {
    id: "component-confusion",
    title: "Numerator-only or denominator-confusion strategy",
    shortLabel: "Parts confused",
    severity: "high",
    studentIds: ["S05", "S09", "S10"],
    description:
      "Students are recombining, holding, or flipping fraction components without preserving the meaning of numerator and denominator.",
    likelyReasoning:
      "They may know that the two parts of a fraction play different roles, but are selecting a remembered operation rather than reasoning about quantity.",
    instructionalRisk:
      "Unexamined component rules make it difficult to judge whether an answer is reasonable and can transfer to multiplication or division incorrectly.",
    teacherMove:
      "Return to language: denominator names the part size; numerator counts those parts. Ask students to label each number before operating.",
    miniLessonSuggestion:
      "Sort four worked examples into 'changes the amount' and 'renames the amount,' requiring a one-sentence justification for each.",
    practiceQuestions: [
      {
        question: "In 5/8, what does the 8 tell us? What does the 5 tell us?",
        expectedAnswer: "Eighths are the part size; 5 is the number of eighths.",
        purpose: "Rebuild numerator and denominator meaning.",
      },
      {
        question: "Is 1/2 + 1/3 closer to 0, 1/2, or 1? Explain before solving.",
        expectedAnswer: "Closer to 1; the exact sum is 5/6.",
        purpose: "Use magnitude to reject component manipulation.",
      },
      {
        question: "Explain why 1/3 and 2/6 name the same amount.",
        expectedAnswer: "Each third is partitioned into two sixths, so the quantity stays equal.",
        purpose: "Connect notation to quantity.",
      },
    ],
    confidence: 0.88,
  },
  {
    id: "magnitude-confusion",
    title: "Estimation or magnitude confusion",
    shortLabel: "Magnitude check",
    severity: "medium",
    studentIds: ["S06", "S12", "S13"],
    description:
      "Students are using informal size comparisons or guesses that do not yet constrain the answer to a reasonable interval.",
    likelyReasoning:
      "Benchmarks such as 0, 1/2, and 1 are not being used consistently, so an answer can be accepted without checking its size.",
    instructionalRisk:
      "Without magnitude checks, students have no independent way to catch procedural errors or explain why an answer makes sense.",
    teacherMove:
      "Ask students to bracket the sum before computing: it must be greater than 1/2 and less than 1. Then compare candidate answers to that interval.",
    miniLessonSuggestion:
      "Run a quick number-line estimate with 1/2, 1/3, 2/3, 4/6, and 5/6, emphasizing estimates as evidence rather than guesses.",
    practiceQuestions: [
      {
        question: "Between which two benchmarks does 2/5 + 1/3 fall: 0, 1/2, or 1?",
        expectedAnswer: "Between 1/2 and 1.",
        purpose: "Strengthen benchmark reasoning.",
      },
      {
        question: "Could 3/4 + 1/5 equal 4/9? Explain without finding the exact sum.",
        expectedAnswer: "No; the sum must be greater than 3/4, while 4/9 is less than 1/2.",
        purpose: "Use estimation to reject an impossible result.",
      },
      {
        question: "Estimate 5/8 + 1/6, then calculate to check.",
        expectedAnswer: "About 3/4; exactly 19/24.",
        purpose: "Link estimation and exact computation.",
      },
    ],
    confidence: 0.82,
  },
];

const correctIds = new Set(["S01", "S04", "S07", "S11", "S14", "S17"]);
const unclearIds = new Set(["S13"]);

function percent(count: number, total: number) {
  return Number(((count / Math.max(total, 1)) * 100).toFixed(1));
}

function clusterForStudent(studentId: string) {
  return clusterSeeds.find((cluster) => cluster.studentIds.includes(studentId));
}

function demoAnalysis(assignment: Assignment, responses: StudentResponse[]): AnalysisResult {
  const byId = new Map(responses.map((item) => [item.studentId, item]));
  const misconceptions = clusterSeeds
    .map((seed) => {
      const studentIds = seed.studentIds.filter((studentId) => byId.has(studentId));
      return {
        ...seed,
        studentIds,
        percentOfClass: percent(studentIds.length, responses.length),
        evidenceQuotes: studentIds.slice(0, 3).map((studentId) => ({
          studentId,
          quote: byId.get(studentId)?.response ?? "",
        })),
      };
    })
    .filter((cluster) => cluster.studentIds.length > 0);

  const students = responses.map((student) => {
    const cluster = clusterForStudent(student.studentId);
    const isCorrect = correctIds.has(student.studentId);
    const isUnclear = unclearIds.has(student.studentId);
    const status = isCorrect ? "correct" : isUnclear ? "unclear" : "misconception";

    if (isCorrect) {
      return {
        ...student,
        status: status as "correct",
        misconceptionId: null,
        confidence: 0.97,
        teacherNote: "Shows a valid common-denominator or decimal-equivalence strategy.",
        studentFeedback:
          "Your answer is correct, and your reasoning shows that the fractions were renamed as equal-size parts. Nice work making your method visible.",
        nextStep: "Explain why sixths are a useful common unit, or solve a related sum with a different common denominator.",
      };
    }

    if (isUnclear) {
      return {
        ...student,
        status: status as "unclear",
        misconceptionId: cluster?.id ?? null,
        confidence: 0.62,
        teacherNote: "The response is too brief to distinguish a conversion error from a guess. Ask for a quick think-aloud.",
        studentFeedback:
          "You chose sixths, which can be a useful unit. Show how each original fraction changes into sixths so we can follow your thinking.",
        nextStep: "Represent 1/2 and 1/3 with fraction bars, then label each amount in sixths.",
      };
    }

    const clusterTitle = cluster?.title ?? "Reasoning pattern needs review";
    const feedbackByCluster: Record<string, string> = {
      "add-across":
        "You applied addition consistently to the numbers you saw. Now check the size of the pieces: can halves and thirds be counted together before they are renamed?",
      "conversion-error":
        "Choosing sixths is a strong start. When a denominator changes, multiply the numerator by the same factor so the fraction keeps its value.",
      "component-confusion":
        "You noticed that the numerator and denominator play different roles. Label what each number means, then use a model to keep the amount unchanged.",
      "magnitude-confusion":
        "Your comparison idea can help. First decide an interval for the answer: adding 1/3 to 1/2 must give a result greater than 1/2 and less than 1.",
    };

    return {
      ...student,
      status: status as "misconception",
      misconceptionId: cluster?.id ?? null,
      confidence: cluster?.confidence ?? 0.7,
      teacherNote: `Evidence aligns with: ${clusterTitle}. Confirm with one model-based follow-up question.`,
      studentFeedback:
        feedbackByCluster[cluster?.id ?? ""] ??
        "Show one more step so we can compare your reasoning with the fraction model.",
      nextStep: cluster?.teacherMove ?? "Ask the student to model the response and explain each step.",
    };
  });

  const correctCount = students.filter((student) => student.status === "correct").length;
  const unclearCount = students.filter((student) => student.status === "unclear").length;
  const misconceptionCount = students.filter((student) => student.status === "misconception").length;

  return {
    assignmentSummary: {
      subject: assignment.subject,
      gradeLevel: assignment.gradeLevel,
      learningObjective: assignment.learningObjective,
      question: assignment.question,
      rubricSummary: assignment.correctAnswer,
    },
    overview: {
      totalResponses: responses.length,
      correctCount,
      nearCorrectCount: 0,
      misconceptionCount,
      unclearCount,
      topMisconceptionId: misconceptions[0]?.id ?? null,
      oneSentenceSummary:
        "Two-thirds of the class need support connecting fraction notation to equal-size parts; the strongest first move is to contrast add-across reasoning with a visual model.",
    },
    misconceptions,
    students,
    reteachingPlan: {
      priorityOrder: [
        "add-across",
        "conversion-error",
        "component-confusion",
        "magnitude-confusion",
      ].filter((id) => misconceptions.some((item) => item.id === id)),
      smallGroups: [
        {
          groupName: "Group A · Meaning before method",
          studentIds: ["S02", "S05", "S08", "S09", "S10", "S15"].filter((id) => byId.has(id)),
          focus: "Reconnect numerator and denominator notation to equal-size pieces.",
          activity: "Build each addend with fraction strips, predict the sum's magnitude, and rename both fractions before combining.",
        },
        {
          groupName: "Group B · Same value, new name",
          studentIds: ["S03", "S16", "S18"].filter((id) => byId.has(id)),
          focus: "Scale numerator and denominator together to preserve equivalence.",
          activity: "Complete equivalent-fraction tables, then justify each row using multiply-by-one language.",
        },
        {
          groupName: "Group C · Estimate, then calculate",
          studentIds: ["S06", "S12", "S13"].filter((id) => byId.has(id)),
          focus: "Use 0, 1/2, and 1 to bound a fraction sum.",
          activity: "Place candidate sums on a number line, eliminate impossible answers, and then calculate exactly.",
        },
        {
          groupName: "Extension · Prove it two ways",
          studentIds: Array.from(correctIds).filter((id) => byId.has(id)),
          focus: "Deepen justification and compare strategies.",
          activity: "Solve 3/4 + 2/3 with both an area model and an equation, then explain why the methods agree.",
        },
      ].filter((group) => group.studentIds.length > 0),
      tenMinuteMiniLesson: {
        objective:
          "Students will explain why fractions need a shared unit before their numerators can be combined.",
        teacherScript: [
          "Display 1/2 + 1/3 and ask: What must be true about pieces before we count them together?",
          "Place a half-strip and a third-strip over the same whole. Name what is different about the pieces.",
          "Partition both strips into sixths. Say: We changed the names, not the amounts.",
          "Record 1/2 × 3/3 = 3/6 and 1/3 × 2/2 = 2/6, then combine 5 sixths.",
          "Compare 5/6 with 2/5 using the benchmark 1/2. Ask which answer could make sense and why.",
        ],
        boardExample: "1/2 + 1/3 = 3/6 + 2/6 = 5/6  |  Estimate: more than 1/2, less than 1",
        checkForUnderstanding:
          "Turn and tell a partner why 1/3 becomes 2/6—not 1/6—when sixths are used.",
      },
      exitTicket: {
        prompt: "Solve 1/4 + 1/3. Show the equivalent fractions you used and one reason your answer is reasonable.",
        correctAnswer: "3/12 + 4/12 = 7/12; the result is greater than 1/2 and less than 1.",
        lookFors: [
          "Both fractions are renamed in twelfths.",
          "Numerator and denominator are scaled by the same factor.",
          "The magnitude statement matches 7/12.",
        ],
      },
      commonWrongAnswers: [
        "2/7 — adding numerator and denominator straight across",
        "2/12 — choosing a common denominator but not scaling numerators",
        "1/7 — preserving the numerator and combining denominators",
      ],
      tomorrowPlan:
        "Open with the 10-minute visual mini lesson, then rotate through three misconception-based groups while students with secure reasoning complete a two-strategy extension. Close with the 1/4 + 1/3 exit ticket and sort it by reasoning pattern, not only correctness.",
    },
    parentOrAdminSummary:
      "Student work shows that several learners are ready to use common denominators, while others need a stronger connection between fraction symbols and equal-size parts. Tomorrow's lesson will use visual models, targeted small groups, and a brief exit ticket to address these specific patterns. This analysis supports—but does not replace—teacher review.",
    limitations: [
      "Analysis is based only on submitted responses.",
      "This tool does not diagnose students or infer sensitive attributes.",
      "Teacher review is required before using feedback or grouping decisions.",
      "Use anonymized IDs, not student names.",
    ],
  };
}

function genericAnalysis(assignment: Assignment, responses: StudentResponse[]): AnalysisResult {
  const evidenceQuotes = responses.slice(0, 3).map((item) => ({
    studentId: item.studentId,
    quote: item.response,
  }));
  const result: AnalysisResult = {
    assignmentSummary: {
      subject: assignment.subject,
      gradeLevel: assignment.gradeLevel,
      learningObjective: assignment.learningObjective,
      question: assignment.question,
      rubricSummary: assignment.correctAnswer,
    },
    overview: {
      totalResponses: responses.length,
      correctCount: 0,
      nearCorrectCount: 0,
      misconceptionCount: 0,
      unclearCount: responses.length,
      topMisconceptionId: "teacher-review",
      oneSentenceSummary:
        "Demo mode preserved the submitted evidence, but this custom task needs live GPT analysis or teacher review before assigning misconception labels.",
    },
    misconceptions: [
      {
        id: "teacher-review",
        title: "Reasoning pattern needs teacher review",
        shortLabel: "Review needed",
        severity: "low",
        studentIds: responses.map((item) => item.studentId),
        percentOfClass: 100,
        description:
          "The deterministic analyzer is optimized for the built-in fractions demonstration and will not invent a content-specific label for this task.",
        likelyReasoning:
          "Student thinking may share a pattern, but the submitted text should be compared with the rubric by a teacher or the live analysis model.",
        evidenceQuotes,
        instructionalRisk:
          "Premature grouping could overstate what short written responses reveal.",
        teacherMove:
          "Select two contrasting responses, ask students to explain one additional step, and compare the language with the rubric.",
        miniLessonSuggestion:
          "Use an anonymous worked-example sort: fully supported, partially supported, and needs more evidence.",
        practiceQuestions: [
          { question: "Explain one step in your reasoning.", expectedAnswer: "A step tied to the learning objective.", purpose: "Elicit additional evidence." },
          { question: "Which part of the rubric does your answer show?", expectedAnswer: "A specific rubric connection.", purpose: "Support self-assessment." },
          { question: "What would you check next?", expectedAnswer: "A relevant verification strategy.", purpose: "Reveal metacognitive strategy." },
        ],
        confidence: 0.35,
      },
    ],
    students: responses.map((item) => ({
      ...item,
      status: "unclear",
      misconceptionId: "teacher-review",
      confidence: 0.35,
      teacherNote: "Demo mode retained this response without making an unsupported content claim.",
      studentFeedback: "Please show one more step and connect it to the question so your teacher can follow your thinking.",
      nextStep: "Add one sentence explaining why the answer fits the learning objective.",
    })),
    reteachingPlan: {
      priorityOrder: ["teacher-review"],
      smallGroups: [{
        groupName: "Evidence check",
        studentIds: responses.map((item) => item.studentId),
        focus: "Elicit enough reasoning to support a teacher decision.",
        activity: "Ask each learner for one additional step, then sort responses against the rubric.",
      }],
      tenMinuteMiniLesson: {
        objective: assignment.learningObjective,
        teacherScript: [
          "Share the learning objective in student-friendly language.",
          "Model a response that makes its reasoning visible.",
          "Ask students to annotate where their own response shows the objective.",
        ],
        boardExample: `Prompt: ${assignment.question}`,
        checkForUnderstanding: "Ask students to add one evidence sentence to their response.",
      },
      exitTicket: {
        prompt: `Answer in one sentence: ${assignment.question}`,
        correctAnswer: assignment.correctAnswer,
        lookFors: ["Reasoning is visible", "Language connects to the learning objective"],
      },
      commonWrongAnswers: ["Not generated in deterministic mode for custom content."],
      tomorrowPlan: "Review the unclear responses, collect one additional reasoning step, and rerun in live mode if available.",
    },
    parentOrAdminSummary:
      "Student responses were collected and preserved for teacher review. Content-specific conclusions were intentionally withheld in deterministic mode for this custom task.",
    limitations: [
      "Analysis is based only on submitted responses.",
      "This tool does not diagnose students.",
      "Teacher review is required.",
      "Custom assignments receive conservative results in demo mode.",
    ],
  };
  return result;
}

export function createMockAnalysis(
  assignment: Assignment,
  responses: StudentResponse[],
): AnalysisResult {
  const isFractionDemo =
    assignment.question.includes("1/2") &&
    assignment.question.includes("1/3") &&
    responses.some((item) => item.studentId === "S02" && item.response.includes("2/5"));
  return AnalysisResultSchema.parse(
    isFractionDemo
      ? demoAnalysis(assignment, responses)
      : genericAnalysis(assignment, responses),
  );
}

