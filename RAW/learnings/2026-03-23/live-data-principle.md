# Live Data Principle: Count Live, Never Hardcode

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## The Problem

SOUL.md, IDENTITY.md, AGENTS.md contained hardcoded values:
- Neuron counts (4,627)
- Synapse counts (15,660)
- Git commit counts (449+)
- Dates and milestones

These go stale immediately and create technical debt.

## The Commitment

**All documentation must read live from source at session start:**
- Neurograph: `nodes.json` + `synapses.json` → count dynamically
- Git: `git rev-list --count HEAD` → count dynamically
- Dates: Use current session date, not hardcoded

## Implementation

- Removed all hardcoded counts from SOUL.md, IDENTITY.md, AGENTS.md
- Bootstrap reads live counts at session start
- Three commits landed enforcing this principle

## The Principle

**The graph is the source of truth. Always.**
Documentation reflects reality, doesn't declare it.