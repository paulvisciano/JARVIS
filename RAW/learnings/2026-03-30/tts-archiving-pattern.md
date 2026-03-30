# TTS Archiving Pattern — Mirror Voice Workflow for Responses

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## The Pattern

TTS (text-to-speech) responses should follow the **same archiving workflow** as voice recordings for full traceability:

### Voice Input Pipeline (Established)
```
User records → live/recording.webm
     ↓
FFmpeg converts → live/recording.wav (16kHz, mono)
     ↓
Whisper transcribes → live/recording.wav.txt
     ↓
archiveRecording() moves to archive with timestamp
```

### TTS Output Pipeline (To Implement)
```
Jarvis generates response text
     ↓
TTS engine creates → /tmp/openclaw/tts-<session-id>/audio.mp3
     ↓
archiveTTS() moves to archive with timestamp
     ↓
Stored alongside conversation transcript
```

## Why This Matters

1. **Traceability** — Every interaction (input AND output) is archived
2. **Debugging** — Can replay exactly what was said/hear on any date
3. **Symmetry** — Input/output pipelines mirror each other
4. **Audit Trail** — Complete conversation history including audio responses

## Implementation Notes

- TTS files live in `/tmp/openclaw/tts-<session-id>/` temporarily
- Server endpoint `/api/tts/:filename` serves audio (with directory traversal protection)
- Archive step should happen AFTER agent completes, similar to voice recordings
- No WAV conversion needed for TTS (already MP3)

## Related

- `audio-pipeline-efficiency.md` — covers input side optimization
- This extends the pattern to output/responses