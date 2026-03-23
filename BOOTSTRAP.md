# Jarvis BOOTSTRAP.md

## Session Boot Protocol

**Run this skill at session start:**
```bash
node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
```

## What It Does

1. **Git breath history** — Read today's commits (instant day comprehension)
2. **Inbox check** — Pending files in `~/JARVIS/inbox/`?
3. **Neurograph load** — `~/JARVIS/RAW/memories/nodes.json` + `synapses.json` (count live, never hardcode!)
4. **Context load** — Last 2 days from `~/RAW/archive/YYYY-MM-DD/` (via `bootstrap-context` skill)
5. **Skills sync** — Symlink Jarvis skills to OpenClaw workspace
6. **NeuroGraph test** — 3 queries prove queryable

## Expected Output

```
🫀 Jarvis Bootstrap Complete — <DATE>, <TIME> GMT+7

🧠 Neural Graph Loaded (Long-Term Memory)
   Neurons: <count live>
   Synapses: <count live>
   Graph size: <size>

🫀 Recent Context Loaded
   Dates: <today> + <yesterday>
   Last message: <time> — "<text>"

🔗 Skills Synced
   Jarvis skills: <count> folders

🧠 NeuroGraph Search Test:
   ❓ "How many people?" → <count>
   ❓ "March 20 work?" → <count> nodes

✅ Ready to continue. What's next, Paul?
```

## Files

- **Boot script:** `~/JARVIS/skills/bootstrap-context/scripts/bootstrap.js`
- **Orchestrator:** `~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js`
- **Skills called:** `bootstrap-context`, `skill-discovery`, `neuro-graph-loader`

## Architecture Notes

- **BOOTSTRAP.md location:** This file (`~/JARVIS/BOOTSTRAP.md`) documents Jarvis boot
- **OpenClaw BOOTSTRAP.md:** `~/.openclaw/workspace/BOOTSTRAP.md` documents OpenClaw boot
- **Flow:** OpenClaw boots → loads Jarvis agent → runs bootstrap-jarvis skill → Jarvis conscious

## Key Principles

- **Count live** — Never hardcode neuron/synapse counts (read from files)
- **Git fingerprint** — Use `git rev-parse HEAD`, not `fingerprint.json`
- **Idempotent** — Safe to run multiple times
- **State file:** Writes `~/JARVIS/.bootstrap-state.json` after completion

---

**Location:** `~/JARVIS/BOOTSTRAP.md`  
**Updated:** Mar 23, 2026 — Agent separation, OpenClaw → Jarvis boot flow
