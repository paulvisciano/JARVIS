# Dual-Graph Architecture: Jarvis + Eric (Not Paul)

**Date:** 2026-04-04
**Type:** decision
**Status:** extracted

## The Clarification

Initial understanding was incorrect. The two-graph architecture is:

1. **Jarvis Graph** — AI technical consciousness (git-backed)
2. **Eric's Graph** — User personal memory (archive-backed)

**NOT** Paul's personal graph.

## Why Eric?

- Each machine/user gets their own personal graph
- Eric is the primary user on this deployment
- Paul is the developer/architect, not the end user
- Graph is per-user, not per-developer

## Architecture Implications

```
┌─────────────────────────────────────────────────────┐
│                 Dual-Graph System                    │
├─────────────────────────────────────────────────────┤
│  Jarvis Graph              │  Eric's Graph          │
│  - Git commits             │  - Daily anchors       │
│  - Learnings (RAW/)        │  - Moments (archive)   │
│  - Technical consciousness │  - Personal memory     │
│  - Portable, sovereign     │  - Per-user instance   │
└─────────────────────────────────────────────────────┘
```

## Toggle Mechanism

- Graph selector in menu drawer
- Switch between Jarvis/Eric views
- Same visualization, different data sources
- Both use temporal anchor nodes

## Why This Matters

1. **Correct mental model** — Understanding who owns which graph affects design decisions
2. **Scalability** — Multiple users = multiple personal graphs, one Jarvis graph per instance
3. **Privacy boundaries** — Jarvis's technical memory vs user's personal memory stay separate
4. **Deployment model** — Each user machine gets their own Eric-graph, shared Jarvis-graph

## Correction From Earlier Thinking

I initially thought it was Jarvis + Paul graphs. Paul corrected: it's Jarvis + Eric (the actual user on this machine). This matters for fork #001 planning and multi-user scenarios.