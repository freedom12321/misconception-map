"use client";

import { useState } from "react";
import { exportFeedbackCsv, exportTeacherMarkdown } from "../lib/exports";
import type { AnalysisResult } from "../lib/schema";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  async function copySummary() {
    await navigator.clipboard.writeText(result.parentOrAdminSummary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="export-section dashboard-section" id="exports" aria-labelledby="export-title">
      <div className="export-heading"><div><p className="section-kicker">TAKE IT WITH YOU</p><h2 id="export-title">From insight to the next conversation.</h2><p>Download the evidence in the format that fits your planning, feedback, or team meeting.</p></div><span className="export-lock">◉ Local download</span></div>
      <div className="export-grid">
        <button onClick={() => download("misconception-map-teacher-report.md", exportTeacherMarkdown(result), "text/markdown")} type="button"><span className="file-type">MD</span><div><strong>Teacher report</strong><p>Clusters, evidence, and the full teaching plan</p></div><i>↓</i></button>
        <button onClick={() => download("misconception-map-student-feedback.csv", exportFeedbackCsv(result), "text/csv")} type="button"><span className="file-type">CSV</span><div><strong>Student feedback</strong><p>One review-ready row per anonymized ID</p></div><i>↓</i></button>
        <button onClick={() => download("misconception-map-analysis.json", JSON.stringify(result, null, 2), "application/json")} type="button"><span className="file-type">JSON</span><div><strong>Full analysis</strong><p>Structured data for your own workflow</p></div><i>↓</i></button>
        <button onClick={() => void copySummary()} type="button"><span className="file-type summary-type">¶</span><div><strong>Parent / admin summary</strong><p>{copied ? "Copied to your clipboard" : "Clear, supportive, and jargon-free"}</p></div><i>{copied ? "✓" : "⧉"}</i></button>
      </div>
    </section>
  );
}

