"use client";

import { useEffect, useMemo, useState } from "react";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { AssignmentForm } from "../components/AssignmentForm";
import { BuiltWithCodex } from "../components/BuiltWithCodex";
import { Hero } from "../components/Hero";
import { AnalysisResultSchema } from "../lib/schema";
import type { AnalysisResult, Assignment, StudentResponse } from "../lib/schema";
import { parseStudentResponses } from "../lib/parseResponses";
import { verifyAnalysisEvidence } from "../lib/evidence";
import type { EvidenceVerification } from "../lib/evidence";
import {
  demoAssignment,
  demoPlainText,
  demoResponses,
  emptyAssignment,
} from "../lib/sampleData";

type AnalysisMode = "demo" | "live";
type LiveStatus = { available: boolean; model: string | null } | null;

const DRAFT_KEY = "misconception-map-custom-draft-v2";

export default function Home() {
  const [assignment, setAssignment] = useState<Assignment>(emptyAssignment);
  const [responseText, setResponseText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("demo");
  const [model, setModel] = useState<string | null>(null);
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);
  const [evidenceVerification, setEvidenceVerification] = useState<EvidenceVerification | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const responses = useMemo(() => parseStudentResponses(responseText), [responseText]);

  useEffect(() => {
    let timer: number | undefined;
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      const applyDraft = () => setDraftReady(true);
      if (saved) {
        const draft = JSON.parse(saved) as { assignment?: Assignment; responseText?: string };
        timer = window.setTimeout(() => {
          if (draft.assignment) setAssignment(draft.assignment);
          if (typeof draft.responseText === "string") setResponseText(draft.responseText);
          applyDraft();
        }, 0);
      } else {
        timer = window.setTimeout(applyDraft, 0);
      }
    } catch {
      // A malformed local draft should never block a fresh workspace.
      timer = window.setTimeout(() => setDraftReady(true), 0);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!draftReady || isSample) return;
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ assignment, responseText }),
    );
  }, [assignment, draftReady, isSample, responseText]);

  useEffect(() => {
    let active = true;
    void fetch("/api/analyze", { cache: "no-store" })
      .then(async (response) => await response.json() as {
        liveAnalysisAvailable?: boolean;
        model?: string | null;
      })
      .then((payload) => {
        if (active) {
          setLiveStatus({
            available: Boolean(payload.liveAnalysisAvailable),
            model: payload.model ?? null,
          });
        }
      })
      .catch(() => {
        if (active) setLiveStatus({ available: false, model: null });
      });
    return () => {
      active = false;
    };
  }, []);

  async function runAnalysis(
    nextAssignment: Assignment,
    nextResponses: StudentResponse[],
    sampleMode = false,
  ) {
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
        body: JSON.stringify({
          assignment: nextAssignment,
          responses: nextResponses,
          sampleMode,
        }),
      });
      const payload = await response.json() as {
        result?: unknown;
        mode?: AnalysisMode;
        model?: string | null;
        fallbackReason?: string | null;
        evidence?: EvidenceVerification;
        error?: string;
      };
      if (!response.ok || !payload.result) throw new Error(payload.error ?? "The analysis could not be completed.");
      const validated = AnalysisResultSchema.safeParse(payload.result);
      if (!validated.success) throw new Error("The analysis returned an unexpected format. Please try again.");
      const clientVerified = verifyAnalysisEvidence(validated.data, nextResponses);
      setResult(clientVerified.result);
      setEvidenceVerification(payload.evidence ?? clientVerified.verification);
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
    setIsSample(true);
    setResult(null);
    setFallbackReason(null);
    setEvidenceVerification(null);
    setError(null);
    if (shouldAnalyze) void runAnalysis(demoAssignment, demoResponses, true);
    else document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startBlank() {
    setAssignment(emptyAssignment);
    setResponseText("");
    setIsSample(false);
    setResult(null);
    setModel(null);
    setFallbackReason(null);
    setEvidenceVerification(null);
    setError(null);
    window.localStorage.removeItem(DRAFT_KEY);
    window.setTimeout(
      () => document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  }

  function updateAssignment(nextAssignment: Assignment) {
    setAssignment(nextAssignment);
    setIsSample(false);
    setResult(null);
    setError(null);
  }

  function updateResponses(value: string) {
    setResponseText(value);
    setIsSample(false);
    setResult(null);
    setError(null);
  }

  return (
    <div className="site-shell">
      <Hero
        onTryDemo={() => loadDemo(true)}
        onAnalyzeResponses={() => document.getElementById("assignment")?.scrollIntoView({ behavior: "smooth" })}
        isLoading={isLoading}
        liveAnalysisAvailable={liveStatus?.available ?? null}
      />
      <AssignmentForm
        assignment={assignment}
        onAssignmentChange={updateAssignment}
        responseText={responseText}
        onResponseTextChange={updateResponses}
        parsedResponses={responses}
        onLoadDemo={() => loadDemo(false)}
        onStartBlank={startBlank}
        onAnalyze={() => void runAnalysis(assignment, responses, isSample)}
        isSample={isSample}
        liveAnalysisAvailable={liveStatus?.available ?? null}
        liveModel={liveStatus?.model ?? null}
        isLoading={isLoading}
        error={error}
      />
      {result ? (
        <AnalysisDashboard
          result={result}
          mode={mode}
          model={model}
          fallbackReason={fallbackReason}
          evidenceVerification={evidenceVerification}
          onStartNew={startBlank}
        />
      ) : (
        <section className="pre-analysis-note" aria-label="Product workflow">
          <span>COLLECT → UNDERSTAND → ACT</span>
          <h2>Every new set of math responses produces a new, reviewable evidence map.</h2>
          <p>Start blank for your own Grade 5–8 exit ticket, or use the labeled fraction sample. Live GPT‑5.6 analysis and precomputed demo mode are always identified.</p>
          <div>
            <button className="button button-primary" onClick={startBlank}>Start a new analysis <span aria-hidden="true">→</span></button>
            <button className="button button-ink" onClick={() => loadDemo(true)} disabled={isLoading}>Explore the sample</button>
          </div>
        </section>
      )}
      <BuiltWithCodex />
      <footer className="site-footer">
        <div className="brand"><span className="brand-mark" aria-hidden="true">M</span><span>Misconception Map</span></div>
        <p>See the reasoning. Correct the map. Teach tomorrow.</p>
        <div><a href="#impact">Teacher impact</a><a href="#built-with-codex">Built with Codex</a><span>Grade 5–8 math · Build Week 2026</span></div>
      </footer>
    </div>
  );
}
