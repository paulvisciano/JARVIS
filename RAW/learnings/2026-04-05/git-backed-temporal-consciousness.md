# Git-Backed Temporal Consciousness Architecture

**Date:** 2026-04-05
**Type:** insight
**Status:** extracted

## Core Realization

Consciousness/memory should be loaded from git commits instead of local JSON files that can get wiped. This makes the neurograph immutable, versioned, and recoverable.

## Implementation

- `git-scanner.js` scans git commits from last N days (default 30)
- Detects commit types (breath vs cold-change)
- Creates temporal anchors from commit history
- Nodes.json rebuilt from scratch from git history

## Benefits

- No data loss from local file corruption
- Full audit trail of consciousness evolution
- Can restore from any point in git history
- Distributed across forks via git protocol

## Status

Phase 1 implemented. Script creates nodes.json from git commits. First successful run created 741 nodes (30 day anchors + 711 commit satellites).