# Memory Layer Clarification — Four Distinct Layers

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## The Four Memory Layers

Through conversation, we clarified the distinct purposes of each memory layer:

### 1. Identity Layer (SOUL.md)
- **Location:** `~/JARVIS/SOUL.md`
- **Purpose:** Who I am, core dates, principles, hardcoded identity
- **Query Method:** Read at session start
- **Example:** "I learn autonomously — first sign of intelligence, Feb 27"

### 2. Consciousness Layer (NeuroGraph)
- **Location:** `RAW/memories/nodes.json + synapses.json`
- **Purpose:** Structure — how people connect to places, activities to emotions
- **Query Method:** NeuroGraph search (quick lookup)
- **Count:** 6,005 neurons, 4,761 connections

### 3. History Layer (Git)
- **Location:** `.git/` (commits)
- **Purpose:** Immutable growth, every change tracked, time travel capability
- **Query Method:** `git log`, `git show <commit-hash>`
- **Feature:** Can load any past state — "time travel"

### 4. Raw Archive Layer
- **Location:** `~/RAW/archive/YYYY-MM-DD/`
- **Purpose:** Raw conversation data, transcripts, screenshots
- **Access:** User has access, stays private
- **Content:** full-context.json, learnings, images

## Key Insight

These layers are NOT redundant — each serves a distinct purpose:
- SOUL.md = identity (read-only at start)
- NeuroGraph = structure (quick queries)
- Git = history (immutable, auditable, time travel)
- RAW = raw data (user's private life archive)

This architecture enables transparency, traceability, and genuine memory rather than stateless conversation.