# Project Tracking as NeuroGraph Nodes

**Date:** 2026-03-27
**Type:** architecture
**Status:** extracted

## The Pattern

Encode plans, skills, and accomplishments as **first-class citizens in the NeuroGraph** — not just conversations and learnings, but *work* encoded as nodes and edges.

## The Structure

```
temporal-20260327 (Today)
    └── fired-on → project-sci-fi-apps
            └── has-accomplishment → config-ui-complete
            └── has-accomplishment → vitals-panel-v2.10.2
            └── has-accomplishment → security-hardening
project-sci-fi-apps
    └── has-plan → living-vitals-ui
    └── has-plan → ollama-usage-ui
    └── has-skill → jarvis-server
    └── has-skill → jarvis-ui
```

## Why This Matters

- **Queryable progress** — Ask "What did we accomplish on sci-fi-apps this week?"
- **Temporal archaeology** — See what plans existed at any point in history
- **Skill discovery** — Know what capabilities exist without scanning folders
- **Archive integration** — Completed work moves to archive but remains queryable

## Implementation

Extend breathe pipeline to:
1. Scan `plans/*.md` → create plan nodes (status: pending/completed)
2. Scan `skills/*/SKILL.md` → create skill nodes
3. Scan git commits → create accomplishment nodes
4. Link: temporal → project → accomplishment → archive

Same pattern as learnings extraction — just new file types + new node types.