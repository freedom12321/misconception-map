import type { AnalysisResult } from "../lib/schema";
import { BuiltWithCodex } from "./BuiltWithCodex";
import { ExportPanel } from "./ExportPanel";
import { MisconceptionCard } from "./MisconceptionCard";
import { ReteachingPlan } from "./ReteachingPlan";
import { StudentTable } from "./StudentTable";

type AnalysisDashboardProps = {
  result: AnalysisResult;
  mode: "demo" | "live";
  model: string | null;
  fallbackReason?: string | null;
};

const barColors = ["coral", "gold", "blue", "purple", "rust", "sage"];

export function AnalysisDashboard({ result, mode, model, fallbackReason }: AnalysisDashboardProps) {
  const topPriority = result.misconceptions.find((item) => item.id === result.overview.topMisconceptionId) ?? result.misconceptions[0];
  const correctPercent = result.overview.totalResponses
    ? ((result.overview.correctCount + result.overview.nearCorrectCount) / result.overview.totalResponses) * 100
    : 0;
  const unclearPercent = result.overview.totalResponses
    ? (result.overview.unclearCount / result.overview.totalResponses) * 100
    : 0;

  return (
    <main className="analysis-wrap" id="analysis-results">
      <section className="analysis-intro">
        <div className="analysis-intro-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Analysis complete</div>
          <h2>Your class map is ready.</h2>
          <p>{result.overview.oneSentenceSummary}</p>
        </div>
        <div className="analysis-meta">
          <span className={`status-chip status-chip-${mode}`}><span />{mode === "live" ? `Live ${model ?? "GPT-5.6"} mode` : "Demo mode"}</span>
          <p>Based on {result.overview.totalResponses} submitted responses · Teacher review required</p>
        </div>
      </section>

      {fallbackReason && <div className="fallback-notice"><span aria-hidden="true">◇</span><div><strong>Demo analysis is active.</strong><p>{fallbackReason}</p></div></div>}

      <section className="overview-grid" aria-label="Analysis overview">
        <article><span>Total responses</span><strong>{result.overview.totalResponses}</strong><p>anonymized students</p></article>
        <article><span>Correct / mostly correct</span><strong>{result.overview.correctCount + result.overview.nearCorrectCount}</strong><p>{Math.round(correctPercent)}% showing secure thinking</p></article>
        <article className="overview-accent"><span>Misconception patterns</span><strong>{result.misconceptions.length}</strong><p>{result.overview.misconceptionCount} students need a next move</p></article>
        <article><span>Needs more context</span><strong>{result.overview.unclearCount}</strong><p>follow up before grouping</p></article>
      </section>

      <section className="insight-grid" aria-label="Misconception distribution and top priority">
        <article className="distribution-card">
          <div className="insight-card-heading"><div><p className="section-kicker">MISCONCEPTION DISTRIBUTION</p><h3>Where the class thinking is clustering</h3></div><span>{result.overview.totalResponses} responses</span></div>
          <div className="stacked-bar" aria-hidden="true">
            <i className="bar-secure" style={{ width: `${correctPercent}%` }} />
            {result.misconceptions.map((item, index) => <i key={item.id} className={`bar-${barColors[index % barColors.length]}`} style={{ width: `${item.percentOfClass}%` }} />)}
            {unclearPercent > 0 && <i className="bar-unclear" style={{ width: `${unclearPercent}%` }} />}
          </div>
          <div className="distribution-list">
            <div><span className="distribution-dot bar-secure" /><strong>Secure reasoning</strong><p>{result.overview.correctCount + result.overview.nearCorrectCount} students</p><b>{Math.round(correctPercent)}%</b></div>
            {result.misconceptions.map((item, index) => <div key={item.id}><span className={`distribution-dot bar-${barColors[index % barColors.length]}`} /><strong>{item.shortLabel}</strong><p>{item.studentIds.length} students</p><b>{Math.round(item.percentOfClass)}%</b></div>)}
            {result.overview.unclearCount > 0 && <div><span className="distribution-dot bar-unclear" /><strong>Needs more context</strong><p>{result.overview.unclearCount} student</p><b>{Math.round(unclearPercent)}%</b></div>}
          </div>
        </article>

        <article className="top-priority-card">
          <div className="priority-card-label"><span>01</span><p>TOP TEACHING PRIORITY</p></div>
          {topPriority ? <><h3>{topPriority.title}</h3><p>{topPriority.description}</p><div className="priority-evidence"><span>{topPriority.studentIds.length} students · {topPriority.percentOfClass}% of class</span>{topPriority.evidenceQuotes[0] && <blockquote>“{topPriority.evidenceQuotes[0].quote}”<small>— {topPriority.evidenceQuotes[0].studentId}</small></blockquote>}</div><a href={`#cluster-${topPriority.id}`} onClick={(event) => { event.preventDefault(); document.getElementById("misconceptions")?.scrollIntoView({ behavior: "smooth" }); }}>See evidence & next move <span aria-hidden="true">→</span></a></> : <p>No misconception pattern was identified.</p>}
        </article>
      </section>

      <section className="dashboard-section misconceptions-section" id="misconceptions" aria-labelledby="misconceptions-title">
        <div className="section-heading split-heading dashboard-heading"><div><p className="section-kicker">PATTERN CARDS</p><h2 id="misconceptions-title">The reasoning beneath the answers.</h2><p>Each pattern stays traceable to original student language and ends with a practical teaching move.</p></div><span className="evidence-badge"><i /> Evidence-linked insights</span></div>
        <div className="misconception-list">
          {result.misconceptions.map((item, index) => <div id={`cluster-${item.id}`} key={item.id}><MisconceptionCard item={item} rank={index + 1} /></div>)}
        </div>
      </section>

      <StudentTable result={result} />
      <ReteachingPlan result={result} />

      <section className="safety-section dashboard-section" id="safety" aria-labelledby="safety-title">
        <div><p className="section-kicker">EVIDENCE & SAFETY</p><h2 id="safety-title">Useful because it stays grounded.</h2><p>Misconception Map supports professional judgment. It does not turn a short answer into a student profile.</p></div>
        <div className="safety-grid">
          <article><span>01</span><h3>Submitted work only</h3><p>Analysis is based only on the responses and assignment context you provide.</p></article>
          <article><span>02</span><h3>No diagnosis</h3><p>The tool does not diagnose students or infer disability, identity, or background.</p></article>
          <article><span>03</span><h3>Teacher review required</h3><p>Use discussion, models, and classroom knowledge before acting on a pattern.</p></article>
          <article><span>04</span><h3>Anonymized by design</h3><p>Use student IDs, not real names. The demo never requires personally identifying data.</p></article>
        </div>
      </section>

      <ExportPanel result={result} />
      <BuiltWithCodex />
    </main>
  );
}

