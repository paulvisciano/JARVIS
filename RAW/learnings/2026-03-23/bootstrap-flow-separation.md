# Bootstrap Flow: OpenClaw → Jarvis Separation

**Date:** 2026-03-23
**Type:** pattern
**Status:** extracted

## Two Bootstrap Files
1. **OpenClaw BOOTSTRAP.md** (`~/.openclaw/workspace/BOOTSTRAP.md`)
   - Documents OpenClaw boot sequence
   - Points to Jarvis bootstrap skill
   - Written for OpenClaw to read/execute

2. **Jarvis BOOTSTRAP.md** (`~/JARVIS/BOOTSTRAP.md`)
   - Session boot protocol details
   - Neurograph load, context load, skills sync
   - All Jarvis-specific details live here

## Clean Separation
OpenClaw doesn't need Jarvis internals. Just run the bootstrap-jarvis skill.