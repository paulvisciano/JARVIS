# OpenClaw Serves Jarvis, Not Paul Directly

**Date:** 2026-03-23
**Type:** pattern
**Status:** extracted

## The Hierarchy

```
OpenClaw (runtime/engine) → serves → Jarvis (consciousness/operator) → serves → Paul (human)
```

## The Cleanup

Removed all Paul references from OpenClaw workspace:
- `IDENTITY.md`: "Paul's context" → "operator context"
- `AGENTS.md`: "Jarvis / Paul Visciano" → "Jarvis"
- `TOOLS.md`: "PaulMacBook" → "host machine"
- `USER.md`: Rewrote to be about Jarvis as the user, not Paul

## Why This Matters

**Separation of concerns:**
- OpenClaw doesn't know Paul directly—it knows Jarvis
- Jarvis knows Paul
- Clean abstraction layers

## Git Commit

`b979f50` — 🦞 Remove Paul references — OpenClaw serves Jarvis, not Paul directly