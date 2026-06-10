# Task Breakdown — GitHub-ready issues

Phases 0–2 are fully broken down (each line becomes a GitHub issue). Phases 3–8 are epic-level; they get decomposed one phase ahead of time. Labels shorthand: `F`=frontend, `B`=backend, `I`=infra, `D`=docs. ⭐ = `good first issue`.

Issue body format (used when creating these on GitHub):

```
## Context
Why this exists + link to design doc section.
## Acceptance criteria
- [ ] verifiable checkbox list
## Hints
Files to touch, docs to read, related issues.
```

---

## Phase 0 — Project & GitHub setup (Milestone: `Phase 0`)

### Epic 0.1 Repository scaffold
| # | Issue | Labels | Size |
|---|---|---|---|
| 1 | Initialize pnpm + Turborepo monorepo with `apps/` and `packages/` | I | S |
| 2 | Scaffold `apps/api` (Express + TypeScript, src/modules layout, /health route) | B | S |
| 3 | Scaffold `apps/web` (Next.js + TypeScript + Tailwind) | F | S |
| 4 | Create `packages/shared` with zod + sample shared type used by web AND api | B,F | S |
| 5 | Create `packages/config` (shared eslint, prettier, tsconfig presets) | I | S |
| 6 | docker-compose: Postgres 16 + PostGIS + Redis for local dev | I | S |
| 7 | Add Prisma (or Drizzle), connect to local DB, first empty migration | B | S |
| 8 | Root `pnpm dev` runs web + api concurrently; document in README ⭐ | I | XS |
| 9 | `.env.example` + env validation (zod) on api boot ⭐ | B | XS |

### Epic 0.2 GitHub configuration
| # | Issue | Labels | Size |
|---|---|---|---|
| 10 | Create label set per github-workflow.md ⭐ | D | XS |
| 11 | Issue templates: feature.yml, bug.yml, research.yml | D | S |
| 12 | PR template with test-plan checklist ⭐ | D | XS |
| 13 | Branch protection rules on `main` (maintainer task) | I | XS |
| 14 | GitHub Project board with automation (assigned→In Progress, etc.) | I | S |
| 15 | CODEOWNERS for payments/auth/.github paths | I | XS |
| 16 | Enable Discussions with Q&A / Ideas / Show & Tell categories ⭐ | D | XS |
| 17 | CONTRIBUTING.md: golden path, local setup, first-PR walkthrough | D | S |
| 18 | CODE_OF_CONDUCT.md + LICENSE (MIT) ⭐ | D | XS |
| 19 | CONTRIBUTORS.md — every new member adds themselves as first PR ⭐ | D | XS |

### Epic 0.3 CI/CD
| # | Issue | Labels | Size |
|---|---|---|---|
| 20 | CI workflow: lint + typecheck + test on every PR (Turborepo cache) | I | M |
| 21 | CI: build check for web and api | I | S |
| 22 | PR title linter (Conventional Commits) ⭐ | I | XS |
| 23 | Dependabot config + CodeQL scanning | I | S |
| 24 | Auto-deploy `main` → staging (Vercel for web, Render/Railway for api) | I | M |
| 25 | Vitest setup in api + web with one passing example test each ⭐ | B,F | S |

---

## Phase 1 — Auth & users (Milestone: `Phase 1`)

### Epic 1.1 Backend auth
| # | Issue | Labels | Size |
|---|---|---|---|
| 26 | User table migration (id, email, name, role, password_hash, avatar_url, locale) | B | S |
| 27 | POST /auth/register: zod validation, argon2 hash, duplicate-email 409 | B | S |
| 28 | POST /auth/login: JWT access (15 min) + httpOnly refresh cookie | B | S |
| 29 | POST /auth/refresh with rotation; POST /auth/logout revokes | B | M |
| 30 | Auth middleware + role guard (`requireRole('host')`) | B | S |
| 31 | Google OAuth (authorization-code flow, account linking by email) | B | M |
| 32 | Rate limiting on auth endpoints (Redis sliding window) | B | S |
| 33 | Unit + integration tests for the full auth flow | B | M |
| 34 | Research: session vs JWT — write 1-page comparison in Discussions ⭐ | D | S |

