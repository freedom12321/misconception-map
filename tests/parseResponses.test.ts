import assert from "node:assert/strict";
import test from "node:test";
import { parseCsvResponses, parsePlainTextResponses, parseStudentResponses } from "../lib/parseResponses";

test("parses CSV with a header and quoted commas", () => {
  const parsed = parseCsvResponses('student_id,response\nS01,"5/6, using sixths"\nS02,"2/5"');
  assert.deepEqual(parsed, [
    { studentId: "S01", response: "5/6, using sixths" },
    { studentId: "S02", response: "2/5" },
  ]);
});

test("parses labeled plain-text responses", () => {
  const parsed = parsePlainTextResponses("S01: First answer\nS02: Second answer");
  assert.deepEqual(parsed, [
    { studentId: "S01", response: "First answer" },
    { studentId: "S02", response: "Second answer" },
  ]);
});

test("auto-generates IDs and deduplicates repeated IDs", () => {
  const generated = parseStudentResponses("First response\nSecond response");
  assert.equal(generated[0].studentId, "S01");
  assert.equal(generated[1].studentId, "S02");

  const duplicated = parsePlainTextResponses("S01: One\nS01: Two");
  assert.equal(duplicated[1].studentId, "S01-2");
});

