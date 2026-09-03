-- Migração: galerias de fotos por ocasião + logos de clientes corporativos.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).

alter table pillars add column if not exists intro text not null default '';

-- ---------------------------------------------------------------------------
-- occasion_photos (galeria de cada ocasião)
-- ---------------------------------------------------------------------------
create table if not exists occasion_photos (
  id uuid primary key default gen_random_uuid(),
  occasion_slug text not null check (occasion_slug in
    ('presentes','casamentos_eventos','corporativo','degustacao')),
  photo_url text not null default '',
  caption text not null default '',
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_occasion_photos_slug on occasion_photos (occasion_slug);

alter table occasion_photos enable row level security;
drop policy if exists "public read active occasion_photos" on occasion_photos;
create policy "public read active occasion_photos" on occasion_photos
  for select to anon using (active = true);
drop policy if exists "admin read all occasion_photos" on occasion_photos;
create policy "admin read all occasion_photos" on occasion_photos
  for select to authenticated using (true);
drop policy if exists "admin write occasion_photos" on occasion_photos;
create policy "admin write occasion_photos" on occasion_photos
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- corporate_clients (empresas que já fecharam com a Bubri)
-- ---------------------------------------------------------------------------
create table if not exists corporate_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  logo_url text,
  display_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table corporate_clients enable row level security;
drop policy if exists "public read active corporate_clients" on corporate_clients;
create policy "public read active corporate_clients" on corporate_clients
  for select to anon using (active = true);
drop policy if exists "admin read all corporate_clients" on corporate_clients;
create policy "admin read all corporate_clients" on corporate_clients
  for select to authenticated using (true);
drop policy if exists "admin write corporate_clients" on corporate_clients;
create policy "admin write corporate_clients" on corporate_clients
  for all to authenticated using (true) with check (true);
