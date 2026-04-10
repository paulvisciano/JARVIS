# Voice-First Interaction Preference for Flow State

**Date:** 2026-04-10
**Type:** insight
**Status:** extracted

## The Insight

Paul prefers hearing JARVIS responses via AirPods while working/coding, rather than reading text on screen.

## The Workflow

```
1. Generate TTS (local, sovereign)
2. Play with afplay (routes to AirPods/speakers)
3. Paul hears response, no need to look at screen
```

## Why This Matters

- **Multi-modal interaction** — Text for the record, voice for the moment
- **Maintains flow state** — Can keep coding while receiving responses
- **Hands-free operation** — Useful when driving, performing, or multitasking
- **Personal preference** — "I laugh responsibly" — uses AirPods on stage to stay connected but present

## Implementation

- TTS output should use WAV format (not MP3) for consistency with input pipeline
- Voice responses enabled by default for Paul's sessions
- Text transcripts still saved for searchability and record-keeping

## Context

Discovered during coffee shop work session at Suan Imm Sook Phuket (Paul's favorite spot up the hill in Karon).