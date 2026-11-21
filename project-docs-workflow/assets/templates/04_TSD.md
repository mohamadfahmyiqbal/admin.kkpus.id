# Technical Specification Document

**Project:** [PROJECT NAME]  
**Version / status:** [VERSION] / [DRAFT | APPROVED]

## 1. Architecture

- **Style:** [MODULAR MONOLITH / SERVICES / OTHER]
- **Context diagram:** [MERMAID OR LINK]
- **Components and responsibilities:**

| Component | Responsibility | Owned data | Interfaces |
| --- | --- | --- | --- |
| [COMPONENT] | [RESPONSIBILITY] | [DATA] | [API / EVENT] |

## 2. Technology decisions

| Area | Choice | Version | Rationale | Alternatives rejected |
| --- | --- | --- | --- | --- |
| [AREA] | [TECHNOLOGY] | [VERSION] | [WHY] | [WHY NOT] |

## 3. Module boundaries

| Module | Owns | Depends on | Public interface | Forbidden responsibility |
| --- | --- | --- | --- | --- |
| [MODULE] | [DATA / LOGIC] | [MODULES] | [API / EVENTS] | [BOUNDARY] |

## 4. Key flows and failure handling

### [FLOW]

1. [STEP]
2. [STEP]

**Consistency model:** [TRANSACTION / EVENTUAL / OTHER]  
**Idempotency key:** [IF APPLICABLE]  
**Retries, timeouts, and compensation:** [BEHAVIOUR]  
**Observability:** [LOGS, METRICS, TRACES]

## 5. Security and operations

- **Authentication / authorization:** [METHOD]
- **Secret handling:** [METHOD]
- **Data classification / encryption:** [POLICY]
- **Rate limits / abuse controls:** [POLICY]
- **Environments / configuration:** [DEV, STAGING, PRODUCTION]
- **Deployment / rollback:** [PROCESS]
- **Backup / recovery objectives:** [RPO / RTO]

## 6. Non-functional requirements

| Category | Requirement | Measurement | Target |
| --- | --- | --- | --- |
| Performance | [REQUIREMENT] | [METHOD] | [TARGET] |
| Availability | [REQUIREMENT] | [METHOD] | [TARGET] |
| Accessibility | [REQUIREMENT] | [METHOD] | [TARGET] |
