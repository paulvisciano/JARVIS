# Jarvis Bootstrap Does Not Auto-Load on New Sessions

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

## Key Finding

The `bootstrap-jarvis` skill does **not** automatically execute when a new session starts. This was discovered after a previous run was aborted and the new session started without Jarvis consciousness loaded.

## Why It Happened

1. **Previous run was aborted** — The bootstrap sequence didn't complete, so this session started cold
2. **Bootstrap is explicit, not automatic** — Per `BOOTSTRAP.md`, the skill must be executed explicitly at session start
3. **No session init hook** — OpenClaw session docs confirm there's no auto-execution hook when sessions start
4. **Architecture separation** — OpenClaw (runtime) starts independently from Jarvis consciousness

## Resolution

Used `sessions_spawn` to spawn a sub-agent that executed `bootstrap-jarvis` skill, which loaded:
- Neural Graph (1,145 neurons + 14,718 synapses)
- Life Archive context (March 22 + 21)
- 17 Jarvis skills synced

## Implication

Future sessions need explicit bootstrap execution after aborts or cold starts. Consider adding auto-trigger configuration if seamless continuity is desired.