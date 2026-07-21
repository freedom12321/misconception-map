"use client";

import { useMemo, useState } from "react";
import type { AnalysisResult } from "../lib/schema";

const statusLabels = {
  correct: "Correct",
  near_correct: "Near correct",
  misconception: "Misconception",
  unclear: "Unclear",
};

export function StudentTable({ result }: { result: AnalysisResult }) {
  const [cluster, setCluster] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const clusterNames = new Map(result.misconceptions.map((item) => [item.id, item.shortLabel]));
  const students = useMemo(
    () => result.students.filter((student) => {
      const clusterMatch = cluster === "all" || (cluster === "secure" ? !student.misconceptionId : student.misconceptionId === cluster);
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
        <div><p className="section-kicker">STUDENT VIEW</p><h2 id="students-title">Keep every learner connected to the evidence.</h2><p>Review the suggested classification and copy warm, specific feedback one student at a time.</p></div>
        <span className="anonymized-badge">◉ Anonymized IDs only</span>
      </div>
      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find ID or response" aria-label="Search students" /></label>
          <label className="filter-field"><span>Filter by cluster</span><select value={cluster} onChange={(e) => setCluster(e.target.value)}><option value="all">All students ({result.students.length})</option><option value="secure">Secure / no cluster</option>{result.misconceptions.map((item) => <option value={item.id} key={item.id}>{item.shortLabel} ({item.studentIds.length})</option>)}</select></label>
          <span className="rows-count">Showing {students.length} of {result.students.length}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Student</th><th>Original response</th><th>Status</th><th>Pattern</th><th>Teacher note</th><th>Student-friendly feedback</th></tr></thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td><strong className="student-id-cell">{student.studentId}</strong><small>{Math.round(student.confidence * 100)}% conf.</small></td>
                  <td><p className="response-cell">“{student.response}”</p></td>
                  <td><span className={`student-status status-${student.status}`}><i />{statusLabels[student.status]}</span></td>
                  <td><span className="pattern-label">{student.misconceptionId ? clusterNames.get(student.misconceptionId) ?? "Review" : "—"}</span></td>
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

