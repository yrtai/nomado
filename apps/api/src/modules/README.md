# Modules

The api is a **modular monolith** (docs/system-design.md §2–3). Each domain
gets a folder here:

```
modules/
├── auth/        # Phase 1
├── users/       # Phase 1
├── listings/    # Phase 2
├── availability/# Phase 2
├── search/      # Phase 3
├── booking/     # Phase 4
├── payments/    # Phase 4
├── reviews/     # Phase 5
├── messaging/   # Phase 5
└── admin/       # Phase 6
```

## The one rule

**Modules talk to each other only through their public interface**
(`modules/<name>/index.ts`) — never by importing another module's internals
and never by querying another module's tables. Code review enforces this.

A module folder typically contains:

```
auth/
├── index.ts        # public interface — the ONLY thing other modules import
├── auth.router.ts  # express routes
├── auth.service.ts # business logic
├── auth.schema.ts  # zod schemas (request/response)
└── auth.test.ts    # tests next to the code they test
```
