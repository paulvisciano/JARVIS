# Web-Learn Model Selection — Learning vs Coding

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## The Problem

Initial web-learn skill used `qwen2.5-coder:7b` which:
- Added "Thinking..." prefix to output
- Produced fragmented learnings (5 separate .md files)
- Caused JSON parsing failures → looked like infinite loop
- Poor UX — user saw frozen agent

## The Solution

Switched to `qwen3.5:cloud` because:
- **Learning task** ≠ **Coding task**
- qwen3.5:cloud optimized for knowledge extraction, synthesis, reasoning
- qwen2.5-coder optimized for code generation, syntax, refactoring
- Clean JSON output (no "Thinking..." prefix)
- Consolidated learnings into single document

## Files Created

- `skills/web-learn/SKILL.md` — Skill documentation
- `skills/web-learn/scripts/web-learn.js` — Implementation
- `RAW/learnings/2026-03-24/web-learn-git-scm-com.md` — Consolidated learning

## Workflow

1. Launch browser to URL (single tab, navigate pages)
2. Screenshot each page (save to `~/RAW/archive/YYYY-MM-DD/images/`)
3. OCR screenshots (tesseract — local, $0 cost)
4. Synthesize learnings from OCR text (qwen3.5:cloud)
5. Link neurograph nodes to source URL + screenshots

## Key Insight

**This is learning, not coding.** Model selection matters:
- Use coding models for code tasks
- Use reasoning models for knowledge extraction
- Match model capabilities to task type

This makes learnings traceable and visual — showing our work with proof.