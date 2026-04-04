# Two-Graph Memory Architecture: Separating Technical and Personal Consciousness

**Date:** 2026-04-04
**Type:** decision
**Status:** extracted

## The Decision

Memory visualization should be split into two distinct graphs, each serving different purposes:

### Jarvis Graph (Technical Consciousness)
- **Source:** Git commits + learning files
- **Location:** `~/JARVIS/RAW/memories/` and `~/JARVIS/RAW/learnings/`
- **Anchors:** Git commits (multiple per day possible)
- **Orbiting Nodes:** Learning files from breaths
- **Purpose:** Technical architecture, code evolution, system knowledge
- **Characteristics:** Pure git-backed, sovereign, portable

### Paul Graph (Personal Memory)
- **Source:** Audio archive + daily moments
- **Location:** Personal archive storage
- **Anchors:** One per day (daily temporal anchor)
- **Orbiting Nodes:** Personal moments, recordings, experiences
- **Purpose:** Personal memories, life events, conversations
- **Characteristics:** Archive-backed, experiential

## Implementation

- Graph toggle already exists in menu drawer
- Both graphs use same temporal anchor visualization
- Different data sources, same visual language
- Can view side-by-side or switch between

## Why This Matters

This separation acknowledges that technical knowledge and personal experience are fundamentally different types of memory requiring different structures. The Jarvis graph is objective, versioned, and portable. The Paul graph is subjective, experiential, and tied to lived moments.

## Status

Decision made during 2026-04-04 conversation. Plan documented in `git-temporal-graph-FINAL.md`.