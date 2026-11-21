# Engineering Backlog

**Project:** KKPUS Platform  
**Last reviewed:** 2026-11-21

## Status and priority definitions

| Status | Meaning |
| --- | --- |
| TODO | Defined, unstarted, and ready when dependencies are met. |
| IN_PROGRESS | Actively being implemented; one active owner. |
| REVIEW | Awaiting review or QA evidence. |
| BLOCKED | Cannot proceed; blocker and owner are recorded. |
| DONE | Implemented and verified; logs updated. |
| CANCELLED | Deliberately removed; reason recorded. |

| Priority | Meaning |
| --- | --- |
| P0 | Blocks security, data integrity, release, or core operation. |
| P1 | Required for committed scope. |
| P2 | Important but safely sequenced later. |
| P3 | Nice to have / future. |

## Active work

| ID | Title | Status | Priority | Owner | Dependencies | Acceptance evidence | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TASK-000 | Project documentation initialization | DONE | P0 | Development Team | None | 21 files in project-docs/ | 2026-11-21 |
| TASK-001 | Define product requirements (PRD) | DONE | P1 | Development Team | TASK-000 | PRD approved | 2026-11-21 |
| TASK-002 | Define functional requirements (FSD) | DONE | P1 | Development Team | TASK-001 | FSD covers PRD-001..026 | 2026-11-21 |
| TASK-003 | Define technical specifications (TSD) | DONE | P1 | Development Team | TASK-002 | TSD covers all FSD modules | 2026-11-21 |
| TASK-004 | Define database schema / ERD | DONE | P1 | Development Team | TASK-003 | ERD covers all TSD modules | 2026-11-21 |
| TASK-005 | Define API specification | DONE | P1 | Development Team | TASK-004 | API spec covers all endpoints | 2026-11-21 |
| TASK-006 | Define UI/UX specification | DONE | P1 | Development Team | TASK-005 | UI/UX spec covers all screens & interaction states | 2026-11-22 |
| TASK-007 | Define Test Plan | DONE | P1 | Development Team | TASK-006 | Test plan covers test strategy, environments, and traceable test cases | 2026-11-22 |
| DEF-001 | Admin: dead reference `savingsService.approveWithdrawal`/`disburseWithdrawal` di DashboardApprovalModals.jsx (method tidak ada di USavings.js; fallback approvalService berfungsi — dead code, non-fungsional) | OPEN | P2 | Development Team | None | Hapus referensi dead code atau tambahkan method yang benar + verifikasi build admin | 2026-11-22 |

## Task details

### TASK-000 — Project documentation initialization

- **Status / priority:** DONE / P0
- **Goal:** Establish project-docs/ baseline from templates
- **Scope:** Copy 21 template markdown files, replace global placeholders (project name, version, owner, dates, stack)
- **Exclusions:** Content-specific specifications (PRD content, FSD modules, API endpoints, ERD entities)
- **Requirements:** 00_AI_AGENT_START_PROMPT.md, 14_GLOBAL_STANDARDS.md
- **Dependencies:** None
- **Acceptance criteria:**
  - [x] All 21 template files present in project-docs/
  - [x] Global placeholders (PROJECT NAME, VERSION, OWNER, DATE) replaced
- **Verification evidence:** `ls project-docs/*.md` → 21 files; `grep` for global placeholders → none found in headers
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-001 — Define product requirements (PRD)

- **Status / priority:** DONE / P1
- **Goal:** Define product vision, users, requirements
- **Scope:** Fill 02_PRD.md with concrete requirements
- **Exclusions:** Technical implementation details
- **Requirements:** Project stakeholder input
- **Dependencies:** TASK-000
- **Acceptance criteria:**
  - [x] PRD contains problem statement, target users, 5 core journeys, 26 requirements with acceptance criteria
- **Verification evidence:** PRD review and approval
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-002 — Define functional requirements (FSD)

- **Status / priority:** DONE / P1
- **Goal:** Translate PRD-001..026 into functional modules, use cases, business rules, and state transitions
- **Scope:** Fill 03_FSD.md
- **Exclusions:** Technical/architecture decisions (TSD)
- **Requirements:** PRD-001..026
- **Dependencies:** TASK-001
- **Acceptance criteria:**
  - [x] Every PRD requirement traced to a functional item (use case/rule) with test reference
- **Verification evidence:** FSD traceability table (26 PRD items mapped to 19 modules, 28 use cases, 82 BRs, 11 state transition tables)
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-003 — Define technical specifications (TSD)

- **Status / priority:** DONE / P1
- **Goal:** Define architecture, tech decisions, module boundaries, key flows, NFRs
- **Scope:** Fill 04_TSD.md
- **Exclusions:** Database schema (ERD), API contracts, UI specs
- **Requirements:** FSD modules F-01..F-19
- **Dependencies:** TASK-002
- **Acceptance criteria:**
  - [x] TSD covers all FSD modules with components, interfaces, NFRs
