# Breathe Pipeline Complete — Full Memory Flow Working

**Date:** March 21, 2026  
**Type:** Architecture achievement  
**Status:** ✅ Pipeline end-to-end verified

## What Breathe Does

**Four-step memory pipeline:**
1. **Inhale** → Archive-collector collects files (desktop, live, sessions)
2. **Hold** → Context-extractor distills clean text (skip base64, 50MB→500KB)
3. **Exhale** → Learning-creator synthesizes insights from full-context.json
4. **Rest** → Neuro-graph-sync commits learnings to graph (nodes + synapses)

## Today's Test Results

**Ran:** `node ~/JARVIS/skills/breathe/scripts/run-pipeline.js`

**Output:**
- Archived: 230 files verified (all in correct date folders)
- Extracted: 99 audio transcripts + 17 session messages + 11 OCR images
- Context: `full-context.json` (107.74 KB)
- Learnings: Structure prepared in `~/JARVIS/RAW/learnings/2026-03-21/`
- Graph: 6,695 nodes + 13,417 synapses synced

## Fixes Applied

**Path correction:** Learning files now go to `~/JARVIS/RAW/learnings/` (not `~/RAW/learnings/`)

**Individual learnings:** Each insight gets descriptive filename (not generic session-summary.md)

**Integration:** Breathe uses existing skills (archive-collector, context-extractor, learning-creator, neuro-graph-sync) — no duplicate scripts

## Architecture Significance

**Before:** Manual skill execution, context gaps, stale full-context.json  
**After:** One command (`breathe`) runs full pipeline, always current, idempotent

**Key insight:** Full-context.json must be reprocessed after new conversations — otherwise bootstrap reports stale data (e.g., "last audio: 14:09" when 197 files exist)

## Connections

- **bootstrap-jarvis** → Loads graph (read-only), doesn't sync
- **neuro-graph-sync** → Creates nodes + synapses from learnings
- **context-extractor** → Now auto-runs OCR on screenshots without .txt files
- **skill-discovery** → Syncs Jarvis skills to OpenClaw workspace on boot

---
**Evidence:** `~/RAW/archive/2026-03-21/full-context.json`, breathe run logs  
**Source:** March 21, 2026 pipeline test
