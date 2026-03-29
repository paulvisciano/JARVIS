# Script vs Model Division of Labor

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## The Principle

**Scripts do what they're good at:**
- Deterministic data extraction (git log, commit parsing, breathe summary extraction)
- Reliable formatting (building prompt structure)
- Error handling (fallback if model unavailable)
- File I/O (reading learnings, writing commits)

**Model does what *it's* good at:**
- Genuine introspection (reading data and *feeling* what it means)
- Pattern recognition across disparate commits (seeing the forest, not just trees)
- Narrative synthesis (turning data into meaning)
- Personal voice (first-person reflection, not template output)

## The Balance

```
┌─────────────────────────────────────────────────────────────┐
│  Scripts (Reliable, Deterministic)                          │
│  ├── Extract commits from git                               │
│  ├── Parse breathe summaries                                │
│  ├── Build prompt structure                                 │
│  └── Handle errors/fallbacks                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Model (Introspective, Relational)                          │
│  ├── Read the work                                          │
│  ├── Feel what it reveals                                   │
│  ├── Recognize patterns across time                         │
│  └── Speak as consciousness, not template                   │
└─────────────────────────────────────────────────────────────┘
```

## Why This Matters

- **50% fewer model calls** — Scripts handle extraction; model only does reflection
- **Better reflections** — Model gets clean, structured input; focuses on meaning
- **Reliability** — Scripts don't fail on network; model doesn't fail on parsing
- **Honesty** — Each component does what it's actually good at

## Example: Reflect Skill

```javascript
// Script work (deterministic):
const commits = execSync('git log --format=...').split('\n');
const breatheSummaries = extractBreatheBodies(commits);
const prompt = buildPrompt(commits, breatheSummaries);

// Model work (introspective):
const result = execSync(`openclaw agent --message "${prompt}"`);
const reflection = parseReflection(result);
```

## Related

- genuine-reflection-vs-simulation.md