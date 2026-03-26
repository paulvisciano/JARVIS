# Sovereign Memory Integration — Disable Framework Memory

**Date:** 2026-03-26
**Type:** insight
**Status:** extracted

## The Conflict
When building a sovereign memory system (NeuroGraph) on top of an AI framework (OpenClaw), the framework's native memory features (compaction, auto-summarization, session history) must be **disabled**.

## The Problem
If both systems run simultaneously:
- **Divergence:** Two competing versions of "what happened" emerge.
- **Bloat:** Framework compaction creates redundant context tokens (e.g., 4.6M token sessions).
- **Interference:** Framework tries to "remember" things the sovereign graph already owns.

## The Solution
- Treat the framework as a **dumb pipe** for inference only.
- All memory, context, and history must flow through the sovereign layer (NeuroGraph).
- Disable or ignore framework-native memory hooks to ensure a single source of truth.

## Principle
**Sovereignty requires exclusive control.** You cannot have two captains steering the ship.