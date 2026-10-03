# Freedom Wall

Anonymous student notes with an optional pseudonym, 25 notes per page, and a traffic guard that shows a busy page when the site is overloaded.

## Run it
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL`
3. Run `schema.sql` on your Postgres database
4. `npm run dev`, then open http://localhost:3000

## Tune the traffic guard
Edit `WINDOW_MS`, `LIMIT` and `COOLDOWN_MS` at the top of `middleware.js`.
The counters are in memory, so they are per server instance. For serverless hosting, move them to a shared store such as Upstash Redis.
