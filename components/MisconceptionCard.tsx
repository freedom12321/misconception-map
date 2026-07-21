"use client";

import { useState } from "react";
import type { AnalysisResult } from "../lib/schema";

type Misconception = AnalysisResult["misconceptions"][number];

export function MisconceptionCard({ item, rank }: { item: Misconception; rank: number }) {
  const [showPractice, setShowPractice] = useState(false);
  return (
    <article className="misconception-card">
      <div className="misconception-card-top">
        <span className="cluster-rank">{String(rank).padStart(2, "0")}</span>
        <div className="cluster-heading-copy">
          <div className="cluster-meta-row">
            <span className={`severity severity-${item.severity}`}>{item.severity} priority</span>
            <span>{item.studentIds.length} students · {item.percentOfClass}% of class</span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
        <div className="confidence-block">
          <strong>{Math.round(item.confidence * 100)}%</strong>
          <span>confidence</span>
        </div>
      </div>

      <div className="student-id-row" aria-label="Students in this cluster">
        {item.studentIds.map((id) => <span key={id}>{id}</span>)}
      </div>

      <div className="cluster-details-grid">
        <div className="cluster-detail">
          <span className="detail-icon">?</span>
          <div><h4>Likely reasoning pattern</h4><p>{item.likelyReasoning}</p></div>
        </div>
        <div className="cluster-detail">
          <span className="detail-icon">!</span>
          <div><h4>Why this matters</h4><p>{item.instructionalRisk}</p></div>
        </div>
      </div>

      <div className="evidence-panel">
        <div className="evidence-panel-heading">
          <span><i /> Evidence from student work</span>
          <small>Exact submitted language</small>
        </div>
        {item.evidenceQuotes.length > 0 ? <div className="quote-grid">
          {item.evidenceQuotes.map((evidence) => (
            <blockquote key={`${evidence.studentId}-${evidence.quote}`}>
              <span>{evidence.studentId}</span>
              “{evidence.quote}”
            </blockquote>
          ))}
        </div> : <p className="empty-evidence-note">No verified quote remains for this teacher-adjusted pattern. Review the original responses in Students before acting.</p>}
      </div>

      <div className="teacher-move">
        <div className="move-label"><span aria-hidden="true">→</span><strong>Suggested next move</strong></div>
        <p>{item.teacherMove}</p>
        <button className="text-button" type="button" onClick={() => setShowPractice((value) => !value)} aria-expanded={showPractice}>
          {showPractice ? "Hide practice" : "Show targeted practice"} <span aria-hidden="true">{showPractice ? "↑" : "↗"}</span>
        </button>
      </div>

      {showPractice && (
        <div className="practice-panel">
          <div className="practice-heading">
            <div><span className="micro-label">READY TO USE</span><h4>Targeted practice for this pattern</h4></div>
            <p>{item.miniLessonSuggestion}</p>
          </div>
          <ol>
            {item.practiceQuestions.map((practice, index) => (
              <li key={practice.question}>
                <span>{index + 1}</span>
                <div><strong>{practice.question}</strong><p><b>Expected:</b> {practice.expectedAnswer}</p><small>{practice.purpose}</small></div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}
