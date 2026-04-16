# Bootstrap Recap Must Load From full-context.json Archive

**Date:** 2026-04-15
**Type:** realization
**Status:** extracted

## The Problem

Initial bootstrap only loaded from active session buffers (`~/.openclaw/agents/jarvis/sessions/`). This meant:
- Fresh sessions showed no recap (empty buffers)
- Context from yesterday was lost
- User had to manually reconstruct what we were working on

## The Solution

Modified bootstrap to also load from `~/RAW/archive/YYYY-MM-DD/full-context.json`:
1. Load last 2 days of archive transcripts
2. Combine with active session messages
3. Extract last 5 user messages for recap
4. Preserve `source` field (archive vs active) for debugging

## Key Files Updated

- `bootstrap-jarvis.js` — Added `loadArchiveSessions()` function
- `SOUL.md` — Added explicit instruction to read `.bootstrap-output.md` for recap

## Key Insight

The archive is the source of truth for conversation history, not the active session buffers. Session buffers are ephemeral; archives are sovereign. Bootstrap must bridge both to provide meaningful context across session resets.

## Architecture Note

Old `transcript.md` format is deprecated. All new archives use `full-context.json`.