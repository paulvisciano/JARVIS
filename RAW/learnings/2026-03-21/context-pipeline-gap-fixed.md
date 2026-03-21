# Context Pipeline Gap Fixed — Full-Context.json Auto-Update

**Date:** March 21, 2026  
**Type:** Bug fix + pipeline enhancement  
**Status:** ✅ Gap closed via breathe skill

## The Problem

**Symptom:** Bootstrap reported "last audio: 14:09" but audio folder had 197 files including 16:11, 16:10, 16:09, etc.

**Root cause:** `full-context.json` not auto-updating with new conversations. Files recorded but not digested.

**Gap:** New audio files in `~/RAW/archive/2026-03-21/audio/` (197 entries) but `full-context.json` had 0 audio entries.

## The Fix

**Solution:** Run breathe skill (manual trigger) to reprocess full context:
```bash
cd ~/JARVIS && node skills/breathe/scripts/run-pipeline.js
```

**Result:** full-context.json now has 99 transcripts + 17 messages + 11 OCR images (107.74 KB)

## Enhancement: Context-Extractor Auto-OCR

**Updated:** `context-extractor/scripts/extract-context.js` now auto-runs OCR on screenshots without .txt files

**New function:** `extractOCR()` scans images folder, runs tesseract, saves .txt alongside images, includes OCR text in full-context.json

**Size comparison:** March 20 context was 336.99 KB without OCR → 434.63 KB with OCR (86 images newly extracted)

## Full Context Now Includes

- Session messages (JSONL, text only, skip base64)
- Audio transcripts (.txt files)
- **OCR text from screenshots** (visual context)

**Example:** Bruce's conversation captured 3 ways:
1. Audio transcript (March 20, 10:01 PM)
2. OCR from 2 screenshots (what displayed on screen)
3. Learning file (bruce-amsterdam-cafe-owner-profile.md)

## Future: Auto-Digest

**Options:**
1. Manual breathe (current) — intentional moments
2. Auto-trigger on cron/heartbeat — always current
3. Hybrid — breathe for full pipeline, context-extractor for quick catch-up

---
**Evidence:** full-context.json before/after, OCR extraction logs  
**Source:** March 21, 2026 context gap investigation
