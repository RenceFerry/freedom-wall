import { NextResponse } from "next/server";

// Site-wide traffic guard. Tune these three numbers.
const WINDOW_MS = 10_000;   // measure requests in 10-second windows
const LIMIT = 300;          // more than this per window = "high traffic"
const COOLDOWN_MS = 60_000; // how long to show the busy page

const t = (globalThis.__traffic ??= { start: Date.now(), count: 0, until: 0 });

function busy(req, ms) {
  const retry = String(Math.ceil(ms / 1000));
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "The wall is busy. Try again soon." }, { status: 503, headers: { "Retry-After": retry } });
  }
  const res = NextResponse.rewrite(new URL("/busy", req.url));
  res.headers.set("Retry-After", retry);
  return res;
}

export function middleware(req) {
  const now = Date.now();
  if (now < t.until) return busy(req, t.until - now);
  if (now - t.start > WINDOW_MS) { t.start = now; t.count = 0; }
  if (++t.count > LIMIT) { t.until = now + COOLDOWN_MS; return busy(req, COOLDOWN_MS); }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
