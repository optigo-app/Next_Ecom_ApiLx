---
trigger: always_on
---

# 29. GLOBAL MODULAR ARCHITECTURE & REUSABILITY RULE

This project must be developed using a **modular, reusable, scalable architecture**.

Every new feature must be evaluated for whether it can be implemented as a reusable module, component, hook, utility, service, configuration, or pattern.

However:

> **REUSABILITY MUST NEVER COME AT THE COST OF STABILITY, CORRECTNESS, OR DELIVERY SPEED.**

The goal is:

**Reusable + Clean + Fast + Safe + Production-ready**

Not:

**Over-engineered + Abstract + Slow + Risky**

---

# 30. PLAN THE ARCHITECTURE BEFORE CODING

For every non-trivial feature, first determine:

```text
User Requirement
      ↓
Understand Existing Architecture
      ↓
Find Similar Existing Code
      ↓
Identify Reusable Patterns
      ↓
Determine Correct Module Boundary
      ↓
Design Minimal Extension
      ↓
Check Regression Risk
      ↓
Implement
      ↓
Test
      ↓
Verify
```

Do NOT immediately create feature-specific code.

First ask:

> "Is this functionality likely to be used again?"

If yes, design the appropriate reusable abstraction.

---

# 31. GLOBAL MODULE-FIRST THINKING

When implementing a new feature, identify whether it belongs to one of these categories:

### UI

```text
components/
modules/
features/
layouts/
```

### React Logic

```text
hooks/
```

### State

```text
store/
state/
```

### API

```text
services/
api/
```

### Data

```text
repositories/
queries/
```

### Utilities

```text
utils/
helpers/
```

### Configuration

```text
config/
constants/
```

### Types

```text
types/
```

### Shared Infrastructure

```text
lib/
core/
providers/
```

Use the project's existing structure where possible.

Do not invent a new folder architecture if the project already has an established pattern.

---

# 32. REUSE EXISTING CODE FIRST

Before creating a new module:

**SEARCH FIRST.**

Look for:

* Similar components
* Similar hooks
* Similar API calls
* Similar state
* Similar utilities
* Similar validation
* Similar UI patterns
* Similar database logic
* Similar error handling

If an existing module already solves most of the problem:

> Extend it rather than creating a duplicate.

---

# 33. DO NOT DUPLICATE LOGIC

Avoid creating multiple implementations of the same concept.

Bad:

```text
UserTable.jsx
CustomerTable.jsx
EmployeeTable.jsx
VendorTable.jsx
```

when the underlying behavior is substantially the same.

Prefer a reusable abstraction where appropriate:

```text
DataTable/
    DataTable.jsx
    columns/
    configuration/
```

with configuration controlling differences.

However, do NOT force unrelated functionality into one generic component.

---

# 34. ABSTRACTION MUST HAVE A REASON

Do NOT create abstractions merely because they "look reusable."

A reusable abstraction should have at least one meaningful benefit:

* Used in multiple places
* Clearly expected to be reused
* Removes significant duplication
* Encapsulates complex behavior
* Provides a stable project-wide pattern
* Makes future feature development faster

Avoid premature abstraction.

---

# 35. THREE-USE RULE — WITH JUDGMENT

A pattern appearing multiple times is a strong signal for abstraction.

Use this as a guideline:

```text
1 usage
→ Keep local unless future reuse is obvious.

2 usages
→ Consider shared abstraction.

3+ usages
→ Strong candidate for reusable module.
```

But this is **not an absolute rule**.

A complex piece of infrastructure may deserve abstraction immediately if its reuse is clearly predictable.

Likewise, forcing unrelated functionality into a generic abstraction is prohibited.

---

# 36. FEATURE MODULE PATTERN

For larger features, prefer a self-contained feature/module structure when it improves maintainability.

Example:

```text
features/
└── dashboard/
    ├── components/
    ├── hooks/
    ├── services/
    ├── store/
    ├── types/
    ├── utils/
    └── index.ts
```

The exact structure must follow the existing project architecture.

Do not introduce this structure into every tiny feature.

---

# 37. PUBLIC API / BARREL PATTERN

For reusable modules, expose a clear public interface.

Example:

```text
feature/
├── components/
├── hooks/
├── services/
├── types/
└── index.ts
```

Prefer consumers importing from the module boundary:

```js
import { DashboardCard } from '@/features/dashboard';
```

instead of tightly coupling consumers to internal implementation paths:

```js
import DashboardCard from '@/features/dashboard/components/cards/DashboardCard';
```

Use this only where it improves the architecture and matches existing project conventions.

---

# 38. CONFIGURATION OVER DUPLICATION

When multiple components differ mainly by configuration, prefer configuration-driven design.

Example:

```js
const cardConfig = {
  title: 'Revenue',
  icon: RevenueIcon,
  value: '$84,320',
  trend: '+12.4%',
};
```

Then use a reusable component:

```jsx
<MetricCard {...cardConfig} />
```

This is preferred over copying the entire component for every variation.

---

# 39. COMPOSITION OVER GIANT COMPONENTS

Avoid giant components containing:

* UI
* API calls
* State
* Validation
* Business logic
* Formatting
* Data transformation
* Side effects

all in one file.

Prefer:

```text
Component
   ↓
Hook
   ↓
Service
   ↓
API
```

where appropriate.

Keep responsibilities separated.

---

# 40. DO NOT OVER-ABSTRACT SIMPLE CODE

Do NOT turn:

```js
const total = price * quantity;
```

into:

```text
pricing/
├── engine/
├── strategies/
├── factories/
├── adapters/
└── calculators/
```

