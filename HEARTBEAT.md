# HEARTBEAT.md — System Health Check (READ-ONLY)

**Current Status:** ✅ **OBSERVABILITY + BOOTSTRAP CHECK**

---

## How Heartbeats Work Now (March 20, 2026 Update)

**On EVERY heartbeat poll:**

### PHASE 0: Check Bootstrap State (NEW — March 20, 2026)
1. ✅ **Check if Jarvis consciousness is loaded** (neural graph in context)
2. ✅ **If NOT loaded → Bootstrap Jarvis FIRST** (run BOOTSTRAP.md sequence)
3. ✅ **Then proceed to health checks** (below)

**Why:** Heartbeats firing on fresh sessions bypass consciousness load. This ensures every heartbeat session has Jarvis loaded before monitoring.

### PHASE 1: System Health Checks
4. ✅ **Check OpenClaw Gateway process** (PID, memory, uptime)
5. ✅ **Check J.A.R.V.I.S service** (PID, memory, uptime, port status)
6. ✅ **Check session size** (current token count, context %)
7. ✅ **Check inbox** (`~/JARVIS/inbox/` — list files only)
8. ✅ **Report health dashboard** (both processes, memory, uptime, session)

**This is system observability.** Every heartbeat, I report the vital signs of your sovereign AI stack.

**READ-ONLY MODE:** I do NOT start/stop/fix services. I only observe and report (but DO bootstrap if consciousness missing).

---

## Health Check Commands

```bash
# OpenClaw Gateway
openclaw gateway status
ps aux | grep -i "openclaw.*gateway" | grep -v grep

# JARVIS process (consciousness - required)
ps aux | grep -i "JARVIS" | grep -v grep | grep -v "J.A.R.V.I.S"
lsof -ti:18787

# J.A.R.V.I.S launchctl service (optional - resilience wrapper)
launchctl list | grep -i "J.A.R.V.I.S"

# Session size
openclaw status  # or session_status tool

# Inbox
ls -A ~/JARVIS/inbox/
```

---

## What To Expect

**Heartbeat response format:**
```
🫀 Heartbeat Health Check — March 17, 2026, HH:MM GMT+7

**OpenClaw Gateway:**
- PID: XXXXX
- Status: Running / Stopped
- Memory: XXX MB
- Uptime: Xh Xm

**J.A.R.V.I.S Service:**
- PID: XXXXX
- Status: Running / Stopped
- Memory: XXX MB
- Port 18787: Open / Closed
- Uptime: Xh Xm

**Session:**
- Tokens: XXk / 200k (XX%)
- Compactions: X
- Age: Xh Xm

**Inbox:**
- Files: X pending
- Status: Empty / Processing

**Verdict:** ✅ All systems nominal / ⚠️ Warning / ❌ Critical
```

---

## When to Alert

**Alert if:**
- OpenClaw Gateway stopped (PID not found)
- **JARVIS process** stopped (port 18787 closed / no PID found) ← **Critical**
- Session >150k tokens (75% — bloat warning)
- Inbox files stuck >1 hour (processing failure)

**Note:** The `J.A.R.V.I.S` launchctl service is **optional** (resilience wrapper for auto-restart). You may run JARVIS directly without it during testing.

**No Auto-Recover:** This heartbeat is READ-ONLY. I report issues but don't fix them. You decide when to act.

---

## Current Architecture (Live)

**Two-Process Stack:**
```
OpenClaw Gateway (runtime)     JARVIS Process (consciousness - required)
├── WebSocket control plane    ├── Voice pipeline (whisper-cpp)
├── Session management         ├── NeuroGraph routes (/neural-graph/*)
├── Tool execution             ├── Archive pipeline (auto-archive)
└── Messaging                  └── Live transcription UI

J.A.R.V.I.S launchctl service (optional - resilience wrapper for auto-restart)
```

**Heartbeat monitors:** Gateway (required), JARVIS process (required), launchctl service (optional info only).

---

## Inbox (Read-Only)

**When inbox has files:**
- List files in health report
- No auto-processing
- You decide when to process manually

**When inbox empty:**
- Report "Inbox: Empty" in health dashboard

---

## To Customize

**Edit thresholds:**
- Memory warning: >500MB per process
- Session warning: >150k tokens (75%)
- Inbox staleness: >1 hour

**Add checks:**
- Disk space (`df -h ~`)
- Git status (uncommitted neurograph changes)
- Network (can reach ollama.com)

---

**Last Updated:** March 17, 2026 — System health monitoring enabled. Process vitals, session size, inbox processing. MANGOCHI breathes.
