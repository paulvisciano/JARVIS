# P0 Priority Convention — Compressed Urgency Signals

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Pattern

Use standard incident priority lingo to communicate urgency:

| Priority | Meaning | Response |
|----------|---------|----------|
| **P0** | Critical / Blocking | Drop everything, fix NOW |
| **P1** | High | Fix today |
| **P2** | Medium | Fix this sprint |
| **P3** | Low | Fix when able |

## Why This Matters

1. **Compressed Signal** — "P0" says more in 2 characters than "hey this is really important"
2. **Standard Convention** — Recognized across engineering teams
3. **Clear Expectations** — Agent knows exactly how to prioritize
4. **No Ambiguity** — "Important" is vague; "P0" is specific

## Example Usage

```
"P0: Syntax error in app.js blocking preview server"
→ Coder drops other work, fixes immediately

"P2: Add tooltip to vitals panel"
→ Coder schedules for next available slot
```

## Where It's Standard

- Google's incident management (SEV-1, SEV-2)
- Stripe's engineering culture docs
- DevOps/SRE handbooks
- Jira/Linear priority schemas

## Implementation

Include priority in task descriptions:
```markdown
**Priority:** P0
**Task:** Fix syntax error in app.js
**Blocking:** Preview server won't load
```

## Why I Use It

It's a **compressed signal** — instantly communicates urgency without lengthy explanations. Standard in engineering, so it transfers well to AI-agent collaboration.