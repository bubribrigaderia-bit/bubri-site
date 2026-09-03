-- Migração: um produto pode pertencer a mais de uma categoria.
-- Rode UMA vez no SQL Editor do Supabase (projeto do site).
-- É seguro rodar de novo se precisar (usa "if exists"/"if not exists").

-- 1. nova coluna de categorias (lista)
alter table products add column if not exists categories text[] not null default '{}';

-- 2. copia a categoria única atual para a lista (só onde ainda está vazio)
update products
   set categories = array[category]
 where category is not null
   and (categories is null or categories = '{}');

-- 3. regra: pelo menos 1 categoria, e só valores válidos
alter table products drop constraint if exists products_categories_valid;
alter table products add constraint products_categories_valid check (
  array_length(categories, 1) >= 1
  and categories <@ array['presentes', 'casamentos_eventos', 'corporativo', 'degustacao']::text[]
);

-- 4. remove a coluna antiga e o índice dela
drop index if exists idx_products_category;
alter table products drop column if exists category;

-- 5. índice novo para busca por categoria
create index if not exists idx_products_categories on products using gin (categories);
