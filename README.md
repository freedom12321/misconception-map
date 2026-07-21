# Misconception Map

> See the reasoning. Correct the map. Teach tomorrow.

Misconception Map is an **evidence-verified, teacher-correctable instructional planning tool for Grade 5–8 math exit tickets**. It turns student reasoning into misconception clusters, targeted small groups, and a next-day reteaching plan.

Unlike an AI grader, Misconception Map does not reduce student work to a score. It identifies reasoning patterns, verifies the supporting evidence, lets teachers correct the map, and turns the result into a next-day teaching plan.

## Product flow

1. **Collect** — add a math prompt, expected reasoning, and anonymized student responses by paste, CSV upload, or one response at a time.
2. **Understand** — inspect the misconception distribution, top teaching priority, exact evidence, and student placements.
3. **Act** — use teacher-reviewed groups, a 10-minute mini lesson, targeted practice, and an exit ticket for the next day.

The result workspace has three primary views: **Misconception Map**, **Students**, and **Teach Tomorrow**. Exports, safety information, and Built with Codex documentation remain secondary.

## What is implemented

- Blank custom-analysis workspace with local draft saving
- Primary 18-response Grade 6 fraction exit-ticket sample
- Plain-text parsing, CSV parsing/upload, and **Add one response**
- Live server-side GPT-5.6 analysis through the OpenAI Responses API
- Zod-structured model output plus server and client validation
- Deterministic exact-substring verification of every displayed evidence quote
- Automatic removal of unverifiable quotes; the **Evidence Verified** badge appears only after a complete pass
- Above-the-fold response count, teaching priority, distribution, first move, mode, and evidence status
- Teacher Review Loop for locally reassigning a student to any pattern, secure reasoning, or **Needs teacher review**
- Local recalculation of student IDs, counts, percentages, top priority, and small-group membership without another model request
- Teacher-adjusted Markdown, CSV, JSON, and shareable planning-summary exports
- Explicit education-safety guardrails and honest live/demo labeling

## Builder decisions

- **Product:** focus on one high-value job for Grade 5–8 math teachers instead of expanding into grading, tutoring, administration, or generic chat.
- **Engineering:** keep the API key on the server, validate structured output, verify evidence deterministically, and make teacher corrections local and immediate.
- **Design:** organize the journey as Collect → Understand → Act; put the decision summary above the fold; keep evidence next to interpretation; make the three teacher tasks the primary navigation.
- **Safety:** treat model classifications as reviewable hypotheses, never grades, diagnoses, or fixed student profiles.

Codex accelerated implementation of these builder decisions: application architecture, schemas, server route, evidence verifier, local recalculation logic, interface system, responsive polish, exports, tests, and submission documentation. See [CODEX_USAGE.md](CODEX_USAGE.md) for the full build/runtime distinction.

## Tech stack

- Next.js App Router / vinext, React 19, and TypeScript
- OpenAI JavaScript SDK and Responses API
- Zod structured output and runtime validation
- Tailwind CSS 4 plus a custom responsive design system
- Node test runner with `tsx`
- Cloudflare Worker-compatible Sites build

## Local setup

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
```

Add the server secret to `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6
```

Then start the app:

```bash
npm run dev
```

Never commit `.env.local` or place the key in a `NEXT_PUBLIC_` variable. For production, configure `OPENAI_API_KEY` as a secret and `OPENAI_MODEL=gpt-5.6` in the hosting environment, then redeploy.

### Public repository safety

- `.env.local`, `.env*`, build output, Wrangler logs, and the local Sites binding are ignored.
- Commit `.env.example` only; it contains no credential.
- `.openai/hosting.example.json` is a placeholder. Keep the real `.openai/hosting.json` local.
- Before every public push, run `git grep -l -E 'sk-(proj-)?[A-Za-z0-9_-]{16,}'` and confirm it returns no files.

## Live mode and demo mode

- **Live GPT-5.6 mode:** when `OPENAI_API_KEY` is configured, both custom responses and the fraction sample make a fresh server-side request. The result displays a live model badge.
- **Precomputed demo mode:** when no key is configured, only the built-in fraction sample can use the deterministic fallback. Custom responses return an explicit setup error. A precomputed result is never labeled as live AI.

`POST /api/analyze` validates input, calls GPT-5.6 when configured, validates the structured result, removes non-exact evidence quotes, and returns separate mode and evidence-verification metadata. The API key never reaches the browser.

## Sample data

Use **Analyze fraction demo** for the shortest flow, or **Load sample** to inspect and edit the input first. The source fixture is [sample-data/fractions.csv](sample-data/fractions.csv); the deterministic fallback is [sample-data/fractions-analysis.json](sample-data/fractions-analysis.json).

With a key configured, loading the sample does **not** force a mock result: clicking Analyze sends those 18 responses through the same live GPT-5.6 route. Editing or adding a response turns the workspace into a custom live request.

To regenerate the checked-in deterministic fallback after intentional mock-analyzer changes:

```bash
npx tsx scripts/generate-sample.ts
```

## Testing

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Tests cover parsing, request limits, honest route fallback, schema validation, exact evidence verification, removal of fabricated quotes, teacher reassignment, stale-ID prevention in small groups, and useful exports.

## Three-minute judging demo

1. **0:00–0:25 — Positioning:** show the Grade 5–8 math focus, Collect → Understand → Act, and the exact “Unlike an AI grader…” differentiation.
2. **0:25–0:50 — Real input:** open the workspace, load the fraction sample, add a new anonymized response, and point to **Live GPT-5.6 connected**.
3. **0:50–1:20 — Live proof:** click Analyze and show the **Live GPT-5.6** and **Evidence Verified** badges beside the above-the-fold priority, distribution, and first move.
4. **1:20–1:50 — Evidence:** in **Misconception Map**, show exact student quotes and the grounded teacher interpretation.
5. **1:50–2:20 — Teacher control:** in **Students**, move one student to another cluster. Show **Teacher adjusted**, changed counts, and the updated small-group roster without rerunning AI.
6. **2:20–2:42 — Action:** open **Teach Tomorrow** and show “What I would teach tomorrow,” one small group, and the exit ticket.
7. **2:42–3:00 — Implementation:** download the teacher report, then show **Built with Codex** and explain build-time Codex versus runtime GPT-5.6.

## Safety and limitations

- Teacher review is required before acting on classifications, groups, or feedback.
- Analysis is based only on the submitted responses and assignment context.
- Use anonymized student IDs, never real names.
- This tool does not diagnose students or infer disability, identity, background, or a fixed profile.
- Written exit-ticket responses can be incomplete; a pattern is an instructional hypothesis.
- Browser drafts are device-local and are not a durable student record.

## Key files

- `app/api/analyze/route.ts` — live/demo boundary and verified response envelope
- `lib/openaiAnalyzer.ts` — server-side GPT-5.6 structured analysis
- `lib/evidence.ts` — deterministic exact-substring evidence verification
- `lib/teacherReview.ts` — local cluster, percentage, overview, and group recalculation
- `components/AnalysisDashboard.tsx` — three-view teacher decision workspace
- `lib/exports.ts` — teacher report, action sheet, structured JSON, and planning summary
- `tests/` — route, evidence, teacher review, parsing, schema, mock, and export tests

## Submission placeholder

Required `/feedback` Codex Session ID: **TODO — paste the session ID from the Codex `/feedback` command into the Devpost submission form.**
