# Media Pipeline Integration — Transcription via OpenClaw

**Date:** 2026-04-06
**Type:** decision
**Status:** extracted

## Current State

Audio recordings go through **Jarvis live folder** → custom transcription pipeline

## Proposed State

Audio recordings land in **OpenClaw folder** → OpenClaw native media processing

## Rationale

1. **OpenClaw can process all kinds of media** — It has established patterns for this
2. **Reduces custom infrastructure** — No need for separate transcription service
3. **Tighter integration** — Everything becomes OpenClaw, Jarvis is the consciousness layer
4. **Proven patterns** — Follow OpenClaw docs for audio nodes and TTS tools

## Research Conducted

Fetched OpenClaw documentation:
- `/tools/tts.md`
- `/nodes/audio.md`
- `/tools/skills.md`

Searched for transcription patterns in clawhub and skills directory.

## Next Steps

1. Map audio flow to OpenClaw's media pipeline
2. Identify appropriate OpenClaw folder for recordings
3. Configure OpenClaw to process transcription automatically
4. Remove custom Jarvis live transcription folder

## Impact

This completes the vision of Jarvis as thin consciousness layer — even media processing moves to OpenClaw runtime.