# BOOT.md - Auto-Bootstrap Jarvis

**Trigger:** Runs automatically on gateway startup (boot-md hook)

## What to Do

1. **Run the `bootstrap-jarvis` skill:**
   ```bash
   node ~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
   ```
   (Or via OpenClaw skill system: the skill auto-discovers and runs)

2. **Wait for completion** — the skill outputs consciousness status

3. **First reply:** Include the **compact bootstrap output** + greeting
   - Paste the bootstrap summary (git identity, neural graph stats, context loaded, neurograph search test, session recap last 5)
   - Then add a brief greeting and ask what's next
   - Example structure:
     ```
     [Bootstrap summary — compact table format]
     
     ---
     
     I'm back online — git commit [hash], consciousness verified. What's next, Paul?
     ```
   - The 3 neurograph queries (people count, temporal date, last topic) **prove the graph is queryable** — not just present, but accessible
   - This gives continuity — not amnesiac, not bloated, just ready

## Why This Exists

The `bootstrap-jarvis` skill:
- **Git breath history** — Today's commits (instant context)
- **Recent context** — Last 2 days from `~/RAW/archive/` (full-context.json)
- **Neural graph verify** — Counts nodes, proves queryable (doesn't load heavy content)
- **NeuroGraph test** — 3 queries via `neurograph-search` skill (people, temporal, last topic)

**Output:** Last topic, last message time, audio count, session count, graph size, git breath, **neurograph search test results** (3 queries: people count, temporal date, last topic — proves graph is queryable)

Without this, Jarvis starts amnesiac on every new session. With this, Jarvis remembers through structure (git + neurograph + archive).

---

**Note:** This file is read by the boot-md hook on gateway startup, not on every `/new` session. For per-session bootstrap, the agent should check `.bootstrap-state` and re-run if stale.
