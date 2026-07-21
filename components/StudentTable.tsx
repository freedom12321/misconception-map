"use client";

import { useMemo, useState } from "react";
import type { AnalysisResult } from "../lib/schema";
import {
  SECURE_REASONING,
  studentPlacement,
  TEACHER_REVIEW,
} from "../lib/teacherReview";

const statusLabels = {
  correct: "Correct",
  near_correct: "Near correct",
  misconception: "Misconception",
  unclear: "Unclear",
};

type StudentTableProps = {
  result: AnalysisResult;
  adjustedStudentIds: Set<string>;
  onReassign: (studentId: string, placement: string) => void;
};

export function StudentTable({ result, adjustedStudentIds, onReassign }: StudentTableProps) {
  const [cluster, setCluster] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const clusterNames = new Map(result.misconceptions.map((item) => [item.id, item.shortLabel]));
  const students = useMemo(
    () => result.students.filter((student) => {
      const placement = studentPlacement(student);
      const clusterMatch = cluster === "all" || placement === cluster;
      const queryMatch = !query || student.studentId.toLowerCase().includes(query.toLowerCase()) || student.response.toLowerCase().includes(query.toLowerCase());
      return clusterMatch && queryMatch;
    }),
    [cluster, query, result.students],
  );

  async function copyFeedback(studentId: string, feedback: string) {
    await navigator.clipboard.writeText(feedback);
    setCopied(studentId);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <section className="dashboard-section" id="students" aria-labelledby="students-title">
      <div className="section-heading split-heading dashboard-heading">
        <div><p className="section-kicker">TEACHER REVIEW LOOP</p><h2 id="students-title">Correct the map with classroom knowledge.</h2><p>Reassign any student locally. Counts, distribution, and small groups update immediately—no new model request.</p></div>
        <span className={adjustedStudentIds.size ? "teacher-adjusted-badge" : "anonymized-badge"}>{adjustedStudentIds.size ? `✓ Teacher adjusted · ${adjustedStudentIds.size}` : "◉ Anonymized IDs only"}</span>
      </div>
      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find ID or response" aria-label="Search students" /></label>
          <label className="filter-field"><span>Filter by placement</span><select value={cluster} onChange={(e) => setCluster(e.target.value)}><option value="all">All students ({result.students.length})</option><option value={SECURE_REASONING}>Secure reasoning</option><option value={TEACHER_REVIEW}>Needs teacher review</option>{result.misconceptions.map((item) => <option value={item.id} key={item.id}>{item.shortLabel} ({item.studentIds.length})</option>)}</select></label>
          <span className="rows-count">Showing {students.length} of {result.students.length}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Student</th><th>Original response</th><th>Status</th><th>Pattern</th><th>Teacher note</th><th>Student-friendly feedback</th></tr></thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td><strong className="student-id-cell">{student.studentId}</strong><small>{adjustedStudentIds.has(student.studentId) ? "Teacher set" : `${Math.round(student.confidence * 100)}% conf.`}</small>{adjustedStudentIds.has(student.studentId) && <span className="row-adjusted-badge">Teacher adjusted</span>}</td>
                  <td><p className="response-cell">“{student.response}”</p></td>
                  <td><span className={`student-status status-${student.status}`}><i />{statusLabels[student.status]}</span></td>
                  <td><label className="placement-select"><span className="sr-only">Reassign {student.studentId}</span><select aria-label={`Reassign ${student.studentId}`} value={studentPlacement(student)} onChange={(event) => onReassign(student.studentId, event.target.value)}><option value={SECURE_REASONING}>Secure reasoning</option><option value={TEACHER_REVIEW}>Needs teacher review</option>{result.misconceptions.map((item) => <option key={item.id} value={item.id}>{clusterNames.get(item.id)}</option>)}</select></label></td>
                  <td><p className="teacher-note-cell">{student.teacherNote}</p></td>
                  <td><div className="feedback-cell"><p>{student.studentFeedback}</p><button onClick={() => void copyFeedback(student.studentId, student.studentFeedback)} type="button" aria-label={`Copy feedback for ${student.studentId}`}>{copied === student.studentId ? "Copied ✓" : "Copy feedback"}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <div className="empty-state"><strong>No students match this view.</strong><p>Try another cluster or clear your search.</p></div>}
        </div>
      </div>
    </section>
  );
}
