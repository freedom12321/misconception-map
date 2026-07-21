import { NextResponse } from "next/server";
import { analyzeWithOpenAI } from "../../../lib/openaiAnalyzer";
import { createMockAnalysis } from "../../../lib/mockAnalyzer";
import { AnalyzeRequestSchema } from "../../../lib/schema";

function hasLiveAnalysis() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function GET() {
  const liveAnalysisAvailable = hasLiveAnalysis();
  return NextResponse.json(
    {
      liveAnalysisAvailable,
      model: liveAnalysisAvailable
        ? process.env.OPENAI_MODEL?.trim() || "gpt-5.6"
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  try {
    const payload = AnalyzeRequestSchema.parse(await request.json());

    if (!hasLiveAnalysis()) {
      if (!payload.sampleMode) {
        return NextResponse.json(
          {
            error:
              "Live GPT-5.6 analysis is not connected yet. Your draft is saved—ask the site owner to configure OPENAI_API_KEY, or explore the sample class instead.",
          },
          { status: 503 },
        );
      }

      return NextResponse.json({
        result: createMockAnalysis(payload.assignment, payload.responses),
        mode: "demo" as const,
        model: null,
        fallbackReason:
          "This is the labeled sample class. Live GPT-5.6 is not connected on this deployment, so the deterministic sample result is shown instead.",
      });
    }

    try {
      const { result, model } = await analyzeWithOpenAI(
        payload.assignment,
        payload.responses,
      );
      return NextResponse.json({ result, mode: "live" as const, model });
    } catch (error) {
      console.error("OpenAI analysis failed.", error);
      if (payload.sampleMode) {
        return NextResponse.json({
          result: createMockAnalysis(payload.assignment, payload.responses),
          mode: "demo" as const,
          model: null,
          fallbackReason:
            "The live request failed, so only this labeled sample class switched to its deterministic fallback.",
        });
      }
      return NextResponse.json(
        {
          error:
            "Live GPT-5.6 analysis could not finish. No mock result was substituted. Your draft is still saved, so please try again.",
        },
        { status: 502 },
      );
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
