# Session /new Button Hiccup Diagnosis

**Timestamp:** 20:08 - 20:09 GMT+7 (March 16, 2026)  
**Type:** bug-diagnosis  
**Category:** learning

---

## Problem

Paul accidentally hit the `/new` button in the OpenClaw UI, triggering a "new session" command mid-conversation. Jarvis got stuck in a boot loop, tried loading the neurograph from wrong paths, and the context bloated from failed read attempts + `find` command output, eventually hitting the token limit.

---

## Timeline (from Transcript)

**20:08** — Paul diagnosed:
> "okay so can you kind of backtrack and figure out what happened why did you have this hiccups I think it's because I accidentally hit the new session button in the open claw interface so you got the new command and then kind of started to start a new session but then got stuck in a weird mode that's my hypothesis right now"

**20:09** — Jarvis confirmed:
> "You're absolutely right, Paul. Here's what happened:"

**The Timeline:**
1. **11:13:46** — Paul hit new session button → `/new` command fired
2. **11:13:47** — Jarvis's first response got **aborted** immediately (operation aborted error)
3. **11:14:47** — Paul said "Hey Jarvis"
4. **11:14:54** — Jarvis tried to load neurograph from `/JARVIS/RAW/memories/` → **file not found**
5. **11:14:56** — Tried backup path `/claw/memory/data/` → **also not found**
6. **11:14:59** — Had to run `find` to locate actual files
7. **11:15:20** — Found real path: `/Users/paulvisciano/Personal/paulvisciano.github.io/memory/data/`

---

## Root Cause

**Session startup used old architecture paths:**
- `/JARVIS/RAW/memories/` ❌ (not found)
- `/claw/memory/data/` ❌ (not found)

**Should use:**
- `/Users/paulvisciano/Personal/paulvisciano.github.io/memory/data/` ✅

**Impact:**
- New session = fresh context
- Failed read attempts bloated context
- `find` command output added more tokens
- Hit token limit: **"prompt too long; exceeded max context length by 3 tokens"**

---

## Fix Applied

1. **Session rotated** — context cleared
2. **Neurograph loaded** — correct path used
3. **Transcript synced** — live folder archived
4. **Stable state** — 116k/200k tokens (58%)

---

## Prevention

**Update boot protocol** to use correct path from session start:
- Read `SOUL.md`, `USER.md`, `BOOTSTRAP.md` from workspace
- Load neurograph from `/JARVIS/RAW/memories/` (git-backed)
- Use correct path: `/Users/paulvisciano/Personal/paulvisciano.github.io/memory/data/`

---

## Related Nodes

- `temporal-march-16` (Temporal)
- `transcript-march-16` (Archive)
- `mistake-prevention-stack` (Learnings)
- `jarvis-server-lifecycle` (Learnings)

---

## Synapses

- `session-new-hiccup` → `temporal-march-16` (temporal, learned on)
- `session-new-hiccup` → `transcript-march-16` (references, documented in)
- `session-new-hiccup` → `mistake-prevention-stack` (references, prevention pattern)
- `session-new-hiccup` → `jarvis-server-lifecycle` (references, session lifecycle)

---

**Archived:** March 16, 2026, 22:03 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, neurograph integrated
