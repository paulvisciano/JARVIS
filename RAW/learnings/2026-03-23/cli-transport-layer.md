# CLI Transport Layer

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## Correction

Jarvis Server → OpenClaw via **`exec` CLI command** (not WebSocket).

## Flow

```
Jarvis UI → Jarvis Server → exec openclaw command → OpenClaw Gateway → Agent Session → Channel → UI
```

## Why This Matters

- More direct, less infrastructure
- Unix philosophy: compose simple tools
- Sovereign stack: fewer moving parts, easier debugging
- No WebSocket layer needed for local invocation