---
name: project-docs-workflow
description: >-
  Documentation-first software delivery system built on a 17-document template set
  (Project Rules, PRD, FSD, TSD, ERD, API Spec, UI/UX Spec, Test Plan, Backlog,
  Dev Log, Changelog, Coding Standards, Task Breakdown, Handoff, Global Standards).
  Use this skill whenever the user wants to start or scaffold a new software project, asks for a
  PRD, FSD, TSD, ERD, API spec, test plan, or backlog, wants project documentation
  set up, or is implementing features in a repository that contains a project-docs/
  directory with numbered documents (01_PROJECT_RULES.md, 02_PRD.md, ...). Also use
  it when the user mentions handoffs between sessions, dev logs, task breakdowns,
  or asks to "follow the project docs", "update the backlog", or "close out a task"
  — even if they don't name a specific document.
---

# Project Docs Workflow

A documentation-first operating model for software projects. The document set is the
source of truth; code must conform to it. This skill has two modes — detect which one
applies before doing anything else:

1. **Bootstrap mode** — the user is starting a project or asks for docs (PRD, FSD, etc.).
   Scaffold and fill the template set.
2. **Implementation mode** — a `project-docs/` directory with these documents already
   exists. Follow the session workflow and keep the documents current.

The 17 templates are bundled in `assets/templates/`. Read a template before producing
or editing its document — the templates define the required sections and table shapes.

## Source-of-truth order

When documents conflict, higher wins. Never resolve a conflict silently: record it as a
`BLOCKED` backlog item and ask the owner for a decision.

1. Approved legal, security, and operational constraints
2. `01_PROJECT_RULES.md`
3. `02_PRD.md`, `03_FSD.md`
4. `04_TSD.md`, `05_ERD.md`, `06_API_SPEC.md`, `07_UI_UX_SPEC.md`
5. `08_TEST_PLAN.md`, `09_BACKLOG.md`, `10_DEV_LOG.md`, `11_CHANGELOG.md`,
   `12_CODING_STANDARDS.md`, `13_TASK_BREAKDOWN.md`, `HANDOFF.md`
6. `14_GLOBAL_STANDARDS.md` — global conventions (version control, commits, versioning,
   CI/CD, security, privacy, accessibility, i18n, observability, performance,
   dependency management, testing, documentation, editor). Project-specific rules may
   tighten but never relax these standards.

## Bootstrap mode

Goal: a `project-docs/` directory where every `[placeholder]` is replaced with real,
agreed content. Fictional requirements are worse than missing ones — delete sections
that are explicitly out of scope rather than inventing filler.

Sequence (from the template README):

1. Copy the templates from `assets/templates/` into `project-docs/` in the target repo.
2. Fill `01`–`08` with the user, in order. Interview rather than invent: the PRD needs
   real users, measurable success metrics, and explicit non-goals; the FSD needs
   testable rules and state transitions; the TSD/ERD/API/UI specs need decisions the
   user has actually made. Park unknowns in the PRD "Open decisions" table instead of
   guessing.
3. Populate `13_TASK_BREAKDOWN.md` (phases → epics → features → tasks with requirement
   references), then create the first actionable tasks in `09_BACKLOG.md`.
4. Set the baseline version and `Unreleased` section in `11_CHANGELOG.md`.
5. Record the baseline in `10_DEV_LOG.md` and `HANDOFF.md`.
6. Give the user `00_AI_AGENT_START_PROMPT.md` adapted with the project name — it is
   the standing prompt for any implementation agent.

Every requirement gets an ID (PRD-001, BR-001, API-001, TEST-001, TASK-001…) so the
traceability tables in the FSD, Test Plan, and Task Breakdown can link them. IDs are
what make "is this change covered by a requirement?" answerable later — don't skip them.

## Implementation mode

Follow the session contract from `00_AI_AGENT_START_PROMPT.md`:

1. Read `HANDOFF.md`, `09_BACKLOG.md`, and the newest `10_DEV_LOG.md` entries to
   establish current state. Spot-check the handoff against the repository.
2. Select ONE highest-priority unblocked `TODO` task whose dependencies are `DONE`.
   Mark only it `IN_PROGRESS`.
3. Trace the task through PRD → FSD → TSD/ERD/API/UI → Test Plan. State the acceptance
   criteria before writing code. If the documents conflict or don't define an
   acceptance criterion, stop: record a `BLOCKED` item and ask for a decision.
