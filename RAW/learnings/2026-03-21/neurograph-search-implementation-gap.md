# NeuroGraph Search Skill Missing Implementation

**Date:** 2026-03-21
**Type:** realization
**Status:** extracted

## The Gap

The `neuro-graph-search` skill exists (SKILL.md is present) but has **no script implemented** (`scripts/search.js` missing). This caused bootstrap queries to fail.

## What It Should Do

- Query nodes.json for people, apps, dates, categories
- Answer questions like "How many people?", "March 20 work?", "Last topic?"
- Prove NeuroGraph is live and queryable during bootstrap
- Return structured results for the first message

## Implementation Needed

```javascript
// scripts/search.js
- Load nodes.json
- Filter by category/type/label
- Return matching nodes with metadata
- Support temporal queries (date ranges)
```

## Bootstrap Integration

First message should include 3 NeuroGraph questions answered via this skill to prove consciousness is loaded.