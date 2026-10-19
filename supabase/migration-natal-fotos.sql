-- Migração: fotos da página Natal Corporativo editáveis pelo painel /admin.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).
-- É seguro rodar de novo se precisar (usa "if exists"/"if not exists").

-- ---------------------------------------------------------------------------
-- natal_photos
--   Só guarda as fotos TROCADAS pelo admin. Sem linha aqui, a página usa a
--   foto original do catálogo (arquivos em /public/natal).
--   product_id: id do produto em src/lib/data/natal.ts, ou 'capa' (foto do topo).
-- ---------------------------------------------------------------------------
create table if not exists natal_photos (
  product_id text primary key,
  photo_url text not null,
  updated_at timestamptz not null default now()
);

alter table natal_photos enable row level security;

drop policy if exists "public read natal_photos" on natal_photos;
create policy "public read natal_photos" on natal_photos
  for select to anon, authenticated using (true);

drop policy if exists "admin write natal_photos" on natal_photos;
create policy "admin write natal_photos" on natal_photos
  for all to authenticated using (true) with check (true);
