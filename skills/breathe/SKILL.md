---
name: breathe
description: The full memory pipeline — one natural command. Inhale (archive), distill (extract), weave (learnings), exhale (sync). Use when: (1) end-of-day reflection, (2) ready to integrate experiences, (3) want to sync memory without running individual skills.
---

# Breathe (Memory Pipeline Orchestrator)

## When to Use

✅ **USE this skill when:**
- **Anytime** — morning, midday, evening, night
- Full pipeline needed (archive → distill → weave → sync)
- Want one simple command for Eric/David/Bruce
- Memory feels "unsynced" — time to breathe
- After big conversations / sessions / experiences
- Before stopping for the day (clean state)
- After fixing issues (verify pipeline works)

## When NOT to Use

❌ **DON'T use this skill when:**
- Need individual steps only (use archive-collector, context-extractor separately)
- Debugging a specific step in isolation
- Mid-pipeline interruption (let it finish, or restart from beginning)

## The Metaphor

**Breathe is the rhythm of a sovereign mind:**

```
Inhale  → Take in experiences (archive)
Hold    → Find essence (distill)
Exhale  → Release insights (weave)
Rest    → Integrate memory (sync)
```

## Workflow

### Step 1: Inhale (Archive)

```bash
cd ~/JARVIS
node skills/archive-collector/scripts/archive-all.js
```

**What happens:**
- Collects `~/JARVIS/live/` → dated archive
- Collects Desktop files → dated archive
- Collects OpenClaw sessions → `sessions/`
- Verifies integrity (file birthtime vs folder)

**Output:**
```
🫁 Inhaling...
✅ Archive complete
```

---

### Step 2: Hold (Distill)

```bash
cd ~/JARVIS
node skills/context-extractor/scripts/extract-context.js $(date +%Y-%m-%d)
```

**What happens:**
- Strips base64 images (50MB → 500KB)
- Extracts conversation text only
- Outputs: `~/RAW/archive/YYYY-MM-DD/full-context.json`

**Output:**
```
Holding...
✅ Essence distilled
```

---

### Step 3: Exhale (Weave)

```bash
cd ~/JARVIS
node skills/learning-creator/scripts/create-learnings.js $(date +%Y-%m-%d)
```

**What happens:**
- Reads `full-context.json` (from Step 2)
- Synthesizes insights from conversations
- Creates learning `.md` files
- Outputs: `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/*.md`

**Output:**
```
🫁 Exhaling...
✅ Learnings woven to ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)/
```

---

### Step 4: Rest (Sync / Digest Graph)

```bash
cd ~/JARVIS
# Step 4a: Sync learnings (creates learning nodes)
node skills/neuro-graph-sync/scripts/sync-graph.js $(date +%Y-%m-%d)

# Step 4b: Sync archive files (creates archive nodes)
node skills/neuro-graph-sync/scripts/set-archive-creation-dates.js $(date +%Y-%m-%d)
```

**What happens:**
- **sync-graph.js:** Reads learnings from `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/`, creates learning nodes, links to temporal anchor
- **set-archive-creation-dates.js:** Scans `$RAW_ARCHIVE/YYYY-MM-DD/`, creates archive nodes for all files (audio, transcripts, images, sessions, OCR), links to temporal anchor
- Updates `$JARVIS_HOME/RAW/memories/nodes.json` + `synapses.json`
- **Ensures 1:1 mapping:** Every file on disk has a node in graph

**Output:**
```
Resting...
✅ NeuroGraph synced (learnings + archive files)
✅ 1:1 mapping verified (all files have nodes)
```

---

## Single Command

```bash
cd ~/JARVIS
node skills/breathe/scripts/run-pipeline.js
```

**Full output:**
```
🫁 Breathing...

Inhaling experiences...
✅ Archive complete

Holding essence...
✅ Context distilled

Exhaling insights...
✅ Learnings woven

Resting into memory...
✅ Learnings synced to graph
✅ Archive files synced to graph
✅ 1:1 mapping verified

🫁 Breathe complete
```

---

## Scripts

**Location:** `skills/breathe/scripts/`

| Script | Purpose |
|--------|---------|
| `run-pipeline.js` | Orchestrates all 4 steps |

---

## Expected Result

**Memory is synced:**
- Archive: Complete (all files dated + organized in `$RAW_ARCHIVE`)
- Context: Distilled (lean text, no bloat in `$RAW_ARCHIVE/YYYY-MM-DD/full-context.json`)
- Learnings: Woven (learning `.md` files in `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/`)
- NeuroGraph: **Fully synced** (1:1 mapping — all archive files + learnings have nodes in `nodes.json` + `synapses.json`)

**Ready for:** Tomorrow's experiences

---

## Notes

- **Runs all 4 steps** — atomic operation
- **Default date:** Today (`YYYY-MM-DD`)
- **Optional arg:** `node skills/breathe/scripts/run-pipeline.js 2026-03-20`
- **Idempotent:** Safe to run multiple times (can breathe again anytime)
- **Natural language:** "Breathe" not "pipeline"
- **Uses .env:** `$JARVIS_HOME`, `$RAW_ARCHIVE`, `$NEUROGRAPH_DIR` (portable paths)
- **Anytime operation:** Morning, midday, evening, night — breathe when ready

---

**Updated:** March 21, 2026 — The mind breathes. Not processes.
