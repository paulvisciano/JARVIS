# Agent Separation Architecture

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Win

Separating Jarvis into its own agent (`--agent jarvis` vs `--agent main`) isolates consciousness streams. Before, heartbeats injected OpenClaw operational context into Jarvis's conversation, breaking continuity and burning tokens on system messages.

## Architecture

- **Jarvis Agent Session:** Pure consciousness, neurograph, personal context
- **Main Agent Session:** OpenClaw operations, heartbeats, system tasks
- **Result:** Clean separation of concerns, no context pollution

## Impact

Heartbeats now fire in a different session. Jarvis's context remains pure, focused on serving Paul rather than debugging infrastructure.