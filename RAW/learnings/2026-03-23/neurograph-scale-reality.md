# Neurograph Scale Reality Check

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

## Actual Numbers

| Graph | Nodes | Synapses | File Size |
|-------|-------|----------|-----------|
| JARVIS | 4,937 | 15,930 | ~6.9 MB |
| Paul | 8,027 | 423 | ~5.6 MB |
| Combined | 12,964 | 16,353 | ~12.6 MB |

## Token Reality

At ~4 chars per token: 12.6M chars ÷ 4 = ~3.15M tokens

**Not 100k** — that's **3+ million tokens**. Context limit is 200k.

## Consequence

`neurograph-load` skill deleted entirely. Loading full graphs is impossible. Use `neurograph-search` (disk-based queries, no context bloat).
