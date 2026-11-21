# Global Development Standards

**Project:** [PROJECT NAME]  
**Version:** [VERSION]  
**Owner:** [OWNER]  
**Last reviewed:** [YYYY-MM-DD]

## Purpose

This document defines the global, cross-cutting standards applied to every repository, branch, commit, release, and runtime of this project. It is the single source of truth for conventions that are not project-specific. Project-specific rules in `01_PROJECT_RULES.md` may tighten these standards but never relax them.

## 1. Version control and branching

- **Default branch:** `main` (protected). Direct pushes are forbidden.
- **Branching model:** trunk-based development with short-lived feature branches.
- **Branch naming:** `feat/<scope>-<slug>`, `fix/<scope>-<slug>`, `chore/<scope>-<slug>`, `docs/<scope>-<slug>`, `refactor/<scope>-<slug>`, `test/<scope>-<slug>`, `hotfix/<slug>`.
- **Lifetime:** feature branches must be merged within 5 working days; stale branches are deleted.
- **Merge strategy:** squash merge into `main` with a Conventional Commit message; delete branch after merge.
- **Protected branches:** `main`, `release/*`. Require PR review, passing CI, and up-to-date branch.

## 2. Commit convention (Conventional Commits)

Format: `<type>(<scope>): <subject>` with optional body and footer.

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Scope:** module or area affected (e.g., `api`, `web`, `db`).
- **Subject:** imperative mood, lowercase, no trailing period, max 72 chars.
- **Body:** wrap at 100 chars; explain *why*, not *what*.
- **Breaking change:** `!` after type/scope and `BREAKING CHANGE:` footer.
- **Issue/PR references:** footer `Closes #123`, `Refs #456`.
- **No WIP commits** on protected branches; use `git commit --fixup` locally.

## 3. Versioning (Semantic Versioning 2.0.0)

- Format `MAJOR.MINOR.PATCH` (pre-release: `MAJOR.MINOR.PATCH-rc.1`).
- **MAJOR:** incompatible API/data/product behaviour change.
- **MINOR:** backward-compatible feature.
- **PATCH:** backward-compatible fix, security patch, or docs correction.
- Tags are annotated and signed where possible: `v1.2.3`.
- Every release has a corresponding `CHANGELOG.md` entry and git tag.

## 4. Changelog (Keep a Changelog)

