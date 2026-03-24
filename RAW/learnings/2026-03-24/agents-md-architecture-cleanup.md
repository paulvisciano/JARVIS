# AGENTS.md Should Reflect Actual Architecture Only

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Cleanup Actions
Removed obsolete sections from AGENTS.md:
- Rules section (private data, external actions, trash vs rm)
- Group chats section (responding, reactions, banter)
- transcript.md reference (no longer generated)

## What Remains
- Available agents (Jarvis, Coder, Main) with workspace, purpose, model, session
- Session startup (bootstrap + read SOUL/USER)
- Memory pipeline (neurograph only, daily transcripts, breathe creates full-context.json + learnings)

## Rationale
Documentation should match actual system state, not historical features.