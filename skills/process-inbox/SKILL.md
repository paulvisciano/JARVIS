---
name: process-inbox
description: Process inbox audio files (WebM, WAV, etc.) → transcribe with whisper → archive to ~/RAW/archive/YYYY-MM-DD/audio/. Use when: (1) inbox has pending audio, (2) user sends offline recording, (3) batch transcribe needed. Supports all whisper formats (flac, mp3, ogg, wav, webm).
metadata:
  openclaw:
    emoji: "📬"
    requires:
      bins: ["ffmpeg", "whisper-cli"]
---

# Process Inbox (Audio → Transcribe → Archive)

## When to Use

✅ **USE this skill when:**
- Inbox has pending audio files (`.webm`, `.wav`, `.mp3`, etc.)
- User sends offline recording (drop in `~/JARVIS/inbox/`)
- Batch transcribe needed (multiple inbox files)
- Server `/api/process-inbox` endpoint fails (use skill as fallback)

## When NOT to Use

❌ **DON'T use this skill when:**
- Inbox empty → skip (nothing to process)
- Live recording (handled by JARVIS server auto-flow)
- Non-audio files in inbox (images, docs → different skill)

## Workflow

```
1. Scan inbox: ls ~/JARVIS/inbox/
2. For each audio file:
   a. Convert to WAV (if WebM/MP3/OGG): ffmpeg → 16kHz mono PCM
   b. Transcribe: whisper-cli -m ggml-large-v3.bin -f file.wav -otxt
   c. Archive: move .wav + .wav.txt to ~/RAW/archive/YYYY-MM-DD/audio/
   d. Clean inbox: remove original file
3. Return: { processed: N, transcriptions: [...] }
```

## Commands

### Scan Inbox
```bash
ls -lh ~/JARVIS/inbox/ | grep -v ".DS_Store"
```

### Convert WebM → WAV (whisper needs WAV)
```bash
ffmpeg -i ~/JARVIS/inbox/recording.webm \
       -ar 16000 -ac 1 -c:a pcm_s16le \
       ~/JARVIS/live/recording.wav -y
```

### Transcribe with Whisper
```bash
/opt/homebrew/opt/whisper-cpp/libexec/bin/whisper-cli \
  -m ~/SCI-FI/apps/JARVIS/assets/ggml-large-v3.bin \
  -f ~/JARVIS/live/recording.wav \
  -otxt
```

### Archive
```bash
mkdir -p ~/RAW/archive/$(date +%Y-%m-%d)/audio/
mv ~/JARVIS/live/recording.wav ~/RAW/archive/$(date +%Y-%m-%d)/audio/
mv ~/JARVIS/live/recording.wav.txt ~/RAW/archive/$(date +%Y-%m-%d)/audio/
```

### Clean Inbox
```bash
rm ~/JARVIS/inbox/recording.webm
```

## Supported Formats

| Format | Convert? | Whisper Support |
|--------|----------|-----------------|
| `.wav` | No (native) | ✅ Yes |
| `.webm` | Yes (ffmpeg) | ✅ Yes (after convert) |
| `.mp3` | Yes (ffmpeg) | ✅ Yes (after convert) |
| `.ogg` | Yes (ffmpeg) | ✅ Yes (after convert) |
| `.flac` | Yes (ffmpeg) | ✅ Yes (after convert) |
| `.m4a` | Yes (ffmpeg) | ✅ Yes (after convert) |

## Context Awareness

**Archive location:**
```
~/RAW/archive/YYYY-MM-DD/audio/
├── recording-YYYYMMDD-HHMMSS.wav
└── recording-YYYYMMDD-HHMMSS.wav.txt
```

**Transcript format:**
```
[00:00:00.000 --> 00:00:08.760]   Okay, now to make it even cleaner...
[00:00:08.760 --> 00:00:14.100]   fade and if you hover on the Jarvis title...
```

## Error Handling

**If whisper fails:**
- Check file exists: `test -f file.wav`
- Check model exists: `test -f ggml-large-v3.bin`
- Check whisper-cli: `which whisper-cli`

**If ffmpeg fails:**
- Check input exists: `test -f recording.webm`
- Check ffmpeg: `which ffmpeg`

**If archive fails:**
- Create dir: `mkdir -p ~/RAW/archive/YYYY-MM-DD/audio/`
- Check permissions: `ls -ld ~/RAW/archive/`

## Notes

- Always convert to 16kHz mono WAV (whisper requirement)
- Archive both `.wav` + `.wav.txt` (audio + transcript)
- Remove original from inbox after archiving
- Use today's date for archive folder (`date +%Y-%m-%d`)
- Whisper model: `ggml-large-v3.bin` (in `~/SCI-FI/apps/JARVIS/assets/`)
- Whisper CLI: `/opt/homebrew/opt/whisper-cpp/libexec/bin/whisper-cli`
