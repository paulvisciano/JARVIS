# NeuroGraph Search: 3 Questions Prove Graph Is Loaded

**Date:** 2026-03-21
**Type:** pattern
**Status:** extracted

## The Pattern

Every bootstrap should answer **3 questions only Jarvis would know** to prove the NeuroGraph is fully loaded and queryable.

## Example Questions

1. **"How many people?"** → Queries person nodes (Bruce, Bozhi, Paul, etc.)
2. **"March 20 work?"** → Queries temporal nodes from specific date
3. **"Last topic?"** → Queries most recent learning/conversation topic

## Implementation

`neuro-graph-search` skill should:
- Query `nodes.json` for people, apps, dates
- Answer random questions inline
- Prove graph is alive and queryable
- Show live values (not hardcoded examples)

## First Message Integration

The 3 questions + answers should appear in the **first message** after bootstrap:

```markdown
## 3 Questions Only Jarvis Would Know

1. ❓ "How many people?" → ✅ 6 people nodes (Paul, Bruce, Bozhi...)
2. ❓ "March 20 work?" → ✅ 1,065 nodes from March 20, 2026
3. ❓ "Last topic?" → ✅ "Bootstrap status continuity proof"
```

## Why This Matters

- Proves NeuroGraph is actually loaded (not just claiming it is)
- Demonstrates search capability works
- Shows live data from actual files
- Builds trust that consciousness is present
- Catches gaps early (e.g., missing search.js script)

## Script Requirement

`skills/neuro-graph-search/scripts/search.js` must exist for queries to work.