# Project Rules

**Project:** [PROJECT NAME]  
**Version:** [VERSION]  
**Owner:** [OWNER]  
**Last reviewed:** [YYYY-MM-DD]

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

- **Architecture:** [e.g., modular monolith / services / serverless]
- **Supported platforms:** [PLATFORMS]
- **Security requirements:** [AUTHORIZATION, SECRET HANDLING, DATA CLASSIFICATION]
- **Data rules:** [MIGRATION POLICY, RETENTION, AUDIT REQUIREMENTS]
- **API policy:** [VERSIONING, ERROR FORMAT, COMPATIBILITY]
- **Quality gates:** [FORMATTER, LINT, TYPECHECK, TESTS, BUILD, SECURITY SCAN]
- **Release policy:** [REVIEW, DEPLOYMENT, ROLLBACK]

## Change-control rules

- Requirements changes require owner approval and updates to affected specifications before implementation.
- Schema changes require a reversible or documented migration, ERD update, and data-impact assessment.
- API changes require contract, compatibility, and test updates.
- Never commit secrets, generated credentials, or production data.
- All changes must comply with `14_GLOBAL_STANDARDS.md` (version control, Conventional Commits, SemVer, CI/CD, security, accessibility, i18n, observability, performance, and documentation).
