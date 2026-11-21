# Test Plan

**Project:** [PROJECT NAME]  
**Version:** [VERSION]  
**QA owner:** [OWNER]

## 1. Quality goals and scope

- **Quality risks:** [RISK]
- **In scope:** [SYSTEMS / FLOWS]
- **Out of scope:** [EXCLUSIONS]
- **Entry criteria:** [REQUIREMENTS / ENVIRONMENT]
- **Exit criteria:** [PASS RATE / BLOCKER POLICY / EVIDENCE]

## 2. Environments and test data

| Environment | Purpose | Build / configuration | Test data | Owner |
| --- | --- | --- | --- | --- |
| [DEV/STAGING] | [PURPOSE] | [DETAIL] | [DATA POLICY] | [OWNER] |

## 3. Test strategy

| Layer | Purpose | Tool / method | Required for |
| --- | --- | --- | --- |
| Unit | [LOGIC] | [TOOL] | [MODULES] |
| Integration | [CONTRACT] | [TOOL] | [MODULES] |
| End-to-end | [JOURNEY] | [TOOL] | [CRITICAL FLOWS] |
| Security | [RISK] | [METHOD] | [SCOPE] |
| Performance | [SLO] | [METHOD] | [SCOPE] |

## 4. Test cases

| ID | Requirement / rule | Preconditions | Steps | Expected result | Type | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| TEST-001 | [PRD/FSD ID] | [STATE] | [STEPS] | [OBSERVABLE RESULT] | [TYPE] | [P0] |

## 5. Regression and release checks

- [ ] Build, lint, and typecheck pass.
- [ ] Relevant automated tests pass.
- [ ] Critical user journeys pass in [ENVIRONMENT].
- [ ] API/schema compatibility reviewed.
- [ ] Accessibility and security checks required by scope pass.
- [ ] Known issues have owner, severity, and release disposition.

## 6. Defect reporting

| Field | Required content |
| --- | --- |
| ID / severity | [FORMAT] |
| Reproduction | [STEPS, ENVIRONMENT, DATA] |
| Expected / actual | [OUTCOMES] |
| Evidence | [LOGS, SCREENSHOT, TRACE] |
| Owner / status | [ASSIGNEE, STATE] |
