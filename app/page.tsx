"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { AssignmentForm } from "../components/AssignmentForm";
import { Hero } from "../components/Hero";
import { AnalysisResultSchema } from "../lib/schema";
import type { AnalysisResult, Assignment, StudentResponse } from "../lib/schema";
import { parseStudentResponses } from "../lib/parseResponses";
import { demoAssignment, demoPlainText, demoResponses } from "../lib/sampleData";

type AnalysisMode = "demo" | "live";

export default function Home() {
  const [assignment, setAssignment] = useState<Assignment>(demoAssignment);
  const [responseText, setResponseText] = useState(demoPlainText);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("demo");
  const [model, setModel] = useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responses = useMemo(() => parseStudentResponses(responseText), [responseText]);

  useEffect(() => {
    let timer: number | undefined;
    try {
      const saved = window.localStorage.getItem("misconception-map-draft");
      if (!saved) return;
      const draft = JSON.parse(saved) as { assignment?: Assignment; responseText?: string };
      timer = window.setTimeout(() => {
        if (draft.assignment) setAssignment(draft.assignment);
        if (typeof draft.responseText === "string") setResponseText(draft.responseText);
      }, 0);
    } catch {
      // A malformed local draft should never block the built-in demo.
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "misconception-map-draft",
      JSON.stringify({ assignment, responseText }),
    );
  }, [assignment, responseText]);

  async function runAnalysis(nextAssignment: Assignment, nextResponses: StudentResponse[]) {
    if (!nextAssignment.subject || !nextAssignment.gradeLevel || !nextAssignment.learningObjective || !nextAssignment.question || !nextAssignment.correctAnswer) {
      setError("Complete the assignment context before analyzing responses.");
      document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!nextResponses.length) {
      setError("Add at least one student response using an anonymized ID.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignment: nextAssignment, responses: nextResponses }),
      });
      const payload = await response.json() as {
        result?: unknown;
        mode?: AnalysisMode;
        model?: string | null;
        fallbackReason?: string | null;
        error?: string;
      };
      if (!response.ok || !payload.result) throw new Error(payload.error ?? "The analysis could not be completed.");
      const validated = AnalysisResultSchema.safeParse(payload.result);
      if (!validated.success) throw new Error("The analysis returned an unexpected format. Please try again.");
      setResult(validated.data);
      setMode(payload.mode ?? "demo");
      setModel(payload.model ?? null);
      setFallbackReason(payload.fallbackReason ?? null);
      window.setTimeout(() => document.getElementById("analysis-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Your draft is still here.");
      document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } finally {
      setIsLoading(false);
    }
  }

  function loadDemo(shouldAnalyze = false) {
    setAssignment(demoAssignment);
    setResponseText(demoPlainText);
    setError(null);
    if (shouldAnalyze) void runAnalysis(demoAssignment, demoResponses);
    else document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="site-shell">
      <Hero
        onTryDemo={() => loadDemo(true)}
        onAnalyzeResponses={() => document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth" })}
        isLoading={isLoading}
      />
      <AssignmentForm
        assignment={assignment}
        onAssignmentChange={setAssignment}
        responseText={responseText}
        onResponseTextChange={setResponseText}
        parsedCount={responses.length}
        onLoadDemo={() => loadDemo(false)}
        onAnalyze={() => void runAnalysis(assignment, responses)}
        isLoading={isLoading}
        error={error}
      />
      {result ? (
        <AnalysisDashboard result={result} mode={mode} model={model} fallbackReason={fallbackReason} />
      ) : (
        <section className="pre-analysis-note" aria-label="Demo invitation">
          <span>18 sample responses are ready</span>
          <h2>One click reveals four teachable patterns.</h2>
          <button className="button button-ink" onClick={() => loadDemo(true)} disabled={isLoading}>Run the demo analysis <span aria-hidden="true">→</span></button>
        </section>
      )}
      <footer className="site-footer">
        <div className="brand"><span className="brand-mark" aria-hidden="true">M</span><span>Misconception Map</span></div>
        <p>See the thinking. Plan the next move.</p>
        <div><a href="#safety">Evidence & safety</a><a href="#built-with-codex">Built with Codex</a><span>Education · Build Week 2026</span></div>
      </footer>
    </div>
  );
}
