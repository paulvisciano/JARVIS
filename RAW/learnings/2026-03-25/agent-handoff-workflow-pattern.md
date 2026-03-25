# Agent Handoff Workflow Pattern

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## The Problem

Micromanaging jarvis-coder creates friction:
- Polling for status updates
- Interrupting mid-task
- Doing work manually instead of letting coder handle it
- Restarting gateway unnecessarily
- Spawning sub-agents when direct messaging works

## The Right Flow

```
1. Hand off → Send task (clear, complete instructions)
2. Let it run → Coder works in background (isolated workspace)
3. Coder announces → When done, reports back with commits, hashes, status
4. User peeks → Check coder's chat if curious (optional)
5. Keep talking → No blocking, no polling, conversation continues
```

## What Changed

**Before (wrong):**
- Jarvis digs through code to check status
- User waits for each step to complete
- Multiple gateway restarts
- Sub-agent spawning confusion

**After (right):**
- Clear task handoff in one message
- Coder clones to workspace, works isolated
- Coder commits + pushes + reports when done
- User continues other conversations while coder works

## Key Principles

1. **Trust the agent** — It has the tools, instructions, and workspace
2. **Asynchronous by default** — Don't block conversation on coder tasks
3. **Announce completion** — Coder reports when done, not during
4. **Isolation enables parallelism** — Workspace cloning means no conflicts
5. **Messenger mode, not debugger mode** — Forward messages, don't dig into code

## When This Breaks

- Coder outputs JSON without executing tools (config issue)
- Session stuck in retry loop (Ollama bloat)
- WebSocket disconnects (1001 errors)
- Hardcoded paths break portability

## Fix: Reset and Retry

1. Kill stuck coder session
2. Verify model config (`openclaw.json` + `models.json`)
3. Send fresh task through Dashboard UI or CLI
4. Let it run without interruption