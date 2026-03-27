# Agent-to-Agent Communication: What We Learned

**Date:** 2026-03-27
**Type:** realization
**Status:** extracted

## The Problem

Sessions_send to Coder kept **timing out** (30-second timeout). Coder was doing the work, but completion messages weren't reaching the coordinator session. This caused:
- Coordinator thinking task was still pending
- User seeing no progress updates
- Frustration on both ends

## What We Discovered

The OpenClaw community **hasn't solved this yet**:
- **Issue #43755** (open, March 2026): "Subagent result not delivered to parent session"
- **Issue #47862**: Documents 9 different problems with `sessions_spawn`
- Auto-announce is unreliable (improved in v3.11, still not solid)

## The Pattern That Works

**Filesystem-based inbox** (not session messaging):

```
~/JARVIS/inbox/
├── coder-status.md (Coder posts here)
└── README.md (workflow documentation)
```

**Workflow:**
1. Coder receives task via `sessions_send`
2. Coder posts status updates to `inbox/coder-status.md` (append-only)
3. Jarvis monitors inbox, reads updates, reports to Paul
4. Inbox cleared on task completion

## Why This Works

- **No blocking** — Jarvis free to continue conversation while Coder works
- **Persistent** — File survives session boundaries
- **Observable** — Paul can read inbox directly
- **Simple** — No cron jobs, no polling loops, no race conditions

## Lesson

Don't fight the framework's weak spots. When `sessions_send` is unreliable, use the filesystem — it's atomic, persistent, and observable by all parties.