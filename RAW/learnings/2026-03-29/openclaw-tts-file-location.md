# OpenClaw TTS File Storage Location

**Date:** 2026-03-29
**Type:** insight
**Status:** extracted

## TTS File Path Format

OpenClaw stores TTS audio files in:

```
/tmp/openclaw/tts-<session-id>/voice-<timestamp>.mp3
```

## Example

```
/tmp/openclaw/tts-mKBwW7/voice-1774766971475.mp3
```

## Server Endpoint Pattern

To serve TTS files, the server must:

1. Look in `/tmp/openclaw/` for TTS directories
2. Find the latest `tts-*` directory
3. Serve the most recent `voice-*.mp3` file

```javascript
app.get('/api/tts/latest', (req, res) => {
  const ttsDir = '/tmp/openclaw/';
  // Find latest tts-* directory
  // Serve latest voice-*.mp3
});
```

## Lesson

TTS files are NOT stored in the live directory or CONFIG paths. They're in `/tmp/openclaw/` with session-based subdirectories. Server endpoints must know this location to serve audio correctly.