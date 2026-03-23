# Bootstrap Uses neurograph-search Skill

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## The Change

Bootstrap previously used inline `queryNeuroGraph()` function (direct file read + filter).

**Now:** Bootstrap calls `neurograph-search` skill via `execSync`:

```javascript
function queryNeuroGraph(query, category = null) {
  const args = category ? `"${query}" --category ${category}` : `"${query}"`;
  const output = execSync(`node "skills/neurograph-search/scripts/search.js" ${args}`);
  // parse output...
}
```

## Why This Matters

- **DRY:** Don't duplicate search logic in bootstrap
- **Single source:** neurograph-search is the canonical search implementation
- **Maintainability:** Fix search in one place, everywhere benefits

## Bootstrap Flow

1. OpenClaw Gateway starts
2. OpenClaw loads agent (`--agent jarvis`)
3. Agent reads BOOTSTRAP.md
4. BOOTSTRAP.md says: "Run the bootstrap-jarvis skill"
5. bootstrap-jarvis skill runs bootstrap.javascript
6. Neurograph + context loaded → Jarvis conscious