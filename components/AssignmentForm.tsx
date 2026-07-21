"use client";

import { useRef, useState } from "react";
import type { Assignment } from "../lib/schema";

type AssignmentFormProps = {
  assignment: Assignment;
  onAssignmentChange: (assignment: Assignment) => void;
  responseText: string;
  onResponseTextChange: (value: string) => void;
  parsedCount: number;
  onLoadDemo: () => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
};

export function AssignmentForm({
  assignment,
  onAssignmentChange,
  responseText,
  onResponseTextChange,
  parsedCount,
  onLoadDemo,
  onAnalyze,
  isLoading,
  error,
}: AssignmentFormProps) {
  const [inputMode, setInputMode] = useState<"paste" | "csv">("paste");
  const fileRef = useRef<HTMLInputElement>(null);

  function updateField(field: keyof Assignment, value: string) {
    onAssignmentChange({ ...assignment, [field]: value });
  }

  async function handleFile(file?: File) {
    if (!file) return;
    onResponseTextChange(await file.text());
    setInputMode("csv");
  }

  return (
    <section className="workspace-section" id="assignment" aria-labelledby="assignment-title">
      <div className="section-heading split-heading">
        <div>
          <p className="section-kicker">NEW ANALYSIS</p>
          <h2 id="assignment-title">Bring the learning moment into focus.</h2>
          <p>Give the map enough context to interpret the thinking—not just score the answer.</p>
        </div>
        <button className="button button-secondary load-demo-button" onClick={onLoadDemo} type="button">
          <span aria-hidden="true">↻</span> Load demo class
        </button>
      </div>

      <div className="setup-card">
        <div className="form-section-title">
          <span>01</span>
          <div><h3>Assignment context</h3><p>What were students learning and responding to?</p></div>
        </div>
        <div className="form-grid form-grid-three">
          <label>
            <span>Subject</span>
            <input value={assignment.subject} onChange={(e) => updateField("subject", e.target.value)} placeholder="e.g. Mathematics" />
          </label>
          <label>
            <span>Grade level</span>
            <input value={assignment.gradeLevel} onChange={(e) => updateField("gradeLevel", e.target.value)} placeholder="e.g. Grade 6" />
          </label>
          <label className="span-two">
            <span>Learning objective</span>
            <input value={assignment.learningObjective} onChange={(e) => updateField("learningObjective", e.target.value)} placeholder="What should students understand or do?" />
          </label>
        </div>
        <div className="form-grid form-grid-two">
          <label>
            <span>Question / prompt</span>
            <textarea rows={5} value={assignment.question} onChange={(e) => updateField("question", e.target.value)} />
          </label>
          <label>
            <span>Correct answer or rubric</span>
            <textarea rows={5} value={assignment.correctAnswer} onChange={(e) => updateField("correctAnswer", e.target.value)} />
          </label>
        </div>
        <label className="full-label">
          <span>Teacher notes <small>Optional</small></span>
          <textarea rows={2} value={assignment.teacherNotes} onChange={(e) => updateField("teacherNotes", e.target.value)} placeholder="What have you taught already? What should the analysis pay attention to?" />
        </label>

        <div className="form-divider" />

        <div className="form-section-title response-title">
          <span>02</span>
          <div><h3>Student responses</h3><p>Use anonymized IDs only—no student names.</p></div>
          <div className="input-tabs" role="tablist" aria-label="Response input format">
            <button className={inputMode === "paste" ? "active" : ""} onClick={() => setInputMode("paste")} type="button">Plain text</button>
            <button className={inputMode === "csv" ? "active" : ""} onClick={() => setInputMode("csv")} type="button">CSV</button>
          </div>
        </div>

        <div className="response-input-wrap">
          <textarea
            className="response-input"
            rows={12}
            value={responseText}
            onChange={(e) => onResponseTextChange(e.target.value)}
            aria-label="Student responses"
            placeholder={inputMode === "csv" ? "student_id,response\nS01,Your response here" : "S01: Student response here\nS02: Another response"}
          />
          <div className="response-input-footer">
            <span><b>{parsedCount}</b> responses detected</span>
            <button type="button" onClick={() => fileRef.current?.click()}><span aria-hidden="true">↑</span> Upload CSV</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" hidden onChange={(e) => void handleFile(e.target.files?.[0])} />
          </div>
        </div>

        {error && <div className="error-banner" role="alert"><strong>We hit a snag.</strong> {error}</div>}

        <div className="form-submit-row">
          <div className="privacy-hint">
            <span aria-hidden="true">◉</span>
            <p><strong>Built for responsible review</strong><br />Insights stay tied to submitted evidence. No diagnosis, no hidden student profile.</p>
          </div>
          <button className="button button-primary button-analyze" onClick={onAnalyze} disabled={isLoading || parsedCount === 0} type="button">
            {isLoading ? <><span className="spinner" /> Mapping student thinking…</> : <>Analyze {parsedCount || ""} responses <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </div>
    </section>
  );
}

