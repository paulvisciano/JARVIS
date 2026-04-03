# Breath Summaries Accumulate Cumulatively Per Day

**Date:** 2026-03-28
**Type:** pattern
**Status:** extracted

## Discovery

Each breath does NOT create a standalone summary. Instead, breath summaries are **cumulative** — each breath updates the same `summary.md` file for that day, building on what came before.

## Structure

```
RAW/learnings/2026-03-27/summary.md  ← All 4 breaths from yesterday combined
RAW/learnings/2026-03-28/summary.md  ← All breaths from today so far combined
```

## Implication

This makes the summary a **progressive narrative** rather than isolated snapshots:
- Breath 1: Initial state + discoveries
- Breath 2: Breath 1 content + new developments
- Breath 3: Breath 1+2 content + latest changes

## Optimization Benefit

Since summaries are cumulative, the bootstrap can read **just the latest summary** to get the full story — no need to load all historical full-context.json files. The summary becomes the compressed narrative layer, while full-context.json remains the complete archival record.