import type { Assignment, StudentResponse } from "./schema";

export const demoAssignment: Assignment = {
  subject: "Mathematics",
  gradeLevel: "Grade 6",
  learningObjective: "Add fractions with unlike denominators and explain why equivalent fractions are needed.",
  question: "What is 1/2 + 1/3? Show your reasoning.",
  correctAnswer:
    "The correct answer is 5/6. Students should convert 1/2 to 3/6 and 1/3 to 2/6, then add 3/6 + 2/6 = 5/6. Award full credit for equivalent reasoning.",
  teacherNotes:
    "We introduced least common denominators yesterday. Look for whether students understand equivalence, not only whether they reached 5/6.",
};

export const demoResponses: StudentResponse[] = [
  { studentId: "S01", response: "5/6 because 1/2 is 3/6 and 1/3 is 2/6, so 3/6 + 2/6 = 5/6." },
  { studentId: "S02", response: "2/5 because 1+1=2 and 2+3=5." },
  { studentId: "S03", response: "2/6 because I added the tops and kept the bottom." },
  { studentId: "S04", response: "5/6. I made both denominators 6." },
  { studentId: "S05", response: "1/5. I added 2 and 3 to get 5 and kept the 1." },
  { studentId: "S06", response: "3/5 because half plus a third is like 2 parts plus 1 part." },
  { studentId: "S07", response: "5/6 because 0.5 + 0.333 is about 0.833." },
  { studentId: "S08", response: "2/5. You add across fractions." },
  { studentId: "S09", response: "6/5 because 2+3=5 and 1+1=2, then flip." },
  { studentId: "S10", response: "I think it is 1/6 because both fractions have 1 on top." },
  { studentId: "S11", response: "5/6. Common denominator is 6." },
  { studentId: "S12", response: "2/3 because 1/2 is close to 1/3." },
  { studentId: "S13", response: "I don't know. I guessed 4/6." },
  { studentId: "S14", response: "5/6 since 3/6 plus 2/6 equals 5/6." },
  { studentId: "S15", response: "2/5 because add numerator and denominator." },
  { studentId: "S16", response: "4/6 because 1/2 becomes 3/6 and 1/3 becomes 1/6." },
  { studentId: "S17", response: "5/6, used common denominator." },
  { studentId: "S18", response: "2/6. I added 1 + 1 and used 6 as the denominator." },
];

export const demoPlainText = demoResponses
  .map(({ studentId, response }) => `${studentId}: ${response}`)
  .join("\n");

