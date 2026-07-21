# How Codex Accelerated Misconception Map

Codex was used as an engineering, product-design, QA, and submission collaborator for this Build Week project. The builder made the product and instructional decisions; Codex accelerated their implementation, verification, and documentation.

## Decisions made by the builder

### Product decisions

- Serve Grade 5–8 math teachers reviewing exit-ticket explanations.
- Solve one workflow: raw responses → misconception patterns → targeted groups → next-day lesson.
- Avoid authentication, databases, school administration, generic chat, subject expansion, and automatic grading.
- Keep teachers in control by making the first map correctable before use.

### Engineering decisions

- Use GPT-5.6 only on the server and keep `OPENAI_API_KEY` out of browser code and source control.
- Require structured Zod output rather than rendering unconstrained model text.
- Independently verify every evidence quote as an exact substring of the matching submitted response.
- Remove failed evidence before rendering and disclose the verification result separately from analysis mode.
- Recalculate teacher adjustments locally, without a second model call, while preventing stale student IDs in small groups.
- Permit deterministic fallback only for the labeled fraction sample.

### Design decisions

- Use Collect → Understand → Act as the product narrative.
- Make Misconception Map, Students, and Teach Tomorrow the three primary result views.
- Put total responses, top teaching priority, distribution, first move, live/demo mode, and evidence state above the fold.
- Keep exports, safety, and Built with Codex visible but secondary.
- Use realistic anonymous student language and avoid unsupported outcome or time-saved claims.

## Specific implementation accelerated by Codex

- Next.js/vinext App Router structure and TypeScript component boundaries
- Shared request/result schemas and OpenAI structured-output contract
- Protected `/api/analyze` route and honest live/sample fallback behavior
- Exact-substring evidence verifier with invalid-quote removal
- Teacher Review Loop and deterministic recalculation of clusters, overview counts, percentages, and small groups
- Responsive evidence-first dashboard, interaction states, accessibility labels, and visual QA
- Plain-text and CSV ingestion, one-response input, local draft persistence, and realistic fraction fixtures
- Markdown teacher report, CSV student action sheet, JSON export, and shareable planning summary
- Automated tests for routes, schemas, parsing, evidence fidelity, teacher adjustments, stale IDs, and exports
- README, demo sequence, safety language, and submission handoff

## How GPT-5.6 is used at runtime

When live mode is available, the browser sends assignment context and anonymized responses to `POST /api/analyze`. The server:

1. validates the input request;
2. calls the OpenAI Responses API with `gpt-5.6`, `store: false`, and a Zod structured-output format;
3. validates the returned misconception map;
4. checks each quote against the corresponding original response and removes any non-exact quote;
5. returns the result with distinct `mode`, `model`, and evidence-verification metadata.

GPT-5.6 creates the first instructional map. Deterministic application code verifies evidence. The teacher makes the final placement decisions. This is not an auto-grader or a teacher replacement.

## Live mode versus precomputed demo mode

- **Live GPT-5.6 mode:** a fresh runtime analysis from the configured server secret. Both custom content and the built-in sample use this path when a key is present.
- **Precomputed demo mode:** a deterministic reliability fallback restricted to the built-in fraction sample when the live connection is unavailable. The interface explicitly labels it and never calls it live AI.
- A custom request without live configuration fails honestly and keeps the browser draft; it never receives a generic mock result.

## Sample data instructions

- Click **Analyze fraction demo** for the direct judging path.
- Click **Load sample** to inspect the 18 anonymous Grade 6 responses before analysis.
- Add a new `S##` response or edit a response to demonstrate that custom data is supported.
- With `OPENAI_API_KEY` configured, click **Analyze with GPT-5.6** for a fresh result.
- Source: `sample-data/fractions.csv`; deterministic fallback: `sample-data/fractions-analysis.json`.

## Testing instructions

Run all release gates from the repository root:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Evidence tests prove that exact substrings remain, fabricated quotes are removed, and a failed pass cannot display the **Evidence Verified** badge. Teacher-review tests prove that cluster IDs, counts, percentages, and group membership recalculate and that no student ID remains in an old group.

## Runtime secret setup

Local `.env.local` and the production hosting environment must contain:

```bash
OPENAI_API_KEY=your_server_secret
OPENAI_MODEL=gpt-5.6
```

The key must never use a `NEXT_PUBLIC_` prefix and must never be committed. Configure it as a production secret, then redeploy.

## Required submission field

`/feedback` Codex Session ID: **TODO — run `/feedback` in the Codex session where the majority of core functionality was built, then paste that Session ID into the Devpost form.**
