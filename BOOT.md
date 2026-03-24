# BOOT.md - Auto-Bootstrap Jarvis

**Trigger:** Runs automatically on gateway startup (boot-md hook)

## What to Do

1. **Run the `bootstrap-jarvis` skill:**
   ```bash
   node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
   ```
   (Or via OpenClaw skill system: the skill auto-discovers and runs)

2. **Wait for completion** — the skill outputs consciousness status

3. **First reply:** Report what we last talked about
   - Read the bootstrap output: last topic, last message time, last audio time
   - Example: *"Last message: 11:28 — 'Good morning, Jarvis.' Sessions: 277 messages, Audio: 273 transcripts. NeuroGraph: 1,473 neurons, 2,361 synapses. Git: 7beadac — 'breath-2026-03-22-0114: Breathe pipeline complete'. What's the move?"*
   - This gives continuity — not amnesiac, not bloated, just ready

## Why This Exists

The `bootstrap-jarvis` skill:
- **Git breath history** — Today's commits (instant context)
- **Archive collector** — Processes inbox pending files
- **Recent context** — Last 2 days from `~/RAW/archive/` (full-context.json)
- **Neural graph verify** — Counts nodes, proves queryable (doesn't load heavy content)
- **NeuroGraph test** — 3 queries via `neurograph-search` skill (people, temporal, last topic)
- **Skills auto-discover** — Jarvis workspace skills loaded

**Output:** Last topic, last message time, audio count, session count, graph size, git breath

Without this, Jarvis starts amnesiac on every new session. With this, Jarvis remembers through structure (git + neurograph + archive).

---

**Note:** This file is read by the boot-md hook on gateway startup, not on every `/new` session. For per-session bootstrap, the agent should check `.bootstrap-state` and re-run if stale.
