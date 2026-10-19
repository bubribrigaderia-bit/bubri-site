-- Migração: fotos extras (carrossel) de cada produto da página Natal Corporativo.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).
-- É seguro rodar de novo se precisar (usa "if exists"/"if not exists").

-- ---------------------------------------------------------------------------
-- natal_gallery
--   Fotos EXTRAS de cada produto, mostradas depois da foto principal no
--   carrossel do card. A foto principal continua em natal_photos (ou a original).
--   product_id: id do produto em src/lib/data/natal.ts
-- ---------------------------------------------------------------------------
create table if not exists natal_gallery (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  photo_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_natal_gallery_product on natal_gallery (product_id);

alter table natal_gallery enable row level security;

drop policy if exists "public read natal_gallery" on natal_gallery;
create policy "public read natal_gallery" on natal_gallery
  for select to anon, authenticated using (true);

drop policy if exists "admin write natal_gallery" on natal_gallery;
create policy "admin write natal_gallery" on natal_gallery
  for all to authenticated using (true) with check (true);
