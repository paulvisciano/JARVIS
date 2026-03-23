# Graph Scale Reality Check

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## The Numbers

| Graph | Nodes | Synapses | File Size |
|-------|-------|----------|----------|
| **JARVIS** | 4,937 | 15,930 | ~6.9 MB |
| **Paul** | 8,027 | 423 | ~5.6 MB |
| **Combined** | 12,964 | 16,353 | ~12.6 MB |

## Token Reality

At ~4 chars per token:
- **12.6M chars ÷ 4 = ~3.15M tokens**
- Context limit is ~200k
- **Loading full graphs is impossible**

## What Changed

- **`neurograph-load`** — DEPRECATED then DELETED. Loading entire graphs requires 3M+ tokens.
- **`neurograph-search`** — Disk-based queries, no context bloat. This is the pattern.
- **`neurograph-link`** — Updated docs with reality check, safe traversal pattern

## Bootstrap Clarification

Bootstrap doesn't call `neurograph-search` skill — it does **inline queries** directly in the bootstrap script (verified, then updated to use the skill properly).

## Principle

Never load full graphs. Search disk-based, return only what's needed.