4. Implement the smallest complete change that satisfies the task. No opportunistic
   refactors — unrelated improvements go into "Newly discovered work" in the backlog.
5. Verify with the tests the Test Plan requires plus a direct smoke scenario. Never
   claim verification that wasn't run.
6. Close out (see checklist below), then recommend one next unblocked task. Don't
   start it unasked.

### Hard rules

- Schema changes only via a migration **and** an ERD update (`05_ERD.md` migration log).
- API contract changes only with `06_API_SPEC.md` and test updates.
- If implementation must diverge from a spec, the spec is updated and approved first.
- Never commit secrets or production data.
- Follow `12_CODING_STANDARDS.md`, including its review checklist.
- Follow `14_GLOBAL_STANDARDS.md` for commits (Conventional Commits), branching, versioning
  (SemVer), security, accessibility, i18n, observability, and performance.

### Task close-out checklist

A task is `DONE` only when all of these are true:

- [ ] Acceptance criteria verified, with the exact command/scenario and observed result.
- [ ] `09_BACKLOG.md`: status `DONE`, date, and acceptance evidence recorded.
- [ ] `10_DEV_LOG.md`: newest-first entry using the template's structure (outcome,
      requirements implemented, files added/modified, DB/API/UI impact, verification,
      risks, next recommended task). Write `None` for empty categories — an explicit
      `None` proves the category was considered.
- [ ] `11_CHANGELOG.md`: updated only for user-visible, released, or versioned changes
      (Keep a Changelog categories, SemVer). Dev-only work stays in the dev log.
- [ ] `HANDOFF.md`: rewritten to the exact current state — verified state, active task,
      last verification, blockers, one next recommended task.
- [ ] Commit message follows Conventional Commits (`14_GLOBAL_STANDARDS.md` §2).
- [ ] Branch name follows convention (`feat/…`, `fix/…`, etc.).
- [ ] Security, a11y, and performance checks required by scope pass.

### Completion report

End each implementation session with:

- **Completed:** task ID and observable outcome.
- **Files changed:** paths and purpose.
- **Verification:** exact commands/scenarios and observed results.
- **Documentation updated:** backlog, dev log, changelog (if applicable), handoff.
- **Next:** one recommended task, or a concrete blocker.

## Which document owns what

Keep these distinct; duplicating state across them is how docs rot.

| Question | Document |
| --- | --- |
| Why are we building this, for whom, what counts as success? | `02_PRD.md` |
| What must the system observably do; what are the rules and states? | `03_FSD.md` |
| How is it built; what are the components, flows, NFRs? | `04_TSD.md` |
| What data exists, and how does the schema evolve? | `05_ERD.md` (+ migration log) |
| What is the external contract? | `06_API_SPEC.md` |
| What does the user see and interact with, in every state? | `07_UI_UX_SPEC.md` |
| How do we know it works? | `08_TEST_PLAN.md` |
| What is being worked on right now? | `09_BACKLOG.md` |
| What actually happened, verified, newest first? | `10_DEV_LOG.md` |
| What shipped to users? | `11_CHANGELOG.md` |
| How is code written and reviewed here? | `12_CODING_STANDARDS.md` |
| What is the full delivery roadmap? | `13_TASK_BREAKDOWN.md` |
| Where does the next session start? | `HANDOFF.md` |
| What global conventions apply (commits, branching, CI/CD, security, a11y, i18n, perf)? | `14_GLOBAL_STANDARDS.md` |

Work absent from both `13_TASK_BREAKDOWN.md` and `09_BACKLOG.md` is not implemented
until it is recorded and triaged as a discovered task.

## Templates

`assets/templates/` contains the full 17-file set: `00_AI_AGENT_START_PROMPT.md`,
`01_PROJECT_RULES.md` … `13_TASK_BREAKDOWN.md`, `HANDOFF.md`, `14_GLOBAL_STANDARDS.md`,
and `README.md` (the operating-model overview). It also includes supporting repository
files: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `LICENSE`,
`CHANGELOG_TEMPLATE.md`, `.editorconfig`, `.gitignore`, `.env.example`. Use them verbatim
as the starting structure; add project-specific detail, don't remove the audit trail
sections.
