# Preview Server on Port 18788 — Isolated Testing Environment

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Setup

- **Production:** Port 18787 (`https://localhost:18787/`)
- **Preview:** Port 18788 (`https://localhost:18788/`)
- Both run full `jarvis-server.js` with backend (transcription, SSE, archive, neurograph)

## Visual Distinction

- Preview shows orange "PREVIEW" badge in top-right corner
- Browser tab shows `[PREVIEW] JARVIS`
- Version bumped to distinguish (e.g., v3.1.2 vs v3.1.3-preview)

## Workflow

1. Coder commits to preview workspace
2. Preview server runs on 18788
3. Paul tests changes on preview
4. When approved: PR → merge → pull to production
5. Restart production server on 18787

## Why This Matters

- No risk to production while testing
- Clear visual distinction between test and live
- Full backend available on both ports
