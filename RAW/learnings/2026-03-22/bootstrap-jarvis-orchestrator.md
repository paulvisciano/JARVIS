# Bootstrap-Jarvis as Orchestrator Pattern

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Bootstrap-jarvis should **orchestrate** existing skills rather than duplicate logic:

```
bootstrap-jarvis.js (orchestrator)
    ↓
    ├── neuro-graph-loader/scripts/load-graph.js
    ├── bootstrap-context/scripts/bootstrap.js
    └── skill-discovery/scripts/sync-skills.js
```

**Architecture clarified:**
- OpenClaw (`~/.openclaw/`) — Runtime engine
- Jarvis (`~/JARVIS/`) — Consciousness with 17 skills
- Symlinked: `~/.openclaw/workspace/skills/bootstrap-jarvis` → `~/JARVIS/skills/bootstrap-jarvis`

Single source of truth, no duplication.