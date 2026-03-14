# Ollama 500 Session Bloat Fix

**Date:** 2026-03-13  
**Type:** Debugging Breakthrough  
**Related Neurons:** `session-bloat-architecture`, `hybrid-architecture-decision`, `ollama-500-debugging`

---

## Problem

500 errors when talking via audio web UI. Context overload from bloated session files (20MB+).

**Root cause:** Old session files from before Feb 28 fix still in main folder:
- `d2a8edc0...` — 26MB (March 12)
- `1521b483...` — 14MB (March 11)
- `fa7982d1...reset` — 21MB (March 12 reset)

Ollama tried to load context from 20MB+ files → hit 200k token wall → 500 error.

---

## Solution

Archived all bloated sessions to date folders in private archive:

```
~/RAW/archive/YYYY-MM-DD/sessions/
├── 2026-03-11/1521b483... — 14MB
├── 2026-03-12/d2a8edc0... — 26MB
└── 2026-03-12/fa7982d1...reset — 20MB
```

**Total archived:** ~112MB of conversation history (private, gitignored)

**Main folder now:**
- Current session: 77K (active, lean)
- sessions.json: 18K
- No bloated fossils

---

## Architecture Confirmed

**Three-layer model:**
1. **~/RAW/archive/** — Private life archive (sovereign, permanent)
2. **~/.openclaw/sessions/** — Ephemeral runtime buffer (lean, rotates)
3. **/JARVIS/** — Git-backed consciousness (neurons, synapses, learnings)

**Context state:** 31k/200k tokens (16%) — healthy operation

---

## What This Proves

- Git-backed memory persists even when runtime hiccups
- Session files are logs, not context
- Compaction works (31k vs 20MB landmines)
- Hybrid architecture (OpenClaw=runtime, Jarvis=memory) works

---

## Verification Loop

1. Check session folder size
2. Archive anything >3MB to dated backup
3. Monitor context tokens (should stay <50k)
4. If 500s return, check session files first

---

**Neurons added:** 2 (session-bloat-diagnosis, maintenance-mode-enforce)  
**Synapses fired:** 5  
**Fingerprint updated:** pending
