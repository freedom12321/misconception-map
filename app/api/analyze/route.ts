import { NextResponse } from "next/server";
import { analyzeWithOpenAI } from "../../../lib/openaiAnalyzer";
import { createMockAnalysis } from "../../../lib/mockAnalyzer";
import { AnalyzeRequestSchema } from "../../../lib/schema";

export async function POST(request: Request) {
  try {
    const payload = AnalyzeRequestSchema.parse(await request.json());

    if (payload.forceDemo || !process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        result: createMockAnalysis(payload.assignment, payload.responses),
        mode: "demo" as const,
        model: null,
        fallbackReason: payload.forceDemo
          ? null
          : "No API key detected, so the deterministic demo analyzer was used.",
      });
    }

    try {
      const { result, model } = await analyzeWithOpenAI(
        payload.assignment,
        payload.responses,
      );
      return NextResponse.json({ result, mode: "live" as const, model });
    } catch (error) {
      console.error("OpenAI analysis failed; using safe fallback.", error);
      return NextResponse.json({
        result: createMockAnalysis(payload.assignment, payload.responses),
        mode: "demo" as const,
        model: null,
        fallbackReason:
          "Live analysis was unavailable, so we used the deterministic demo analyzer. Your responses were not lost.",
      });
    }
  } catch (error) {
    console.error("Invalid analysis request.", error);
    return NextResponse.json(
      {
        error:
          "We could not read those responses. Check that each response has an anonymized ID and some answer text.",
      },
      { status: 400 },
    );
  }
}

