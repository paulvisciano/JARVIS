# Context Extractor: Skip Transcript Duplication in Active Mode

**Date:** 2026-03-28
**Type:** insight
**Status:** extracted

## The Bug

Context spiked to 100% (483k+ tokens) when audio usage increased. Root cause: **transcript .txt files were being double-loaded**.

## The Architecture

- **Audio notes** → Jarvis UI → Archive (`~/RAW/archive/YYYY-MM-DD/audio/` + `sessions/`)
- **Text messages** → Gateway chat → Active sessions (`~/.openclaw/agents/jarvis/sessions/`)
- **Breathe pipeline** → Distills archive → `full-context.json` (~38KB)
- **Active context extractor** → Loads active sessions → Stdout → Bootstrap loads it

## The Problem

When audio is sent via gateway:
1. Audio is transcribed → stored in session messages ✅
2. Transcript .txt files also stored separately in archive ✅
3. Context extractor loaded BOTH → **double-loading the same content** ❌

Yesterday worked fine (text-only, ~38KB). Today exploded (audio + text, 232KB+) because 26 transcript files were loaded in addition to session messages.

## The Fix

**Active mode:** Load session messages ONLY, skip transcript .txt files (they're already embedded when audio was sent).

**Archive mode:** Load sessions + transcripts + learnings → `full-context.json` (for historical record).

## Additional Fix: Bootstrap Execution Rule

**Bootstrap runs ONCE per session at startup. Period.**

Running it manually multiple times doubles context (33% → 75%). It's session initialization, not a diagnostic tool.

## Commit

`18fb966 — 🧠 CONTEXT FIX: Skip transcript duplication in active mode`

## Lessons

1. Debugging context bloat by dumping full context into chat = ironic self-sabotage
2. Audio usage patterns affect context architecture (text-only vs audio+text)
3. Separation of concerns: archive mode (full history) vs active mode (session gap-bridging only)