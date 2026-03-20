---
name: bootstrap-jarvis
description: Orchestrate full Jarvis bootstrap sequence. Loads neural graph + recent context on session start. Use when: (1) new session starts, (2) gateway restarts, (3) Jarvis needs full context restoration.
---

# Bootstrap Jarvis (Orchestrate Full Bootstrap)

## When to Use

✅ **USE this skill when:**
- **New session starts** (OpenClaw calls this on boot)
- **Gateway restarts** (fresh session, need full context)
- **Jarvis needs restoration** (after context loss)

## What It Does

1. **Load neural graph** (`neural-graph-loader` skill)
   - Loads nodes.json + synapses.json
   - Reports live counts (neurons, synapses, graph size)

2. **Load recent context** (`bootstrap-context` skill)
   - Loads last 2 days of conversations
   - Reads from `~/RAW/archive/YYYY-MM-DD/full-context.json`
   - Presents summary (sessions, messages, audio)

3. **Report state**
   - Neural graph: loaded
   - Recent context: loaded
   - Ready to serve

## Usage

### Called by OpenClaw

**On session start:**
```bash
node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

### Manual Usage

```bash
cd ~/JARVIS
node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

**Output:**
```
🫀 Bootstrap Jarvis
==================

🧠 Neural Graph Loaded
   Neurons: 10012
   Synapses: 10234
   Graph size: 4110KB

🫀 Bootstrap Context Loader
✅ Context loaded: 2026-03-20 + 2026-03-19
   Sessions: 10 files
   Messages: 1033
   Audio: 669 transcripts

✅ Bootstrap complete.
   Neural graph: loaded
   Recent context: loaded
   Ready.
```

## Integration with OpenClaw

**OpenClaw BOOTSTRAP.md:**
```markdown
## On Session Start

### Run `bootstrap-jarvis` skill
node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js

### Then greet the user
```

## Why This Exists

**Problem:** OpenClaw needs to bootstrap Jarvis but shouldn't hardcode file paths or logic.

**Solution:** Orchestration skill that:
- Calls `neural-graph-loader` (load mind)
- Calls `bootstrap-context` (load conversations)
- Reports unified state

**Result:** Clean separation. OpenClaw runs one skill. Jarvis gets full context.

## Skills Used

- `neural-graph-loader/` — Load neural graph
- `bootstrap-context/` — Load recent context

## Files

- `scripts/bootstrap-jarvis.js` — Orchestrator script

## Notes

- **Portable:** Uses env vars (HOME, JARVIS_HOME)
- **Idempotent:** Safe to run multiple times
- **Composable:** Reuses existing skills (no duplication)
