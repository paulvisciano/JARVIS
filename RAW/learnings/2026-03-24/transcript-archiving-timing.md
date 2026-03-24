# Wait for Transcription Completion Before Archiving

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

## Current Behavior
UI returns immediately and polls for transcript latest. Archives file prematurely before transcription completes.

## Better Approach
Wait on UI transcription (shouldn't take that long). Once transcription is done, then archive the file.

## Benefit
- No premature archiving of incomplete transcripts
- Cleaner data pipeline
- User gets complete transcript before file moves to archive

## Implementation
Coder should fix UI to wait for transcription completion signal before triggering archive.