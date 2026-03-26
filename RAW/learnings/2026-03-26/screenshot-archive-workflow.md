# Screenshot Archive Workflow — Visual Proof of Work

**Date:** 2026-03-26
**Type:** pattern
**Status:** extracted

## The Workflow

1. **Coder takes screenshot** → Saved to `~/.openclaw/media/browser/`
2. **Breathe skill runs** → Moves screenshots to `~/RAW/archive/YYYY-MM-DD/images/`
3. **Archive with context** → OCR + metadata + git commit
4. **Permanent work history** → Visual proof of what was built

## Why This Matters

- **Verification** — See exactly what the UI looked like when feature was built
- **Accountability** — Coder must test in browser, not just claim completion
- **Memory** — Visual archive complements text transcripts
- **Portfolio** — Build a visual history of all work done

## Implementation Details

- Screenshots saved with timestamp in filename
- Breathe pipeline handles the move automatically
- Git-tracked in RAW archive (not in agent workspace)
- OCR text extracted for searchability

## Principle

**Every feature should have visual proof. Text commits tell you what changed; screenshots show you what was built.**