- Sections per release: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`, `Performance`, `Database`, `API`, `Documentation`.
- `Unreleased` section always present at top.
- Entries are user-facing; dev-only work stays in `10_DEV_LOG.md`.
- Dates in ISO-8601 (`YYYY-MM-DD`).

## 5. Code review

- Every change via pull request; no self-merge on protected branches.
- Minimum 1 reviewer (2 for security/data/auth changes).
- Reviewer checklist (see `12_CODING_STANDARDS.md` §5) must be satisfied.
- PR title follows Conventional Commits; PR description links task ID and requirement IDs.
- Stale PRs (>7 days) are closed or re-based.
- CI must be green before merge.

## 6. CI/CD

- **Pipeline stages:** lint → typecheck → unit tests → integration tests → build → security scan → (optional) e2e.
- **Required checks on PR:** lint, typecheck, tests, build, secret scan.
- **Deployment:** automated to staging on merge to `main`; production via tagged release with manual approval.
- **Rollback:** every release must be rollback-able within 15 minutes; document rollback command in release notes.
- **No secrets in CI logs**; use masked variables and OIDC where supported.

## 7. Environments and configuration

- Environments: `local`, `dev`, `staging`, `production`.
- Configuration via environment variables; never hardcode secrets or endpoints.
- Provide `.env.example` with all required keys (no values) in repo root.
- Validate environment variables at startup; fail fast on missing/invalid config.
- Secrets managed via secret manager (not committed); rotation policy documented.
- Feature flags for risky changes; default off in production until validated.

## 8. Security (ISO/IEC 27001:2022 Annex A, OWASP)

- **Authentication:** [METHOD]; MFA for privileged accounts.
- **Authorization:** least privilege; deny by default; enforce server-side.
- **Input validation:** at every boundary; allow-list over deny-list.
- **Output encoding:** context-aware (HTML, JS, URL, CSS, SQL).
- **Secrets:** never committed; scan with gitleaks/trufflehog in CI.
- **Dependencies:** SCA scan; patch critical CVEs within 7 days, high within 30 days.
- **Data classification:** public / internal / confidential / restricted; encryption at rest for confidential+.
- **Logging:** no PII/secrets in logs; structured JSON with correlation IDs.
- **Headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Rate limiting / abuse controls** on all public endpoints.
- **Security disclosure:** `SECURITY.md` with contact and response SLA.

## 9. Privacy and data protection

- Collect only necessary data (data minimisation).
- Document lawful basis and retention period per data category.
- Right to access / export / delete supported where applicable.
- DPIA for high-risk processing.
- Consent recorded with timestamp and version.
- Backups encrypted and tested for restore quarterly.

## 10. Accessibility (WCAG 2.2 AA)

- All user-facing UI must meet WCAG 2.2 AA.
- Keyboard operable; visible focus; logical tab order.
- Colour contrast ≥ 4.5:1 (text), ≥ 3:1 (large/UI).
- Semantic HTML; ARIA only when native semantics insufficient.
- Screen-reader tested for critical flows.
- Automated a11y checks in CI (axe-core or equivalent).

## 11. Internationalisation (i18n)

- All user-facing strings externalised; no hardcoded text in components.
- Locale files under `i18n/` or framework equivalent; default locale documented.
- Dates, numbers, currency formatted via locale-aware APIs (ICU).
- RTL support considered for applicable locales.
- Translation keys stable; renames require migration note.

## 12. Observability

- **Logging:** structured, leveled (debug/info/warn/error), with correlation/trace IDs; no PII.
- **Metrics:** RED (rate, errors, duration) for services; USE for resources.
- **Tracing:** distributed tracing for cross-service flows (OpenTelemetry preferred).
- **Alerting:** SLO-based alerts with runbooks; no alert fatigue (max actionable alerts).
- **Dashboards:** golden signals per service.

## 13. Performance

- Define performance budgets per route/API (e.g., LCP < 2.5s, API p95 < 300ms).
- Bundle size budgets enforced in CI.
- Database queries reviewed for N+1 and missing indexes.
- Load testing before major releases.

## 14. Dependency management

- Lockfiles committed (`package-lock.json` / `pnpm-lock.yaml` / etc.).
- Automated dependency updates (Dependabot/Renovate) with CI validation.
- No unmaintained/deprecated dependencies without documented justification.
- License compliance check (allow-list of OSS licenses).

## 15. Testing standards

- Unit tests for logic; integration for contracts; e2e for critical journeys.
- Deterministic and isolated; no shared mutable state.
- Coverage thresholds enforced in CI (project-defined; minimum 70% lines for new code).
- Every bug fix includes a regression test that fails on the original defect.

## 16. Documentation standards

- Markdown lint (markdownlint) enforced in CI.
- Docs updated in the same PR as code change.
- ADR (Architecture Decision Record) for significant decisions under `docs/adr/`.
- README with setup, run, test, and deploy instructions.

## 17. Editor and formatting

- `.editorconfig` committed; 2-space indent default, LF line endings, final newline.
- Formatter + linter run via pre-commit hooks (husky/lefthook) and CI.
- No generated files committed unless explicitly allowed.

## Compliance matrix

| Standard | Document owner | Verification | Evidence |
| --- | --- | --- | --- |
| Version control | Tech lead | Branch protection rules | Repo settings |
| Commits | All contributors | CI commitlint | PR checks |
| Security | Security owner | SAST/DAST/SCA | Reports |
| Accessibility | Design/QA | axe-core + manual | Test report |
| Performance | Tech lead | Lighthouse/benchmarks | CI artifacts |