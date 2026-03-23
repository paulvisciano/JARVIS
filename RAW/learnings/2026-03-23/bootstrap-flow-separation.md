# Bootstrap Flow Separation

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## Two Bootstrap Files

1. **OpenClaw BOOTSTRAP.md** (`~/.openclaw/workspace/BOOTSTRAP.md`)
   - Documents OpenClaw boot sequence (gateway, agents, routing, channels)
   - Points to Jarvis boot: "Run the bootstrap-jarvis skill"
   - Minimal, doesn't duplicate Jarvis details

2. **Jarvis BOOTSTRAP.md** (`~/JARVIS/BOOTSTRAP.md`)
   - Session boot protocol specifics
   - Neurograph load, context load, skills sync
   - All Jarvis-specific details live here only

## Principle

OpenClaw boots itself, then bootstraps Jarvis. Clean separation prevents outdated coupling.