# Project Rules

**Project:** KKPUS Platform  
**Version:** 1.0.0  
**Owner:** Development Team  
**Last reviewed:** 2026-11-21

## Purpose and precedence

These rules govern contributors and AI agents. They override personal preferences. Repository-local security and operational instructions override this document.

When documents conflict, use this precedence unless a decision record states otherwise:

1. Approved legal, security, and operational constraints
2. `01_PROJECT_RULES.md`
3. Approved PRD and FSD
4. Approved API, data, UI, and technical specifications
5. Test plan, backlog, development log, task breakdown, changelog, handoff

Record unresolved conflicts in the backlog; do not guess.

## Required workflow

1. Read the relevant specifications, backlog, development log, and handoff.
2. Select one unblocked task and mark it `IN_PROGRESS`.
3. Define acceptance criteria and dependencies.
4. Implement, review, and verify the task.
5. Update the backlog, development log, handoff, and changelog when appropriate.

## Engineering constraints

- **Architecture:** Modular monolith (Node.js/Express API + React admin portal + React public website)
- **Supported platforms:** Web (Admin Portal via Vite, Public Website via Vite)
- **Security requirements:** JWT authentication, RBAC, secret via env, data classification confidential
- **Data rules:** Migration-first with Sequelize, retention policy per entity, audit trail required
- **API policy:** REST, versioned via URL prefix, error envelope JSON, backward compatibility
- **Quality gates:** ESLint, Prettier, Jest/Vitest, build, npm audit
- **Release policy:** PR review, staging deploy, rollback plan documented

## Change-control rules

- Requirements changes require owner approval and updates to affected specifications before implementation.
- Schema changes require a reversible or documented migration, ERD update, and data-impact assessment.
- API changes require contract, compatibility, and test updates.
- Never commit secrets, generated credentials, or production data.
- All changes must comply with `14_GLOBAL_STANDARDS.md` (version control, Conventional Commits, SemVer, CI/CD, security, accessibility, i18n, observability, performance, and documentation).
