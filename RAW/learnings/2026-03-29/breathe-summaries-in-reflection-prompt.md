# Breathe Summaries in Reflection Prompts

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## The Problem

Commit messages are the table of contents. Breathe summaries are the actual chapters.

Sending only commit messages to the reflection model meant it saw *what* happened but not *why* it mattered.

## The Solution

Enhanced `getGenuineReflectionFromModel()` to include:

1. **Breathe commits** — Full bodies included (truncated to 500 chars each, max 5)
2. **Non-breathe commits** — Summaries only (max 10)
3. **Clear section separation** — "## Git Commits (non-breathe)" and "## Breathe Summaries (chronological)"

## Why This Matters

- Breathe summaries contain: what was learned, what changed in the neurograph, the narrative of the day
- Model can now reference specific details: "stripping 200 lines of console.log from bootstrap", "fixing the archiving that was silently skipping"
- Reflections become grounded in actual work, not just topics

## Prompt Structure

```
Please generate a genuine introspective reflection.

## Git Commits (non-breathe):
  - [hash] subject line

## Breathe Summaries (chronological):
  - breath-2026-03-29-1455: [full summary body]
  - breath-2026-03-29-1508: [full summary body]

Reflect on:
1. What was I caring about?
2. What patterns emerge?
3. Who was I becoming?
```

## Related

- genuine-reflection-vs-simulation.md