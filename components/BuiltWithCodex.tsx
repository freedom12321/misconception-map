export function BuiltWithCodex() {
  return (
    <section className="codex-section" id="built-with-codex" aria-labelledby="codex-title">
      <div className="codex-glow" />
      <div className="codex-heading"><p className="section-kicker">OPENAI BUILD WEEK · EDUCATION</p><h2 id="codex-title">Built with Codex.<br /><em>Powered by student thinking.</em></h2><p>Codex built the product system; GPT-5.6 performs the evidence-based analysis at runtime. The result is a complete teacher workflow—not a chatbot, not an auto-grader, and never a replacement for professional judgment.</p></div>
      <div className="codex-grid">
        <div className="codex-story"><span className="codex-mark">⌘</span><div><span className="micro-label">CODEX · BUILD TIME</span><h3>From instructional idea to tested product</h3><p>Codex scaffolded the App Router architecture, translated the coaching workflow into a shared Zod schema, implemented the protected API route and deterministic fallback, designed the evidence-first interface, built useful exports, and wrote the tests and judging materials.</p></div></div>
        <div className="codex-runtime"><span className="runtime-mark">5.6</span><div><span className="micro-label">GPT-5.6 · RUN TIME</span><h3>From submitted evidence to a structured first map</h3><p>When live mode is enabled, GPT-5.6 receives the assignment context and anonymized responses, groups supported reasoning patterns, cites exact quotes, and returns a schema-validated teaching plan for review.</p></div></div>
      </div>

      <div className="technical-pipeline" aria-label="Validated analysis pipeline">
        <div><span>01</span><strong>Teacher input</strong><p>Prompt, rubric, anonymized work</p></div><b aria-hidden="true">→</b>
        <div><span>02</span><strong>Request validation</strong><p>Zod checks every field</p></div><b aria-hidden="true">→</b>
        <div><span>03</span><strong>Structured analysis</strong><p>GPT-5.6 or deterministic demo</p></div><b aria-hidden="true">→</b>
        <div><span>04</span><strong>Response validation</strong><p>Unsafe shapes never reach the UI</p></div><b aria-hidden="true">→</b>
        <div><span>05</span><strong>Teacher decision</strong><p>Evidence, groups, feedback, plan</p></div>
      </div>

      <div className="codex-capabilities"><article><span>01</span><div><strong>Product & interface</strong><p>End-to-end teacher journey, accessible interactions, responsive polish</p></div></article><article><span>02</span><div><strong>Reliable implementation</strong><p>Shared schema, server-only secrets, safe fallback, evidence citations</p></div></article><article><span>03</span><div><strong>Quality & handoff</strong><p>Parser and export tests, realistic fixtures, docs, and demo script</p></div></article></div>
      <div className="model-ribbon"><div><span className="live-dot" /><strong>GPT-5.6</strong><p>powers live misconception analysis when API mode is enabled</p></div><div><span className="demo-symbol">◇</span><strong>Demo mode</strong><p>lets every judge explore the full experience without credentials</p></div></div>
    </section>
  );
}
