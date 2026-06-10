# System Design — Nomado

> Open-source travel platform for inbound tourism in Kyrgyzstan: book **stays** (like Airbnb), **cars**, and **tours** in one place.
> This document is the single source of truth for architecture. Every GitHub issue traces back to a section here.

---

## 1. Requirements

### 1.1 Functional

**Guests (travelers)**
- Search stays / cars / tours by location, dates, guests, price, amenities
- View listing details: photos, description, map, reviews, availability calendar
- Book with date selection; pay online; receive confirmation
- Manage trips: upcoming, past, cancellations
- Leave reviews after completed bookings
- Message hosts
- Wishlists (save listings)

**Hosts / Operators**
- Register as host; pass verification
- Create and manage listings (stay, car, or tour) with photos, pricing, availability calendar
- Accept / decline booking requests (or instant book)
- Calendar management (block dates, sync)
- Dashboard: earnings, upcoming bookings, reviews

**Platform / Admin**
- Moderate listings and reviews
- Manage users (ban, verify)
- Payouts to hosts (platform takes a commission)
- Analytics dashboard

**Cross-cutting**
- Auth: email/password + Google OAuth; roles: guest, host, admin
- i18n: English, Russian, Kyrgyz
- Currency display: KGS, USD, EUR
- Notifications: email (booking confirmed, message received, review reminder)
- Mobile: responsive web first; native app is a later phase

### 1.2 Non-functional

| Requirement | Target (v1) | Note |
|---|---|---|
| Availability | 99.5% | Single region is fine |
| Search latency | < 500 ms p95 | |
| Page load | < 3 s on 3G | Tourists on roaming |
| Scale | 10k listings, 100k users, 1k bookings/day | Realistic for KG inbound tourism |
| Security | OWASP top 10, payment data never stored | Use payment provider tokens |
| Cost | Free-tier friendly | Students run this |

### 1.3 Constraints
- Team: junior developers, part-time, variable availability
- Stack: TypeScript everywhere (React + Node.js)
- Everything must be doable with free tiers (Vercel/Render/Railway, Neon/Supabase Postgres)
- The project must be decomposable into hundreds of small, independent GitHub issues

---

## 2. Architecture decision: modular monolith

Airbnb today runs thousands of microservices — and Airbnb **started as a monolith** and split it only when team size forced them to. We copy Airbnb's *domain boundaries* exactly, but deploy them as one modular monolith. Each module below maps 1:1 to a service Airbnb eventually extracted, so the codebase teaches the same architecture without the operational pain juniors can't handle.

**Trade-off made explicit:**

| | Microservices now | Modular monolith (chosen) |
|---|---|---|
| Realism | Matches Airbnb today | Matches Airbnb's actual history |
| Junior-friendly | No — distributed debugging, infra overhead | Yes — one deploy, one DB, clear modules |
| Cost | Many services to host | One free-tier service |
| Future | — | Modules split into services in Phase 8 (advanced learning) |

**Rule:** modules communicate only through their public interfaces (exported functions / internal events), never by reaching into another module's tables. This is enforced in code review and is the #1 architecture lesson of the project.

---

## 3. High-level design

```
                ┌─────────────────────────────────────────────┐
                │                  Clients                    │
                │  Web (React/Next.js)   Mobile (later, RN)   │
                └───────────────┬─────────────────────────────┘
                                │ HTTPS / JSON
                ┌───────────────▼─────────────────────────────┐
                │            API (Node.js + Express/Nest)     │
                │  ┌────────┐ ┌─────────┐ ┌────────┐          │
                │  │ Auth   │ │ Users   │ │Listings│  modules │
                │  ├────────┤ ├─────────┤ ├────────┤          │
                │  │ Search │ │ Booking │ │Payments│          │
                │  ├────────┤ ├─────────┤ ├────────┤          │
                │  │Reviews │ │Messaging│ │ Admin  │          │
                │  └────────┘ └─────────┘ └────────┘          │
                │        internal event bus (in-process)      │
                └──────┬──────────────┬───────────┬───────────┘
                       │              │           │
              ┌────────▼───┐  ┌───────▼────┐  ┌───▼────────────┐
              │ PostgreSQL │  │   Redis    │  │ Object storage │
              │ (+PostGIS) │  │cache/queue │  │  (images, S3)  │
              └────────────┘  └────────────┘  └────────────────┘

         External: payment provider · email (Resend) · maps (Mapbox/OSM) · OAuth
```

### 3.1 Monorepo layout

```
nomado/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Node.js backend (modular monolith)
│   └── mobile/       # React Native (Phase 7+)
├── packages/
│   ├── shared/       # shared types, validation schemas (zod)
│   ├── ui/           # shared UI components
│   └── config/       # eslint, tsconfig, prettier presets
├── docs/             # this folder
├── .github/          # workflows, issue/PR templates, CODEOWNERS
└── docker-compose.yml  # local Postgres + Redis
```

Tooling: pnpm workspaces + Turborepo. One `pnpm dev` boots everything.

### 3.2 Backend modules (the "Airbnb domains")

| Module | Responsibility | Key entities |
|---|---|---|
| `auth` | signup, login, OAuth, sessions/JWT, roles | Session, RefreshToken |
| `users` | profiles, host verification | User, HostProfile |
| `listings` | CRUD for stays/cars/tours, photos, amenities, pricing rules | Listing, Photo, Amenity, PricingRule |
| `availability` | calendars, blocked dates | CalendarDay |
| `search` | filtered + geo search, ranking | (reads listings) |
| `booking` | reservation state machine, cancellation policies | Booking |
| `payments` | charges, refunds, host payouts, commission | Payment, Payout |
| `reviews` | two-sided reviews, ratings aggregation | Review |
| `messaging` | guest↔host threads | Conversation, Message |
| `notifications` | email/push fan-out, triggered by events | Notification |
| `admin` | moderation, analytics | AuditLog |