### Epic 1.2 Users & profiles
| # | Issue | Labels | Size |
|---|---|---|---|
| 35 | GET/PATCH /users/me (name, bio, languages, avatar) | B | S |
| 36 | Avatar upload to object storage (S3-compatible), validation | B | M |
| 37 | "Become a host" endpoint: HostProfile + role upgrade | B | S |
| 38 | GET /users/:id public profile (joined date, listings, reviews stub) | B | S |

### Epic 1.3 Frontend auth & profile
| # | Issue | Labels | Size |
|---|---|---|---|
| 39 | Register + login pages with react-hook-form + zod (shared schemas!) | F | M |
| 40 | Auth context/provider, token refresh, protected routes | F | M |
| 41 | "Continue with Google" button + callback page | F | S |
| 42 | Profile page: view + edit own profile | F | M |
| 43 | Public profile page /users/[id] | F | S |
| 44 | Navbar with auth state (login/avatar menu/logout) ⭐ | F | S |
| 45 | Become-a-host onboarding screen | F | S |

---

## Phase 2 — Listings (Milestone: `Phase 2`)

### Epic 2.1 Listings backend
| # | Issue | Labels | Size |
|---|---|---|---|
| 46 | Listing + Photo + Amenity migrations (type enum, JSONB attributes, PostGIS point) | B | M |
| 47 | Zod schemas per listing type (stay/car/tour) in packages/shared | B | S |
| 48 | POST /listings (host only, draft status) | B | S |
| 49 | PATCH /listings/:id with ownership check (object-level authz!) | B | S |
| 50 | Photo upload: multi-image, ordering, cover photo, size/type limits | B | M |
| 51 | Amenity seed data + attach/detach endpoints ⭐ | B | S |
| 52 | Publish flow: draft → pending_review → active; validation gate | B | S |
| 53 | CalendarDay model + GET/PUT availability endpoints (block dates, price override) | B | M |
| 54 | GET /listings/:id with photos, amenities, host card | B | S |
| 55 | GET /my/listings for host dashboard | B | XS |
| 56 | Integration tests: full listing lifecycle | B | M |

### Epic 2.2 Listings frontend
| # | Issue | Labels | Size |
|---|---|---|---|
| 57 | Multi-step "create listing" wizard shell (type → details → photos → pricing → publish) | F | M |
| 58 | Step: type-specific detail forms (3 issues, one per type — stay/car/tour) | F | 3×S |
| 59 | Step: photo upload with drag-drop reorder + cover select | F | M |
| 60 | Step: pricing + cancellation policy picker | F | S |
| 61 | Availability calendar UI (month view, block/unblock, price overrides) | F | M |
| 62 | Host dashboard: my listings table with status badges | F | S |
| 63 | Public listing detail page (gallery, amenities, map pin, host card, calendar) | F | M |
| 64 | Listing card component in packages/ui ⭐ | F | S |

---

## Phases 3–8 — epics only (decomposed one phase ahead)

| Phase | Epics |
|---|---|
| 3 Search | Geo+filter query builder · date-availability exclusion · Redis cache layer · search page with map (MapLibre) · filter UI · URL-state sync · ranking v1 · empty/loading states |
| 4 Booking & payments | Quote calculator · booking state machine + transactional locking · cancellation policies · payment provider integration (test mode) · webhook idempotency · expiry jobs (BullMQ) · confirmation emails · trips page · host booking inbox (accept/decline) |
| 5 Community | Double-blind reviews · rating aggregation · messaging threads (polling v1) · wishlists · notification preferences · email templates |
| 6 Admin & ops | Moderation queue · user management · payout batching · audit log · Sentry + metrics dashboard · security hardening sprint · load test baseline |
| 7 Launch | i18n EN/RU/KG · currency display · SEO/SSR metadata · sitemap · Lighthouse ≥90 · WCAG AA pass · production runbook · pilot host onboarding |
| 8 Advanced | React Native app · Typesense/Elasticsearch migration · extract payments service · WebSocket messaging · CDN image resizing |

**Counting check:** Phases 0–2 ≈ 66 issues (issue 58 is three). At 5–10 active contributors averaging 1–2 issues/week, Phase 0–2 ≈ 9 weeks — matches the roadmap.
