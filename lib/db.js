import { neon } from "@neondatabase/serverless";

export const PAGE_SIZE = 25;

const sql = neon(process.env.DATABASE_URL);

export async function getNotes(page) {
  const offset = (page - 1) * PAGE_SIZE;
  const [rows, count] = await Promise.all([
    sql`SELECT id, body, pseudonym, created_at FROM notes ORDER BY created_at DESC, id DESC LIMIT ${PAGE_SIZE} OFFSET ${offset}`,
    sql`SELECT COUNT(*)::INT AS n FROM notes`,
  ]);

  return { notes: rows, total: count[0].n };
}

export async function addNote(body, pseudonym) {
  await sql.query("insert into notes (body, pseudonym) values ($1, $2)", [body, pseudonym || null]);
}
