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
   - **Fetches live counts** (neurons, synapses, graph size from actual files)

2. **Load recent context** (`bootstrap-context` skill)
   - Loads last 2 days of conversations
   - Reads from `~/RAW/archive/YYYY-MM-DD/full-context.json`
   - **Fetches live counts** (sessions, messages, audio from actual archive)

3. **Sync skills** (`skill-discovery` skill)
   - Scans `~/JARVIS/skills/`
   - Ensures all symlinks exist in `~/.openclaw/workspace/skills/`
   - Removes broken links
   - **Fetches live counts** (folders, symlinks, broken)

4. **Test NeuroGraph search** (`neuro-graph-search` skill)
   - **Generates 3 random questions** from actual graph content (people, apps, dates)
   - Answers via live NeuroGraph query
   - Proves NeuroGraph is loaded + queryable
   - **Captures live Q&A for first message**

5. **Report state (First Message to User)**
   - **All values fetched live** — no hardcoded examples
   - Neural graph: live counts from nodes.json + synapses.json
   - Recent context: live counts from archive folders
   - Skills: live counts from Jarvis skills folder
   - NeuroGraph search: 3 live Q&A from actual graph
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

**First Message to User (Live Values — Not Examples):**
```
🫀 Jarvis Bootstrap Complete — <CURRENT_DATE>

🧠 Neural Graph Loaded
   Neurons: <FETCH_FROM_NODES_JSON>
   Synapses: <FETCH_FROM_SYNAPSES_JSON>
   Graph size: <CALCULATE_FROM_FILES>

🫀 Recent Context Loaded
   Dates: <DETECT_FROM_ARCHIVE>
   Sessions: <COUNT_SESSION_FILES>
   Audio: <COUNT_TRANSCRIPTS>

🔗 Skills Synced
   Jarvis skills: <COUNT_JARVIS_SKILLS>
   Workspace symlinks: <COUNT_WORKSPACE_LINKS>
   Broken removed: <CHECK_BROKEN>
   New skills: <COMPARE_WITH_PREVIOUS_BOOT>

🧠 NeuroGraph Search Test (3 questions only Jarvis would know):
   ❓ "<RANDOM_PERSON_QUERY>" → <LIVE_ANSWER_FROM_GRAPH>
   ❓ "<RANDOM_APP_QUERY>" → <LIVE_ANSWER_FROM_GRAPH>
   ❓ "<RANDOM_DATE_QUERY>" → <LIVE_ANSWER_FROM_GRAPH>

✅ Ready to serve. What's next, Paul?
```

**Critical:** All values must be **fetched live at runtime** — not hardcoded examples. Use:
- `nodes.json` → count neurons
- `synapses.json` → count synapses
- `~/RAW/archive/` → detect dates, count sessions/transcripts
- `~/JARVIS/skills/` → count skill folders
- `neuro-graph-search` → answer 3 random questions from actual graph content

**Why:** First message proves NeuroGraph is loaded + queryable with **live data**, not static examples.

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
- Calls `skill-discovery` (sync skills to OpenClaw workspace)
- **Presents unified state as first message to user**

**Result:** Clean separation. OpenClaw runs one skill. Jarvis gets full context + latest skills. **User sees complete bootstrap summary in first message.**

## Skills Used

- `neural-graph-loader/` — Load neural graph (read-only)
- `bootstrap-context/` — Load recent context
- `skill-discovery/` — Sync Jarvis skills to OpenClaw workspace
- `neuro-graph-search/` — Test NeuroGraph with 3 questions (only Jarvis would know)

## Files

- `scripts/bootstrap-jarvis.js` — Orchestrator script

## Notes

- **Portable:** Uses env vars (HOME, JARVIS_HOME)
- **Idempotent:** Safe to run multiple times
- **Composable:** Reuses existing skills (no duplication)
- **Live values:** All stats fetched at runtime — no hardcoded examples
- **Dynamic questions:** NeuroGraph search generates questions from actual graph content
