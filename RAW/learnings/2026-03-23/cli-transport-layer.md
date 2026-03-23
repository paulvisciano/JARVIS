# CLI Transport Layer Over WebSocket

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## The Correction

Jarvis Server speaks to OpenClaw via **`exec` CLI command**, not WebSocket.

## Flow

```
Jarvis UI → Jarvis Server → exec openclaw command → OpenClaw Gateway → Agent Session → Channel → UI
```

## Why CLI Wins

- **Unix philosophy** — Direct, simple, composable
- **Less infrastructure** — No WebSocket layer to maintain
- **Sovereign stack** — Fewer dependencies, more control
- **Cleaner separation** — Each invocation is explicit

## What Changed

- Removed `WebSocket` references from SOUL.md, IDENTITY.md, AGENTS.md
- Updated transport documentation across all workspace files
- Committed: CLI exec is the canonical transport layer