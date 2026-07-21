type HeroProps = {
  onTryDemo: () => void;
  onAnalyzeResponses: () => void;
  isLoading: boolean;
};

export function Hero({ onTryDemo, onAnalyzeResponses, isLoading }: HeroProps) {
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
          Analyze responses <span aria-hidden="true">↗</span>
        </button>
      </nav>

      <div className="hero-grid" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Teacher decision support</div>
          <h1>
            See how your students are thinking,
            <em> not just who got it wrong.</em>
          </h1>
          <p className="hero-lede">
            Turn a pile of student answers into evidence-based misconception
            patterns, ready-to-teach groups, and feedback you can use tomorrow.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={onTryDemo} disabled={isLoading}>
              {isLoading ? "Mapping the class…" : "Try demo class"}
              <span className="button-arrow" aria-hidden="true">→</span>
            </button>
            <button className="button button-secondary" onClick={onAnalyzeResponses}>
              Analyze my responses
            </button>
          </div>
          <div className="trust-row" aria-label="Product guardrails">
            <span>✓ Demo works without a key</span>
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
            <p><strong>Tomorrow’s plan</strong><br />ready in seconds</p>
          </div>
        </div>
      </div>

      <section className="steps-strip" id="how-it-works" aria-labelledby="steps-title">
        <p className="section-kicker" id="steps-title">FROM ANSWERS TO ACTION</p>
        <div className="steps-grid">
          <article>
            <span className="step-number">01</span>
            <div><h3>Bring the student work</h3><p>Paste a question and anonymized responses, or load our demo class.</p></div>
          </article>
          <article>
            <span className="step-number">02</span>
            <div><h3>See the thinking patterns</h3><p>Spot shared reasoning errors with exact evidence from original answers.</p></div>
          </article>
          <article>
            <span className="step-number">03</span>
            <div><h3>Teach the next move</h3><p>Get small groups, feedback, practice, and a 10-minute mini lesson.</p></div>
          </article>
        </div>
      </section>

      <section className="impact-proof" id="impact" aria-labelledby="impact-title">
        <div className="impact-copy">
          <p className="section-kicker">WHY THIS MATTERS</p>
          <h2 id="impact-title">From a stack of answers to one reviewable teaching decision.</h2>
          <p>Misconception Map does not replace a teacher or declare a final grade. It shortens the first-pass review so teachers can spend their time confirming patterns, listening to students, and choosing the right next move.</p>
        </div>
        <div className="impact-equation" aria-label="18 student explanations become 4 shared reasoning patterns and 1 plan for tomorrow">
          <div><strong>18</strong><span>student explanations</span></div>
          <b aria-hidden="true">→</b>
          <div><strong>4</strong><span>shared reasoning patterns</span></div>
          <b aria-hidden="true">→</b>
          <div><strong>1</strong><span>plan for tomorrow</span></div>
        </div>
        <div className="impact-guardrail"><span>Teacher stays in control</span><strong>Evidence, not verdicts.</strong><p>Every recommendation is a hypothesis tied to student work and marked for teacher review.</p></div>
      </section>
    </header>
  );
}
