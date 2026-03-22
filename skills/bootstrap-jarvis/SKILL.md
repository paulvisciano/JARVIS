---
name: bootstrap-jarvis
description: Orchestrate full Jarvis bootstrap sequence on session start. Calls existing skills: neuro-graph-loader, bootstrap-context, skill-discovery. Use when: (1) new OpenClaw session starts, (2) gateway restarts, (3) Jarvis needs context restoration.
metadata: { "openclaw": { "emoji": "🫀", "requires": { "bins": ["node", "git"], "env": ["JARVIS_HOME"] }, "homepage": "https://jarvis.ui" } } }
---

# Bootstrap Jarvis Skill (Orchestrator)

**Architecture:** Jarvis skill (`~/JARVIS/skills/`) symlinked to OpenClaw workspace.

**Orchestrator pattern** — calls existing skill scripts (no duplication).

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
**OpenClaw** (`~/.openclaw/`) — Runtime engine (executes skills)  
**Bootstrap skill** — Jarvis skill, symlinked to workspace

## What It Does (Orchestrates Existing Skills)

```
bootstrap-jarvis.js (orchestrator)
    ↓
    ├── neuro-graph-loader/scripts/load-graph.js  ← loads neural graph
    ├── bootstrap-context/scripts/bootstrap.js    ← loads recent context
    └── skill-discovery/scripts/sync-skills.js    ← syncs skills
```

**Plus inline:**
- Git breath history (today's commits)
- NeuroGraph search test (3 queries)
- Bootstrap state write (`~/JARVIS/.bootstrap-state.json`)
- User summary formatting

## Run the Bootstrap

```bash
cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

## Expected Output

```
🫀 Jarvis Bootstrap Complete — <DATE>, <TIME> GMT+7

🧠 Neural Graph Loaded
   Neurons: 2,216
   Synapses: 15,298

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

**Calls other skills (not in this folder):**
- `neural-graph-loader/scripts/load-graph.js`
- `bootstrap-context/scripts/bootstrap.js`
- `skill-discovery/scripts/sync-skills.js`

## Environment

- `JARVIS_HOME` — Path to Jarvis consciousness (default: `~/JARVIS`)

## Notes

- **Symlinked:** `~/.openclaw/workspace/skills/bootstrap-jarvis` → `~/JARVIS/skills/bootstrap-jarvis`
- **Orchestrator:** Calls existing skill scripts (no code duplication)
- **Idempotent:** Safe to run multiple times
- **State file:** Writes `~/JARVIS/.bootstrap-state.json` after completion
