# UI / UX Specification

**Project:** [PROJECT NAME]  
**Design owner:** [OWNER]  
**Supported viewports / platforms:** [PLATFORMS]

## 1. Experience principles

- [PRINCIPLE AND RATIONALE]
- **Accessibility baseline:** [WCAG TARGET, KEYBOARD, FOCUS, CONTRAST]
- **Responsive policy:** [BREAKPOINTS / ADAPTATION]

## 2. Design system

| Token / component | Definition | Usage | Accessibility requirement |
| --- | --- | --- | --- |
| [TOKEN] | [VALUE] | [WHEN] | [REQUIREMENT] |

## 3. Navigation and role access

| Role | Entry points | Allowed screens | Restricted screens |
| --- | --- | --- | --- |
| [ROLE] | [PATHS] | [SCREENS] | [SCREENS] |

## 4. Screen specifications

### [SCREEN ID] — [Screen name]

**Purpose:** [USER OUTCOME]  
**Route / entry:** [PATH / TRIGGER]  
**Roles:** [ROLES]  
**Reference design:** [FIGMA / ASSET LINK]

| Area | Content / behaviour | States | Validation / accessibility |
| --- | --- | --- | --- |
| [AREA] | [BEHAVIOUR] | [LOADING / EMPTY / ERROR / SUCCESS] | [REQUIREMENT] |

**Primary action:** [ACTION → RESULT]  
**Secondary actions:** [ACTION → RESULT]  
**Responsive changes:** [SMALL-SCREEN POLICY]  
**Analytics events:** [EVENT NAME / PROPERTIES]

## 5. Interaction states

- Loading: [BEHAVIOUR]
- Empty: [BEHAVIOUR]
- Error: [RECOVERY]
- Offline / degraded: [BEHAVIOUR]
- Confirmation / destructive actions: [GUARD]
