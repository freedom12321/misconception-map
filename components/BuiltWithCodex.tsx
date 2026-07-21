export function BuiltWithCodex() {
  return (
    <section className="codex-section" id="built-with-codex" aria-labelledby="codex-title">
      <div className="codex-glow" />
      <div className="codex-heading"><p className="section-kicker">OPENAI BUILD WEEK · EDUCATION</p><h2 id="codex-title">Built with Codex.<br /><em>Powered by student thinking.</em></h2><p>The builder used Codex as an engineering, product-design, and QA collaborator to turn the instructional concept into a tested workflow. At runtime, GPT-5.6 creates the first evidence map; deterministic code then verifies every displayed quote, and the teacher can correct group placement without another model request.</p></div>
      <div className="codex-grid">
        <div className="codex-story"><span className="codex-mark">⌘</span><div><span className="micro-label">CODEX · BUILD TIME</span><h3>From builder decisions to tested product</h3><p>Codex accelerated the App Router architecture, shared Zod contracts, protected server route, quote-verification layer, teacher-correction state logic, evidence-first interface, exports, tests, responsive QA, and judging documentation.</p></div></div>
        <div className="codex-runtime"><span className="runtime-mark">5.6</span><div><span className="micro-label">GPT-5.6 · RUN TIME</span><h3>From submitted evidence to a structured first map</h3><p>When live mode is enabled, GPT-5.6 receives the assignment context and anonymized responses, groups supported reasoning patterns, cites exact quotes, and returns a schema-validated teaching plan for review.</p></div></div>
      </div>

      <div className="technical-pipeline" aria-label="Validated analysis pipeline">
        <div><span>01</span><strong>Teacher input</strong><p>Prompt, rubric, anonymized work</p></div><b aria-hidden="true">→</b>
        <div><span>02</span><strong>Request validation</strong><p>Zod checks every field</p></div><b aria-hidden="true">→</b>
        <div><span>03</span><strong>Structured analysis</strong><p>GPT-5.6; sample-only fallback</p></div><b aria-hidden="true">→</b>
        <div><span>04</span><strong>Evidence verification</strong><p>Non-exact quotes are removed</p></div><b aria-hidden="true">→</b>
        <div><span>05</span><strong>Teacher correction</strong><p>Local map and groups recalculate</p></div>
      </div>

      <div className="codex-capabilities"><article><span>01</span><div><strong>Product & interface</strong><p>Collect → Understand → Act journey, accessible interactions, responsive polish</p></div></article><article><span>02</span><div><strong>Reliable implementation</strong><p>Server-only secrets, exact-substring evidence checks, honest mode boundary</p></div></article><article><span>03</span><div><strong>Quality & handoff</strong><p>Review-loop tests, realistic fixtures, useful exports, docs, and demo script</p></div></article></div>
      <div className="model-ribbon"><div><span className="live-dot" /><strong>Live GPT-5.6 mode</strong><p>runs fresh server-side analysis of the submitted responses</p></div><div><span className="demo-symbol">◇</span><strong>Precomputed demo mode</strong><p>appears only as a labeled reliability fallback for the fraction sample</p></div></div>
    </section>
  );
}
