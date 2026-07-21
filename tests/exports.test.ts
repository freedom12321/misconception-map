import assert from "node:assert/strict";
import test from "node:test";
import { exportFeedbackCsv, exportTeacherMarkdown } from "../lib/exports";
import { createMockAnalysis } from "../lib/mockAnalyzer";
import { demoAssignment, demoResponses } from "../lib/sampleData";

const result = createMockAnalysis(demoAssignment, demoResponses);

test("Markdown export includes evidence and reteaching sections", () => {
  const markdown = exportTeacherMarkdown(result);
  assert.match(markdown, /# Misconception Map — Teacher Report/);
  assert.match(markdown, /Evidence from student work/);
  assert.match(markdown, /Top teaching priority/);
  assert.match(markdown, /Small groups/);
  assert.match(markdown, /Common wrong answers to watch for/);
  assert.match(markdown, /Tomorrow's plan/);
  assert.match(markdown, /Teacher review required/);
});

test("CSV feedback export escapes feedback and includes all students", () => {
  const csv = exportFeedbackCsv(result);
  const lines = csv.split("\n");
  assert.equal(lines.length, demoResponses.length + 1);
  assert.match(lines[0], /original_response/);
  assert.match(lines[0], /teacher_note/);
  assert.match(lines[0], /small_group/);
  assert.match(lines[0], /student_friendly_feedback/);
  assert.match(csv, /^S01,.*?,correct,/m);
  assert.match(csv, /^S02,.*?,misconception,/m);
});
