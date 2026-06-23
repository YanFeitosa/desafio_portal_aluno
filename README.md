# Portal do Aluno

MVP fullstack para um portal academico com dois perfis: Coordenacao e Aluno.

## Stack

- Backend: Node.js, Express, Prisma, MySQL, JWT, bcrypt e Zod
- Frontend: React, Vite, TypeScript e Tailwind CSS
- Banco de dados: MySQL via Docker Compose

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env
docker compose up -d
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

A API roda por padrao em `http://localhost:3333`.
A documentacao interativa das rotas fica em `http://localhost:3333/docs`
e o JSON OpenAPI fica em `http://localhost:3333/docs/json`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

O frontend deve rodar em `http://localhost:5173`, que é a origem configurada em `backend/.env.example` (`CORS_ORIGIN`).

## Usuarios de teste

Todos os usuarios do seed usam a senha `123456`.

- Coordenacao: `coord@escola.com`
- Aluno: `aluno@escola.com`
- Aluno: `maria@escola.com`

## Observacoes de seguranca

- O token JWT fica em `localStorage` no frontend. Para este MVP; em producao, deveria ser substituido por cookie `HttpOnly` e `Secure` ou uma estrategia com refresh token.
- O seed é destrutivo e apaga e recria dados. Rodar apenas em ambiente local ou de teste.
- A configuracao de CORS usa uma origem exata. Se usar outra URL no frontend, ajuste `CORS_ORIGIN`.
- Observação: a rota `/docs` está pública apenas para facilitar a avaliação do desafio; em produção, ela seria restringida ou desabilitada.
