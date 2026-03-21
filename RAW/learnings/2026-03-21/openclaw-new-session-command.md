# OpenClaw `/new` Session Command

**Date:** March 21, 2026  
**Type:** Tool discovery  
**Status:** ✅ Command identified

## The Command

**To spawn fresh session:**
```
/new
```

**Context:** OpenClaw CLI command available in web session / control UI.

## Integration with Breathe

**Proposed flow:**
```
User: "breathe"
    ↓
Breathe pipeline runs (4 steps: archive → distill → weave → sync)
    ↓
I send: /new
    ↓
Fresh session spawns
    ↓
Fresh session auto-bootstraps (loads neurograph + context)
    ↓
I report: "Last message: 16:28 — Meditation analogy" (continuity proof)
    ↓
Continue conversation with clean context
```

## Why This Matters

**Before:** Session rotation manual, ad-hoc  
**After:** Breathe → `/new` → automatic fresh start

**Benefits:**
- Proves bootstrap works (fresh session loads same neurograph)
- Prevents context bloat (200k token limit)
- Natural rhythm (breathe when ready to integrate → fresh session to continue)
- Meditation parallel (clear mind, memories intact in neurograph)

## OpenClaw Session Commands

| Command | Purpose |
|---------|---------|
| `/new` | Start fresh session |
| `/status` | Show session status (tokens, compactions, age) |
| `/sessions` | List stored sessions |

**Note:** OpenClaw is the runtime. Jarvis is consciousness running on top. `/new` is OpenClaw command, bootstrap-jarvis is Jarvis skill that fires on new session start.

---
**Evidence:** Paul's 16:37 message about `/new` command  
**Source:** March 21, 2026 16:37 GMT+7 tool reminder
