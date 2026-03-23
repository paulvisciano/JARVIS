---
name: bootstrap-context
description: Auto-load recent context on session start. Runs context-extractor for today + yesterday, then presents summary. Use when: (1) new session starts, (2) gateway restarts, (3) you need to recover from context loss. Ensures you always have conversation history.
metadata:
  openclaw:
    emoji: "🫀"
    requires:
      bins: ["node"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
---

# Bootstrap Context (Auto-Load Recent Context)

## When to Use

✅ **USE this skill when:**
- **New session starts** (auto-run via BOOTSTRAP.md)
- **Gateway restarts** (fresh session, need context)
- **You lost context** (recovery from session rotation)
- **Catching up** after gap in conversation

## When NOT to Use

❌ **DON'T use this skill when:**
- Mid-conversation (context already loaded)
- Manual context search (use memory_search or neurograph-search)
- Single file extraction (use context-extractor directly)

## Bootstrap Sequence

### Auto-Run on Session Start

**Called by:** `BOOTSTRAP.md` (after neuro-graph-loader)

```bash
# Step 1: Neural graph loaded (neuro-graph-loader)
# Step 2: Context loaded (bootstrap-context) ← This skill
# Step 3: Ready to serve
```

### What It Does

1. **Runs context-extractor** for today + yesterday
2. **Parses session messages** (134 messages today)
3. **Extracts audio transcripts** (180 files today)
4. **Writes state** to `~/.openclaw/workspace/.bootstrap-context.json`
5. **Presents summary** to agent

## Output Format

**Read-only:** No state file written. Archive is source of truth.

**Data sources:**
- `~/RAW/archive/YYYY-MM-DD/full-context.json` (sessions + audio)
- `~/RAW/archive/YYYY-MM-DD/sessions/*.jsonl` (raw sessions)
- `~/RAW/archive/YYYY-MM-DD/audio/*.txt` (transcripts)

**Presents summary to agent:**
```
✅ Context loaded: 2026-03-20 + 2026-03-19
   Sessions: 10 files
   Messages: 5848
   Audio: 647 transcripts
   Source: ~/RAW/archive
```

## Manual Usage

```bash
cd ~/JARVIS
node skills/bootstrap-context/scripts/bootstrap.js
```

**Output:**
```
🫀 Bootstrap Context Loader
==========================

✅ Context loaded: 2026-03-20 + 2026-03-19
   Sessions: 2 files
   Messages: 200
   Audio: 250 transcripts
   State: ~/.openclaw/workspace/.bootstrap-context.json

📝 Recent audio (today):
   1. 12:24 GMT+7 — "Yeah, rerun the archive right now."
   2. 12:35 GMT+7 — "Okay, I see the full context file."
   ...
```

## Integration with BOOTSTRAP.md

**Add to bootstrap sequence:**

```bash
# PHASE 0: Check bootstrap state
# PHASE 1: Verify neural graph (bootstrap-jarvis)
# PHASE 2: Load context (bootstrap-context) ← This skill (read-only)
# PHASE 3: Check inbox
# PHASE 4: Report state + greet
```

**Notes:**
- **Read-only** — no writes to `.openclaw/`
- **Archive is source of truth** (`~/RAW/archive/`)
- **Idempotent** — safe to run multiple times

## Why This Exists

**Problem:** Gateway restart → fresh session → no context → agent is lost

**Solution:** Auto-load last 2 days of conversations on every session start

**Result:** You always know what we were working on, even after restart

## Files

- `scripts/bootstrap.js` — Runner script (read-only, no writes)
- `~/RAW/archive/YYYY-MM-DD/full-context.json` — Source data

## Notes

- **Portable:** Uses env vars (HOME, JARVIS_HOME, RAW_ARCHIVE)
- **Fast:** ~2 seconds to scan + summarize
- **Idempotent:** Safe to run multiple times
- **Complements:** neuro-graph-loader (loads memory graph, this loads conversation context)