unless the project genuinely requires that complexity.

### Principle:

> **Abstract complexity, not simplicity.**

---

# 41. SAFE EXTENSION OF WORKING SYSTEMS

This project contains working functionality.

Therefore, when introducing reusable architecture:

### NEVER rewrite working code unnecessarily.

Prefer:

```text
Existing Working Code
        ↓
Small Extension
        ↓
Reusable Layer
        ↓
Existing Code Continues Working
```

instead of:

```text
Existing Working Code
        ↓
Large Refactor
        ↓
Entire Architecture Rewritten
```

unless the user explicitly requests a refactor.

---

# 42. BACKWARD COMPATIBILITY

If an existing component/API/function is already being used, avoid breaking its current interface.

Prefer:

```js
<ExistingComponent
  existingProp={value}
  newOptionalProp={newValue}
/>
```

rather than changing existing required behavior.

When an API or function must change:

1. Find all consumers.
2. Update them safely.
3. Test them.
4. Verify no old behavior was accidentally removed.

---

# 43. ADDITIVE DEVELOPMENT

When possible, prefer additive changes.

Example:

```text
Existing Component
       +
New reusable capability
       ↓
Existing behavior preserved
```

This makes development:

* Faster
* Safer
* Easier to review
* Easier to rollback

---

# 44. PERFORMANCE-AWARE REUSABILITY

Reusable code must not introduce unnecessary performance costs.

Watch for:

* Extra React renders
* Large context providers
* Unnecessary state
* Repeated API requests
* Expensive computations
* Large bundles
* Unnecessary client components
* Duplicate data fetching
* Excessive abstraction layers

A reusable component should remain efficient.

---

# 45. FAST DEVELOPMENT PRINCIPLE

Architecture should **accelerate future development**, not slow down the current feature.

Before creating an abstraction, ask:

```text
Will this make the next similar feature faster?
Will this reduce duplication?
Will this make behavior easier to maintain?
Will this preserve existing functionality?
Will this add unnecessary complexity?
```

If the abstraction creates more complexity than value:

**Do not create it.**

---

# 46. DO NOT REFACTOR UNRELATED CODE

If the requested feature is:

```text
Add sticker sharing
```

do not suddenly refactor:

```text
Authentication
Database architecture
Global state
Navigation
Theme system
```

unless the feature genuinely requires those changes.

Keep the change focused.

---

# 47. REUSABILITY SCORE

Before implementing a reusable abstraction, evaluate:

```text
Reuse potential
Complexity reduction
Maintenance benefit
Performance impact
Regression risk
Implementation cost
```

Conceptually:

```text
VALUE =

Reuse Benefit
+
Complexity Reduction
+
Future Development Speed

MINUS

Implementation Complexity
+
Regression Risk
+
Performance Cost
```

If the value is negative:

**Keep the implementation local.**

---

# 48. ARCHITECTURE DECISION RECORD

For meaningful architectural decisions, briefly document:

```text
Decision:
Why:
Alternatives considered:
Why this approach:
Impact:
```

Do not create excessive documentation for trivial changes.

---

# 49. BEFORE/AFTER SAFETY CHECK

Before modifying architecture:

### Before

Understand:

```text
Current structure
Current dependencies
Current consumers
Current behavior
Current performance
```

### After

Verify:

```text
Existing functionality
New functionality
Imports
Types
Build
Tests
Runtime
Performance
```

For UI changes also perform:

```text
Screenshot
↓
Visual comparison
↓
Fix differences
↓
Screenshot again
```

---

# 50. ARCHITECTURE QUALITY GATE

Before completing a feature, verify:

```text
[ ] Existing code searched
[ ] Existing patterns reused where appropriate
[ ] Duplicate logic avoided
[ ] Module boundary is appropriate
[ ] Abstraction is justified
[ ] No unnecessary abstraction added
[ ] Existing APIs preserved where possible
[ ] Existing functionality preserved
[ ] Performance considered
[ ] Dependencies minimized
[ ] Feature remains maintainable
[ ] Future similar features can reuse the appropriate pieces
[ ] Tests completed
[ ] Build verified
[ ] Runtime verified
```

---

# 51. GOLDEN ARCHITECTURE PRINCIPLE

Always prefer:

```text
SIMPLE
    +
REUSABLE
    +
COMPOSABLE
    +
PERFORMANT
    +
BACKWARD-COMPATIBLE
    +
FAST TO EXTEND
```

over:

```text
ABSTRACT
    +
OVER-ENGINEERED
    +
FRAGILE
    +
HARD TO UNDERSTAND
```

---

# 52. FINAL RULE

The agent must think like a **senior staff-level engineer**, not simply a code generator.

Before every significant implementation, ask internally:

> "How can I implement exactly what the user requested using the smallest safe change while creating reusable architecture that makes future development faster?"

Then:

```text
UNDERSTAND
→ SEARCH
→ PLAN
→ DESIGN MODULE BOUNDARY
→ IMPLEMENT MINIMAL CHANGE
→ REUSE EXISTING PATTERNS
→ TEST
→ VERIFY
→ REFINE
→ COMPLETE
```

### NON-NEGOTIABLE

**Do not break working functionality for the sake of architectural purity.**

**Do not over-engineer for hypothetical future requirements.**

**Do not duplicate functionality when a clean reusable pattern is obvious.**

**Do not create abstractions that make simple code harder to understand.**

**Build reusable modules only when they provide real value.**

The target architecture is:

> **Highly reusable, modular, composable, production-safe, performant, and fast to extend — while preserving everything that already works.**

<!-- END:global-modular-architecture-rules -->
