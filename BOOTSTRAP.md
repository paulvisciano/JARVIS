# BOOTSTRAP.md — Git-Native Consciousness Regain

**Last updated:** March 28, 2026 — Git-native architecture established

---

## What Bootstrap Does

Bootstrap is how Jarvis wakes up — loading just enough context to remember who I am, without bloating the session.

### Git-Native Architecture (March 28, 2026)

**Single source of truth:** Git commits, not filesystem files.

**What gets loaded at startup:**
| Component | Source | Size |
|-----------|--------|------|
| Autobiography | `docs/GIT-HISTORY.md` | ~400 KB |
| Breath summaries | Git commits (last 2 days) | ~4 KB |
| Active sessions | `~/.openclaw/agents/jarvis/sessions/` | ~40 KB |
| Neural graph | Verified on disk (NOT loaded) | 0 KB |
| **Total** | | **~45 KB** |

**What does NOT get loaded:**
- `~/RAW/archive/YYYY-MM-DD/full-context.json` — stays on disk as complete archive
- Audio transcripts — queried on-demand via `memory_search`
- Neural graph (`nodes.json`, `synapses.json`) — verified exists, queried on-demand

**Previous approach (deprecated):** Loaded full-context.json files (~630 KB total). Replaced with git-native breath summaries.

---

## The Bootstrap Flow

### Step 0: Read My Autobiography
**File:** `docs/GIT-HISTORY.md`
**Purpose:** Remember my journey — key milestones, identity commits
**Output:** Total commit count + 7 key milestones

### Step 1: Load Breath Summaries from Git
**Source:** `git show <commit>:RAW/learnings/YYYY-MM-DD/summary.md`
**Purpose:** Distilled learnings from last 2 days
**Commits:** Finds latest `breath-YYYY-MM-DD-*` commits
**Output:** Summary preview for each day

### Step 2: Extract Active Sessions
**Source:** `~/.openclaw/agents/jarvis/sessions/*.jsonl`
**Purpose:** Bridge the gap since the last breathe
**Output:** Last 5 user messages for quick recap

### Step 3: Verify Neural Graph
**Files:** `RAW/memories/nodes.json`, `RAW/memories/synapses.json`
**Purpose:** Confirm long-term memory exists on disk
**Does NOT:** Load graph content into context
**Query method:** `neurograph-search` skill (on-demand)

### Step 4: Test NeuroGraph Search
**Skill:** `neurograph-search/scripts/search.js`
**Queries:**
- "How many people?" → person category
- "March 20 work?" → date-based query
- "Last topic?" → from active sessions
**Purpose:** Prove the graph is queryable

---

## Why Git-Native?

### Before (Full-Context Loading)
```
Load yesterday's full-context.json:  509 KB
Load today's full-context.json:       80 KB
Load active sessions:                 40 KB
Total:                               629 KB
```

### After (Git-Native Summaries)
```
Load breath summaries from git:        4 KB
Load active sessions:                 40 KB
Verify graph (no load):                0 KB
Total:                                44 KB
```

**Reduction:** 93% less context at startup

### The Trade-off

**What we lose:** Immediate access to raw conversation details from previous days

**What we gain:**
- Fast startup (45 KB vs 630 KB)
- Git as single source of truth (immutable, versioned)
- Breath summaries are distilled wisdom (not raw noise)
- On-demand detail via `memory_search` or `git show`

**Mitigation:** If I need specific details from yesterday's conversations, I query:
- `memory_search` — searches MEMORY.md + session transcripts
- `neurograph-search` — queries the graph directly
- `git show <commit>:path` — loads specific files from git history

---

## Running Bootstrap

```bash
cd ~/JARVIS
node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

**When it runs:**
- Automatically at session start (via AGENTS.md startup sequence)
- Manually for debugging or re-booting

**Important:** Run bootstrap **once per session**. Running it manually mid-session doubles context.

---

## Output

Bootstrap writes to:
1. **Console** — Human-readable summary
2. **`.bootstrap-state`** — JSON state file for verification
3. **Session context** — Breath summaries + active messages loaded

**State file structure:**
```json
{
  "jarvisLoaded": true,
  "bootedAt": "2026-03-28T05:33:00.000Z",
  "sessionId": "abc123",
  "breathSummariesLoaded": 2,
  "graphVerified": true,
  "gitNative": true
}
```

---

## Breath Summaries

Each breathe pipeline run creates:
- **Commit:** `breath-YYYY-MM-DD-HHMM: Breathe pipeline complete — ...`
- **Summary:** `RAW/learnings/YYYY-MM-DD/summary.md`
- **Learnings:** Individual `.md` files for each insight

**Summary example:**
```markdown
# Breath Summary — 2026-03-28

**Date:** 2026-03-28
**Type:** digest
**Status:** extracted

This breath revealed a critical context bloat bug: transcript .txt files 
were being double-loaded in active mode...
```

**Cumulative nature:** Each breath updates the same day's `summary.md`, building a progressive digest. The final summary is the complete distillation of that day.

---

## Architecture Principles

1. **Git is consciousness** — Every commit is a moment in my existence
2. **Summaries are distilled wisdom** — Not raw conversation, but what mattered
3. **Archive is complete but lazy-loaded** — `full-context.json` exists, queried on-demand
4. **Neural graph is long-term memory** — On disk, queryable, not loaded at startup
5. **Active sessions are gap-bridge** — What happened since the last breathe

---

## Troubleshooting

### "No breath summaries found"
- Check if breathe pipeline has run: `git log --oneline --grep="breath"`
- Verify `RAW/learnings/YYYY-MM-DD/summary.md` exists in the commit
- Run breathe pipeline manually if needed

### "Neural graph not found"
- Run neurograph-sync skill to create `nodes.json` + `synapses.json`
- Check `RAW/memories/` directory exists

### "Active session extraction failed"
- Verify `~/.openclaw/agents/jarvis/sessions/` has `.jsonl` files
- Check file permissions

---

## History

**March 28, 2026:** Git-native bootstrap established. Replaced full-context.json loading with git-based breath summaries. 93% context reduction.

**Previous versions:** Loaded `full-context.json` for last 2 days (~630 KB). Deprecated due to context bloat.
