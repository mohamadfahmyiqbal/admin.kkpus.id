# Project Documentation Template

A documentation-first starter kit for software projects. Replace every `[placeholder]` before implementation. Delete sections that are explicitly out of scope; do not leave fictional requirements.

## Source-of-truth order

1. Approved legal, security, and operational constraints
2. `01_PROJECT_RULES.md` — operating constraints and conflict policy.
3. `02_PRD.md` — product scope and business goals.
4. `03_FSD.md` — observable functional behaviour and business rules.
5. `04_TSD.md` — architecture and implementation constraints.
6. `05_ERD.md` — data model and migrations.
7. `06_API_SPEC.md` — external API contract.
8. `07_UI_UX_SPEC.md` — interaction and visual contract.
9. `08_TEST_PLAN.md` — acceptance and quality strategy.
10. `09_BACKLOG.md` — active delivery state.
11. `10_DEV_LOG.md` — verified engineering history.
12. `11_CHANGELOG.md` — released changes.
13. `12_CODING_STANDARDS.md` — code conventions.
14. `13_TASK_BREAKDOWN.md` — complete delivery roadmap.
15. `HANDOFF.md` — current-session continuity.
16. `14_GLOBAL_STANDARDS.md` — global development standards (version control, commits, versioning, CI/CD, security, privacy, accessibility, i18n, observability, performance, documentation, editor).

`00_AI_AGENT_START_PROMPT.md` tells a new AI agent how to use the set.

## Supporting repository files

These files are also scaffolded into the target repo root and are part of the standard:

- `CONTRIBUTING.md` — how to contribute.
- `SECURITY.md` — vulnerability disclosure policy.
- `CODE_OF_CONDUCT.md` — community behaviour standards.
- `LICENSE` — software licence.
- `.editorconfig` — editor formatting rules.
- `.gitignore` — ignored paths.
- `.env.example` — required environment variables (no values).

## Operating model

- Requirements, decisions, contracts, and current work state are distinct documents. Keep them distinct.
- Global standards (`14_GLOBAL_STANDARDS.md`) apply everywhere; project-specific rules (`01_PROJECT_RULES.md`) may tighten but never relax them.
- A conflict is a blocker: record it in `09_BACKLOG.md` and `HANDOFF.md`; do not choose silently.
- Complete one coherent task at a time. A completed task has implementation evidence, verification evidence, backlog state, a development-log entry, and an appropriate changelog update.
- Add only project-specific detail. This template deliberately does not prescribe a stack, architecture, or workflow tool.

## Bootstrap sequence

1. Fill `01` through `08`; agree on scope and acceptance criteria.
2. Review and customise `14_GLOBAL_STANDARDS.md` for the project (commits, branches, CI/CD, security, a11y, etc.).
3. Add the supporting files (`CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, `.editorconfig`, `.gitignore`, `.env.example`) to the repo root.
4. Populate `13_TASK_BREAKDOWN.md`, then create actionable tasks in `09_BACKLOG.md`.
5. Set the baseline version and initial `Unreleased` section in `11_CHANGELOG.md`.
6. Record the project baseline in `10_DEV_LOG.md` and `HANDOFF.md`.
7. Give the starting-agent prompt to each new implementation agent.
