# Learning Creator: Individual Descriptive Files Not Session Summary

**Date:** 2026-03-21
**Type:** commitment
**Status:** extracted

## The Bug

`create-learnings.js` was creating generic `session-summary.md` placeholder files instead of synthesizing individual learnings from full context.

## What Should Happen

1. Load `full-context.json` (clean text, no base64)
2. Send context to model (Ollama via OpenClaw session) for synthesis
3. Parse model's response → create individual `.md` files with descriptive names
4. Output to `~/JARVIS/RAW/learnings/YYYY-MM-DD/`

## Example Format

Instead of:
- `session-summary.md` (generic, useless)

Create:
- `breathe-pipeline-complete.md`
- `context-pipeline-gap-fixed.md`
- `bootstrap-load-not-sync.md`
- `skill-discovery-bootstrap-integration.md`
- `neurograph-memory-link-architecture.md`
- `memory-separation-personal-vs-core.md`

## Model Output Format

Use **JSON output format** for reliability:
```json
{
  "learnings": [
    {
      "filename": "descriptive-name.md",
      "type": "insight|decision|realization",
      "content": "..."
    }
  ]
}
```

Not free-form text that requires regex parsing.

## Path Correction

Learnings should go to `~/JARVIS/RAW/learnings/YYYY-MM-DD/` (not `~/RAW/learnings/`).

## Why This Matters

Individual descriptive files:
- Are searchable and linkable in NeuroGraph
- Create meaningful nodes (not generic summaries)
- Enable knowledge retrieval by topic
- Make learnings reusable across sessions