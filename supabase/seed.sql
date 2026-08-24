-- Bubri Confeitaria — dados iniciais (rode depois do schema.sql)
-- Pode editar tudo isso depois pelo painel /admin; isso aqui é só o ponto de partida.

insert into site_settings (whatsapp_number, business_hours, instagram_handle, google_reviews_url, delivery_text)
values (
  '5511952714308',
  'Todos os dias, das 10h às 18h',
  'bubriconfeitaria',
  'https://g.page/r/CZw9X8NWSKxYEAI/review',
  'Todas as regiões de São Paulo (taxa calculada pela localização). Retirada disponível mediante combinação pelo WhatsApp.'
);

insert into pillars (slug, title, description, display_order) values
  ('presentes', 'Presentes finos', 'Caixas e kits pensados para presentear com elegância — aniversários, agradecimentos ou só porque sim.', 1),
  ('casamentos_eventos', 'Casamentos & eventos', 'Docinhos personalizados para casamentos, chás e formaturas, do provador à mesa do seu grande dia.', 2),
  ('corporativo', 'Brindes corporativos', 'Kits com a identidade da sua empresa para presentear clientes, parceiros e equipes com bom gosto.', 3),
  ('degustacao', 'Degustação em 24h', 'Não precisa de um grande motivo: peça a caixa degustação de doces finos e viva uma experiência diferente em até 24 horas.', 4);

insert into products (name, description, price_label, category, display_order) values
  ('Gift Cookies', '6 cookies artesanais em caixa presenteável', 'R$75', 'presentes', 1),
  ('Doces finos avulsos', 'Avelã, pistache, pão de mel, camafeu e mais — mín. 20 unid/sabor', 'a partir de R$4,10/unid', 'presentes', 2),
  ('Cesta Café da Manhã', 'Clássica ou Premium, com pães, frutas e brigadeiros', 'R$250 / R$290', 'presentes', 3),
  ('Mini Pão de Mel', '6 unidades com doce de leite artesanal, em latinha', 'R$45', 'presentes', 4),
  ('Box Celebração', 'Mini bolo, 15 brigadeiros, 2 brownies, bebida e flores', 'R$190', 'presentes', 5),

  ('Doce Brinde', '12 brigadeiros + bebida (espumante ou cerveja)', 'a partir de R$90', 'casamentos_eventos', 1),
  ('Brigadeiros para mesa de festa', 'Mín. 50 unid, 10 por sabor', 'a partir de R$3,20/unid', 'casamentos_eventos', 2),
  ('Lembrancinha para convidados', 'Mini pão de mel, 6 unidades em latinha', 'R$45', 'casamentos_eventos', 3),

  ('Doces Finos personalizados', 'Tampa/tag com a logo da empresa — mín. 5 unid', '20 unid R$170', 'corporativo', 1),
  ('Latinha Personalizada', 'Recheada, com a logo da empresa — mín. 10 unid', 'R$25', 'corporativo', 2),
  ('Gift Box', 'Mini espumante, 2 pães de mel e latinha personalizada', 'R$150', 'corporativo', 3),
  ('Cesta Personalizada', 'Composição sob medida para o perfil da empresa', 'sob consulta', 'corporativo', 4),

  ('Caixa Degustação de Doces Finos', 'Caixa de madeira, 25 unidades, 12 sabores', 'R$170', 'degustacao', 1);

insert into faq_items (question, answer, display_order) values
  ('Como funciona a degustação em 24h?', 'Você escolhe a caixa degustação de doces finos, confirma pelo WhatsApp e recebe em até 24 horas. Não precisa de um motivo especial: serve tanto pra conhecer os sabores antes de um evento quanto só pra viver uma experiência diferente.', 1),
  ('Fazem doces para casamentos e eventos?', 'Sim! Personalizamos sabores, cores e embalagens de acordo com o tema do seu evento. Eventos pequenos pedem 7 dias de antecedência; casamentos e grandes eventos, no mínimo 30 dias.', 2),
  ('Atendem pedidos corporativos em grande volume?', 'Sim — montamos kits personalizados com a logo da sua empresa para clientes, parceiros ou colaboradores. Emitimos nota fiscal e oferecemos condições especiais acima de 50 unidades.', 3),
  ('Quais as formas de pagamento?', 'Pix, transferência ou link de cartão. A confirmação do pedido é feita mediante pagamento integral.', 4),
  ('Posso cancelar ou alterar meu pedido?', 'Pedidos avulsos podem ser cancelados normalmente. Para pedidos de eventos e grandes volumes, as condições de cancelamento ficam definidas no contrato do seu evento.', 5);

insert into page_content (page, section_key, content) values
  ('home', 'hero_eyebrow', 'Bubri Confeitaria'),
  ('home', 'hero_headline', 'Doces finos para os momentos que merecem ser lembrados'),
  ('home', 'hero_subheadline', 'Presentes, casamentos, eventos e brindes corporativos com a assinatura de quem trata cada doce como uma pequena obra de confeitaria.'),
  ('home', 'hero_cta', 'Peça sua degustação em 24h'),
  ('home', 'reviews_cta', 'Ver avaliações no Google'),
  ('home', 'foto_hero_url', ''),

  ('sobre', 'foto_url', ''),
  ('sobre', 'paragrafo_1', 'A Bubri nasceu em 2019, na cozinha de um apartamento — entre testes de receita e a vontade de transformar algo simples em um pequeno momento de encantamento. O que começou pequeno virou uma confeitaria artesanal dedicada a doces finos, com a mesma atenção aos detalhes do primeiro dia.'),
  ('sobre', 'paragrafo_2', 'Trabalhamos sem conservantes, com processos cuidadosos e ingredientes selecionados — destaque para os chocolates belgas Callebaut e Sicao, presentes desde as massas e recheios até as finalizações. Por serem feitos manualmente, nossos doces são únicos: pequenas variações fazem parte do processo artesanal, e é isso que torna cada caixa Bubri especial.'),
  ('sobre', 'paragrafo_3', 'Nossa missão é simples: entregar experiências que encantam e emocionam em cada detalhe. Nossa visão é ser referência em confeitaria artesanal humanizada — reconhecida pela excelência dos produtos, pelo atendimento acolhedor e por transformar momentos especiais em memórias inesquecíveis.'),
  ('sobre', 'valor_1_titulo', 'Ingredientes selecionados'),
  ('sobre', 'valor_1_descricao', 'Processos cuidadosos, do primeiro ao último doce.'),
  ('sobre', 'valor_2_titulo', 'Relações humanizadas'),
  ('sobre', 'valor_2_descricao', 'Cada cliente é tratado com atenção de verdade, não como número.'),
  ('sobre', 'valor_3_titulo', 'Inovação'),
  ('sobre', 'valor_3_descricao', 'Produtos únicos e personalizados para cada ocasião.'),
  ('sobre', 'cta_final', 'Vamos conversar sobre o seu evento?'),

  ('contato', 'prazo_pequenos', 'Eventos pequenos: 7 dias de antecedência.'),
  ('contato', 'prazo_grandes', 'Casamentos e grandes eventos: mínimo de 30 dias.');
