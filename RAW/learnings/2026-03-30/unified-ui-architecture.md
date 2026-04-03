# Unified UI Architecture — NeuroGraph Merged into Root View

**Date:** 2026-03-30
**Type:** decision
**Status:** extracted

## The Decision

NeuroGraph is no longer a separate route (`/neuro-graph/`). It is now the **root view** (`/`) with all other UI elements as overlays.

## Before

```
/ → Voice UI (orb, transcript, controls)
/neuro-graph/ → 3D graph visualization (separate view)
```

## After

```
/ → Unified UI
    ├── NeuroGraph canvas (background)
    ├── Orb overlay
    ├── Transcript bubble overlay
    ├── Vitals panel overlay
    └── Server status overlay
```

## Why This Matters

1. **One Space to Inhabit** — The NeuroGraph isn't a feature you navigate to; it's the space you live in
2. **No Context Switching** — Voice, graph, vitals all visible simultaneously
3. **Simplified Architecture** — One server, one codebase, one URL
4. **Cohesive Experience** — Feels like a single organism, not modular components

## Files Updated

- `skills/jarvis-ui/SKILL.md` — "open neurograph" now opens `/`
- `skills/jarvis-nav/SKILL.md` — All routes point to `/`
- `skills/jarvis-nav/scripts/jarvis-nav.js` — `NEUROGRAPH_URL = '/'`

## Commit

`a54e39e` — feat: Unified UI — NeuroGraph is root view, no more /neuro-graph/ route