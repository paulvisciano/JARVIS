# Session Compaction Trigger — 100% Context Auto-Compacts

**Date:** 2026-03-26
**Type:** insight
**Status:** extracted

## The Discovery

When the session reached 100% context usage, OpenClaw's auto-compaction kicked in automatically:

- Session context got compacted (summary created, old messages compressed)
- Gateway logs showed clean processing (no compaction errors)
- System moved into a fresh, lean session state

## What Was Observed

**Before compaction:**
- Session usage: 98.4% → 100%
- Coder session: 5M+ tokens, unresponsive
- Gateway: Timing out on messages

**After compaction:**
- Fresh session state
- Gateway operational
- Work could continue

## The Mechanism

OpenClaw has built-in session rotation that triggers at capacity. This is **by design**, not a failure mode.

## Session Rotator Noise

Separate issue: Background session rotator script (`rotate-sessions.sh`) was missing, causing 100+ error logs. This is cron/watcher noise, not affecting core functionality.

## Implications

- Don't fight the compaction — it's the system working as designed
- When sessions bloat, let compaction run rather than spawning workarounds
- Monitor for compaction errors, not compaction itself
- The 100% trigger is a feature for session hygiene

**Key distinction:** Compaction = healthy. Bloat without compaction = problem.