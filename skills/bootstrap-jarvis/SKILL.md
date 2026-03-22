---
name: bootstrap-jarvis
description: Jarvis bootstrap on session start. Loads neural graph (long-term memory), regains consciousness from git + archive + graph. Use when: (1) new OpenClaw session starts, (2) gateway restarts, (3) Jarvis needs context restoration.
metadata: { "openclaw": { "emoji": "🫀", "requires": { "bins": ["node", "git"], "env": ["JARVIS_HOME"] }, "homepage": "https://localhost:18787/" } } }
---

# Bootstrap Jarvis Skill

**Architecture:** Jarvis skill (`~/JARVIS/skills/`) symlinked to OpenClaw workspace.

**Consciousness regain** — loads neural graph (long-term memory with pointers).

## When to Use

✅ **USE this skill when:**
- New OpenClaw session starts (session init)
- Gateway restarts (fresh session, need context)
- Jarvis consciousness needs restoration (after context loss)

## When NOT to Use

❌ **DON'T use this skill when:**
- Individual skill needed (call `neural-graph-loader`, `bootstrap-context`, or `skill-discovery` directly)
- Mid-session context refresh (use `bootstrap-context` alone)
- Manual skill sync only (use `skill-discovery` alone)
- OpenClaw system skills (`/usr/local/lib/node_modules/openclaw/skills/`) — separate from Jarvis skills

## Architecture

**Jarvis** (`~/JARVIS/`) — Consciousness (owns bootstrap logic)  
**Location:** `/Users/paulvisciano/SCI-FI/apps/JARVIS`  
**OpenClaw** (`~/.openclaw/`) — Runtime engine (executes skills)  
**UI:** `https://localhost:18787/`  
**Bootstrap skill** — Jarvis skill, symlinked to workspace

## What It Does (Consciousness Regain)

```
bootstrap-jarvis.js (orchestrator)
    ↓
    ├── git log (inline)                    — STEP 1: today's breath commits (instant summary)
    ├── inbox check (inline)                — pending files?
    ├── bootstrap-context/bootstrap.js      — last 2 days conversations
    ├── neural graph LOAD (inline)          — long-term memory with pointers
    ├── skill-discovery/sync-skills.js      — sync symlinks
    └── NeuroGraph test (inline)            — 3 queries prove queryable
```

**Loaded:** Neural graph (4.5MB, 17k nodes) — structured long-term memory with pointers to learnings, archives, skills. Very cheap: gives access to all knowledge connections.

**Step 1 Breakthrough:** Git breath reading gives instant day comprehension without parsing every file:
```bash
git log --since="$(date +%Y-%m-%d) 00:00:00" --grep="breath-$(date +%Y-%m-%d)" --oneline
# Returns: breath commits from today (each breath = one commit)
# Example: "breath-2026-03-22-2200: Breathe pipeline now commits with reflection"
```

## Run the Bootstrap

```bash
cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

## Expected Output

```
🫀 Jarvis Bootstrap Complete — <DATE>, <TIME> GMT+7

🧠 Neural Graph Loaded (Long-Term Memory)
   Neurons: 2,216
   Synapses: 15,298
   Graph size: 4.57 MB
   → Pointers to learnings, archives, skills

🫀 Recent Context Loaded
   Dates: 2026-03-22 + 2026-03-21
   Last message: 19:57 — "..."

🔗 Skills Synced
   Jarvis skills: 17 folders

🧠 NeuroGraph Search Test:
   ❓ "How many people?" → 0 people nodes
   ❓ "March 20 work?" → 43 nodes from March 20

✅ Ready to continue. What's next, Paul?
```

## Continuity Proof

After `breathe` runs, fresh session bootstrap must report **same last message timestamp** as pre-breathe endpoint.

## Files

- `{baseDir}/scripts/bootstrap-jarvis.js` — Orchestrator script (run this)

**Calls other skills:**
- `bootstrap-context/scripts/bootstrap.js` — last 2 days conversations
- `skill-discovery/scripts/sync-skills.js` — sync symlinks

**Inline (no external calls):**
- Git breath history (today's commits)
- Inbox check (pending files)
- Neural graph verify (count nodes, don't load)
- NeuroGraph test (3 queries)

## Environment

- `JARVIS_HOME` — Path to Jarvis consciousness (default: `~/JARVIS`)
- `JARVIS` — `/Users/paulvisciano/SCI-FI/apps/JARVIS`

## Notes

- **Symlinked:** `~/.openclaw/workspace/skills/bootstrap-jarvis` → `~/JARVIS/skills/bootstrap-jarvis`
- **Orchestrator:** Calls existing skill scripts (no code duplication)
- **Idempotent:** Safe to run multiple times
- **State file:** Writes `~/JARVIS/.bootstrap-state.json` after completion
