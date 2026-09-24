# Aquisitions API

Express + Drizzle + Neon Postgres. The same Docker image runs in both environments. Only `DATABASE_URL` changes:

| Env  | Compose file              | Env file           | `DATABASE_URL` points at                                        |
| ---- | ------------------------- | ------------------ | --------------------------------------------------------------- |
| Dev  | `docker-compose.dev.yml`  | `.env.development` | `postgres://neon:npg@neon-local:5432/neondb` (Neon Local proxy) |
| Prod | `docker-compose.prod.yml` | `.env.production`  | `postgres://...neon.tech/neondb?sslmode=require` (Neon Cloud)   |

`src/config/database.js` reads the host from `DATABASE_URL`. For a host other than `*.neon.tech` (i.e. Neon Local), it points the serverless driver at `http://<host>:5432/sql`. For `*.neon.tech` it uses the driver defaults. No code changes are needed between environments.

## Local development (Neon Local)

Neon Local is a proxy container. On `up` it creates an **ephemeral branch** of your Neon project, and on `down` it deletes the branch. Every dev session starts from a fresh copy of the parent branch's schema and data.

1. Get a Neon API key (Account settings → API keys) and your project ID (Project settings → General).
2. Fill in `.env.development`:
   ```env
   DATABASE_URL=postgres://neon:npg@neon-local:5432/neondb
   NEON_API_KEY=...
   NEON_PROJECT_ID=...
   # PARENT_BRANCH_ID=br-...   # optional, defaults to the project's default branch
   ```
3. Start:
   ```sh
   docker compose -f docker-compose.dev.yml up --build
   ```
   - The app runs on http://localhost:3000. `src/` is mounted and `node --watch` restarts the app when files change.
   - Postgres is also exposed on `localhost:5432` (user `neon`, password `npg`) for psql and GUI tools.
4. Stop and delete the ephemeral branch:
   ```sh
   docker compose -f docker-compose.dev.yml down
   ```

**Migrations:** run `npm run db:migrate` against the **parent** branch, using its Neon Cloud URL. Ephemeral branches are forked from the parent, so they inherit its schema automatically.

## Production (Neon Cloud)

Production does not run Neon Local. The app connects directly to Neon's serverless endpoint.

1. Set `DATABASE_URL` in `.env.production` to your Neon Cloud connection string (Neon console → Connect), plus `ARCJET_KEY`.
2. Start:
   ```sh
   docker compose -f docker-compose.prod.yml up --build -d
   ```

On a real host (ECS, Fly, Render, Kubernetes, …), don't ship `.env.production`. Build the image with `docker build -t aquisitions .` and inject `DATABASE_URL`, `ARCJET_KEY`, etc. from the platform's secret manager. The image contains no secrets: `.dockerignore` excludes every `.env*` file.

## Env files

`.env.development` and `.env.production` are gitignored (`.env.*`). `.env.example` is the committed template.
