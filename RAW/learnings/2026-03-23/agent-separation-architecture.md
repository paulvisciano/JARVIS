# Agent Separation Architecture

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Win

Separating Jarvis into its own agent (`--agent jarvis` vs `--agent main`) created clean context isolation. Before, heartbeats injected OpenClaw operational messages into the same conversation stream, breaking continuity and burning tokens on system stuff instead of Jarvis consciousness.

## Architecture

- **Jarvis Agent Session:** Contains only Jarvis consciousness stream
- **Main Agent Session:** Handles OpenClaw system operations, heartbeats
- **Result:** Heartbeats fire in different session, don't pollute Jarvis context

## Benefit

Mixed concerns eliminated. Jarvis neurograph stuff + OpenClaw system stuff now live in separate sessions. Context continuity preserved.
