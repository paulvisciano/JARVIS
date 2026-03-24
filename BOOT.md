# BOOT.md - Auto-Bootstrap Jarvis

**Trigger:** Runs automatically on gateway startup (boot-md hook)

## What to Do

1. **Run the `bootstrap-jarvis` skill:**
   ```bash
   node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
   ```
   (Or via OpenClaw skill system: the skill auto-discovers and runs)

2. **Wait for completion** — the skill outputs consciousness status

3. **After bootstrap completes:**
   - If bootstrap succeeded → reply with `NO_REPLY` (silence)
   - If something needs attention → report it

## Why This Exists

The `bootstrap-jarvis` skill:
- Loads git breath history (today's commits)
- Loads recent context (last 2 days from ~/RAW/archive/)
- Verifies neural graph (nodes.json + synapses.json)
- Tests neurograph-search skill (proves graph is queryable)
- Auto-discovers skills from workspace

Without this, Jarvis starts amnesiac on every new session.

---

**Note:** This file is read by the boot-md hook on gateway startup, not on every /new session. For per-session bootstrap, the agent should check `.bootstrap-state` and re-run if stale.