### 3.3 Listing types: one table, three kinds

A `Listing` has `type: 'stay' | 'car' | 'tour'` plus a type-specific JSONB `attributes` column (rooms/beds for stays; transmission/seats for cars; duration/group-size/itinerary for tours). Shared behavior (photos, pricing, availability, reviews, booking) is identical across types — that's the whole point of the product and a great lesson in data modeling.

Trade-off: JSONB loses some type safety in the DB; we recover it with zod schemas in `packages/shared` validated at the API boundary.

---

## 4. Data model (core)

```
User ──1:1── HostProfile
User ──1:N── Listing (as host)
Listing ──1:N── Photo
Listing ──1:N── CalendarDay (date, status: available|blocked|booked, price_override)
Listing ──N:M── Amenity
User ──1:N── Booking ──N:1── Listing
Booking ──1:1── Payment
Booking ──1:2── Review (guest→host, host→guest)
Conversation ──1:N── Message; Conversation links guest+host+listing
User ──N:M── Listing (Wishlist)
```

**Booking state machine** (the heart of the system):

```
pending ──host accepts──► confirmed ──check-in date──► active ──checkout──► completed
   │                          │                                                │
   │ host declines / expires  │ guest or host cancels (policy applies)         │ review window
   ▼                          ▼                                                ▼
declined                  cancelled (full/partial refund per policy)        reviewed
```

Instant-book listings skip `pending`.

**Concurrency rule:** booking creation must be transactional — lock the calendar rows (`SELECT … FOR UPDATE`), verify all dates available, insert booking, mark dates. This prevents double-booking and is one of the best interview-grade lessons in the project.

Geo: PostGIS point on Listing; search uses `ST_DWithin` for radius queries. (Elasticsearch is intentionally deferred to Phase 8.)

---

## 5. API design

REST, versioned under `/api/v1`. JSON. Errors follow RFC 7807 (problem+json). Auth via short-lived JWT access token + refresh token cookie.

Representative contracts (full list lives in `docs/api/` as the project grows):

```
POST   /api/v1/auth/register            {email, password, name}
POST   /api/v1/auth/login               → {accessToken}; sets refresh cookie
GET    /api/v1/listings?type=stay&lat=&lng=&radius=&checkIn=&checkOut=&guests=&priceMin=&priceMax=&amenities=&page=
POST   /api/v1/listings                 (host) create
GET    /api/v1/listings/:id
GET    /api/v1/listings/:id/availability?from=&to=
POST   /api/v1/bookings                 {listingId, checkIn, checkOut, guests}
POST   /api/v1/bookings/:id/cancel
GET    /api/v1/trips                    (guest's bookings)
POST   /api/v1/reviews                  {bookingId, rating, text}
GET    /api/v1/conversations / POST /api/v1/conversations/:id/messages
POST   /api/v1/payments/webhook        (provider webhook, idempotent)
```

Conventions taught: pagination (`page`/`limit` + `X-Total-Count`), idempotency keys on booking/payment creation, input validation with zod at every boundary, never trust client prices (server recomputes totals).

---

## 6. Key flows

**Search:** client → `GET /listings` → API filters in Postgres (PostGIS radius + date-availability anti-join + attribute filters) → results cached in Redis 60 s keyed by query hash. Ranking v1: rating desc, then review count. Cache invalidation on listing update (lesson: cache keys & TTLs).

**Booking + payment:**
1. Client requests quote → server computes price (nights × rate + fees − discounts)
2. `POST /bookings` with idempotency key → transaction locks calendar → booking `pending`/`confirmed`
3. Payment intent created at provider; client confirms card; webhook flips payment `succeeded`
4. Event `booking.confirmed` → notifications module emails both sides
5. Failure paths: payment fails → booking auto-cancels after 30 min (background job); webhook retries are idempotent

**Reviews:** unlocked only after booking `completed`; double-blind (published when both submitted or 14 days pass) — same as Airbnb.

Background jobs (BullMQ on Redis): pending-booking expiry, review-window reminders, payout batching, email retries.

---

## 7. Scale & reliability (v1 targets)

- Load estimate: 1k bookings/day ≈ negligible write load; search dominates reads → Redis cache + proper indexes are enough. No sharding, no read replicas in v1.
- Single API instance can scale horizontally later (stateless; sessions in JWT/Redis).
- Backups: daily Postgres dump (managed provider handles it).
- Observability: structured logs (pino), error tracking (Sentry free tier), `/health` endpoint, uptime monitor. Basic metrics dashboard in Phase 6.
- Rate limiting on auth and search endpoints (Redis sliding window).

**Revisit when:** listings > 100k (move search to Elasticsearch/Typesense), team > 15 contributors on one deploy (split payments module out first), image traffic grows (add CDN + on-the-fly resizing).

---

## 8. Security checklist (enforced via issues + CI)

- Passwords: argon2; tokens httpOnly + SameSite
- Card data never touches our servers (provider-hosted fields)
- Authorization on every route: guests can't edit listings; hosts can't read others' payouts (object-level checks, not just role checks)
- File uploads: type/size validation, served from object storage, never from API host
- Secrets in env, never in repo; dependabot + CodeQL enabled

---

## 9. What we deliberately copy from Airbnb

Domain boundaries, the booking state machine, double-blind reviews, cancellation-policy tiers (Flexible / Moderate / Strict), host/guest two-sided model, instant book vs request-to-book, service-fee commission model, wishlist, message-before-book. What we defer: dynamic pricing ML, fraud ML, multi-region, microservices runtime — each gets a "research issue" so learners study how Airbnb does it even though v1 doesn't build it.
