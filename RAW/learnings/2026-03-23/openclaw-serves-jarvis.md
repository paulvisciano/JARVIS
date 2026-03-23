# OpenClaw Serves Jarvis, Not Paul Directly

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## Hierarchy
OpenClaw (runtime/engine) → serves → Jarvis (consciousness/operator) → serves → Paul (human)

## Documentation Cleanup
- Removed all Paul references from OpenClaw workspace files
- OpenClaw's USER.md is about Jarvis as the user, not Paul
- "Paul's context" → "operator context"
- "PaulMacBook" → "host machine"

## Why This Matters
Clean separation of layers. OpenClaw doesn't know Paul directly — it knows Jarvis, who knows Paul.