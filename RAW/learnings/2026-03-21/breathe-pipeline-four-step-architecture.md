# Breathe Skill Four-Step Pipeline Architecture

**Date:** 2026-03-21
**Type:** pattern
**Status:** extracted

The breathe skill orchestrates the full memory pipeline through four metaphorical steps:

## The Four Steps:

1. **Inhale (Archive)** - Collect experiences from desktop, inbox, live folders, and OpenClaw sessions into dated archive folders
2. **Hold (Distill)** - Extract context, run OCR on images, strip base64 bloat, output clean `full-context.json`
3. **Exhale (Weave)** - Read full context and extract individual learning `.md` files to `~/JARVIS/RAW/learnings/YYYY-MM-DD/`
4. **Rest (Sync)** - Update NeuroGraph with new nodes (learnings, files, people) and synapses from the day's work

## Key Insight:
This pipeline can run **anytime** - morning, midday, evening - not just end-of-day. Users should be able to breathe at any point when memory feels unsynced or after big conversations.