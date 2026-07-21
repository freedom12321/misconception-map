"use client";

import { useRef, useState } from "react";
import type { Assignment, StudentResponse } from "../lib/schema";

type AssignmentFormProps = {
  assignment: Assignment;
  onAssignmentChange: (assignment: Assignment) => void;
  responseText: string;
  onResponseTextChange: (value: string) => void;
  parsedResponses: StudentResponse[];
  onLoadDemo: () => void;
  onStartBlank: () => void;
  onAnalyze: () => void;
  isSample: boolean;
  liveAnalysisAvailable: boolean | null;
  liveModel: string | null;
  isLoading: boolean;
  error: string | null;
};

export function AssignmentForm({
  assignment,
  onAssignmentChange,
  responseText,
  onResponseTextChange,
  parsedResponses,
  onLoadDemo,
  onStartBlank,
  onAnalyze,
  isSample,
  liveAnalysisAvailable,
  liveModel,
  isLoading,
  error,
}: AssignmentFormProps) {
  const [inputMode, setInputMode] = useState<"paste" | "csv">("paste");
  const fileRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLTextAreaElement>(null);
  const parsedCount = parsedResponses.length;
  const requiredFields = [
    assignment.subject,
    assignment.gradeLevel,
    assignment.learningObjective,
    assignment.question,
    assignment.correctAnswer,
  ];
  const completedContext = requiredFields.filter((value) => value.trim()).length;

  function updateField(field: keyof Assignment, value: string) {
    onAssignmentChange({ ...assignment, [field]: value });
  }

  async function handleFile(file?: File) {
    if (!file) return;
    onResponseTextChange(await file.text());
    setInputMode("csv");
  }

  function addResponseLine() {
    const nextId = `S${String(parsedCount + 1).padStart(2, "0")}`;
    const spacer = responseText.trim() ? "\n" : "";
    onResponseTextChange(`${responseText.trimEnd()}${spacer}${nextId}: `);
    window.setTimeout(() => responseRef.current?.focus(), 0);
  }

  return (
    <section className="workspace-section" id="assignment" aria-labelledby="assignment-title">
      <div className="section-heading split-heading">
        <div>
          <p className="section-kicker">NEW ANALYSIS</p>
          <h2 id="assignment-title">Bring a math exit ticket into focus.</h2>
          <p>Add the exact task and expected reasoning so the map can interpret thinking—not auto-grade an answer.</p>
        </div>
        <div className="workspace-heading-actions">
          <button className="button button-secondary" onClick={onStartBlank} type="button">
            <span aria-hidden="true">＋</span> Start blank
          </button>
          <button className="button button-secondary load-demo-button" onClick={onLoadDemo} type="button">
            <span aria-hidden="true">◇</span> Load sample
          </button>
        </div>
      </div>

      <div className="setup-card">
        <div className={`workspace-status ${liveAnalysisAvailable ? "workspace-status-live" : "workspace-status-offline"}`}>
          <div>
            <span className="status-light" aria-hidden="true" />
            <p>
              <strong>
                {liveAnalysisAvailable === null
                  ? "Checking the analysis connection…"
                  : liveAnalysisAvailable
                    ? `${liveModel ?? "GPT-5.6"} live analysis is ready`
                    : "Custom analysis needs the server connection"}
              </strong>
              <small>
                {liveAnalysisAvailable
                  ? "Your anonymized responses will produce a fresh, schema-validated result."
                  : "You can build and save a draft now. Only the labeled sample can use deterministic fallback."}
              </small>
            </p>
          </div>
          <span className="workspace-source">{isSample ? "Sample class loaded" : "My class workspace"}</span>
        </div>

        <div className="workflow-ribbon" aria-label="Custom analysis workflow">
          <div className={completedContext === 5 ? "complete" : ""}><span>01</span><p><strong>Collect context</strong>{completedContext}/5 required fields complete</p></div>
          <div className={parsedCount > 0 ? "complete" : ""}><span>02</span><p><strong>Collect student work</strong>{parsedCount || 0} responses detected</p></div>
          <div><span>03</span><p><strong>Understand → Act</strong>Verify, correct, group, and plan</p></div>
        </div>

        <div className="form-section-title">
          <span>01</span>
          <div><h3>Assignment context</h3><p>What were students learning and responding to?</p></div>
        </div>
        <div className="form-grid form-grid-three">
          <label>
            <span>Subject</span>
            <select value={assignment.subject} onChange={(e) => updateField("subject", e.target.value)}><option value="">Select subject</option><option value="Mathematics">Mathematics</option></select>
          </label>
          <label>
            <span>Grade level</span>
            <select value={assignment.gradeLevel} onChange={(e) => updateField("gradeLevel", e.target.value)}><option value="">Select grade</option>{[5, 6, 7, 8].map((grade) => <option key={grade} value={`Grade ${grade}`}>Grade {grade}</option>)}</select>
          </label>
          <label className="span-two">
            <span>Learning objective</span>
            <input value={assignment.learningObjective} onChange={(e) => updateField("learningObjective", e.target.value)} placeholder="What should students understand or do?" />
          </label>
        </div>
        <div className="form-grid form-grid-two">
          <label>
            <span>Question / prompt</span>
            <textarea rows={5} value={assignment.question} onChange={(e) => updateField("question", e.target.value)} placeholder="Paste the exact question students answered." />
          </label>
          <label>
            <span>Correct answer or rubric</span>
            <textarea rows={5} value={assignment.correctAnswer} onChange={(e) => updateField("correctAnswer", e.target.value)} placeholder="What would strong reasoning include? Add scoring guidance if relevant." />
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
            <button role="tab" aria-selected={inputMode === "paste"} className={inputMode === "paste" ? "active" : ""} onClick={() => setInputMode("paste")} type="button">Plain text</button>
            <button role="tab" aria-selected={inputMode === "csv"} className={inputMode === "csv" ? "active" : ""} onClick={() => setInputMode("csv")} type="button">CSV</button>
          </div>
        </div>

        <div className="response-input-wrap">
          <textarea
            ref={responseRef}
            className="response-input"
            rows={12}
            value={responseText}
            onChange={(e) => onResponseTextChange(e.target.value)}
            aria-label="Student responses"
            placeholder={inputMode === "csv" ? "student_id,response\nS01,Your response here" : "S01: Student response here\nS02: Another response"}
          />
          <div className="response-input-footer">
            <span><b>{parsedCount}</b> responses detected</span>
            <div>
              <button type="button" onClick={addResponseLine}><span aria-hidden="true">＋</span> Add one response</button>
              <button type="button" onClick={() => fileRef.current?.click()}><span aria-hidden="true">↑</span> Upload CSV</button>
            </div>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" hidden onChange={(e) => void handleFile(e.target.files?.[0])} />
          </div>
        </div>
        <p className="response-format-hint">{inputMode === "csv" ? "CSV columns: student_id,response. Quoted commas are supported." : "Use one response per line, beginning with an anonymized ID such as S01:"}</p>

        {parsedResponses.length > 0 && (
          <div className="response-preview" aria-label="Parsed response preview">
            <div><strong>Parsed student work</strong><span>Showing {Math.min(3, parsedCount)} of {parsedCount}</span></div>
            <ul>
              {parsedResponses.slice(0, 3).map((response) => (
                <li key={response.studentId}><span>{response.studentId}</span><p>{response.response}</p></li>
              ))}
            </ul>
          </div>
        )}

        {error && <div className="error-banner" role="alert"><strong>We hit a snag.</strong> {error}</div>}

        <div className="form-submit-row">
          <div className="privacy-hint">
            <span aria-hidden="true">◉</span>
            <p><strong>Teacher review required</strong><br />Submitted evidence only · Anonymized IDs · No diagnosis</p>
          </div>
          <button className="button button-primary button-analyze" onClick={onAnalyze} disabled={isLoading || parsedCount === 0} type="button">
            {isLoading ? <><span className="spinner" /> Mapping student thinking…</> : <>{isSample ? "Analyze sample" : "Analyze with GPT-5.6"} <span aria-hidden="true">→</span></>}
          </button>
        </div>
      </div>
    </section>
  );
}
