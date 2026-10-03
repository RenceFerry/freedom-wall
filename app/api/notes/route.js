import { NextResponse } from "next/server";
import { addNote } from "../../../lib/db";

// Per-IP limit: 5 notes per minute.
const hits = (globalThis.__postHits ??= new Map());

export async function POST(req) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(ip);
  if (!h || now - h.start > 60_000) hits.set(ip, { start: now, count: 1 });
  else if (++h.count > 5) {
    return NextResponse.json({ error: "Too many notes. Try again in a minute." }, { status: 429 });
  }

  let data;
  try { data = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const body = String(data.body ?? "").trim();
  const pseudonym = String(data.pseudonym ?? "").trim();
  if (!body) return NextResponse.json({ error: "Write something first." }, { status: 400 });
  if (body.length > 500) return NextResponse.json({ error: "Notes are 500 characters max." }, { status: 400 });
  if (pseudonym.length > 30) return NextResponse.json({ error: "Pseudonym is 30 characters max." }, { status: 400 });

  await addNote(body, pseudonym);
  return NextResponse.json({ ok: true }, { status: 201 });
}
