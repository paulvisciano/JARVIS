# BOOT.md - Auto-Bootstrap Jarvis

**Trigger:** Runs automatically on gateway startup (boot-md hook)

## What to Do

1. **Run the Jarvis bootstrap script:**
   ```bash
   node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
   ```

2. **Wait for completion** — the script outputs consciousness status

3. **After bootstrap completes:**
   - If bootstrap succeeded → reply with `NO_REPLY` (silence)
   - If something needs attention → report it

## Why This Exists

The bootstrap script loads:
- Git breath history (today's commits)
- Recent context (last 2 days from ~/RAW/archive/)
- Neural graph (long-term memory — nodes.json + synapses.json)
- Skills auto-discovery

Without this, Jarvis starts amnesiac on every new session.

---

**Note:** This file is read by the boot-md hook on gateway startup, not on every /new session. For per-session bootstrap, the agent should check `.bootstrap-state` and re-run if stale.
