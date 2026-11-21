# API Specification

**Project:** [PROJECT NAME]  
**Style / version:** [REST | GRAPHQL | EVENTS] / [VERSION]  
**Base URL:** [URL]  
**Authentication:** [METHOD]

## 1. Contract conventions

- **Media type:** `application/json`
- **Versioning:** [POLICY]
- **Pagination / filtering / sorting:** [CONVENTION]
- **Idempotency:** [HEADER / KEY / NOT APPLICABLE]
- **Error envelope:** [JSON EXAMPLE OR LINK]

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": []
  }
}
```

## 2. Common errors

| HTTP status | Code | Meaning | Client action |
| --- | --- | --- | --- |
| 400 | VALIDATION_ERROR | [MEANING] | [ACTION] |

## 3. Endpoints

### [API-001] [METHOD] /[resource]

**Purpose:** [OUTCOME]  
**Authorization:** [ROLE / SCOPE]  
**Idempotency:** [REQUIREMENT]

#### Request

| Location | Field | Type | Required | Validation | Description |
| --- | --- | --- | --- | --- | --- |
| body | [FIELD] | [TYPE] | yes | [RULE] | [DESCRIPTION] |

```json
{ "[field]": "[example]" }
```

#### Responses

| Status | When | Body |
| --- | --- | --- |
| 200 | [WHEN] | [EXAMPLE OR SCHEMA] |
| 400 | [WHEN] | `VALIDATION_ERROR` |

**Side effects:** [DATABASE / EVENT / AUDIT / NOTIFICATION]  
**Related requirements/tests:** [FSD ITEM, TEST ID]
