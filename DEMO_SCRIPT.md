# Misconception Map — 3-Minute Demo Script

**Target:** 2:50–2:58
**Required:** Public YouTube video with voiceover explaining both Codex and GPT-5.6.

## 0:00–0:22 — Positioning

**On screen:** Hero and Collect → Understand → Act.

**Voiceover:** “Misconception Map is an evidence-verified, teacher-correctable planning tool for Grade 5–8 math exit tickets. Unlike an AI grader, it does not reduce student work to a score. It identifies reasoning patterns, verifies the evidence, lets teachers correct the map, and turns the result into a next-day teaching plan.”

## 0:22–0:48 — Real input

**On screen:** Open the workspace, load the fraction sample, and add S19 with a short anonymous response.

**Voiceover:** “Teachers can enter their own prompt and anonymous responses by paste, CSV, upload, or one at a time. I’m using the primary Grade 6 fraction exit ticket and adding a new response to show this is a real input workflow, not a preset slideshow.”

## 0:48–1:15 — Live GPT-5.6 proof

**On screen:** Click Analyze. Cut the loading time. Land on the above-the-fold result.

**Voiceover:** “At runtime, the protected server route calls GPT-5.6 through the Responses API and requires structured Zod output. The API key stays on the server. This Live GPT-5.6 badge proves the result is fresh; precomputed fallback is separately labeled and restricted to the sample.”

Point to:

- Total student responses
- Top Teaching Priority
- Misconception distribution
- Suggested First Teaching Move
- Live GPT-5.6
- Evidence Verified

## 1:15–1:42 — Evidence verification

**On screen:** Open Misconception Map and show Evidence from Student Work.

**Voiceover:** “The model does not get the final word on evidence. Deterministic code checks every displayed quote against the corresponding original response and removes anything that is not an exact substring. Evidence Verified appears only when that pass succeeds.”

## 1:42–2:12 — Teacher Review Loop

**On screen:** Open Students. Move S02 from Add across to another cluster.

**Voiceover:** “This is a first map, not an automatic verdict. I can correct S02’s placement using classroom knowledge. The Teacher adjusted badge appears, cluster counts and percentages update immediately, and no second model request is made.”

## 2:12–2:38 — Teach Tomorrow

**On screen:** Open Teach Tomorrow, then Small groups and Exit ticket.

**Voiceover:** “The correction flows into tomorrow’s plan. S02 leaves the old group, joins the selected group, and no stale student ID remains. The teacher gets a ten-minute mini lesson, targeted groups, practice, and an exit ticket—all still subject to professional review.”

## 2:38–2:57 — Codex and close

**On screen:** Briefly show an export, then Built with Codex.

**Voiceover:** “Codex accelerated the full-stack architecture, structured contracts, protected API route, evidence verifier, teacher-correction logic, interface, exports, tests, and browser QA. GPT-5.6 powers the runtime first map; deterministic verification and teacher judgment make it instructionally usable. See the reasoning. Correct the map. Teach tomorrow.”
