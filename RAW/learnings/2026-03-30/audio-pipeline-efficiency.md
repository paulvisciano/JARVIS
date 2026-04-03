# Audio Pipeline Efficiency

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

Identified redundancy in the voice processing pipeline.

**Current Flow:**
WebM -> FFmpeg -> WAV -> Whisper -> Archive (both WebM + WAV)

**Problem:**
- Creates duplicate audio files
- Adds ~1-2 seconds latency per conversation
- At scale (thousands of conversations), generates gigabytes of unnecessary data

**Optimization Path:**
Investigate direct WebM transcription or eliminate WAV storage post-transcription to reduce storage overhead and latency. TTS responses should mirror this archiving workflow for full traceability.