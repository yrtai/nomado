# Nomado — planning docs

Open-source travel platform for inbound tourism in Kyrgyzstan: book **stays, cars, and tours** in one place (Airbnb + tours model). Built in public by junior developers to learn professional GitHub workflow on a real, large project.

> "Nomado" is a working title — rename freely.

## Two goals, in order

1. **Teach GitHub-first professional workflow** — issues, branches, PRs, reviews, CI, project boards — exactly as practiced in large companies.
2. **Ship a real product** that helps tourism in Kyrgyzstan.

The project only matters because it's big enough to make goal #1 real.

## Documents

| Doc | What it is |
|---|---|
| [docs/system-design.md](docs/system-design.md) | Architecture, data model, APIs, key flows. Every issue traces here. |
| [docs/roadmap.md](docs/roadmap.md) | 9 phases, each a GitHub milestone with a demo criterion. |
| [docs/github-workflow.md](docs/github-workflow.md) | The rules of contribution — the actual curriculum. |
| [docs/task-breakdown.md](docs/task-breakdown.md) | ~66 GitHub-ready issues for Phases 0–2; epics for 3–8. |

## Stack

TypeScript everywhere. Next.js (web) · Node.js/Express (api, modular monolith) · PostgreSQL + PostGIS · Redis · pnpm + Turborepo monorepo. Free-tier deployable.

## Next steps

1. Create the GitHub organization and `nomado` repo
2. Push these docs as the repo's first commit
3. Create labels, milestones, project board, templates (Phase 0 issues #10–19)
4. Open Phase 0 issues and invite the first contributors
