# Breathe Pipeline Complete - Full Memory Flow Working

**Date:** 2026-03-21
**Type:** insight
**Status:** extracted

## The Full Memory Pipeline

The `breathe` skill orchestrates the complete memory pipeline in one natural command:

### 4-Step Flow (Meditation Analogy)
1. **Inhale (Archive)** - Collect experiences from desktop, inbox, live folders, OpenClaw sessions
2. **Hold (Distill)** - Extract context, run OCR on images, create full-context.json
3. **Exhale (Weave)** - Read full context, extract individual learning .md files to ~/JARVIS/RAW/learnings/
4. **Rest (Sync)** - Update neurograph with learning nodes + archive file nodes

### Test Results
- 230 files archived
- 107.74 KB clean context extracted
- 6,695 neurons + 13,417 synapses synced
- Individual learning files created (not generic session-summary.md)

### Key Fix
Learning files now output to correct location: `~/JARVIS/RAW/learnings/YYYY-MM-DD/` (not `~/RAW/learnings/`)