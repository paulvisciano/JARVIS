# Graph Integrity Requires Full Archive Sync

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Problem:

NeuroGraph was only showing temporal node for 21st, one learning (session summary), and Bruce person node. Should have way more nodes based on the sync that ran.

## What Was Missing:

**March 20 learnings (4):**
- bootstrap-sequence-working.md
- bruce-amsterdam-cafe-owner-profile.md
- david-sovereignty-launch.md
- natural-language-skill-execution.md

**Archive files (564 total):**
- March 20: 306 files (conversations, audio, transcripts)
- March 21: 258 files (conversations, audio, transcripts, images)

## The Fix:

Updated neuro-graph-sync to include:
1. Create learning nodes from `.md` files
2. Create archive nodes from ALL files (audio, transcripts, images, sessions, OCR)
3. Run `set-archive-creation-dates.js` for archive file nodes

## Result:

Full sync creates complete graph integrity with all source material represented.