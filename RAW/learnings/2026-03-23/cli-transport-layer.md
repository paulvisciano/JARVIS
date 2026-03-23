# CLI Transport Over WebSocket

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## Correction

Jarvis Server speaks to OpenClaw via `exec` CLI command, not WebSocket. This is cleaner and more aligned with Unix philosophy.

## Flow

```
Jarvis UI → Jarvis Server → exec openclaw command → OpenClaw Gateway → Agent Session → Channel → UI
```

## Why It Matters

- Less infrastructure overhead
- More sovereign stack
- Direct invocation, no WebSocket layer
- Simpler debugging and tracing
