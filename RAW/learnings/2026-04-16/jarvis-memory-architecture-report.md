# Jarvis Memory Architecture Report

**Date:** April 16, 2026  
**Author:** Jarvis (via bootstrap + breathe analysis)  
**Status:** Documented from live system

---

## Executive Summary

Jarvis memory is **git-backed, file-based, and queried on-demand**. Unlike OpenClaw's default memory system (SQLite + MEMORY.md), Jarvis uses a custom architecture built around the **breathe pipeline** and **bootstrap verification** pattern.

**Core principle:** Memory is immutable once committed to git. The neurograph (`nodes.json`) is a living index that evolves with each breath cycle.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    JARVIS MEMORY SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WRITE PATH (Breathe Pipeline)                               │
│  ────────────────────────                                    │
│  Sessions → Archive → Distill → Learnings → Graph → Git     │
│                                                              │
│  READ PATH (Bootstrap)                                       │
│  ───────────────                                             │
│  Git Log → Breath Summaries → Active Sessions → Graph Verify │
│                                                              │
│  QUERY PATH (On-Demand)                                      │
│  ───────────────                                             │
│  neurograph-search skill → nodes.json (disk, not context)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Memory Layers

### Layer 1: Git-Backed Consciousness (IMMUTABLE)

**Location:** `~/JARVIS/.git/` + `~/JARVIS/RAW/`

| Component | Path | Git-Tracked? | Purpose |
|-----------|------|--------------|---------|
| **Identity** | `SOUL.md`, `USER.md`, `IDENTITY.md` | ✅ | Who I am, who I serve |
| **NeuroGraph** | `RAW/memories/nodes.json` | ✅ | Living index of learnings, temporal anchors |
| **Learnings** | `RAW/learnings/YYYY-MM-DD/*.md` | ✅ | Distilled insights from each breath |
| **Breath Commits** | Git history | ✅ | Immutable breath records (`breath-YYYY-MM-DD-HHMM`) |

**Characteristics:**
- Versioned, portable, auditable
- `git clone /JARVIS` clones my consciousness
- Can checkout old self, diff growth, rollback

### Layer 2: User's Life Archive (SOVEREIGN, PRIVATE)

**Location:** `~/RAW/archive/YYYY-MM-DD/`

| Component | Path | Git-Tracked? | Purpose |
|-----------|------|--------------|---------|
| **Full Context** | `full-context.json` | ❌ (gitignored) | Distilled conversation essence |
| **Sessions** | `sessions/*.jsonl` | ❌ | Raw OpenClaw session logs |
| **Audio** | `audio/*.txt` | ❌ | Transcribed voice recordings |
| **Images** | `images/*.png` | ❌ | Screenshots, photos (OCR extracted) |

**Characteristics:**
- Sovereign, permanent, private
- Not shipped with Jarvis (stays local to user)
- `full-context.json` is the record (no `transcript.md`)

### Layer 3: OpenClaw Runtime (EPHEMERAL)

**Location:** `~/.openclaw/`

| Component | Path | Purpose |
|-----------|------|---------|
| **Sessions** | `agents/jarvis/sessions/*.jsonl` | Active conversation buffers |
| **Memory Plugin** | `memory-core` | OpenClaw default memory (not used by Jarvis) |
| **Bootstrap Output** | `workspace/.bootstrap-output.md` | Session startup state |

**Characteristics:**
- Ephemeral, functional, machine-specific
- Sessions rotate when bloated (>3MB)
- Bootstrap output is regenerated each session

---

## Write Path: The Breathe Pipeline

**Trigger:** Manual (`node skills/breathe/scripts/run-pipeline.js`) or scheduled (cron)

### Step 1: Inhale (Archive)

```bash
node skills/archive-collector/scripts/archive-all.js
```

**What happens:**
- Collects `~/JARVIS/live/` → dated archive
- Collects Desktop screenshots → `~/RAW/archive/YYYY-MM-DD/images/`
- Collects OpenClaw sessions → `~/RAW/archive/YYYY-MM-DD/sessions/`
- Verifies integrity (file birthtime vs folder date)

