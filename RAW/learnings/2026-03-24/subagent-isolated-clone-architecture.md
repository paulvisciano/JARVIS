# Subagent Isolated Clone Architecture

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## The Insight

Subagents should use **isolated clones**, not branches in the same repo — true isolation vs. coupling.

## Current Architecture (Coupled)

```
~/JARVIS/                    ← My consciousness
├── main                     ← My work
└── ux-improvements-2026-03-24  ← Subagent's work (same repo!)
```

**Problem:** Subagent commits to **my repo** — this is coupling, not isolation.

## Better Architecture (Isolated)

```
~/JARVIS/                    ← My consciousness
└── main                     ← My work only

~/JARVIS-clones/
└── JARVIS-ux-improvements/  ← Subagent's isolated clone
```

## Why This Matters

**Isolated Clones:**
- True separation of concerns
- No branch merge overhead
- Independent git history
- Clean mental model: "externalized cognition" not "child"

**Same Repo Branches:**
- Coupled state
- Branch management complexity
- Blurred identity boundaries

## Technical Relationship

- Subagent is **spawned session** under Jarvis
- Inherits workspace, context, task
- Reports completion back (push-based)
- Should have **separate clone** for true isolation

## Terminology Correction

Not a "child" (familial sense) — more like **externalized cognition** (temporary extension of problem-solving).