- **Verification evidence:** TSD review — 15 modules mapped, 6 tech stacks, 4 key flows, 22 NFR targets
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-004 — Define database schema / ERD

- **Status / priority:** DONE / P1
- **Goal:** Define all database entities, relationships, indexes, and migration log
- **Scope:** Fill 05_ERD.md
- **Exclusions:** API contracts (06), UI specs (07)
- **Requirements:** TSD modules M-AUTH..M-FILES
- **Dependencies:** TASK-003
- **Acceptance criteria:**
  - [x] ERD covers all entities referenced in TSD module boundaries
  - [x] Migration log populated
- **Verification evidence:** ERD review — 53 entities documented across Core/Auth/Approval/Billing/Savings/Financing/Program/Content/Training domains
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-005 — Define API specification

- **Status / priority:** DONE / P1
- **Goal:** Define external API contract (endpoints, auth, errors) per module
- **Scope:** Fill 06_API_SPEC.md
- **Exclusions:** Database migration execution, UI implementation
- **Requirements:** ERD entities + FSD use cases
- **Dependencies:** TASK-004
- **Acceptance criteria:**
  - [x] API spec covers all 18 endpoint groups from TSD
- **Verification evidence:** 06_API_SPEC.md — 50 endpoints across 15 TSD modules (M-AUTH..M-FILES), traceability matrix covering all 19 FSD modules and 26 PRD requirements
- **Blocker:** None
- **Completion date:** 2026-11-21

### TASK-006 — Define UI/UX specification

- **Status / priority:** DONE / P1
- **Goal:** Define screen specifications, navigation, role access, design system, and interaction states per module
- **Scope:** Fill 07_UI_UX_SPEC.md
- **Exclusions:** Wireframes/mockups, design assets, frontend implementation
- **Requirements:** FSD modules F-01..F-19, API endpoints API-001..API-050
- **Dependencies:** TASK-005
- **Acceptance criteria:**
  - [x] UI/UX spec defines screen specifications per FSD module
  - [x] Navigation & role access matrix complete
  - [x] Interaction states (loading, empty, error, success) defined
- **Verification evidence:** 07_UI_UX_SPEC.md — 24 screen specs (SCR-001..024) mencakup 19 modul FSD, 26 PRD requirement, 50 API endpoint; matrix peran × layar; design token admin vs public; 6 catatan lintas-repo (UI-NOTE-1..6)
- **Blocker:** None
- **Completion date:** 2026-11-22

### TASK-007 — Define Test Plan

- **Status / priority:** DONE / P1
- **Goal:** Define quality goals, environments, test strategy, and traceable test cases per requirement
- **Scope:** Fill 08_TEST_PLAN.md
- **Exclusions:** Test implementation/automation code, CI/CD configuration
- **Requirements:** PRD-001..026, FSD modules, API-001..API-050, SCR-001..SCR-024
- **Dependencies:** TASK-006
- **Acceptance criteria:**
  - [x] Test plan defines quality goals, environments, and test data policy
  - [x] Test strategy per layer with tools (unit/integration/e2e/security/performance)
  - [x] Test cases traceable to PRD/API/screen IDs with expected results and priority
- **Verification evidence:** 08_TEST_PLAN.md — 36 test case (TEST-001..TEST-036): 12 P0 / 17 P1 / 7 P2; mencakup 26/26 PRD, 50/50 API endpoint, 24/24 screen; 3 environment (local/staging/production) dengan kebijakan data sintetis; 6 quality risk (R-01..R-06); traceability 3 arah (PRD↔TEST, API↔TEST, SCR↔TEST)
- **Blocker:** None
- **Completion date:** 2026-11-22

Move closed task details here; preserve task ID, outcome, verification reference, and cancellation reason where applicable.

## Newly discovered work

| Candidate ID | Discovery | Suggested priority | Source | Needs triage by |
| --- | --- | --- | --- | --- |
| NEW-001 | ~~Rewrite detail §3 `06_API_SPEC.md` menjadi inventaris aktual~~ **DONE 2026-11-22 (TASK-008)** — §3 = kontrak aktual per modul, API-001..050 dipetakan ke route aktual, API-051..054 baru (regions); ideal v1 diarsipkan §3.1 | P2 | BLK-003 / REC-1 | Development Team |
| NEW-002 | ~~Konsolidasi modul ganda: simpanan (`/api/simpanan` + `/api/savings`) & pembiayaan (`/api/financing` + `/api/financial` + `/api/jualbeli`)~~ **RESOLVED 2026-11-22 (triase)** — bukan duplikat: `/api/financial` = alias tipis (reuse controller `/api/financing`), `/api/savings` = tabungan target, `/api/simpanan` = simpanan pokok. Domain berbeda, konsolidasi tidak sepadan risiko | P2 | BLK-003 / REC-5 | Development Team |
