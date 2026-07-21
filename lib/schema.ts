import { z } from "zod";

export const StudentResponseSchema = z.object({
  studentId: z.string().trim().min(1).max(40),
  response: z.string().trim().min(1).max(3_000),
});

export const AssignmentSchema = z.object({
  subject: z.string().trim().min(1).max(120),
  gradeLevel: z.string().trim().min(1).max(80),
  learningObjective: z.string().trim().min(1).max(500),
  question: z.string().trim().min(1).max(4_000),
  correctAnswer: z.string().trim().min(1).max(6_000),
  teacherNotes: z.string().trim().max(4_000).default(""),
});

const PracticeQuestionSchema = z.object({
  question: z.string().min(1),
  expectedAnswer: z.string().min(1),
  purpose: z.string().min(1),
});

export const AnalysisResultSchema = z.object({
  assignmentSummary: z.object({
    subject: z.string(),
    gradeLevel: z.string(),
    learningObjective: z.string(),
    question: z.string(),
    rubricSummary: z.string(),
  }),
  overview: z.object({
    totalResponses: z.number().int().nonnegative(),
    correctCount: z.number().int().nonnegative(),
    nearCorrectCount: z.number().int().nonnegative(),
    misconceptionCount: z.number().int().nonnegative(),
    unclearCount: z.number().int().nonnegative(),
    topMisconceptionId: z.string().nullable(),
    oneSentenceSummary: z.string(),
  }),
  misconceptions: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      shortLabel: z.string().min(1),
      severity: z.enum(["low", "medium", "high"]),
      studentIds: z.array(z.string()),
      percentOfClass: z.number().min(0).max(100),
      description: z.string(),
      likelyReasoning: z.string(),
      evidenceQuotes: z.array(
        z.object({
          studentId: z.string(),
          quote: z.string(),
        }),
      ),
      instructionalRisk: z.string(),
      teacherMove: z.string(),
      miniLessonSuggestion: z.string(),
      practiceQuestions: z.array(PracticeQuestionSchema).min(3),
      confidence: z.number().min(0).max(1),
    }),
  ),
  students: z.array(
    z.object({
      studentId: z.string(),
      response: z.string(),
      status: z.enum(["correct", "near_correct", "misconception", "unclear"]),
      misconceptionId: z.string().nullable(),
      confidence: z.number().min(0).max(1),
      teacherNote: z.string(),
      studentFeedback: z.string(),
      nextStep: z.string(),
    }),
  ),
  reteachingPlan: z.object({
    priorityOrder: z.array(z.string()),
    smallGroups: z.array(
      z.object({
        groupName: z.string(),
        studentIds: z.array(z.string()),
        focus: z.string(),
        activity: z.string(),
      }),
    ),
    tenMinuteMiniLesson: z.object({
      objective: z.string(),
      teacherScript: z.array(z.string()),
      boardExample: z.string(),
      checkForUnderstanding: z.string(),
    }),
    exitTicket: z.object({
      prompt: z.string(),
      correctAnswer: z.string(),
      lookFors: z.array(z.string()),
    }),
    commonWrongAnswers: z.array(z.string()),
    tomorrowPlan: z.string(),
  }),
  parentOrAdminSummary: z.string(),
  limitations: z.array(z.string()),
});

export const AnalyzeRequestSchema = z
  .object({
    assignment: AssignmentSchema,
    responses: z.array(StudentResponseSchema).min(1).max(60),
    sampleMode: z.boolean().optional().default(false),
  })
  .superRefine((value, context) => {
    const totalCharacters = value.responses.reduce(
      (total, response) => total + response.response.length,
      0,
    );
    if (totalCharacters > 80_000) {
      context.addIssue({
        code: "custom",
        path: ["responses"],
        message: "Student responses exceed the 80,000 character request limit.",
      });
    }
  });

export type StudentResponse = z.infer<typeof StudentResponseSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
