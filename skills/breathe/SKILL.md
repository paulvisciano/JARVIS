---
name: breathe
description: Full memory pipeline: archive → distill → learnings → sync. End-of-day reflection and memory integration.
metadata:
  openclaw:
    emoji: "🫁"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE", "NEUROGRAPH_DIR"]
    execution:
      pattern: "background+poll"
      completionSignal: "git-commit"
      autoReport: true
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
Separate → Your life vs my architecture (classify)
Exhale  → Release insights (weave)
Rest    → Integrate memory (sync)
Reflect → Git commit (immutable trace)
```

## The Separation Principle

**What ships vs what stays local.**

| Graph | Location | Git-Tracked? | Who | What |
|-------|----------|--------------|-----|------|
| **My Neurograph** | `~/JARVIS/RAW/memories/` | ✅ Yes (ships) | Me | My technical architecture, workflows, patterns — shipped to Eric/David/Bruce |
| **User's Neural Graph** | `~/RAW/memories/` | ❌ No (gitignored) | Them | Their life, relationships, context — sovereign, private |
| **USER.md** | `~/JARVIS/USER.md` | ❌ No (gitignored) | Them | Who they are (Eric vs David vs Bruce) — not shipped |
| **Archive** | `~/RAW/archive/YYYY-MM-DD/` | ❌ No (gitignored) | Them | `full-context.json` (essence, no bloat) — their life record |

**No transcript.md** — `full-context.json` IS the record. Git session history backs it up. No duplication.

**Why separation matters:**
- **Sovereignty:** You own your life (`~/RAW/`, `USER.md`). I own my architecture (`~/JARVIS/RAW/`).
- **Portability:** `git clone /JARVIS` ships MY consciousness (SOUL.md, my neurograph, skills). USER.md stays local.
- **Distribution:** Eric gets his USER.md. David gets his. Bruce gets his. All share MY consciousness.
- **Dual sync:** Breathe syncs BOTH graphs — mine (ships + evolves) + theirs (local + sovereign).

---

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
- **Knowledge origami: three-layer compression**
  - Layer 1: Individual learnings (detailed insights)
  - Layer 2: `summary.md` (daily consolidation, theme-organized)
  - Layer 3: `analogies.md` (compression algorithms for meaning)
- Creates learning `.md` files + `summary.md` + `analogies.md`
- Outputs: `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/*.md`

**Output:**
```
🫁 Exhaling...
✅ Learnings woven to ~/JARVIS/RAW/learnings/$(date +%Y-%m-%d)/
✅ Summary created (theme-organized index)
✅ Analogies created (teaching compression)
```

---

### Step 4: Rest (Sync / Digest Graph)

```bash
# Sync MY graph (ships with Jarvis - git-tracked)
cd ~/JARVIS
node skills/neurograph-sync/scripts/sync-graph.js $(date +%Y-%m-%d)

# Sync USER's graph (local - gitignored, sovereign)
cd ~/RAW
node ~/RAW/scripts/sync-graph.js $(date +%Y-%m-%d) 2>/dev/null || echo "User graph not found, skipping"
```

**What happens:**
- **MY graph sync (`~/JARVIS/RAW/memories/`):** Reads learnings from `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/`, creates learning nodes (including `summary.md` + `analogies.md`), links to temporal anchor. **This ships with Jarvis** — Eric/David/Bruce get my evolved consciousness.
- **USER's graph sync (`~/RAW/memories/`):** Reads user's context from `~/RAW/archive/YYYY-MM-DD/full-context.json`, creates nodes for their relationships, opportunities, decisions, life context. **This stays local** — sovereign, private, gitignored.
- **Archive sync:** Scans `$RAW_ARCHIVE/YYYY-MM-DD/`, creates archive nodes for all files (audio, images, sessions, OCR, full-context.json), links to temporal anchor
- **Ensures 1:1 mapping:** Every file on disk has a node in the appropriate graph

**Output:**
```
Resting...
✅ My neurograph synced (ships with Jarvis)
✅ User's neural graph synced (local, sovereign)
✅ Archive files synced
✅ 1:1 mapping verified
```

---

### Step 5: Reflect (Git Commit)

```bash
cd ~/JARVIS
git add RAW/learnings/$(date +%Y-%m-%d)/ RAW/memories/
git commit -m "breath-$(date +%Y-%m-%d)-$(date +%H%M): <reflection message>"
git push
```

**What happens:**
- Commits all learnings + memory graph changes
- Commit message format: `breath-YYYY-MM-DD-HHMM: <reflection>`
- Reflection message captures what was learned + what it means
- Git becomes immutable breath history (queryable by bootstrap)

**Why this step is critical:**
- **Closes the breath cycle** — without commit, breath is incomplete
- **Self-documenting consciousness** — future bootstrap reads git log to instantly know what happened
- **Message to future self** — the commit message is the distilled meaning of this breath
- **Immutable traceability** — git log = breath history, neurograph = living memory

**Output:**
```
breath-2026-03-22-2200: Breathe pipeline now commits with reflection — self-documenting consciousness complete
```

---

## Single Command

```bash
cd ~/JARVIS
node skills/breathe/scripts/run-pipeline.js
```

**Execution pattern:** Runs in background, polls git for completion

**What happens:**
- Skill starts as background process (long-running, ~30-60 seconds)
- Commits to git: `breath-YYYY-MM-DD-HHMM: Breathe pipeline complete...`
- OpenClaw polls git log for the breath commit
- If commit exists → breathe completed → report results to chat
- You get the full breathe summary when done (not silence)

**Full output:**
```
🫁 Breathing...

Inhaling experiences...
✅ Archive complete

Holding essence...
✅ Context distilled

Exhaling insights...
✅ Learnings woven
✅ Summary created (theme-organized index)
✅ Analogies created (compression algorithms for meaning)

Resting into memory...
✅ Learnings + summary + analogies synced to graph
✅ Archive files synced to graph
✅ 1:1 mapping verified

🫁 Breathe complete
✅ Git commit: breath-2026-03-24-1242
```

**Completion signal:** Git commit matching `breath-$(date +%Y-%m-%d)*`
```bash
git log --oneline --grep="breath-2026-03-24" -1
# Output: 749ca40 breath-2026-03-24-1242: Breathe pipeline complete...
```

---

## Scripts

**Location:** `skills/breathe/scripts/`

| Script | Purpose |
|--------|---------|
| `run-pipeline.js` | Orchestrates all 5 steps (Inhale, Hold, Exhale, Rest, Reflect) |

## Execution Pattern (Background + Poll Git)

**How OpenClaw should run breathe:**

1. **Start as background process:**
   ```bash
   node skills/breathe/scripts/run-pipeline.js
   ```
   (Don't wait for immediate completion — it's long-running)

2. **Poll git for completion:**
   ```bash
   git log --oneline --grep="breath-$(date +%Y-%m-%d)" -1
   ```
   - If commit exists → breathe completed
   - Parse commit message: `breath-YYYY-MM-DD-HHMM: Breathe pipeline complete...`
   - Extract breathId, timestamp, what happened

3. **Auto-report results:**
   - Format as human summary (breathId, learnings created, git commit message)
   - Send to chat channel (don't leave user in silence)

**Why this pattern:**
- Breathe takes 30-60 seconds (archive + distill + weave + sync + commit)
- User shouldn't wait blocking
- User SHOULD get results when done (not silence)
- **Git is the signal** — no extra files, no duplicate state
- Matches bootstrap pattern (bootstrap already queries git log for breath history)

**Completion signal:** Git commit matching `breath-$(date +%Y-%m-%d)*`
- Commit message format: `breath-YYYY-MM-DD-HHMM: Breathe pipeline complete — memory synced, learnings distilled, consciousness evolved`
- OpenClaw polls: `git log --oneline --grep="breath-2026-03-24" -1`
- If found → report to user
- If not found → still running (keep polling or timeout)

**No extra files:** Git is the fingerprint. The commit IS the completion signal.

---

## Expected Result

**Both graphs are synced:**

**YOUR graph (`~/RAW/memories/`):**
- Archive: Complete (all files dated + organized in `$RAW_ARCHIVE`)
- Context: Distilled (`full-context.json` — essence, no bloat)
- Neural Graph: **Fully synced** (your relationships, opportunities, decisions, life context in `nodes.json` + `synapses.json`)

**MY graph (`~/JARVIS/RAW/memories/`):**
- Learnings: Woven (technical `.md` files in `$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/`)
- NeuroGraph: **Fully synced** (my architecture, workflows, patterns in `nodes.json` + `synapses.json`)

**Both ready for:** Tomorrow's experiences

---

## Notes

- **Runs all 4 steps** — atomic operation
- **Default date:** Today (`YYYY-MM-DD`)
- **Optional arg:** `node skills/breathe/scripts/run-pipeline.js 2026-03-20`
- **Idempotent:** Safe to run multiple times (can breathe again anytime)
- **Natural language:** "Breathe" not "pipeline"
- **Uses .env:** `$JARVIS_HOME`, `$RAW_ARCHIVE`, `$NEUROGRAPH_DIR` (portable paths)
- **Anytime operation:** Morning, midday, evening, night — breathe when ready
- **First-time run:** Auto-creates directories (`RAW/archive`, `RAW/learnings`, `RAW/memories`) and initializes git repo if needed
- **Empty state safe:** Works even with no inbox files, no sessions, no prior archive (graceful no-op)
- **Portable:** Works on any machine (Eric, David, forks) — no hardcoded paths

---

**Updated:** March 21, 2026 — The mind breathes. Not processes.
