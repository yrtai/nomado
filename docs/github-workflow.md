# GitHub Workflow Guide

This project exists to teach professional GitHub workflow. The rules below are how large companies actually work. They are enforced by branch protection and code review, not by trust.

## 1. The golden path (every change, no exceptions)

```
pick issue → assign yourself → branch → commit → push → PR → CI green → review → merge → issue auto-closes
```

1. **Pick an issue** from the project board's `Ready` column. Comment "I'll take this" and assign yourself. One issue at a time until you've merged 3 PRs.
2. **Branch** from `main`: `git checkout -b feat/123-listing-photo-upload` (format: `type/issue-number-short-name`; types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`).
3. **Commit** using Conventional Commits: `feat(listings): add photo upload endpoint (#123)`. Small commits; each should build.
4. **Push & open a PR** against `main`. Fill the PR template completely. Title = conventional commit format. Write `Closes #123` in the description so the issue auto-closes on merge.
5. **CI must be green** (lint, typecheck, tests). Red CI = your job to fix, nobody reviews red PRs.
6. **Review:** 1 approval required (2 for `payments` and `auth` modules — see CODEOWNERS). Respond to every comment; resolve conversations yourself only after addressing them.
7. **Merge:** squash-merge only (clean linear history on `main`). Delete the branch after merge.

**Never:** push directly to `main` (blocked anyway), force-push a branch someone is reviewing, open a PR > ~400 changed lines (split it), start coding without an issue.

## 2. Repository configuration

**Branch protection on `main`:** require PR, require 1 approval, require status checks (lint, typecheck, test, build), require conversation resolution, no force pushes, admins included.

**Labels:**

| Label | Use |
|---|---|
| `type: feature` / `bug` / `docs` / `chore` / `test` | what kind of work |
| `area: frontend` / `backend` / `infra` / `design` | where |
| `size: XS` (<2h) / `S` (<1d) / `M` (<1wk) | how big |
| `good first issue` | safe for a brand-new contributor |
| `help wanted` | unassigned, ready, needs an owner |
| `blocked` | waiting on another issue (link it) |
| `epic` | parent issue tracking child issues |
| `research` | output is a written doc/Discussion, not code |

**Milestones:** one per roadmap phase (`Phase 0: Setup`, `Phase 1: Auth`, …). Every issue belongs to a milestone.

**Project board (GitHub Projects):** columns `Backlog → Ready → In Progress → In Review → Done`, automated: assigned ⇒ In Progress, PR opened ⇒ In Review, merged ⇒ Done. Board views: by milestone, by assignee, by area.

**Issue templates** (`.github/ISSUE_TEMPLATE/`): `feature.yml` (user story, acceptance criteria, hints, files to touch), `bug.yml` (steps, expected/actual, environment), `research.yml`. **PR template** asks: what/why, how to test, screenshots, checklist (tests added, docs updated, self-reviewed diff).

**CODEOWNERS:** maintainers own `/apps/api/src/modules/payments/` and `/apps/api/src/modules/auth/` and `/.github/` — those paths require maintainer review automatically.

**Discussions:** enabled — Q&A category for help ("how do I run migrations?"), Ideas for proposals, Show & Tell for weekly demos. Issues are for actionable work only; questions go to Discussions.

## 3. Writing good issues (for maintainers)

Every issue must contain: **context** (why, link to design doc section), **acceptance criteria** (checkbox list a reviewer can verify), **hints** (files to touch, relevant docs), **size label**. If a junior can't start it without asking a question, the issue isn't done being written. Epics list child issues; child issues link the epic.

## 4. Code review culture

- Review within 24h or say you can't
- Comments are about code, never people; prefix nitpicks with `nit:`
- Author of a merged PR reviews someone else's PR next — reviewing is how you learn fastest
- Request changes with a reason and a suggestion, not just "this is wrong"
- It's normal for a first PR to get 15 comments. That's the product working.

## 5. Issue lifecycle for contributors

```
see issue → read linked design-doc section → ask in issue if unclear
→ assign self → code → PR → address review → merge → pick next issue
```

Stale rule: assigned but no commit in 7 days → maintainer pings; 14 days → unassigned back to `Ready` (no hard feelings — life happens).

## 6. Releases

`main` auto-deploys to staging. Production releases are tagged `v0.x.y` (semver) with generated release notes grouped by Conventional Commit type. A release issue uses the deploy checklist (migrations? env vars? rollback plan?).
