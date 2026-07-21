import type { StudentResponse } from "./schema";

function parseCsvRows(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function makeId(index: number) {
  return `S${String(index + 1).padStart(2, "0")}`;
}

function dedupeIds(responses: StudentResponse[]): StudentResponse[] {
  const used = new Map<string, number>();
  return responses.map((item, index) => {
    const base = item.studentId.trim() || makeId(index);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return { ...item, studentId: count === 0 ? base : `${base}-${count + 1}` };
  });
}

export function parseCsvResponses(input: string): StudentResponse[] {
  const rows = parseCsvRows(input.replace(/^\uFEFF/, ""));
  if (!rows.length) return [];

  const header = rows[0].map((value) => value.toLowerCase().replace(/[\s_-]/g, ""));
  const idIndex = header.findIndex((value) => ["studentid", "id", "student"].includes(value));
  const responseIndex = header.findIndex((value) => ["response", "answer", "studentresponse"].includes(value));
  const hasHeader = idIndex >= 0 || responseIndex >= 0;
  const body = hasHeader ? rows.slice(1) : rows;
  const actualIdIndex = idIndex >= 0 ? idIndex : 0;
  const actualResponseIndex = responseIndex >= 0 ? responseIndex : 1;

  return dedupeIds(
    body
      .map((row, index) => ({
        studentId: row[actualIdIndex]?.trim() || makeId(index),
        response: row[actualResponseIndex]?.trim() || "",
      }))
      .filter((item) => item.response.length > 0),
  );
}

export function parsePlainTextResponses(input: string): StudentResponse[] {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const responses = lines.map((line, index) => {
    const labeled = line.match(/^([^:]{1,40}):\s*(.+)$/);
    const tabbed = line.match(/^([^\t]{1,40})\t(.+)$/);
    const match = labeled ?? tabbed;
    return match
      ? { studentId: match[1].trim(), response: match[2].trim() }
      : { studentId: makeId(index), response: line };
  });

  return dedupeIds(responses);
}

export function parseStudentResponses(input: string): StudentResponse[] {
  const firstLine = input.trim().split(/\r?\n/, 1)[0] ?? "";
  const looksLikeCsv =
    /^(student[ _-]?id|id|student),/i.test(firstLine) ||
    (firstLine.includes(",") && !firstLine.includes(":"));
  return looksLikeCsv ? parseCsvResponses(input) : parsePlainTextResponses(input);
}

