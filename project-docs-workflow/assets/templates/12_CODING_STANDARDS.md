# Coding Standards

**Project:** [PROJECT NAME]  
**Languages / frameworks:** [STACK]

## 1. General principles

- Prefer clear, small, cohesive code over clever abstractions.
- Validate untrusted input at boundaries; encode output at rendering boundaries.
- Keep side effects explicit. Preserve errors with actionable context.
- Do not duplicate business rules across UI, services, and persistence layers.

## 2. Architecture and boundaries

| Layer / module | May do | Must not do |
| --- | --- | --- |
| Transport / controller | Parse, authorize, invoke application logic, map responses | Contain business rules or persistence queries |
| Application / service | Orchestrate use cases and enforce business rules | Depend directly on UI framework details |
| Repository / gateway | Persist and retrieve data | Apply policy or silently mutate data |
| UI | Render state and invoke use cases | Become the only source of business validation |

Add project-specific module layout and dependency rules here.

## 3. Language conventions

- **Formatting / linting:** [COMMANDS AND CONFIGURATION]
- **Types / nullability:** [POLICY]
- **Naming:** [CASES, FILE CONVENTION]
- **Errors:** [ERROR TYPE AND MAPPING POLICY]
- **Logging:** [STRUCTURED FIELDS, PII POLICY]
- **Configuration:** [ENVIRONMENT VARIABLE VALIDATION POLICY]

## 4. Testing conventions

- Test observable contracts, boundaries, failures, authorization, and state transitions.
- Tests must be deterministic and isolated.
- Use fixtures/builders from [LOCATION]; do not duplicate raw setup.
- Every regression test must fail on the original plausible defect.

## 5. Review checklist

- [ ] Requirement and acceptance criterion are traceable.
- [ ] Input validation, authorization, error handling, and data integrity are covered.
- [ ] API/data/UI contract changes are documented.
- [ ] Tests and direct smoke verification cover the changed behaviour.
- [ ] No secrets, debug code, dead compatibility path, or unrelated refactor.
