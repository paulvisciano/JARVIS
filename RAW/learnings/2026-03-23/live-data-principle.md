# Live Data Principle: No Hardcoded Counts

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## Commitment
Remove all hardcoded neuron/synapse counts, git commit numbers from documentation.

## Files Updated
- SOUL.md
- IDENTITY.md
- AGENTS.md
- VISION.md

## Principle
**Count live, never hardcode.** Read from neurograph and git at session start.

## Why
- Docs reflect actual state, not stale snapshots
- Graph is source of truth
- Prevents drift between documentation and reality