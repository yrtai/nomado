# Nomado

Stays, cars and tours in Kyrgyzstan — one open-source travel platform (think Airbnb + tours), built in public by junior developers learning professional GitHub workflow.

**Two goals, in order:** learn how real engineering teams work on GitHub, and ship a product that helps tourism in Kyrgyzstan.

## 🚀 Quickstart (10 minutes)

You need: [Node.js 20+](https://nodejs.org), [pnpm](https://pnpm.io/installation) (`npm i -g pnpm`), [Docker Desktop](https://docs.docker.com/desktop/), git.

```bash
# 1. Get the code
git clone https://github.com/yrtai/nomado.git
cd nomado

# 2. Install dependencies (one command for all apps)
pnpm install

# 3. Start the local database (Postgres + Redis in Docker)
docker compose up -d

# 4. Create your local env file
cp .env.example .env

# 5. Run everything
pnpm dev
```

Now open:
- **http://localhost:3000** — the web app
- **http://localhost:4000/health** — the API (you should see `{"status":"ok",...}`)

Run the tests:

```bash
pnpm test        # all tests
pnpm lint        # code style
pnpm typecheck   # TypeScript
```

If anything fails, ask in [Discussions → Q&A](https://github.com/yrtai/nomado/discussions) — that's exactly what it's for.

## 🗺️ What's in this repo

```
apps/
  web/        → Next.js frontend          (http://localhost:3000)
  api/        → Express API               (http://localhost:4000)
packages/
  shared/     → zod schemas used by BOTH web and api
  config/     → shared tsconfig/prettier presets
docs/         → 📖 the brain of the project (start here!)
.github/      → CI workflows, issue templates, bootstrap automation
```

Read these in order when you join:

1. [docs/github-workflow.md](docs/github-workflow.md) — **how we work** (branches, PRs, reviews). Read this first.
2. [docs/system-design.md](docs/system-design.md) — what we're building and why it's shaped this way
3. [docs/roadmap.md](docs/roadmap.md) — where we are (phases = GitHub milestones)
4. [docs/task-breakdown.md](docs/task-breakdown.md) — how the work was split into issues

## 🧑‍💻 Your first contribution (today, not someday)

1. **Say hi** — add yourself to `CONTRIBUTORS.md` via your first PR (see issue [#19](https://github.com/yrtai/nomado/issues/19)). This teaches you the full branch → PR → review → merge loop with zero risk.
2. **Pick a real issue** — anything labeled [`good first issue`](https://github.com/yrtai/nomado/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that's unassigned. Comment "I'll take this" and assign yourself.
3. **Follow the golden path** (full version in [docs/github-workflow.md](docs/github-workflow.md)):

```
branch from main:  git checkout -b feat/42-short-name
commit:            feat(scope): what you did (#42)
push + open PR:    fill the template, write "Closes #42"
CI must be green → 1 approval → squash-merge 🎉
```

**Rules that protect you:** nobody pushes to `main` directly, red CI means not mergeable, every PR gets a review. Getting 10 comments on your first PR is normal and is the fastest way to learn.

## 🧪 Testing

Tests live next to the code they test (`*.test.ts` / `*.test.tsx`) and run with [Vitest](https://vitest.dev). Every feature PR is expected to add or update tests — see the examples:

- API: [`apps/api/src/app.test.ts`](apps/api/src/app.test.ts) (HTTP tests with supertest)
- Web: [`apps/web/app/page.test.tsx`](apps/web/app/page.test.tsx) (component tests with Testing Library)

## 📊 Project status

Live progress is on the [issues board](https://github.com/yrtai/nomado/issues) and [milestones](https://github.com/yrtai/nomado/milestones). Current phase: **Phase 0 → Phase 1** (auth & users).

## 🛠️ Stack

TypeScript everywhere · Next.js · Express · PostgreSQL + PostGIS · Redis · Prisma · pnpm + Turborepo · Vitest · GitHub Actions

## 📄 License

MIT (see issue #18 — yes, even the license is an issue someone gets to ship).
