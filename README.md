# Site Bubri Confeitaria

Site institucional (Home, Cardápio, Sobre, Contato) + painel próprio em `/admin`
para editar textos, fotos e produtos sem precisar mexer em código.

## Stack

- **Next.js** (React) — site público + painel admin no mesmo projeto
- **Supabase** — banco de dados (Postgres), autenticação e armazenamento de fotos
- **Vercel** — hospedagem (plano gratuito)

Custo recorrente esperado: **R$0/mês** nos free tiers do Supabase e da Vercel.

---

## Passo a passo para colocar no ar

### 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em "New project".
2. Escolha um nome (ex: `bubri-site`) e uma senha de banco (guarde essa senha).
3. Espere o projeto terminar de ser criado (leva 1-2 minutos).

### 2. Rodar o schema do banco

1. No painel do Supabase, abra **SQL Editor**.
2. Cole todo o conteúdo do arquivo `supabase/schema.sql` deste projeto e clique em **Run**.
3. Depois, cole todo o conteúdo de `supabase/seed.sql` e clique em **Run** de novo.
   Isso já deixa o site com o catálogo, textos e configurações preenchidos —
   só falta trocar as fotos e revisar os textos pelo painel.

### 3. Criar seu usuário de admin

1. No painel do Supabase, vá em **Authentication → Users → Add user**.
2. Cadastre seu e-mail e uma senha — é com isso que você vai entrar em `/admin`.
3. Importante: em **Authentication → Sign In / Providers**, desative o
   cadastro público ("Enable sign ups") — assim ninguém além de você consegue
   criar uma conta no painel.

### 4. Pegar as chaves do projeto

Em **Project Settings → API**, copie:

- **Project URL**
- **anon public key**

### 5. Configurar as variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=<sua Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua anon public key>
```

### 6. Rodar localmente (opcional, para testar antes de publicar)

```
npm install
npm run dev
```

Acesse `http://localhost:3000` (site) e `http://localhost:3000/admin` (painel).

### 7. Publicar na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em "New Project" e importe o repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do passo 5.
4. Clique em Deploy.

### 8. Conectar seu domínio

1. No projeto da Vercel, vá em **Settings → Domains** e adicione seu domínio.
2. A Vercel mostra os registros de DNS que você precisa apontar no lugar onde
   comprou o domínio (geralmente um registro `A` ou `CNAME`).

---

## Como editar o site no dia a dia

Acesse `/admin` com o e-mail e senha que você criou no passo 3:

- **Produtos** — adiciona, edita, ativa/desativa ou remove itens do cardápio
- **Páginas** — textos e fotos da Home, Sobre e perguntas frequentes do Contato
- **Configurações** — WhatsApp, horário, Instagram, link do Google e texto de entrega

Toda alteração aparece no site em poucos segundos, sem precisar mexer em código.

## Estrutura do projeto

```
src/
  app/(site)/       páginas públicas: Home, Cardápio, Sobre, Contato
  app/admin/        painel: login + produtos, páginas, configurações
  components/site/  componentes do site público
  components/admin/ componentes do painel
  lib/data/         acesso somente-leitura ao Supabase (usado pelo site público)
  lib/supabase/     clientes Supabase (server, browser, proxy/middleware)
  types/database.ts tipos das tabelas do banco
supabase/
  schema.sql        tabelas, índices e políticas de segurança (RLS)
  seed.sql          conteúdo inicial (catálogo, textos, configurações)
```
