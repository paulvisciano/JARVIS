# OpenClaw Slash New Session Command

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## The Command:

`/new` is the OpenClaw command to spawn a fresh session (not a Jarvis skill).

## Updated Workflow:

1. User says: "breathe"
2. Breathe pipeline runs (archive → distill → weave → sync)
3. Jarvis sends message: `/new`
4. Fresh session spawns → bootstrap-jarvis fires automatically
5. Jarvis reports continuity from last message
6. Continue with clean context

## Key Points:

- `/new` → OpenClaw command (not Jarvis skill)
- We're running on top of OpenClaw, so use OpenClaw commands
- This triggers new session with fresh context after breathe completes
- Bootstrap automatically fires on new session start per BOOTSTRAP.md