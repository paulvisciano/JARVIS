# TTS Streaming Endpoint Discovery

**Date:** 2026-04-15
**Type:** insight
**Status:** extracted

## The Discovery

Voicebox TTS API at `127.0.0.1:17493` has an undocumented streaming endpoint:

- **Batch endpoint:** `/generate` — 4+ minutes, saves to disk, then plays
- **Streaming endpoint:** `/generate/stream` — 1-2 seconds, pipes directly to ffplay

## Implementation

Updated speak-tool plugin to:
1. Check text length (≤500 chars → streaming, >500 chars → batch)
2. Use `/generate/stream` for short messages
3. Pipe audio directly to ffplay stdin (no disk I/O)

## Results

| Mode | Latency | Disk I/O | Use Case |
|------|---------|----------|----------|
| Batch | 4+ min | Yes | Long messages |
| Stream | 1-2 sec | No | Conversational |

## Key Insight

Always check API documentation endpoints (`/docs`) before assuming batch-only. Streaming endpoints often exist but aren't advertised in main docs. The 240x latency improvement transforms UX from "wait for response" to "conversational flow."