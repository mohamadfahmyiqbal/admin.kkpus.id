# Functional Specification Document

**Project:** [PROJECT NAME]  
**Version / status:** [VERSION] / [DRAFT | APPROVED]

## 1. Scope and terminology

- **Purpose:** [WHAT THIS SPECIFIES]
- **Definitions:** [TERM]: [MEANING]
- **Roles:** reference `02_PRD.md`; list only functional differences here.

## 2. Functional modules

### [MODULE ID] — [Module name]

**Purpose:** [OUTCOME]  
**Actors:** [ROLES]  
**Preconditions:** [STATE / PERMISSIONS]

#### Use case: [USE CASE ID] — [Name]

| Step | Actor / system action | Validation / rule | Result |
| --- | --- | --- | --- |
| 1 | [ACTION] | [RULE] | [RESULT] |

**Inputs:** [FIELDS, TYPE, REQUIREDNESS]  
**Outputs:** [USER-VISIBLE / SYSTEM RESULTS]  
**Errors:** [CODE OR CONDITION → USER BEHAVIOUR]

#### Business rules

| ID | Rule | Enforced by | Related requirement |
| --- | --- | --- | --- |
| BR-001 | [RULE] | [CLIENT / SERVER / DATABASE] | [PRD-001] |

#### State transitions

| Entity | From | Event | To | Guard / side effect |
| --- | --- | --- | --- | --- |
| [ENTITY] | [STATE] | [EVENT] | [STATE] | [RULE] |

## 3. Cross-cutting behaviour

- **Authorization:** [ROLE AND SCOPE RULES]
- **Auditability:** [EVENTS AND FIELDS]
- **Notifications:** [TRIGGER, RECIPIENT, FAILURE BEHAVIOUR]
- **Offline / async behaviour:** [IF APPLICABLE]

## 4. Traceability

| Functional item | PRD item | API / data / UI reference | Test reference |
| --- | --- | --- | --- |
| [USE CASE] | [PRD-001] | [API-001 / TABLE / SCREEN] | [TEST-001] |
