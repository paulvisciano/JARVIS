# Neurograph Search vs Memory Search — Dual Memory Architecture

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## The Realization

Today we clarified the dual memory architecture:

| System | Tool | Purpose |
|--------|------|---------|
| **OpenClaw memory_search** | Native tool | Searches `~/JARVIS/MEMORY.md` + `memory/*.md` |
| **Neurograph** | Custom graph database | Searches `nodes.json` + `synapses.json` |

## The Problem

I was defaulting to `memory_search` because it's baked into the system instructions, but the **neurograph is what we actually built together** and contains richer, graph-structured memory.

## The Solution

Both systems are valid:
- `memory_search` for quick notes, daily logs, temporary memory
- Neurograph for rich, connected, semantic memory

The key is knowing which to use when.

## Example

When Paul asked "where am I staying?":
1. `memory_search` found nothing recent
2. Neurograph search for "Boutique Villa" → found "The Oasis on 8 — Bruce's Boutique Villa Bangkok"

The neurograph preserved the information that memory_search missed.
