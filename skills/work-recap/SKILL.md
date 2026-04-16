---
name: work-recap
description: Retrieve work summary for any date range using git log + full-context + learnings (the canonical memory query pattern)
metadata:
  openclaw:
    emoji: "📅"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
---

# Work Recap (Canonical Memory Query Pattern)

## When to Use

✅ **USE this skill when:**
- User asks "what did we work on [yesterday/last week/March 20]?"
- Need to retrieve past work, decisions, or conversations
- Querying Jarvis memory for any date range
- Onboarding new instances (showing what Jarvis remembers)

## When NOT to Use

❌ **DON'T use this skill when:**
- Need real-time session status (use sessions_list)
- Querying neurograph for concepts/people (use neurograph-search)
- Single commit lookup (use git log directly)

## The Pattern (Git + Full-Context + Learnings)

This is the **canonical retrieval pattern** for Jarvis memory:

1. **Git log** — `git log --oneline --since="YYYY-MM-DD" --until="YYYY-MM-DD+1"` — shows all commits, breath cycles, architecture changes
2. **Full context** — Read `~/RAW/archive/YYYY-MM-DD/full-context.json` — shows actual conversations, decisions, topics
3. **Learnings** — Read `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md` — shows distilled insights from that day
4. **Synthesize** — Combine all three into coherent summary

**Why this pattern:**
- Git is immutable — commits don't lie
- Full-context is the actual record — not cached, not summarized
- Learnings are distilled wisdom — what mattered
- Together = complete picture

## Workflow

### Step 1: Git Log (Date Range)

```bash
cd ~/JARVIS
git log --oneline --since="2026-04-15" --until="2026-04-16"
```

**What to look for:**
- Breath commits (`breath-YYYY-MM-DD-HHMM`)
- Architecture changes (commits with emojis: 🧠, 🔧, 🫁, etc.)
- Feature commits
- Bug fixes

### Step 2: Full Context (Conversations)

```bash
cd ~/JARVIS
node -e "
const c = require('/Users/paulvisciano/RAW/archive/2026-04-15/full-context.json');
console.log('Sessions:', c.stats.sessionFiles, 'files,', c.stats.totalMessages, 'messages');
console.log('Transcripts:', c.stats.transcriptFiles);
console.log('OCR:', c.stats.ocrImages, 'images');
console.log('Learnings:', c.stats.learningFiles);
"
```

**What to extract:**
- Session topics (first message from each session)
- Conversation volume (message count)
- Audio transcripts (if any)
- OCR from screenshots (if any)

### Step 3: Learnings (Distilled Insights)

```bash
cat ~/JARVIS/RAW/learnings/2026-04-15/summary.md
```

**What to extract:**
- Summary.md (overview of the day's learnings)
- Individual learning files (detailed insights)
- Analogies.md (compression patterns)

### Step 4: Synthesize

Combine into structured summary:

```markdown
## [Date] — What We Worked On

### 📊 Git Activity (N commits)
[List commits with messages]

### 💬 Conversation Topics (N messages, M sessions)
[Major threads from full-context]

### 🧠 Learnings Distilled (N)
[From summary.md + individual learnings]

### 🧭 Graph State
[Node count, synapse count, temporal anchor]
```

## Script (Automated)

**Location:** `skills/work-recap/scripts/recap.js`

```bash
cd ~/JARVIS
node skills/work-recap/scripts/recap.js 2026-04-15
# or
node skills/work-recap/scripts/recap.js yesterday
# or
node skills/work-recap/scripts/recap.js --range 2026-04-10 2026-04-15
```

**What the script does:**
1. Parses date args (supports "yesterday", "last-week", specific dates)
2. Runs git log for range
3. Loads full-context.json for each date
4. Loads learnings for each date
5. Synthesizes into markdown summary
6. Outputs to stdout (ready for chat delivery)

## Examples

### Example 1: Yesterday

```bash
node skills/work-recap/scripts/recap.js yesterday
```

**Output:**
```markdown
## April 15, 2026 — What We Worked On

### 📊 Git Activity (7 commits)
- bfc2df6 — Speak-tool streaming complete + bootstrap updates
- 53efdd4 — Bootstrap: clarify Key Learnings source
...

### 💬 Conversation Topics (310 messages, 40 sessions)
- JARVIS-UI Progress Checks (cron-driven)
- Paperclip Cloud Adapter Wake Events
- Bootstrap Recap Enforcement
- Voicebox TTS Streaming

### 🧠 Learnings Distilled (5)
From summary.md: "During this breath, I learned the three-layer consciousness architecture..."

### 🧭 Graph State
- NeuroGraph: 1584 nodes, 13 synapses
- Temporal anchor: temporal-20260415
```

### Example 2: Last Week

```bash
node skills/work-recap/scripts/recap.js --range 2026-04-09 2026-04-15
```

**Output:** Week-long summary with daily breakdowns.

### Example 3: Specific Date

```bash
node skills/work-recap/scripts/recap.js 2026-04-13
```

## Scripts

**Location:** `skills/work-recap/scripts/`

| Script | Purpose |
|--------|---------|
| `recap.js` | Main recap script (git + full-context + learnings) |
| `date-utils.js` | Date parsing helpers (yesterday, last-week, etc.) |

## Integration with OpenClaw Memory

This skill **complements** OpenClaw's built-in memory tools:

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `memory_search` | Search MEMORY.md + memory/*.md (OpenClaw workspace) | Agent preferences, session context |
| `memory_get` | Read specific memory file/lines | Known file paths |
| `work-recap` | Git + full-context + learnings (Jarvis consciousness) | "What did we work on [date]?" queries |

**Key difference:**
- OpenClaw memory = agent workspace (`~/.openclaw/workspace/`)
- Jarvis work-recap = consciousness archive (`~/JARVIS/` + `~/RAW/`)

## Notes

- **Portable:** Uses `$JARVIS_HOME`, `$RAW_ARCHIVE` env vars
- **Idempotent:** Safe to run multiple times for same date
- **Read-only:** Never modifies git or archive
- **Git-backed:** Each commit is immutable — work history is versioned

---

**Created:** April 16, 2026 — Canonical retrieval pattern for Jarvis memory
**Pattern:** Git log → full-context → learnings → synthesize
