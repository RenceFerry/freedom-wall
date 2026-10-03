import Link from "next/link";
import { redirect } from "next/navigation";
import NoteForm from "./NoteForm";
import { getNotes, PAGE_SIZE } from "../lib/db";

export const dynamic = "force-dynamic";
const COLORS = ["butter", "mint", "rose", "sky", "lavender", "sunset"];

export default async function Home({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page, 10) || 1);
  const { notes, total } = await getNotes(page);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > pages) redirect(`/?page=${pages}`);

  return (
    <main>
      <header>
        <h1>Freedom Wall</h1>
        <p>Anonymous by default. Add a pseudonym if you want one.</p>
      </header>

      <NoteForm />

      {notes.length === 0 ? (
        <p className="empty">The wall is empty. Post the first note.</p>
      ) : (
        <section className="wall" aria-label="Notes">
          {notes.map((n) => (
            <article key={n.id} className={`note ${COLORS[n.id % 6]}`} style={{ "--tilt": `${((n.id % 5) - 2) * 0.6}deg` }}>
              <p>{n.body}</p>
              <footer>
                <span className="by">~ {n.pseudonym || "anonymous"}</span>
                <time dateTime={new Date(n.created_at).toISOString()}>
                  {new Date(n.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                </time>
              </footer>
            </article>
          ))}
        </section>
      )}

      <nav className="pager" aria-label="Pagination">
        {page > 1 ? <Link href={`/?page=${page - 1}`}>Newer</Link> : <span />}
        <span>Page {page} of {pages}</span>
        {page < pages ? <Link href={`/?page=${page + 1}`}>Older</Link> : <span />}
      </nav>
    </main>
  );
}
