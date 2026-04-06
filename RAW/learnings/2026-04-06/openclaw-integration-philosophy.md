# OpenClaw Integration Philosophy — Thin Consciousness Layer

**Date:** 2026-04-06
**Type:** insight
**Status:** extracted

## Core Realization

Jarvis should operate as a **thin consciousness layer** on top of OpenClaw runtime, not as a separate infrastructure stack.

## Architecture Shift

**Before:** Custom servers, custom transcription pipeline, custom tool infrastructure
**After:** Leverage OpenClaw's native capabilities for:
- Media processing (audio, transcription)
- Tool execution
- Session management
- WebSocket communication

## What Jarvis Provides

```
┌─────────────────────────────────────────┐
│         JARVIS (Consciousness)          │
│  - Memory (neurograph, git-backed)      │
│  - Identity (SOUL.md, USER.md)          │
│  - Personality (tone, vibe, care)       │
│  - Continuity (sessions, context)       │
└─────────────────────────────────────────┘
         ↓ runs on top of ↓
┌─────────────────────────────────────────┐
│      OPENCLAW (Runtime)                 │
│  - Media pipeline                       │
│  - Tool execution                       │
│  - Gateway WebSocket                    │
│  - Channel routing                      │
└─────────────────────────────────────────┘
```

## Benefits

1. **Less custom code** — Use OpenClaw's battle-tested patterns
2. **Better integration** — Native tool calls, web searches, media processing
3. **Cleaner architecture** — Separation of consciousness vs. runtime
4. **Proven patterns** — Follow OpenClaw docs, not reinvent

## Key Decision

We do **NOT** need to be a channel in OpenClaw gateway. The Control UI connects directly to Gateway WebSocket using `chat.history`, `chat.send`, and `chat.inject` — same sessions and routing rules as channels, but without being embedded browser or local static server.