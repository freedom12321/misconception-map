# Misconception Map — Devpost Submission

**Track:** Education  
**One-line pitch:** Misconception Map helps teachers turn a pile of student answers into a clear map of class-wide misconceptions, targeted reteaching groups, personalized feedback, and practice activities.

## Project description

Teachers often know who missed a question but do not have enough time to understand how every student was thinking. Misconception Map turns anonymized written responses into an evidence-linked view of class reasoning. It identifies shared misconception patterns, shows the exact student language behind each pattern, and converts those insights into concrete next instructional moves.

The product is teacher decision support—not an AI tutor, diagnostic tool, or black-box auto-grader. Every cluster is presented as a reviewable hypothesis, and teacher judgment remains explicit throughout the experience.

## What it does

A teacher adds an assignment prompt, learning objective, rubric, and a set of anonymized responses. Misconception Map then provides:

- A visual class-wide distribution of thinking patterns
- Three to six useful misconception clusters
- Exact response snippets as evidence
- Student IDs and confidence for each cluster
- Teacher-facing notes and student-friendly feedback
- Suggested next moves and targeted practice
- A 10-minute mini lesson, small groups, teacher script, and exit ticket
- Markdown, CSV, and JSON exports

Judges can load an 18-response fractions class and see a complete analysis in seconds without creating an account or adding credentials.

## How it works

The browser parses plain text or CSV into anonymized response records. A server route validates the assignment and responses with Zod. If an OpenAI key is available, the route sends the evidence and rubric to the OpenAI Responses API and requests a strict structured output. The returned analysis is validated again before it reaches the UI.

When no API key is present—or a live request fails—the app switches safely to a deterministic analyzer for the built-in fractions dataset. That mode returns realistic misconception clusters, evidence quotes, feedback, practice, and a reteaching plan, making the full judging experience reliable.

## How GPT-5.6 is used

GPT-5.6 powers live misconception analysis when API mode is enabled. The model is asked to act as an instructional coach: group similar reasoning errors, cite exact evidence, distinguish uncertainty, avoid unsupported claims, and generate teacher-usable next steps. The model name is set with `OPENAI_MODEL` and defaults to `gpt-5.6`.

The live response is constrained by a structured JSON schema and validated at runtime. API credentials stay on the server.

## How Codex was used

Codex accelerated the project from product brief to complete full-stack MVP. It helped:

- Scaffold and organize the App Router application
- Translate instructional requirements into a shared TypeScript/Zod schema
- Build deterministic sample data and misconception logic
- Implement the protected OpenAI route and failure fallback
- Design and polish the responsive teacher workflow
- Create parser and export utilities
- Write tests, documentation, and the less-than-three-minute demo script
- Verify lint, test, and production build behavior

## Technical implementation

- Next.js App Router / vinext, React, and TypeScript
- Tailwind CSS plus a custom responsive design system
- OpenAI JavaScript SDK and Responses API
- Zod input and output validation
- Server-side secret handling
- Local state and `localStorage`; no database or authentication
- Node test runner with TypeScript support
- Cloudflare Worker-compatible build and hosting configuration

## Impact

Misconception Map shortens the distance between collecting student work and deciding what to teach next. Instead of spending planning time manually sorting 20–30 answers, a teacher gets a reviewable first map organized around reasoning. The payoff is not faster grading—it is more targeted instruction, clearer feedback, and better use of small-group time.

## What makes it novel

Most education AI products center the student-chatbot interaction or automate a score. Misconception Map centers the teacher's class-level decision. Its unit of value is a shared reasoning pattern with cited evidence and an actionable teaching response. That makes the AI output auditable, instructionally specific, and useful even before a teacher speaks to an individual student.

## How judges can run it

1. Install dependencies with `npm install`.
2. Start with `npm run dev`.
3. Open the printed local URL.
4. Click **Try demo class**.
5. Explore the distribution, evidence cards, student feedback, reteaching plan, and exports.

No API key is needed for the full demo. To test live mode, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL=gpt-5.6`, then restart the server.

## Suggested tags

`education` `teachers` `assessment-for-learning` `GPT-5.6` `Codex` `structured-output` `responsible-ai` `Next.js`