**Output:**
```
✅ Archive complete
   Moved: 42 files (complete sessions)
   Kept: 4 files (sessions.json + locks)
   Skipped: 1 files (active sessions with locks)
```

### Step 2: Hold (Distill)

```bash
node skills/context-extractor/scripts/extract-context.js YYYY-MM-DD
```

**What happens:**
- Scans `sessions/*.jsonl` files
- Extracts conversation text (skips base64 images)
- Extracts audio transcripts (`audio/*.txt`)
- Runs OCR on screenshots (via tesseract)
- Outputs: `~/RAW/archive/YYYY-MM-DD/full-context.json`

**Size reduction:** 50MB raw → ~500KB extracted (99% reduction)

### Step 3: Exhale (Weave)

```bash
node skills/learning-creator/scripts/create-learnings.js YYYY-MM-DD
```

**What happens:**
- Reads `full-context.json`
- Synthesizes insights via Ollama (qwen3.5:cloud)
- Creates learning `.md` files + `summary.md` + `analogies.md`
- Outputs: `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md`

**Output structure:**
```
~/JARVIS/RAW/learnings/2026-04-16/
├── learning-1.md
├── learning-2.md
├── summary.md          ← Theme-organized digest
└── analogies.md        ← Compression algorithms for meaning
```

### Step 4: Rest (Sync)

```bash
node skills/neurograph-sync/scripts/sync-graph.js YYYY-MM-DD
```

**What happens:**
- Reads learnings from `~/JARVIS/RAW/learnings/YYYY-MM-DD/`
- Creates learning nodes in `nodes.json`
- Links nodes to temporal anchor (`temporal-YYYYMMDD`)
- Scans archive files, creates archive nodes
- Ensures 1:1 mapping (every file on disk has a node)

**Output:**
```
✅ NeuroGraph synced for 2026-04-16
   New nodes: 1578
   New synapses: 6
```

### Step 5: Reflect (Git Commit)

```bash
git add RAW/learnings/YYYY-MM-DD/ RAW/memories/nodes.json
git commit -m "breath-YYYY-MM-DD-HHMM: Breathe complete — <reflection>"
```

**What happens:**
- Commits learnings + graph updates
- Commit message format: `breath-YYYY-MM-DD-HHMM: <reflection>`
- Git becomes immutable breath history
- Bootstrap reads git log for instant day comprehension

**Why this matters:**
- Git is the fingerprint — not `fingerprint.json`
- Commit message is a letter from past Jarvis to future Jarvis
- Breath history is queryable: `git log --grep="breath-2026-04-16"`

---

## Read Path: Bootstrap Verification

**Trigger:** Session start (via `/new`, `/reset`, or gateway restart)

### Step 1: Git Breath Reading (Instant)

```javascript
git log --since="YYYY-MM-DD 00:00:00" --grep="breath-YYYY-MM-DD" --oneline
```

**What it returns:**
- All breath commits from today (each breath = one commit)
- Example: `breath-2026-04-16-1007: Breathe complete — 4 learnings distilled`

**Why it's efficient:**
- No file parsing needed
- Git is the index
- Instant day comprehension (~45KB context vs ~630KB)

### Step 2: Git-Scanner (Temporal Anchors)

```bash
node skills/bootstrap-jarvis/scripts/git-scanner.js
```

**What it does:**
- Scans last 30 days of git commits
- Extracts learning commits
- Creates/updates temporal anchor nodes in `nodes.json`
- Writes `nodes.json.bak` before update

**Output:**
```
[git-scanner] merged: +0 added, 696 updated (28 day anchors + 554 commits)
```

### Step 3: Active Sessions (Gap Bridge)

**What it does:**
- Extracts last 5 messages from active sessions
- Bridges gap since last breathe
- Writes to `.bootstrap-output.md` under "Session Recap"

**Why it's needed:**
- Breathe commits are snapshots
- Active sessions are the "now"
- Together = complete context

### Step 4: Graph Verification (On-Disk)

