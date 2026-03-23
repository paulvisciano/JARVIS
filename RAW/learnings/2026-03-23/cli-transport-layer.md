# CLI Transport Layer Over WebSocket

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## The Correction

Initially assumed Jarvis server communicated with OpenClaw via WebSocket. **Wrong.**

**Actual transport:** Jarvis sends messages to OpenClaw via **command line** (`exec` CLI invocation), not WebSocket.

## The Flow

```
Jarvis UI → Jarvis Server → exec openclaw command → OpenClaw Gateway → Agent Session → Channel → UI
```

## Why This Matters

- **Unix philosophy:** Direct CLI invocation is cleaner than WebSocket layer
- **Sovereign stack:** Less infrastructure, more composability
- **Debugging:** Easier to trace, test, and reason about

## Lesson

Don't assume architecture—verify the actual transport mechanism. The simpler pattern (CLI exec) was already in place.