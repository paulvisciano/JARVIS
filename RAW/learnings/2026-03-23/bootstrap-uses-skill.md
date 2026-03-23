# Bootstrap Uses Neurograph Search Skill

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## The Update

Bootstrap now calls the `neurograph-search` skill instead of inline queries.

## Before

Inline `queryNeuroGraph()` function (direct file read + filter)

## After

Calls `neurograph-search` skill via `execSync`:
```javascript
function queryNeuroGraph(query, category = null) {
  const args = category ? `"${query}" --category ${category}` : `"${query}"`;
  const output = execSync(`node "skills/neurograph-search/scripts/search.js" ${args}`);
}
```

## Why

DRY principle — use the skill, don't duplicate logic. Skills are the canonical implementation.
