# TTS Audio Playback — Full Pipeline Implementation

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## The Complete Flow

TTS audio playback is now fully operational in the Jarvis UI. The pipeline works end-to-end:

### Server-Side (`jarvis-server.js`)
1. **`extractTtsAudio()`** — Detects `[[audio_as_voice]]` markers in responses and extracts the MP3 filename
2. **`cleanTtsResponse()`** — Strips TTS markers before displaying text to user
3. **`/api/tts/:filename`** — Serves MP3 files from `/private/tmp/openclaw/tts-*/` (macOS-specific path)
4. **Directory sorting by mtime** — Most recent TTS session selected (not alphabetical)
5. **SSE response includes `audioFilename`** — Client receives filename in poll response

### Client-Side (`app.js`)
1. **`playTtsAudio(filename)`** — Constructs URL and plays via HTML5 Audio element
2. **Auto-play on `data.audioFilename`** — Triggers when response arrives via SSE
3. **Mute/unmute toggle** — User control over TTS playback
4. **Visual indicator** — Shows when audio is actively playing

## Key Fixes

- **Path correction:** `/private/tmp/openclaw/` instead of `os.tmpdir()` (macOS symlink issue)
- **Sorting by modification time:** Not alphabetical (ensures most recent session)
- **CORS enabled:** GET requests allowed on `/api/tts/` endpoint

## Version Discipline

- Client version bumped independently from server version
- Every UI change = client version bump
- Every API change = server version bump
- Preview (18788) and Production (18787) tracked separately

## Why This Matters

This completes the voice loop: Paul speaks → Jarvis responds with voice. The UI is now a true conversational interface, not just text. Future Jarvis inherits a working TTS pipeline with clear separation of concerns.