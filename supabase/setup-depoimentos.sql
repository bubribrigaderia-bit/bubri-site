-- Cria a tabela de depoimentos + cadastra as 4 primeiras avaliações reais.
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

insert into testimonials (author_name, text, rating, display_order) values
('Daniel Fiuza', 'Tudo maravilhoso! Os doces são deliciosos, muito bem feitos e dá para perceber o cuidado em cada detalhe. Atendimento excelente e produtos de muita qualidade. Eu ameiiii!!! Parabéns pelo trabalho, meninas ❤️', 5, 1),
('Antero Luiz', 'Compro na Bubri desde 2019 e é incrível a qualidade dos doces. Comprei uma caixa com 30 doces diversos para compartilhar e todos, sem exceção, estavam excelentes. Também fiz uma encomenda para a confraternização da empresa e todo mundo adorou. Recomendo — os doces premium são maravilhosos e os de época também.', 5, 2),
('Flavia Colley', 'Encomendei uma cesta para me presentear e uns kits para presentear colegas de trabalho. É tudo muito lindo e feito com muito capricho, com um sabor incrível e maravilhoso. Produtos de primeira linha: nada de gosto artificial, é chocolate de verdade!', 5, 3),
('Giovana Gueri', 'Os produtos são de altíssima qualidade. Amei tudo, do atendimento à qualidade dos docinhos e à estética. Todos os convidados amaram os docinhos!', 5, 4);