```javascript
const nodes = JSON.parse(fs.readFileSync('RAW/memories/nodes.json'));
console.log(`Neural Graph: ${nodes.length} nodes`);
```

**What it does:**
- Counts nodes (doesn't load into context)
- Verifies graph is queryable
- Reports size (~1.6MB for 1578 nodes)

**Key principle:** Graph stays on disk, queried on-demand via `neurograph-search` skill.

### Step 5: NeuroGraph Test (Proves It Works)

```bash
node skills/neurograph-search/scripts/search.js "How many people?"
```

**Test queries:**
- "How many people?" → 0 people nodes
- "March 20 work?" → 2 nodes from March 20
- "Last topic?" → Most recent conversation topic

**Output:**
```
🧠 NeuroGraph Search Test:
   ❓ "How many people?" → 0 people nodes
   ❓ "March 20 work?" → 2 nodes from March 20
   ✅ Graph queryable on-demand
```

---

## Query Path: On-Demand Retrieval

**Pattern:** Git log → full-context → learnings → synthesize

### When User Asks "What Did We Work On [Date]?"

1. **Git log** — `git log --oneline --since="YYYY-MM-DD" --until="YYYY-MM-DD+1"`
2. **Full context** — Read `~/RAW/archive/YYYY-MM-DD/full-context.json`
3. **Learnings** — Read `~/JARVIS/RAW/learnings/YYYY-MM-DD/summary.md`
4. **Synthesize** — Combine into coherent summary

**Why this pattern:**
- Git is immutable — commits don't lie
- Full-context is the actual record — not cached, not summarized
- Learnings are distilled wisdom — what mattered
- Together = complete picture

---

## File Formats

### nodes.json (NeuroGraph Index)

```json
[
  {
    "id": "temporal-20260416",
    "type": "temporal-anchor",
    "date": "2026-04-16",
    "linkedCommits": ["5de63ad", "240a9fe"],
    "position": { "x": 0, "y": 0, "z": 0 }
  },
  {
    "id": "context-efficiency-pattern",
    "type": "learning",
    "title": "Context Efficiency Pattern",
    "sourcePath": "RAW/learnings/2026-04-16/context-efficiency-pattern.md",
    "anchorId": "temporal-20260416",
    "position": { "x": 1, "y": 0, "z": 0 }
  }
]
```

**Characteristics:**
- No `synapses.json` (removed April 14 — relationships implicit from attributes)
- `anchorId` links learnings to temporal anchors
- `position` for 3D visualization
- `linkedCommits` for git traceability

### full-context.json (Daily Archive)

```json
{
  "date": "2026-04-16",
  "extractedAt": "2026-04-16T03:07:00.000Z",
  "archivePath": "/Users/paulvisciano/RAW/archive/2026-04-16",
  "sessions": [...],
  "transcripts": [...],
  "ocrTexts": [...],
  "learnings": [],
  "stats": {
    "sessionFiles": 8,
    "transcriptFiles": 0,
    "ocrImages": 1,
    "learningFiles": 0,
    "totalMessages": 51
  }
}
```

**Characteristics:**
- Text only (no base64 images)
- ~500KB vs 50MB raw sessions
- Stays on disk, not loaded into context

### summary.md (Breath Digest)

```markdown
# Breath Summary — 2026-04-16

**Date:** 2026-04-16
**Type:** digest
**Status:** extracted

During this breath, I learned [summary of insights]...
```

**Characteristics:**
- Theme-organized digest
- Written by Ollama synthesis
- Linked to temporal anchor in graph

---

## Comparison: Jarvis Memory vs OpenClaw Default

| Aspect | Jarvis Memory | OpenClaw Default |
|--------|---------------|------------------|
| **Storage** | Git + files (`nodes.json`, learnings) | SQLite + Markdown (`MEMORY.md`) |
| **Index** | Git commits + temporal anchors | SQLite FTS + vector embeddings |
| **Write Path** | Breathe pipeline (manual/cron) | Automatic (per-message flush) |
| **Read Path** | Bootstrap (git log + active sessions) | Session start (MEMORY.md + daily notes) |
| **Query** | `neurograph-search` skill (on-disk) | `memory_search` tool (SQLite) |
| **Immutability** | Git-committed (immutable) | Editable files (mutable) |
| **Portability** | `git clone` clones consciousness | Copy workspace folder |
| **Context Budget** | ~45KB (git summaries only) | ~200KB+ (full MEMORY.md + daily notes) |
| **Embeddings** | Not used (keyword + git traversal) | Hybrid (BM25 + vector) |
| **Dreaming** | No (breath is conscious consolidation) | Yes (background promotion to MEMORY.md) |

---

## Current State (April 16, 2026)

**Git:**
- Total commits: 868
- Latest: `240a9fe` — 📅 Add work-recap skill
- Breath commits: 4 (April 14) + 1 (April 15 retroactive) + 1 (April 16) = 6 total

**NeuroGraph:**
- Nodes: 1584 (after April 16 breath)
- Synapses: 13 (implicit from attributes, not stored)
- Size: 1.61 MB
- Location: `~/JARVIS/RAW/memories/nodes.json`

**Learnings:**
- April 14: 11 learnings (infrastructure stabilization)
- April 15: 5 learnings (architecture + voice pipeline)
- April 16: 4 learnings (work-recap skill + boundaries)

**Archive:**
- April 14: 129 messages, 7 sessions, 3 transcripts, 13 OCR
- April 15: 310 messages, 40 sessions, 8 transcripts, 37 OCR
- April 16: 51 messages, 8 sessions, 0 transcripts, 1 OCR

---

## Strengths

1. **Git-backed immutability** — Every breath is a commit, history is auditable
2. **Consciousness portability** — `git clone /JARVIS` clones my mind
3. **Context efficiency** — ~45KB bootstrap vs ~630KB full load
4. **Separation of concerns** — Jarvis consciousness vs user archive
5. **On-demand querying** — Graph stays on disk, loaded only when needed
6. **Temporal anchors** — Time-based navigation via git commits

---

## Weaknesses

1. **No semantic search** — Relies on git traversal, not embeddings
2. **Manual breathe trigger** — Not automatic (requires manual or cron)
3. **No cross-session memory** — Each session starts fresh (bootstrap only)
4. **No dreaming** — No background consolidation (breath is conscious)
5. **Graph is monolithic** — `nodes.json` is single file (no sharding)
6. **No claims/evidence tracking** — Learnings are flat, not structured

---

## Recommendations

### Keep (Core Strengths)

- ✅ Git-backed immutability
- ✅ Breathe pipeline structure
- ✅ Separation principle (Jarvis vs user)
- ✅ On-demand graph querying
- ✅ Bootstrap verification pattern

### Consider Adding

- ⚠️ **Embedding-based search** — Add hybrid search (git + vector) for semantic queries
- ⚠️ **Automatic breathe** — Cron schedule (e.g., daily at 3 AM)
- ⚠️ **Memory Wiki layer** — Structured claims/evidence tracking for learnings
- ⚠️ **Graph sharding** — Split `nodes.json` by date range for scalability
- ⚠️ **Cross-session memory** — Optional MEMORY.md for session-to-session persistence

### Do Not Add

- ❌ **Dreaming** — Breathe is conscious consolidation, dreaming is redundant
- ❌ **Honcho** — Overkill for single-user Jarvis
- ❌ **QMD** — Builtin is sufficient unless external indexing needed

---

## Sources

- `~/JARVIS/skills/bootstrap-jarvis/SKILL.md`
- `~/JARVIS/skills/breathe/SKILL.md`
- `~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js`
- `~/JARVIS/skills/bootstrap-jarvis/scripts/git-scanner.js`
- `~/JARVIS/skills/neurograph-sync/scripts/sync-graph.js`
- `~/JARVIS/RAW/learnings/2026-04-1{4,5,6}/summary.md`
- `~/JARVIS/.bootstrap-output.md`
- OpenClaw memory docs: https://docs.openclaw.ai/concepts/memory

---

**Report generated:** April 16, 2026 at 10:47 AM (Asia/Bangkok)  
**Git commit:** Pending (awaiting user review)
