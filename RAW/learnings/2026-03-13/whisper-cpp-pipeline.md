# whisper-cpp Transcription Pipeline

**Date:** 2026-03-13  
**Type:** Infrastructure  
**Related Neurons:** `whisper-cpp-performance`, `transcriber-agent-architecture`, `local-ai-future`

---

## What Changed

Switched from PyTorch whisper (OpenAI) to whisper-cpp (local, sovereign).

**Before:**
- `openai-whisper` (PyTorch version)
- `large-v3.pt` (1.4GB) in `~/.cache/whisper/`
- PyTorch dependencies (~2.5GB total)

**After:**
- `whisper-cpp` 1.8.3 (Homebrew)
- `ggml-large-v3.bin` (2.9GB) in `/Users/paulvisciano/SCI-FI/apps/JARVIS/`
- No PyTorch, no API calls

---

## Command

```bash
/opt/homebrew/bin/whisper-cli \
  -m /Users/paulvisciano/SCI-FI/apps/JARVIS/ggml-large-v3.bin \
  -otxt <audio-file>
```

**Output:** `.wav.txt` files alongside audio

---

## Benefits

- **Fully local** — no API keys, no cloud
- **High accuracy** — large-v3 model (not turbo)
- **Smaller deps** — freed ~2.5GB PyTorch bloat
- **Sovereign** — runs on your hardware, your data

---

## Integration

- `voice-pipeline-server.js` auto-detects `whisper-cli`
- Uses `ggml-large-v3.bin` by default
- Wrapper script: `/Users/paulvisciano/SCI-FI/apps/JARVIS/whisper-transcribe.sh`

---

## Future: Sovereign Audio Analysis

Vision: Local emotion detection, tone analysis, music ID from audio.

**Not Shazam** — build sovereign models for:
- Speaker count
- Tone/emotion detection
- Music identification
- Background noise analysis

All local, no third-party APIs.

---

**Neurons added:** 2 (whisper-cpp-pipeline, sovereign-audio-analysis-vision)  
**Synapses fired:** 6
