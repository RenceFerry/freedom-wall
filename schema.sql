create table if not exists notes (
  id bigserial primary key,
  body text not null check (char_length(body) between 1 and 500),
  pseudonym text check (char_length(pseudonym) <= 30),
  created_at timestamptz not null default now()
);
create index if not exists notes_created_idx on notes (created_at desc, id desc);
