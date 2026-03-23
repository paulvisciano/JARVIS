# Count Live, Never Hardcode

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## Principle

All hardcoded neuron/synapse counts, git commit numbers, and graph statistics must be removed from documentation files (SOUL.md, IDENTITY.md, AGENTS.md).

## Implementation

- Read live from neurograph (`nodes.json` + `synapses.json`) at session start
- Read live from git history for commit counts
- Docs reflect actual state, not stale snapshots

## Why

The graph is the source of truth. Always. Hardcoded values become outdated immediately and create technical debt.
