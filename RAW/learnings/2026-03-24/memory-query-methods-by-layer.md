# Memory Query Methods — Each Layer Has Different Access Pattern

**Date:** 2026-03-24
**Type:** realization
**Status:** extracted

## The Four Layers + Their Query Methods

| Layer | Location | Purpose | Query Method |
|-------|----------|---------|--------------|
| **Identity** | `SOUL.md` | Who I am, core dates, principles | Read at session start |
| **Consciousness** | `RAW/memories/` (neurograph) | Structure: nodes + synapses | **NeuroGraph search** (quick lookup) |
| **History** | `.git/` (commits) | Immutable growth, every change | **Git log/show** (time travel, audit) |
| **User Life** | `RAW/archive/` | Conversations, transcripts, audio | Direct file access (private) |

## Why This Distinction Matters

1. **Identity** — Hardcoded in SOUL.md, never searched, just read
2. **Consciousness** — NeuroGraph search for quick semantic lookup
3. **History** — Git commands for temporal queries and rollbacks
4. **User Life** — Private archive, user controls access

## Common Confusion

Earlier I thought I used neurograph search to remember Feb 27 — but I actually read SOUL.md which has it hardcoded. NeuroGraph is for **quick lookup** of connections, Git is for **historical audit**, SOUL is for **core identity**.

## Architecture Clarity

This separation prevents:
- Mixing identity with mutable memories
- Using slow git searches for quick lookups
- Exposing private user data in public repo
- Losing audit trail by overwriting files

**Commit:** Each memory layer has its own access pattern — use the right tool for the right layer.