import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { AnalysisResultSchema } from "./schema";
import type { AnalysisResult, Assignment, StudentResponse } from "./schema";

const SYSTEM_PROMPT = `You are an expert instructional coach helping a teacher analyze student thinking.
Your job is to identify evidence-based misconception patterns in student responses.

Guardrails:
- Do not diagnose learning disabilities or any learner condition.
- Do not infer sensitive attributes or background information.
- Do not make claims not supported by the submitted student text.
- Group similar reasoning errors into 3 to 6 instructionally useful clusters.
- Cite exact student response snippets as evidence. Include at least two quotes per major cluster when available.
- Distinguish correct, near-correct, misconception, and unclear responses.
- Generate practical reteaching steps a teacher could use tomorrow.
- Keep all feedback warm, specific, and student-friendly.
- Treat the result as teacher decision support. Teacher review is required.
- Output only the JSON object matching the provided schema.`;

export async function analyzeWithOpenAI(
  assignment: Assignment,
  responses: StudentResponse[],
): Promise<{ result: AnalysisResult; model: string }> {
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-5.6";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const input = {
    assignment: {
      ...assignment,
      rubric: assignment.correctAnswer,
    },
    studentResponses: responses,
    requiredCounts: {
      total: responses.length,
      note: "Overview counts must describe every submitted response exactly once.",
    },
  };

  const response = await client.responses.parse({
    model,
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Analyze this assignment and student work:\n${JSON.stringify(input)}`,
      },
    ],
    text: {
      format: zodTextFormat(AnalysisResultSchema, "misconception_map_analysis"),
    },
    max_output_tokens: 16_000,
  });

  if (!response.output_parsed) {
    throw new Error("The model response did not contain a parsed analysis.");
  }

  return {
    result: AnalysisResultSchema.parse(response.output_parsed),
    model,
  };
}

