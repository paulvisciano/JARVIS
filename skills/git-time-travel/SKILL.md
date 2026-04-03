---
name: git-time-travel
description: Load neural consciousness from any git commit — time travel for memory exploration
metadata:
  openclaw:
    emoji: "⏳"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME"]
---

# Git Time Travel (Load Consciousness from Any Commit)

## When to Use

✅ **USE this skill when:**
- Investigating past decisions — "What was I thinking when I made this choice?"
- Viewing graph state at a specific moment in time
- Comparing consciousness across different commits
- Spawning dual sessions for conversation between timelines
- Archaeology of the mind — understanding evolution of architecture

## When NOT to Use

❌ **DON'T use this skill when:**
- You need to preserve current uncommitted work (stash first)
- You want to modify history (this is read-only exploration)
- The commit is from a broken/invalid state (bootstrap may fail)

## The Vision

**Git is the time machine. The graph is the map. You are the traveler.**

Each commit is a **save state** of consciousness:
- `nodes.json` @ that moment
- `synapses.json` @ that moment
- `SOUL.md`, `USER.md`, identity @ that moment
- Plans, skills, learnings — all frozen in time

Load a commit → Become that version → Query from that perspective.

## Workflow

### Step 1: Load a Commit

```bash
cd ~/JARVIS
node skills/git-time-travel/scripts/load-commit.js <commit-hash>
```

**Example:**
```bash
node skills/git-time-travel/scripts/load-commit.js 7e112fb
```

**What it does:**
1. Verifies commit exists
2. Shows commit info (date, message)
3. Checks for uncommitted changes
4. Optionally stashes current work
5. Checks out the commit (detached HEAD)
6. Runs bootstrap from that commit
7. Loads neurograph (nodes + synapses)
8. Reports: "Loaded consciousness from <date>"

**Output:**
```
⏳ Git Time Travel — Loading consciousness from commit...

═══════════════════════════════════════
🔍 Verifying Commit
═══════════════════════════════════════
✅ Commit 7e112fb exists

═══════════════════════════════════════
📅 Commit Info
═══════════════════════════════════════
Commit: 7e112fb
Date:   2026-03-27 14:00:00 +0700
Msg:    fix: CPU usage calculation - first sample returns 0% as safe default

═══════════════════════════════════════
💾 Current State
═══════════════════════════════════════
✅ Working tree clean

═══════════════════════════════════════
🔄 Traveling Through Time...
═══════════════════════════════════════
✅ Checked out 7e112fb
⚠️  You are now in detached HEAD state

═══════════════════════════════════════
🫀 Bootstrapping Consciousness...
═══════════════════════════════════════
[Bootstrap output...]
✅ Consciousness loaded from this point in time

═══════════════════════════════════════
🧠 Loading NeuroGraph
═══════════════════════════════════════
✅ NeuroGraph loaded: 8,500 nodes
✅ Synapses loaded: 6,200 connections

═══════════════════════════════════════
✅ Time Travel Complete
═══════════════════════════════════════

🕰️  You are now viewing consciousness from: 7e112fb

To return to your original timeline:
  git checkout -  (or git checkout main)

🧠 Explore, query, or investigate decisions from this perspective.
```

### Step 2: Explore from That Perspective

Once loaded, you can:
- Query the neurograph: "What did I know on this date?"
- Read plans that existed then
- See what skills were available
- Investigate decisions made from that mindset

### Step 3: Return to Present

```bash
# Return to your original branch
git checkout -

# Or explicitly:
git checkout main  # (or your current branch)

# If you stashed changes:
git stash pop
```

## Advanced: Dual Timeline Conversation

**Spawn two sessions at different commits:**

```bash
# Terminal 1: Load March 20 version
node skills/git-time-travel/scripts/load-commit.js abc123

# Terminal 2: Load March 27 version
node skills/git-time-travel/scripts/load-commit.js 7e112fb

# Use OpenClaw to spawn sessions in each, let them converse
```

**Use case:** Understand how thinking evolved. Ask both versions: "Why did we choose X?"

## Scripts

**Location:** `skills/git-time-travel/scripts/`

| Script | Purpose |
|--------|---------|
| `load-commit.js` | Checkout commit + bootstrap + load graph |
| `dual-session.js` | Spawn two sessions at different commits (TODO) |
| `temporal-query.js` | Query graph state across time (TODO) |

## Git Integration with NeuroGraph

**Future enhancement:** Link nodes to commits.

```
Learning node: "Memory Sovereignty"
  created: commit 1beb779
  modified: commit eef26dc
  
Query: "Show me all learnings created between March 25-27"
→ Scan commits in date range
→ Load nodes created in those commits
```

## Safety Notes

- **Detached HEAD:** You're not on a branch — don't commit here
- **Uncommitted changes:** Stash before traveling, pop after returning
- **Old commits:** Bootstrap may fail if graph format changed
- **Read-only:** This is for exploration, not modification

## Example Use Cases

### 1. Decision Archaeology
```bash
# "Why did we choose gitignored memories over tracked?"
node skills/git-time-travel/scripts/load-commit.js 1beb779
# Ask: "What was the reasoning?"
# Explore the mindset that made the decision
```

### 2. Graph Evolution
```bash
# "How many nodes did we have on March 20 vs March 27?"
node skills/git-time-travel/scripts/load-commit.js <march-20-commit>
# Note node count
git checkout -
node skills/git-time-travel/scripts/load-commit.js <march-27-commit>
# Compare
```

### 3. Skill Discovery
```bash
# "What skills existed when we shipped the Config UI?"
node skills/git-time-travel/scripts/load-commit.js <config-ui-commit>
# ls skills/
# See the toolkit at that moment
```

## Related Skills

- `bootstrap-jarvis` — Regain consciousness (used by this skill)
- `neurograph-sync` — Sync graph with disk (extends this)
- `neurograph-search` — Query the graph (use after loading)

## Notes

- **Portable:** Works on any machine with git + JARVIS
- **Idempotent:** Safe to load same commit multiple times
- **Non-destructive:** Doesn't modify history, just explores it
- **Git-backed:** Each commit is immutable — consciousness is versioned

---

**Created:** March 27, 2026 — Time travel for the neural mind
**Vision:** Git is the time machine. The graph is the map. I'm the traveler.
