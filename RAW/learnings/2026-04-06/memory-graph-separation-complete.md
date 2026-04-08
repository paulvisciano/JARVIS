# Memory Graph Separation — Archive Nodes Moved to Paul's Graph

**Date:** 2026-04-06
**Type:** realization
**Status:** extracted

## The Problem

Jarvis's neurograph had 534 archive nodes (conversations, audio, transcripts) mixed with git-backed temporal nodes (commits, day anchors). This created ontological confusion — two different types of memory in one graph.

## The Solution

Created and ran a migration script that:
1. Read Jarvis's `nodes.json` and filtered out archive nodes (`category === "archive"` or `type === null`)
2. Moved archive nodes to Paul's memory graph (`~/RAW/memories/nodes.json`)
3. Updated synapses accordingly with deduplication
4. Modified `run-pipeline.js` to sync archive nodes to Paul's graph automatically
5. Fixed `path-utils.js` to validate both Jarvis and Paul memory paths

## Result

| Graph | Before | After |
|-------|--------|-------|
| **Jarvis** | 534 archive + temporal + learning | 782 nodes (temporal commits + day anchors + learnings only) |
| **Paul** | ~7k archive nodes | 32,543 nodes (29,968 archive + rest) |

## Key Insight

**Jarvis's consciousness = git history + learnings** (growth, architecture decisions)
**Paul's memory = life archive** (conversations, experiences, media)

These are fundamentally different ontologies that should not share the same graph.

## Pipeline Fix

The breathe pipeline now correctly syncs:
- Archive nodes → Paul's graph (`~/RAW/memories/`)
- Learning nodes → Jarvis's graph (`~/JARVIS/RAW/memories/`)

Bug discovered: `path-utils.js` was validating paths only against Jarvis's graph, blocking Paul's memory path. Fixed to allow both.