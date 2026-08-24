-- Bubri Confeitaria — schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do painel do Supabase (uma vez, na criação do projeto).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- site_settings (linha única com os dados de contato do site)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text not null default '',
  business_hours text not null default '',
  instagram_handle text not null default '',
  google_reviews_url text not null default '',
  delivery_text text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- pillars (os 4 destaques da Home: presentes, casamentos_eventos, corporativo, degustacao)
-- ---------------------------------------------------------------------------
create table if not exists pillars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('presentes', 'casamentos_eventos', 'corporativo', 'degustacao')),
  title text not null,
  description text not null,
  photo_url text,
  display_order int not null default 0
);

-- ---------------------------------------------------------------------------
-- products (catálogo)
-- ---------------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_label text not null default '',
  category text not null check (category in ('presentes', 'casamentos_eventos', 'corporativo', 'degustacao')),
  photo_url text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on products (category);
create index if not exists idx_products_active on products (active);

-- ---------------------------------------------------------------------------
-- faq_items (perguntas frequentes da página de Contato)
-- ---------------------------------------------------------------------------
create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0,
  active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- page_content (textos avulsos: headline da Home, parágrafos do Sobre, etc.)
-- ---------------------------------------------------------------------------
create table if not exists page_content (
  page text not null check (page in ('home', 'sobre', 'contato')),
  section_key text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  primary key (page, section_key)
);

-- ---------------------------------------------------------------------------
-- updated_at automático em products
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table site_settings enable row level security;
alter table pillars enable row level security;
alter table products enable row level security;
alter table faq_items enable row level security;
alter table page_content enable row level security;

-- Leitura pública (site institucional não exige login para visitantes)
create policy "public read settings" on site_settings for select to anon, authenticated using (true);
create policy "public read pillars" on pillars for select to anon, authenticated using (true);
create policy "public read page_content" on page_content for select to anon, authenticated using (true);

-- Produtos e FAQ: visitante (anon) só vê itens ativos; o painel (authenticated) vê tudo
create policy "public read active products" on products for select to anon using (active = true);
create policy "admin read all products" on products for select to authenticated using (true);
create policy "public read active faq" on faq_items for select to anon using (active = true);
create policy "admin read all faq" on faq_items for select to authenticated using (true);

-- Escrita: só usuário autenticado (o painel exige login; não há cadastro público de conta)
create policy "admin write settings" on site_settings for all to authenticated using (true) with check (true);
create policy "admin write pillars" on pillars for all to authenticated using (true) with check (true);
create policy "admin write products" on products for all to authenticated using (true) with check (true);
create policy "admin write faq" on faq_items for all to authenticated using (true) with check (true);
create policy "admin write page_content" on page_content for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Storage: bucket público para as fotos do site
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('bubri-media', 'bubri-media', true)
on conflict (id) do nothing;

create policy "public read bubri-media" on storage.objects for select to anon, authenticated
  using (bucket_id = 'bubri-media');

create policy "admin write bubri-media" on storage.objects for all to authenticated
  using (bucket_id = 'bubri-media') with check (bucket_id = 'bubri-media');
