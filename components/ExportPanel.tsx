"use client";

import { useState } from "react";
import { exportFeedbackCsv, exportPlanningSummary, exportTeacherMarkdown } from "../lib/exports";
import type { AnalysisResult } from "../lib/schema";

function downloadHref(content: string, type: string) {
  return `data:${type};charset=utf-8,${encodeURIComponent(content)}`;
}

export function ExportPanel({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  async function copySummary() {
    await navigator.clipboard.writeText(exportPlanningSummary(result));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="export-section dashboard-section" id="exports" aria-labelledby="export-title">
      <div className="export-heading"><div><p className="section-kicker">TAKE IT WITH YOU</p><h2 id="export-title">From insight to the next conversation.</h2><p>Download the evidence in the format that fits your planning, feedback, or team meeting.</p></div><span className="export-lock">◉ Local download</span></div>
      <div className="export-grid">
        <a download="misconception-map-teacher-report.md" href={downloadHref(exportTeacherMarkdown(result), "text/markdown")}><span className="file-type">MD</span><div><strong>Teacher report</strong><p>Priority, evidence, groups, script, and exit ticket</p></div><i>↓</i></a>
        <a download="misconception-map-student-feedback.csv" href={downloadHref(exportFeedbackCsv(result), "text/csv")}><span className="file-type">CSV</span><div><strong>Student action sheet</strong><p>Original work, reviewed cluster, current group, feedback, and next step</p></div><i>↓</i></a>
        <a download="misconception-map-analysis.json" href={downloadHref(JSON.stringify(result, null, 2), "application/json")}><span className="file-type">JSON</span><div><strong>Full analysis</strong><p>Structured data for your own workflow</p></div><i>↓</i></a>
        <button onClick={() => void copySummary()} type="button"><span className="file-type summary-type">¶</span><div><strong>Shareable planning summary</strong><p>{copied ? "Copied to your clipboard" : "Current counts, priority, and guardrails"}</p></div><i>{copied ? "✓" : "⧉"}</i></button>
      </div>
    </section>
  );
}
