# Misconception Map — Devpost Submission Copy

**Category:** Education
**Tagline:** Turn Grade 5–8 math exit-ticket reasoning into an evidence-verified, teacher-correctable plan for tomorrow.

## Project description

Misconception Map is an evidence-verified, teacher-correctable instructional planning tool for Grade 5–8 math exit tickets. It turns raw student reasoning into misconception clusters, targeted small groups, and a next-day reteaching plan.

Unlike an AI grader, Misconception Map does not reduce student work to a score. It identifies reasoning patterns, verifies the supporting evidence, lets teachers correct the map, and turns the result into a next-day teaching plan.

## The problem

An incorrect answer does not tell a teacher why a student chose it or whether several students share the same hidden rule. Reviewing a class set of written explanations and translating them into groups and lesson decisions is cognitively demanding. Misconception Map creates a reviewable first map while keeping instructional judgment with the teacher.

## How it works

1. **Collect:** The teacher adds the math prompt, expected reasoning, and anonymized responses by paste, CSV, upload, or one response at a time.
2. **Understand:** GPT-5.6 produces a structured first map. Deterministic application code validates the schema and verifies every displayed quote as an exact substring of the matching original response. Non-exact quotes are removed.
3. **Act:** The teacher can reassign any student locally. Counts, percentages, top priority, and small-group membership recalculate without another model request. The reviewed map becomes a mini lesson, groups, targeted practice, and an exit ticket.

## GPT-5.6 at runtime

The server-side `/api/analyze` route validates the submitted context and anonymized responses, calls the OpenAI Responses API with `gpt-5.6`, requests Zod-structured output, validates the result, and runs an independent evidence-verification pass before returning it. The API key remains in a server environment variable and never reaches the browser.

When the key is unavailable, only the labeled fraction sample may use its deterministic precomputed fallback. Custom responses never silently receive a mock result, and live versus demo mode is always disclosed.

## Teacher Review Loop

The Students view lets the teacher move a student to another misconception, Secure reasoning, or Needs teacher review. This interaction is deterministic and local: it does not call GPT-5.6 again and it prevents stale student IDs from remaining in prior small groups.

## How Codex was used

The builder used Codex as an engineering, product-design, QA, and submission collaborator. Codex accelerated the App Router architecture, shared Zod contracts, protected server route, evidence verifier, teacher-correction logic, responsive dashboard, exports, automated tests, browser QA, and documentation. Product scope, educational framing, safety boundaries, and final design decisions remained builder decisions.

## Safety

- Teacher review is required.
- Analysis is based only on submitted responses and assignment context.
- Use anonymized student IDs, never names.
- The tool does not diagnose students or infer a fixed profile.
- It is not an auto-grader or teacher replacement.

## Technology

`OpenAI GPT-5.6` · `Codex` · `OpenAI Responses API` · `Next.js` · `React` · `TypeScript` · `Zod` · `Cloudflare-compatible Sites runtime`

## Judge testing path

1. Open the public project URL.
2. Click **Analyze fraction demo**.
3. Confirm the **Live GPT-5.6** and **Evidence Verified** badges.
4. Open **Misconception Map** and inspect exact student evidence.
5. Open **Students**, reassign S02, and confirm the distribution changes without rerunning AI.
6. Open **Teach Tomorrow** and inspect the updated groups and exit ticket.
7. Download the teacher report or student action sheet.

## Required links to add before submission

- Public project URL: `TODO`
- Public or judge-shared GitHub repository: `TODO`
- Public YouTube demo under three minutes: `TODO`
- `/feedback` Codex Session ID: `TODO`
