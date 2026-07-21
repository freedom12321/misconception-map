import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../app/api/analyze/route";
import { demoAssignment, demoResponses } from "../lib/sampleData";

function requestFor(sampleMode: boolean) {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assignment: demoAssignment,
      responses: demoResponses,
      sampleMode,
    }),
  });
}

test("custom responses never receive a mock result when the API key is absent", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await POST(requestFor(false));
    const payload = await response.json() as { error?: string; result?: unknown };
    assert.equal(response.status, 503);
    assert.equal(payload.result, undefined);
    assert.match(payload.error ?? "", /Live GPT-5\.6 analysis is not connected/);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test("the labeled sample can use deterministic fallback without an API key", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await POST(requestFor(true));
    const payload = await response.json() as { mode?: string; result?: unknown };
    assert.equal(response.status, 200);
    assert.equal(payload.mode, "demo");
    assert.ok(payload.result);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});

test("status endpoint reports that live analysis is unavailable without a key", async () => {
  const previousKey = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const response = await GET();
    const payload = await response.json() as { liveAnalysisAvailable?: boolean };
    assert.equal(payload.liveAnalysisAvailable, false);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
});
