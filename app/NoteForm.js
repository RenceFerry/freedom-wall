"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pseudonym, setPseudonym] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, pseudonym }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Could not post. Try again.");
      }
      setBody("");
      setStatus("Posted.");
      router.push("/");
      router.refresh();
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="compose" onSubmit={submit}>
      <label htmlFor="body">Your note</label>
      <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} rows={4} placeholder="Say what's on your mind. No sign-in needed." required />
      <div className="row">
        <input aria-label="Pseudonym (optional)" value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} maxLength={30} placeholder="– pseudonym (optional)" />
        <span className="count">{body.length}/500</span>
        <button disabled={sending || !body.trim()}>{sending ? "Posting…" : "Post note"}</button>
      </div>
      <p className="status" role="status">{status}</p>
    </form>
  );
}
