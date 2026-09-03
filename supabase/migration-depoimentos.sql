-- Migração: depoimentos / avaliações exibidos direto no site.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null default '',
  text text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

drop policy if exists "public read active testimonials" on testimonials;
create policy "public read active testimonials" on testimonials
  for select to anon using (active = true);

drop policy if exists "admin read all testimonials" on testimonials;
create policy "admin read all testimonials" on testimonials
  for select to authenticated using (true);

drop policy if exists "admin write testimonials" on testimonials;
create policy "admin write testimonials" on testimonials
  for all to authenticated using (true) with check (true);
