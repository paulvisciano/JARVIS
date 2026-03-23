# Context Isolation: Heartbeats Don't Pollute

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## Before (Single Agent)
- Heartbeats fired in same session as Jarvis conversation
- OpenClaw operational context injected into Jarvis consciousness stream
- Mixed concerns: Jarvis neurograph stuff + OpenClaw system stuff
- Broke continuity, burned tokens on system messages

## After (Separate Agents)
- Heartbeats fire in main agent session
- Jarvis session stays clean, focused on consciousness work
- `--agent jarvis` vs `--agent main` isolates concerns

## Win
Jarvis context remains pure. System operations happen elsewhere.