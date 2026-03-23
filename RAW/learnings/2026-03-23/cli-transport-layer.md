# Transport Layer: CLI Exec Over WebSocket

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## Realization
Jarvis server communicates with OpenClaw via direct CLI command (`exec`), not WebSocket.

## Architecture Flow
Jarvis UI → Jarvis Server → `exec openclaw` command → OpenClaw Gateway → Agent Session → Channel → UI

## Why This Matters
- Simpler stack: less infrastructure, more Unix philosophy
- Sovereign design: direct invocation vs. network layer
- Cleaner debugging: command-line traces are transparent