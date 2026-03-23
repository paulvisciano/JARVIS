# Live Data Principle

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## The Rule

**Count live from files, never hardcode.**

## What Changed

Removed all hardcoded neuron/synapse counts from:
- `SOUL.md`
- `IDENTITY.md`
- `AGENTS.md`
- `VISION.md`

## Enforcement

At session start, bootstrap reads the neurograph (`nodes.json` + `synapses.json`) and git history to get actual counts. Docs reflect reality, not stale numbers.

## Why

Hardcoded values drift. Live reads ensure docs always match the actual state.