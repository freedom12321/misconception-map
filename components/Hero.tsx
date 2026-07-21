type HeroProps = {
  onTryDemo: () => void;
  onAnalyzeResponses: () => void;
  isLoading: boolean;
  liveAnalysisAvailable: boolean | null;
};

export function Hero({
  onTryDemo,
  onAnalyzeResponses,
  isLoading,
  liveAnalysisAvailable,
}: HeroProps) {
  return (
    <header className="hero-shell">
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Misconception Map home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Misconception Map</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Teacher impact</a>
          <a href="#built-with-codex">Build Week</a>
        </div>
        <button className="button button-small button-ink" onClick={onAnalyzeResponses}>
          Analyze a math exit ticket <span aria-hidden="true">↗</span>
        </button>
      </nav>

      <div className="hero-grid" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Grade 5–8 math exit tickets</div>
          <h1>
            See the reasoning. Correct the map.
            <em> Teach tomorrow.</em>
          </h1>
          <p className="hero-lede">
            Misconception Map is an evidence-verified, teacher-correctable instructional planning tool for Grade 5–8 math exit tickets. It turns student reasoning into misconception clusters, targeted small groups, and a next-day reteaching plan.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={onAnalyzeResponses}>
              Analyze a math exit ticket
              <span className="button-arrow" aria-hidden="true">→</span>
            </button>
            <button className="button button-secondary" onClick={onTryDemo} disabled={isLoading}>
              {isLoading ? "Mapping the sample…" : "Analyze fraction demo"}
            </button>
          </div>
          <div className="trust-row" aria-label="Product guardrails">
            <span>
              {liveAnalysisAvailable === true
                ? "✓ Live GPT-5.6 connected"
                : liveAnalysisAvailable === false
                  ? "○ Live GPT-5.6 setup pending"
                  : "○ Checking live analysis"}
            </span>
            <span>✓ Anonymized by design</span>
            <span>✓ Teacher review required</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Example class analysis preview">
          <div className="visual-orbit visual-orbit-one" />
          <div className="visual-orbit visual-orbit-two" />
          <div className="class-pulse-card">
            <div className="card-window-heading">
              <div>
                <span className="micro-label">CLASS PULSE</span>
                <h2>Fraction addition</h2>
              </div>
              <span className="status-chip status-chip-demo"><span /> Demo ready</span>
            </div>
            <div className="pulse-main">
              <div className="donut" aria-label="33 percent secure, 61 percent misconception, 6 percent unclear">
                <div><strong>18</strong><span>responses</span></div>
              </div>
              <div className="pulse-legend">
                <div><span className="legend-dot dot-teal" /><strong>6</strong><p>Secure reasoning</p></div>
                <div><span className="legend-dot dot-coral" /><strong>11</strong><p>Misconception</p></div>
                <div><span className="legend-dot dot-gold" /><strong>1</strong><p>Needs context</p></div>
              </div>
            </div>
            <div className="priority-strip">
              <span className="priority-number">01</span>
              <div>
                <span className="micro-label">TOP TEACHING PRIORITY</span>
                <strong>Adding fractions straight across</strong>
                <p>“2/5 because 1+1=2 and 2+3=5.”</p>
              </div>
              <span className="confidence-pill">98% match</span>
            </div>
            <div className="preview-footer">
              <span><i className="mini-avatar">S02</i><i className="mini-avatar">S08</i><i className="mini-avatar">S15</i></span>
              <span>Evidence from student work <b aria-hidden="true">→</b></span>
            </div>
          </div>
          <div className="floating-note floating-note-one">
            <span>Small group focus</span>
            <strong>Meaning before method</strong>
          </div>
          <div className="floating-note floating-note-two">
            <span aria-hidden="true">✓</span>
            <p><strong>Tomorrow’s plan</strong><br />ready for teacher review</p>
          </div>
        </div>
      </div>

      <section className="steps-strip" id="how-it-works" aria-labelledby="steps-title">
        <p className="section-kicker" id="steps-title">FROM ANSWERS TO ACTION</p>
        <div className="steps-grid">
          <article>
            <span className="step-number">01</span>
            <div><h3>Collect</h3><p>Add the math prompt, expected reasoning, and anonymized exit-ticket responses.</p></div>
          </article>
          <article>
            <span className="step-number">02</span>
            <div><h3>Understand</h3><p>See shared reasoning patterns, inspect exact evidence, and correct the map.</p></div>
          </article>
          <article>
            <span className="step-number">03</span>
            <div><h3>Act</h3><p>Turn reviewed patterns into targeted groups and a next-day teaching plan.</p></div>
          </article>
        </div>
      </section>

      <section className="impact-proof" id="impact" aria-labelledby="impact-title">
        <div className="impact-copy">
          <p className="section-kicker">WHY THIS MATTERS</p>
          <h2 id="impact-title">Evidence, correction, then action—not a score.</h2>
          <p>Unlike an AI grader, Misconception Map does not reduce student work to a score. It identifies reasoning patterns, verifies the supporting evidence, lets teachers correct the map, and turns the result into a next-day teaching plan.</p>
        </div>
        <div className="impact-equation" aria-label="Raw responses become misconception patterns, targeted groups, and a next-day lesson">
          <div><strong>Raw</strong><span>student responses</span></div>
          <b aria-hidden="true">→</b>
          <div><strong>Map</strong><span>misconception patterns</span></div>
          <b aria-hidden="true">→</b>
          <div><strong>Group</strong><span>targeted students</span></div>
          <b aria-hidden="true">→</b>
          <div><strong>Act</strong><span>next-day lesson</span></div>
        </div>
        <div className="impact-guardrail"><span>Teacher stays in control</span><strong>Evidence, not verdicts.</strong><p>Every recommendation is a hypothesis tied to student work and marked for teacher review.</p></div>
      </section>
    </header>
  );
}
