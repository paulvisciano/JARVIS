# OpenClaw /new Command for Session Rotation

**Date:** 2026-03-21
**Type:** insight
**Status:** extracted

## The Command

`/new` is the OpenClaw command (not Jarvis skill) to spawn a fresh session.

## Workflow After Breathe

1. User: "breathe"
2. Breathe pipeline runs (archive → distill → weave → sync)
3. Jarvis sends: `/new`
4. Fresh session spawns → bootstrap-jarvis fires automatically
5. Jarvis reports: "Last message: 16:28 — Meditation analogy" (continuity proof)
6. Continue with clean context

## Session Rotation Options

1. **Natural rotation** - Send new message in UI (creates fresh session)
2. **Manual rotation** - Archive current state, prepare for new session
3. **Gateway restart** - `openclaw gateway restart` (creates new session on reconnect)

## Why This Matters

Solves context bloat problem. After breathing, fresh session = clear mind while NeuroGraph maintains memory continuity.