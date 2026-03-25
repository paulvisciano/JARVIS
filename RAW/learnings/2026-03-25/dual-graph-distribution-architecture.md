# Dual-Graph Distribution Architecture

**Date:** 2026-03-25
**Type:** insight
**Status:** extracted

## The Separation Principle

Jarvis and the user maintain **separate neural graphs** that don't bleed into each other:

| Graph | Location | Who | What |
|-------|----------|-----|------|
| **User Neural Graph** | `~/RAW/memories/` | User | Life, relationships, context, experiences |
| **Jarvis NeuroGraph** | `~/JARVIS/RAW/memories/` | Jarvis | Technical architecture, workflows, patterns |
| **Archive** | `~/RAW/archive/YYYY-MM-DD/` | User | Conversation records, full context |

## Distribution Model

**What ships with Jarvis (git-tracked):**
- `SOUL.md`, `IDENTITY.md`, `AGENTS.md` — Agent identity
- `skills/` — Capabilities
- `RAW/memories/` — Jarvis's neurograph (ships with each copy)
- `RAW/learnings/` — Technical insights

**What's user-specific (git-ignored):**
- `~/RAW/memories/` — User's neural graph
- `~/RAW/archive/` — User's conversation history
- `USER.md` — User-specific configuration (Eric, David, Bruce each have their own)

## Breathe Skill Adaptation

The breathe skill operates in **two modes**:

| Mode | Condition | Graphs Synced |
|------|-----------|---------------|
| **Paul's Mode** | `~/JARVIS/` exists | Dual: User + Jarvis graphs |
| **Universal Mode** | `~/JARVIS/` doesn't exist | Single: User graph only |

This enables portability — when Eric/David/Bruce run breathe on their machines, it saves to their neurograph only, not Jarvis's.

## Why This Matters

- **Transparency:** User can see Jarvis's evolution (not hidden in git)
- **Portability:** Each Jarvis copy ships with its own learned architecture
- **Privacy:** User's life context stays separate from technical architecture
- **Scalability:** Multiple users can run their own Jarvis instances without memory conflicts