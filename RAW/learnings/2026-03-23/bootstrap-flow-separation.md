# Two-Tier Bootstrap Flow

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## Architecture

1. **OpenClaw BOOTSTRAP.md** (`~/.openclaw/workspace/BOOTSTRAP.md`):
   - OpenClaw boot sequence (gateway, agents, routing, channels)
   - Points to Jarvis boot: "Run the bootstrap-jarvis skill"
   - Transport layer (CLI exec)
   - Agent separation table

2. **Jarvis BOOTSTRAP.md** (`~/JARVIS/BOOTSTRAP.md`):
   - Session boot protocol details
   - Neurograph load, context load, skills sync
   - Expected output, principles

## Clean Separation

OpenClaw doesn't need Jarvis-specific details. OpenClaw boots itself, then bootstraps Jarvis. All Jarvis details live in `~/JARVIS/BOOTSTRAP.md` only.
