# Whisper CLI Defaults to English Without --language auto

**Date:** 2026-04-01
**Type:** insight
**Status:** extracted

## The Problem

Whisper CLI transcription was only capturing English audio, missing Burmese speech entirely. Paul and Anna were both speaking, but only Paul's English was transcribed.

## Root Cause

```javascript
// ❌ Before - English only
execFile(CONFIG.whisperCli, ['-m', modelPath, '-otxt', audioPath], ...)

// ✅ After - Multilingual auto-detect
execFile(CONFIG.whisperCli, ['-m', modelPath, '-otxt', audioPath, '--language', 'auto'], ...)
```

Without `--language auto`, Whisper defaults to English-only mode.

## Result

- Burmese (Anna) + English (Paul) both transcribed in same recording
- Language detection happens automatically
- No need to specify language beforehand

## Lesson

Always use `--language auto` for Whisper CLI when multiple languages may be present in audio. This is a one-line fix that enables true multilingual transcription.