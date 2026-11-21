# Database Schema / ERD

**Project:** [PROJECT NAME]  
**Database:** [ENGINE / VERSION]  
**Last reviewed:** [YYYY-MM-DD]

## 1. Data model overview

```mermaid
erDiagram
  [ENTITY_A] ||--o{ [ENTITY_B] : owns
```

## 2. Entities

### [table_name]

**Purpose:** [WHY THIS ENTITY EXISTS]

| Column | Type | Null | Default | Constraints / index | Description |
| --- | --- | --- | --- | --- | --- |
| id | [TYPE] | no | [VALUE] | PK | [DESCRIPTION] |

**Relations:** [FOREIGN KEYS AND CARDINALITY]  
**Lifecycle:** [CREATED / UPDATED / DELETED / RETAINED]  
**Authorization boundary:** [WHO MAY READ / WRITE]

## 3. Integrity and performance rules

- **Invariants:** [E.G., UNIQUE PER TENANT]
- **Transactions / locking:** [WHEN REQUIRED]
- **Indexes:** [QUERY → INDEX]
- **Soft deletion / retention:** [POLICY]
- **Money / precision / time zone:** [CONVENTIONS]

## 4. Migration log

| Migration | Date | Change | Forward path | Rollback / mitigation | Data impact |
| --- | --- | --- | --- | --- | --- |
| [ID] | [DATE] | [CHANGE] | [HOW] | [HOW] | [IMPACT] |
