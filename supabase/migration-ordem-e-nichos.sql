-- Migração: ordem dos produtos por ocasião + nichos (sub-blocos) da página de Eventos.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).
-- É seguro rodar de novo se precisar (usa "if exists"/"if not exists").

-- ---------------------------------------------------------------------------
-- product_occasion_meta
--   Guarda, para cada par (produto, ocasião), a ordem de exibição e o nicho.
--   `products.categories` continua definindo EM QUAIS ocasiões o produto aparece;
--   esta tabela só guarda ordem/nicho, preenchida pelo painel /admin.
--   event_niche: '' (sem nicho) | 'mesa_de_doces' | 'lembrancinhas'  (só Eventos usa)
-- ---------------------------------------------------------------------------
create table if not exists product_occasion_meta (
  product_id uuid not null references products(id) on delete cascade,
  occasion_slug text not null check (occasion_slug in
    ('presentes','casamentos_eventos','corporativo','degustacao')),
  position int not null default 0,
  event_niche text not null default '',
  primary key (product_id, occasion_slug)
);

create index if not exists idx_pom_occasion on product_occasion_meta (occasion_slug);

alter table product_occasion_meta enable row level security;

drop policy if exists "public read product_occasion_meta" on product_occasion_meta;
create policy "public read product_occasion_meta" on product_occasion_meta
  for select to anon, authenticated using (true);

drop policy if exists "admin write product_occasion_meta" on product_occasion_meta;
create policy "admin write product_occasion_meta" on product_occasion_meta
  for all to authenticated using (true) with check (true);
