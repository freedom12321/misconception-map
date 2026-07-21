# Misconception Map

> See how your students are thinking, not just who got it wrong.

Misconception Map is a teacher decision-support tool built for the OpenAI Build Week Education track. It turns anonymized student responses into evidence-based misconception patterns, targeted reteaching groups, review-ready student feedback, and a practical plan for tomorrow.

It is intentionally **not** an AI tutor, a diagnostic tool, or a generic auto-grader. Every major insight stays connected to exact language from submitted student work, and every output is framed for teacher review.

## Why it matters

Teachers can usually see which answers are incorrect. The harder, more valuable question is *why students answered that way*. Looking for shared reasoning patterns across a class takes time that teachers rarely have. Misconception Map makes that thinking visible while keeping instructional judgment with the teacher.

## Features

- Assignment context for subject, grade, objective, prompt, rubric, and teacher notes
- Blank custom-analysis workspace with local draft saving
- Plain-text and CSV response parsing, browser upload, and parsed-response preview
- Built-in 18-student middle school fractions demo
- Clearly labeled deterministic fallback for the sample class only
- Live GPT-5.6 structured analysis for all teacher-provided content
- Zod-validated response schema with no silent mock substitution
- Class overview and misconception distribution visualization
- Evidence-linked misconception cards with confidence and exact quotes
- Filterable anonymized student table with copyable feedback
- 10-minute mini lesson, targeted small groups, practice, exit ticket, and teacher script
- Markdown, CSV, and JSON downloads plus a copyable parent/admin summary
- Local draft persistence in `localStorage`
- Responsive, accessible teacher-facing interface

## Tech stack

- Next.js App Router / vinext
- React 19 and TypeScript
- Tailwind CSS 4 plus custom responsive CSS
- OpenAI JavaScript SDK
- Zod runtime validation
- Node test runner with `tsx`
- Cloudflare Worker-compatible Sites build

## Setup

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by the development server.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes for custom analysis | Enables live analysis of teacher-provided content. It is read only by the server route and is never exposed to the browser. |
| `OPENAI_MODEL` | No | Model used for live analysis. Defaults to `gpt-5.6`. |

Never commit `.env.local` or an API key.

## Custom and sample modes

The app opens as a blank workspace. Teachers can describe a task, paste or upload anonymized responses, preview the parsed work, and run a fresh GPT-5.6 analysis. A custom request without `OPENAI_API_KEY` returns an explicit configuration error and keeps the browser draft—it never substitutes a generic mock result.

The optional sample loads from **Explore sample demo** or **Load sample**. With a key configured, it uses the same live GPT-5.6 route. Without a key, only this labeled sample is allowed to use its deterministic evidence-linked fallback. The source fixture is [sample-data/fractions.csv](sample-data/fractions.csv), and the expected structured result is [sample-data/fractions-analysis.json](sample-data/fractions-analysis.json).

The header and result badge always disclose whether live or sample fallback mode is active.

## Three-minute judge demo

The shortest high-signal path is designed into the interface:

1. Start on the hero and point out the **Live GPT-5.6 connected** indicator.
2. Click **Analyze my class** to reveal the blank workspace. Show that assignment fields and student responses are genuinely editable.
3. Click **Load sample**, change one response or add a new anonymized response, and click **Analyze with GPT-5.6**. Editing the sample turns it into a custom live request.
4. Follow the on-screen **Judge demo path**: class pattern → exact evidence → tomorrow's teaching decision.
5. Open the first pattern card to show confidence, exact quotes, instructional risk, and targeted practice.
6. Filter the student table, copy one feedback note, then export the teacher Markdown report or student feedback CSV.
7. Click **Start a new analysis** to prove the workflow resets, then end on **Built with Codex**.

Avoid scrolling every table row or opening every cluster in the video; the product's value is the traceable path from evidence to instructional action.

## Live API mode

Add the following to `.env.local`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6
```

Restart the development server. Requests go to `POST /api/analyze`, which:

1. Validates the teacher input.
2. Calls the OpenAI Responses API with a structured Zod output format.
3. Validates the model result before returning it to the browser.
4. Returns the fresh validated result; custom requests never silently fall back to mock content.

If the live request fails, the teacher's local draft remains available. Only the built-in sample may use deterministic fallback.

## Scripts

```bash
npm run dev      # start the local development server
npm run build    # create the production build
npm run lint     # run ESLint
npm run typecheck # run the strict TypeScript check
npm test         # run parser, schema, export, and mock-analyzer tests
```

To regenerate the checked-in sample analysis after changing the mock analyzer:

```bash
npx tsx scripts/generate-sample.ts
```

## Exports

After running an analysis, scroll to **Take it with you**:

- **Teacher report (.md):** top priority, clusters, evidence, practice, small groups, lesson script, common wrong answers, exit ticket, and family/admin summary
- **Student feedback (.csv):** original response, status, pattern, confidence, teacher note, feedback, and next step for each anonymized ID
- **Full analysis (.json):** the complete validated result
- **Parent/admin summary:** copied directly to the clipboard

Downloads are generated in the browser. No database is used.

## Privacy and responsible use

- Use anonymized IDs, not student names.
- Analysis is based only on submitted responses and assignment context.
- Misconception Map does not diagnose students or infer sensitive attributes.
- Teacher review is required before using feedback or grouping decisions.
- In live mode, submitted content is sent to the configured OpenAI API account under that account's data controls.
- Local drafts are stored only in the current browser's `localStorage`.

## Project map

- `app/page.tsx` — client workflow and state
- `app/api/analyze/route.ts` — validated live/demo analysis route
- `components/` — product sections and interactions
- `lib/schema.ts` — shared TypeScript and Zod contracts
- `lib/mockAnalyzer.ts` — deterministic demo analysis
- `lib/openaiAnalyzer.ts` — OpenAI Responses API integration
- `lib/parseResponses.ts` — CSV and plain-text parsing
- `lib/exports.ts` — Markdown and feedback CSV exports
- `sample-data/` — judge-ready input and output fixtures
- `tests/` — parser, schema, exports, and mock analyzer coverage

## Known limitations

- Written responses can be incomplete or ambiguous; a classification is only a hypothesis for teacher review.
- The deterministic analyzer is intentionally restricted to the included fractions sample.
- Live analysis quality depends on the context and evidence supplied.
- The MVP has no accounts, shared workspaces, roster integration, or database.
- Browser storage is device-local and is not appropriate for a durable student record.

## Future improvements

- Teacher editing and confirmation of clusters before export
- Longitudinal misconception tracking across assignments
- LMS and roster integrations with stronger privacy controls
- Rubric import and multi-question assignment analysis
- Multilingual feedback review
- Classroom-level evaluation of cluster usefulness and teacher time saved
