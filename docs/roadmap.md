# Roadmap — Nomado

Each phase = one **GitHub Milestone**. A phase is done when all its issues are closed and the demo criterion passes. Phases 0–2 are fully broken into issues in [task-breakdown.md](./task-breakdown.md); later phases get broken down as we approach them (real teams don't pre-write 500 issues).

| Phase | Milestone | Demo criterion ("definition of done") | Est. |
|---|---|---|---|
| 0 | Project & GitHub setup | Repo, CI, project board, templates live; `pnpm dev` boots web+api+db | 2 wk |
| 1 | Auth & users | Register, login (email + Google), profile page, roles | 3 wk |
| 2 | Listings (host side) | Host creates a stay/car/tour with photos; visible on detail page | 4 wk |
| 3 | Search & discovery | Map + filter search across all three types; listing pages public | 4 wk |
| 4 | Booking & payments | End-to-end: search → book → pay (test mode) → confirmation email | 5 wk |
| 5 | Reviews, messaging, wishlists | Two-sided reviews, guest↔host chat, saved listings | 4 wk |
| 6 | Admin & operations | Moderation panel, host payouts, Sentry + metrics, rate limiting | 3 wk |
| 7 | Polish & launch | i18n (EN/RU/KG), SEO, accessibility pass, performance budget, deploy to prod | 3 wk |
| 8 | Advanced (stretch) | Mobile app (React Native), Elasticsearch search, split payments into a service | ongoing |

## Phase details

**Phase 0 — Project & GitHub setup.** The "learn GitHub" phase. Monorepo scaffold, Docker compose for Postgres/Redis, CI (lint, typecheck, test on every PR), branch protection, issue/PR templates, labels, CODEOWNERS, project board automation, CONTRIBUTING.md. Every contributor's first PR happens here (add yourself to CONTRIBUTORS.md) — a zero-risk way to learn fork → branch → PR → review → merge.

**Phase 1 — Auth & users.** First real vertical slice. DB migrations, argon2 passwords, JWT + refresh rotation, Google OAuth, profile CRUD, role middleware. Frontend: register/login forms, protected routes, profile page.

**Phase 2 — Listings.** Listing CRUD with the three-type model, photo upload to object storage, amenities, pricing, availability calendar UI. Host dashboard skeleton.

**Phase 3 — Search.** PostGIS geo queries, filters, date-availability exclusion, Redis caching, map view (Mapbox/MapLibre), search results page, listing detail page with calendar.

**Phase 4 — Booking & payments.** The hardest phase: booking state machine, transactional calendar locking, quote calculation, payment provider integration (test mode), webhooks with idempotency, expiry jobs, confirmation emails, trips page, cancellation policies.

**Phase 5 — Community features.** Double-blind reviews with rating aggregation, messaging threads, wishlists, notification preferences.

**Phase 6 — Admin & ops.** Admin panel (moderation queues, user management), payout batching, audit log, observability dashboard, security hardening sprint.

**Phase 7 — Launch.** i18n, currency display, SEO (SSR metadata, sitemap), Lighthouse ≥ 90, WCAG AA pass on core flows, production deploy + runbook, real content from pilot hosts in Kyrgyzstan.

**Phase 8 — Advanced.** Optional tracks for contributors who finished the fundamentals: React Native app reusing `packages/shared`, search engine migration, extracting the payments module into a standalone service (the microservices lesson), load testing.

## Working agreement

- Weekly demo: whatever merged to `main` gets shown (recorded, linked in Discussions)
- Issues are sized XS/S/M — nothing bigger than ~1 week for one person; bigger work becomes an epic with child issues
- No phase starts until the previous phase's demo criterion passes
- Every phase ends with a retro issue: what slowed us down, what to change
