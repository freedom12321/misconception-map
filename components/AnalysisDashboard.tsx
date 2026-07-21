"use client";

import { useState } from "react";
import type { EvidenceVerification } from "../lib/evidence";
import type { AnalysisResult } from "../lib/schema";
import { reassignStudent, studentPlacement } from "../lib/teacherReview";
import { ExportPanel } from "./ExportPanel";
import { MisconceptionCard } from "./MisconceptionCard";
import { ReteachingPlan } from "./ReteachingPlan";
import { StudentTable } from "./StudentTable";

type AnalysisDashboardProps = {
  result: AnalysisResult;
  mode: "demo" | "live";
  model: string | null;
  fallbackReason?: string | null;
  evidenceVerification: EvidenceVerification | null;
  onStartNew: () => void;
};

type ResultTab = "map" | "students" | "teach";
const barColors = ["coral", "gold", "blue", "purple", "rust", "sage"];

export function AnalysisDashboard({
  result,
  mode,
  model,
  fallbackReason,
  evidenceVerification,
  onStartNew,
}: AnalysisDashboardProps) {
  const [reviewedResult, setReviewedResult] = useState(result);
  const [activeTab, setActiveTab] = useState<ResultTab>("map");
  const [adjustedStudentIds, setAdjustedStudentIds] = useState<Set<string>>(new Set());
  const topPriority = reviewedResult.misconceptions.find(
    (item) => item.id === reviewedResult.overview.topMisconceptionId,
  ) ?? reviewedResult.misconceptions.find((item) => item.studentIds.length > 0);
  const secureCount = reviewedResult.overview.correctCount + reviewedResult.overview.nearCorrectCount;
  const correctPercent = reviewedResult.overview.totalResponses
    ? (secureCount / reviewedResult.overview.totalResponses) * 100
    : 0;
  const unclearPercent = reviewedResult.overview.totalResponses
    ? (reviewedResult.overview.unclearCount / reviewedResult.overview.totalResponses) * 100
    : 0;

  function handleReassign(studentId: string, placement: string) {
    setReviewedResult((current) => reassignStudent(current, result, studentId, placement));
    const originalStudent = result.students.find((student) => student.studentId === studentId);
    setAdjustedStudentIds((current) => {
      const next = new Set(current);
      if (originalStudent && studentPlacement(originalStudent) === placement) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  return (
    <main className="analysis-wrap" id="analysis-results">
      <section className="analysis-intro">
        <div className="analysis-intro-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Understand → Act</div>
          <h2>Your evidence map is ready for review.</h2>
          <p>{reviewedResult.overview.oneSentenceSummary}</p>
        </div>
        <div className="analysis-meta">
          <div className="result-badges">
            <span className={`status-chip status-chip-${mode}`}><span />{mode === "live" ? `Live ${model ?? "GPT-5.6"}` : "Precomputed demo"}</span>
            {evidenceVerification?.verified ? (
              <span className="evidence-verified-badge"><i />Evidence Verified · {evidenceVerification.checkedQuotes} quotes</span>
            ) : (
              <span className="evidence-filtered-badge">{evidenceVerification?.removedQuotes ? `Evidence filtered · ${evidenceVerification.removedQuotes} removed` : "Evidence not verified · no exact quotes"}</span>
            )}
            {adjustedStudentIds.size > 0 && <span className="teacher-adjusted-badge">✓ Teacher adjusted · {adjustedStudentIds.size}</span>}
          </div>
          <p>Based only on submitted responses · Teacher review required</p>
          <button className="text-button results-new-button" type="button" onClick={onStartNew}>Start a new analysis <span aria-hidden="true">↗</span></button>
        </div>
      </section>

      {fallbackReason && <div className="fallback-notice"><span aria-hidden="true">◇</span><div><strong>Precomputed demo mode is active.</strong><p>{fallbackReason}</p></div></div>}

      <nav className="result-journey" aria-label="Product workflow">
        <span className="complete"><i>01</i><strong>Collect</strong><small>{reviewedResult.overview.totalResponses} anonymized responses</small></span>
        <b aria-hidden="true">→</b>
        <span className="active"><i>02</i><strong>Understand</strong><small>Verify and correct the map</small></span>
        <b aria-hidden="true">→</b>
        <span><i>03</i><strong>Act</strong><small>Teach tomorrow</small></span>
      </nav>

      <section className="result-hero-grid" aria-label="Immediate analysis summary">
        <article className="result-total-card">
          <p className="section-kicker">TOTAL STUDENT RESPONSES</p>
          <strong>{reviewedResult.overview.totalResponses}</strong>
          <span>anonymized Grade 5–8 math explanations</span>
        </article>

        <article className="result-priority-card">
          <div><p className="section-kicker">TOP TEACHING PRIORITY</p>{topPriority && <span>{topPriority.studentIds.length} students · {Math.round(topPriority.percentOfClass)}%</span>}</div>
          {topPriority ? <><h3>{topPriority.title}</h3><p>{topPriority.description}</p><strong>Why first: {topPriority.instructionalRisk}</strong></> : <><h3>No shared priority yet</h3><p>Review individual responses before assigning a whole-class reteaching move.</p></>}
        </article>

        <article className="result-distribution-card">
          <div><p className="section-kicker">MISCONCEPTION DISTRIBUTION</p><span>{secureCount} secure · {reviewedResult.overview.misconceptionCount} clustered · {reviewedResult.overview.unclearCount} review</span></div>
          <div className="stacked-bar" aria-label={`${Math.round(correctPercent)} percent secure reasoning`}>
            <i className="bar-secure" style={{ width: `${correctPercent}%` }} />
            {reviewedResult.misconceptions.map((item, index) => <i key={item.id} className={`bar-${barColors[index % barColors.length]}`} style={{ width: `${item.percentOfClass}%` }} />)}
            {unclearPercent > 0 && <i className="bar-unclear" style={{ width: `${unclearPercent}%` }} />}
          </div>
          <div className="distribution-chips"><span><i className="bar-secure" />Secure {Math.round(correctPercent)}%</span>{reviewedResult.misconceptions.filter((item) => item.studentIds.length > 0).map((item, index) => <span key={item.id}><i className={`bar-${barColors[index % barColors.length]}`} />{item.shortLabel} {Math.round(item.percentOfClass)}%</span>)}{unclearPercent > 0 && <span><i className="bar-unclear" />Review {Math.round(unclearPercent)}%</span>}</div>
        </article>

        <article className="result-first-move-card">
          <div><span>01</span><p className="section-kicker">SUGGESTED FIRST TEACHING MOVE</p></div>
          <h3>{topPriority?.teacherMove ?? "Conference before grouping"}</h3>
          <p>This is a planning hypothesis, not an automatic grade. Confirm it with student talk and classroom evidence.</p>
        </article>
      </section>

      <nav className="result-tabs" role="tablist" aria-label="Analysis results">
        <button type="button" role="tab" aria-selected={activeTab === "map"} className={activeTab === "map" ? "active" : ""} onClick={() => setActiveTab("map")}><span>01</span>Misconception Map</button>
        <button type="button" role="tab" aria-selected={activeTab === "students"} className={activeTab === "students" ? "active" : ""} onClick={() => setActiveTab("students")}><span>02</span>Students{adjustedStudentIds.size > 0 && <i>{adjustedStudentIds.size}</i>}</button>
        <button type="button" role="tab" aria-selected={activeTab === "teach"} className={activeTab === "teach" ? "active" : ""} onClick={() => setActiveTab("teach")}><span>03</span>Teach Tomorrow</button>
      </nav>

      <div className="primary-result-panel" role="tabpanel">
        {activeTab === "map" && (
          <>
            {topPriority && (
              <section className="evidence-spotlight dashboard-section" aria-labelledby="evidence-title">
                <div className="bridge-heading"><span>EV</span><div><p className="section-kicker">EVIDENCE FROM STUDENT WORK</p><h2 id="evidence-title">The priority stays traceable to exact student language.</h2></div></div>
                {topPriority.evidenceQuotes.length > 0 ? (
                  <div className="bridge-quotes">{topPriority.evidenceQuotes.slice(0, 3).map((evidence) => <blockquote key={`${evidence.studentId}-${evidence.quote}`}><span>{evidence.studentId}</span>“{evidence.quote}”</blockquote>)}</div>
                ) : (
                  <div className="no-evidence-callout"><strong>No verified quote is displayed for this teacher-adjusted cluster.</strong><p>Open Students to review the original responses before acting.</p></div>
                )}
                <p className="evidence-interpretation"><strong>Teacher interpretation:</strong> {topPriority.likelyReasoning}</p>
                <small>Exact substring check against the submitted response · No inferred student profile</small>
              </section>
            )}

            <section className="dashboard-section misconceptions-section" id="misconceptions" aria-labelledby="misconceptions-title">
              <div className="section-heading split-heading dashboard-heading"><div><p className="section-kicker">MISCONCEPTION MAP</p><h2 id="misconceptions-title">The reasoning beneath the answers.</h2><p>Each pattern ends with a practical teaching move. Teacher adjustments update this map locally.</p></div><span className={evidenceVerification?.verified ? "evidence-badge" : "anonymized-badge"}><i /> {evidenceVerification?.verified ? "Verified evidence only" : "Unverified quotes removed"}</span></div>
              <div className="misconception-list">{reviewedResult.misconceptions.filter((item) => item.studentIds.length > 0).map((item, index) => <div id={`cluster-${item.id}`} key={item.id}><MisconceptionCard item={item} rank={index + 1} /></div>)}</div>
            </section>
          </>
        )}

        {activeTab === "students" && <StudentTable result={reviewedResult} adjustedStudentIds={adjustedStudentIds} onReassign={handleReassign} />}

        {activeTab === "teach" && (
          <>
            <section className="tomorrow-summary dashboard-section" aria-labelledby="tomorrow-summary-title">
              <div><p className="section-kicker">WHAT I WOULD TEACH TOMORROW</p><h2 id="tomorrow-summary-title">Meaning before method.</h2><p>{reviewedResult.reteachingPlan.tomorrowPlan}</p></div>
              <ol><li><span>10 min</span><strong>{reviewedResult.reteachingPlan.tenMinuteMiniLesson.objective}</strong></li><li><span>{reviewedResult.reteachingPlan.smallGroups.length} groups</span><strong>Target each verified reasoning pattern</strong></li><li><span>Exit ticket</span><strong>{reviewedResult.reteachingPlan.exitTicket.prompt}</strong></li></ol>
            </section>
            <ReteachingPlan result={reviewedResult} />
          </>
        )}
      </div>

      <nav className="secondary-results-nav" aria-label="Secondary result tools"><span>SECONDARY TOOLS</span><a href="#safety">Safety & limitations</a><a href="#exports">Useful exports</a><a href="#built-with-codex">Built with Codex</a></nav>

      <section className="safety-section dashboard-section" id="safety" aria-labelledby="safety-title">
        <div><p className="section-kicker">EVIDENCE & SAFETY</p><h2 id="safety-title">Decision support with clear limits.</h2><p>Misconception Map supports professional judgment. It is not an auto-grader or a teacher replacement.</p></div>
        <div className="safety-grid">
          <article><span>01</span><h3>Teacher review required</h3><p>Confirm patterns using discussion, models, prior work, and classroom knowledge.</p></article>
          <article><span>02</span><h3>Submitted responses only</h3><p>Analysis is based only on the responses and assignment context provided.</p></article>
          <article><span>03</span><h3>Anonymized student IDs</h3><p>Use IDs such as S01, never student names or personally identifying data.</p></article>
          <article><span>04</span><h3>This tool does not diagnose students</h3><p>It does not infer disability, identity, background, or a fixed student profile.</p></article>
        </div>
      </section>

      <ExportPanel result={reviewedResult} />
    </main>
  );
}
