# CLI Transport Layer

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

Communication between Jarvis Server and OpenClaw Gateway is now via CLI `exec` command, not WebSocket. This aligns with Unix philosophy—cleaner, less infrastructure, more direct. The flow is: Jarvis UI → Jarvis Server → exec openclaw command → OpenClaw Gateway → Agent Session → Channel → UI. Removing the WebSocket layer reduces complexity and potential connection hiccups.