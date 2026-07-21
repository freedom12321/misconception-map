"use client";

import { useState } from "react";
import type { AnalysisResult } from "../lib/schema";

type PlanTab = "overview" | "lesson" | "groups" | "exit";

export function ReteachingPlan({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState<PlanTab>("overview");
  const plan = result.reteachingPlan;

  return (
    <section className="plan-section dashboard-section" id="reteaching" aria-labelledby="plan-title">
      <div className="section-heading split-heading dashboard-heading">
        <div><p className="section-kicker">RETEACHING PLAN</p><h2 id="plan-title">Tomorrow is already taking shape.</h2><p>A practical sequence built from the reasoning patterns above. Edit with your classroom knowledge.</p></div>
        <div className="ten-minute-stamp"><strong>10</strong><span>minute<br />mini lesson</span></div>
      </div>
      <div className="plan-shell">
        <div className="plan-tabs" role="tablist" aria-label="Reteaching plan views">
          <button type="button" role="tab" aria-selected={tab === "overview"} className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Tomorrow at a glance</button>
          <button type="button" role="tab" aria-selected={tab === "lesson"} className={tab === "lesson" ? "active" : ""} onClick={() => setTab("lesson")}>Mini lesson</button>
          <button type="button" role="tab" aria-selected={tab === "groups"} className={tab === "groups" ? "active" : ""} onClick={() => setTab("groups")}>Small groups</button>
          <button type="button" role="tab" aria-selected={tab === "exit"} className={tab === "exit" ? "active" : ""} onClick={() => setTab("exit")}>Exit ticket</button>
        </div>

        <div className="plan-content" role="tabpanel" aria-live="polite">
          {tab === "overview" && (
            <div className="plan-overview-grid">
              <div className="tomorrow-card"><span className="micro-label">TOMORROW&apos;S PLAN</span><h3>One class period, four purposeful moves.</h3><p>{plan.tomorrowPlan}</p><ol><li><span>01</span><div><strong>Make the unit visible</strong><p>Lead the visual 10-minute mini lesson.</p></div></li><li><span>02</span><div><strong>Group by reasoning</strong><p>Use the {plan.smallGroups.length} teacher-reviewed groups shown here.</p></div></li><li><span>03</span><div><strong>Practice the exact gap</strong><p>Pull three questions from each misconception card.</p></div></li><li><span>04</span><div><strong>Check for transfer</strong><p>Close with a new unlike-denominator sum.</p></div></li></ol></div>
              <aside className="watch-card"><span className="micro-label">WATCH FOR</span><h3>Common wrong answers</h3><ul>{plan.commonWrongAnswers.map((item) => <li key={item}><span aria-hidden="true">!</span>{item}</li>)}</ul><div className="review-callout"><strong>Teacher review required</strong><p>Adjust pacing and group membership with what you know from discussion, models, and prior work.</p></div></aside>
            </div>
          )}

          {tab === "lesson" && (
            <div className="mini-lesson-grid">
              <div><span className="micro-label">OBJECTIVE</span><h3>{plan.tenMinuteMiniLesson.objective}</h3><div className="board-example"><span>ON THE BOARD</span><strong>{plan.tenMinuteMiniLesson.boardExample}</strong></div><div className="cfu-card"><span>✓</span><div><strong>Check for understanding</strong><p>{plan.tenMinuteMiniLesson.checkForUnderstanding}</p></div></div></div>
              <div className="script-card"><span className="micro-label">TEACHER SCRIPT</span><ol>{plan.tenMinuteMiniLesson.teacherScript.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></div>
            </div>
          )}

          {tab === "groups" && (
            <div className="small-groups-grid">
              {plan.smallGroups.map((group, index) => (
                <article key={group.groupName} style={{ "--group-index": index } as React.CSSProperties}><div className="group-card-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.groupName}</h3></div><div className="group-students">{group.studentIds.map((id) => <i key={id}>{id}</i>)}</div><h4>Small group focus</h4><p>{group.focus}</p><div className="group-activity"><strong>Try this</strong><p>{group.activity}</p></div></article>
              ))}
            </div>
          )}

          {tab === "exit" && (
            <div className="exit-ticket-wrap">
              <div className="exit-ticket-paper"><div className="ticket-top"><span>EXIT TICKET</span><span>{result.assignmentSummary.subject} · {result.assignmentSummary.gradeLevel}</span></div><h3>{plan.exitTicket.prompt}</h3><div className="writing-lines"><span /><span /><span /></div><div className="ticket-footer"><span>Student ID: __________</span><span>Teacher review: □</span></div></div>
              <aside><span className="micro-label">ANSWER & LOOK-FORS</span><h3>{plan.exitTicket.correctAnswer}</h3><ul>{plan.exitTicket.lookFors.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul><button className="button button-secondary" type="button" onClick={() => window.print()}>Print plan <span aria-hidden="true">↗</span></button></aside>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
