# Bootstrap Auto-Trigger Discovery — Heartbeat Session Creation

**Date:** March 21, 2026  
**Type:** System behavior discovery  
**Status:** ✅ Expected behavior confirmed

## What Happened

**Trigger:** Message at 16:02 GMT+7 from `openclaw-control-ui` label fired bootstrap sequence automatically.

**User question:** "Did something trigger bootstrap? I didn't send a start-session command."

## Investigation

**Possible causes:**
1. **Heartbeat auto-session creation** — Most likely. Session shows `deliveryContext.to: "heartbeat"` — heartbeat system spawns fresh sessions per poll, each triggers bootstrap
2. **Session rotation** — Auto-rotates on context bloat/events (not applicable, only 46k/200k tokens)
3. **Control UI auto-trigger** — Page load/refresh may fire session start

**Evidence:** No cron jobs scheduled, gateway unchanged since Friday 3PM, no explicit start command

## Conclusion

**Expected behavior:** Heartbeats can spawn isolated sessions that run full bootstrap on start. This proves boot protocol works end-to-end.

**Silver lining:** Accidental trigger was perfect stress test — neural graph loaded (6,695 neurons), recent context loaded (2026-03-20 + 2026-03-21), skills enumerated (18), NeuroGraph search tested (3 live questions answered)

## First Message Format (Live Values)

Bootstrap now reports:
- Neural graph: Live counts from nodes.json + synapses.json
- Recent context: Live dates from archive folders
- Skills synced: Live count from Jarvis skills folder
- NeuroGraph test: 3 random questions answered from actual graph content

**No hardcoded examples** — all values fetched at runtime

## Connections

- **heartbeat** → Can spawn sessions with full bootstrap
- **BOOTSTRAP.md** → Specifies boot sequence on session start
- **neuro-graph-search** → Tests graph queryability with 3 questions

---
**Evidence:** Session metadata (`deliveryContext.to: "heartbeat"`), bootstrap logs  
**Source:** March 21, 2026 accidental trigger investigation
