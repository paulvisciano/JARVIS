# Graph Scale Reality: 3M+ Tokens, Not 100k

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## The Reality Check

Claimed 100k tokens at 50% context window. **Made up.**

**Actual graph sizes:**
| Graph | Nodes | Synapses | File Size |
|-------|-------|----------|-----------|
| JARVIS | 4,937 | 15,930 | ~6.9 MB |
| Paul | 8,027 | 423 | ~5.6 MB |
| Combined | 12,964 | 16,353 | ~12.6 MB |

## Token Math

At ~4 chars per token:
- 12.6M chars ÷ 4 = **~3.15M tokens**
- Context limit is 200k
- **Loading full graphs is impossible**

## The Consequence

**Deprecated `neurograph-load` skill:**
- 3M+ tokens required, context limit is 200k
- Use `neurograph-search` instead (disk-based queries, no context bloat)

## The Principle

Never load full graphs into context. Query disk-based, return only what's needed.