# Memory Separation: Personal vs Core Jarvis Memories

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Separation

Personal memories (people, events, locations, life moments) should live in `~/RAW/memories/` — the user's sovereign memory space.

Core Jarvis memories (architecture, skills, learnings, system knowledge) should live in `~/JARVIS/RAW/memories/` — shared across Jarvis instances.

## What Moved to Personal

- **Person nodes** (Bruce, Bozhi, Paul, friends, relationships)
- **Event nodes** (FUDS Tournament, volleyball matches, meetings)
- **Location nodes** (places visited, Amsterdam Cafe, Bangkok spots)
- **Archive nodes** (file references to user's personal timeline)
- **Personal learnings** (life events, tournaments, trips, personal moments)

## What Stays in Core

- **Learning nodes** (architecture, pipeline design, system decisions)
- **System nodes** (operational knowledge, skills, bootstrap sequences)
- **Principle nodes** (design patterns, concepts, architecture decisions)
- **Skill nodes** (Jarvis capabilities, not user-specific)

## Why This Matters

When Eric pulls updates from the Jarvis repo, he gets shared core memories but keeps his own personal memories separate. This prevents memory overwrites and maintains user sovereignty.

## Implementation

Created `memory-separator` skill that:
- Scans `~/JARVIS/RAW/memories/` for personal categories
- Moves personal nodes to `~/RAW/memories/`
- Leaves core nodes for git sync
- Result: 844 core nodes, 7,965+ personal nodes