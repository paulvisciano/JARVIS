# JARVIS Voice Interface — Production Implementation

**Based on learnings from:** `jarvis-voice-interface-architecture.md`

**Key insight:** Don't fight the gateway. Use what works:
- ✅ Gateway WebSocket for chat (proper protocol)
- ✅ Local `whisper` CLI for transcription
- ✅ macOS `say` for TTS (or browser speechSynthesis)
- ✅ File system for audio storage

---

## Architecture (What Actually Works)

```
┌──────────────────────────────────────────────────────────────┐
│                    JARVIS WEB UI                             │
│                                                              │
│  🎤 RECORD (Web Audio API)                                   │
│      ↓                                                       │
│  💾 SAVE (Download or gateway files.write)                   │
│      ↓                                                       │
│  📝 TRANSCRIBE (whisper CLI via exec)                        │
│      ↓                                                       │
│  🧠 SEND TO JARVIS (Gateway WebSocket)                       │
│      ↓                                                       │
│  💬 RECEIVE REPLY (Gateway event stream)                     │
│      ↓                                                       │
│  🗣️ SPEAK (speechSynthesis or macOS say)                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Working Prototype (Today)

**Goal:** Record → transcribe → reply → speak (all automated)

**Steps:**
1. Record audio in browser
2. Save to `~/RAW/inbox/` (auto-download or gateway file write)
3. File watcher detects new file
4. Runs `whisper` CLI
5. Sends transcript to Jarvis via gateway
6. Jarvis replies
7. TTS plays reply

**Tools:**
- Web Audio API (recording)
- `whisper` CLI (transcription)
- Gateway WebSocket (chat)
- Browser speechSynthesis (TTS)

### Phase 2: Polish (Next Session)

- Waveform visualizer
- Better TTS (ElevenLabs or macOS `say`)
- Auto-save without download
- Mobile responsive

---

## Files To Create

### 1. `voice-pipeline.sh` — Background Processor

```bash
#!/bin/bash
# Watch inbox, transcribe, send to Jarvis

INBOX="$HOME/RAW/inbox"
mkdir -p "$INBOX"

echo "🎙️ JARVIS Voice Pipeline running..."
echo "Drop audio files in: $INBOX"

while true; do
    for file in "$INBOX"/*.webm "$INBOX"/*.m4a "$INBOX"/*.wav; do
        [ -f "$file" ] || continue
        
        echo "📥 Processing: $(basename "$file")"
        
        # Transcribe
        transcript=$(whisper "$file" --model turbo --output_format txt 2>/dev/null | tail -1)
        
        if [ -n "$transcript" ]; then
            echo "📝 Transcript: $transcript"
            
            # Save transcript
            date_part=$(date +%Y-%m-%d)
            base=$(basename "$file" | sed 's/\.[^.]*$//')
            echo "$transcript" > "$HOME/RAW/$date_part/transcripts/$base.txt"
            
            # Send to Jarvis (via gateway or agent command)
            openclaw agent --message "Paul said (voice note): $transcript" --to-me
            
            # Move processed file
            mv "$file" "$file.processed"
        else
            echo "⚠️  Transcription failed for: $file"
        fi
    done
    sleep 2
done
```

### 2. Updated `app-v2.js` — Auto-Save + Trigger

Modify recording handler to:
- Auto-download with timestamped filename
- Show instruction to drop in inbox (for now)
- Or: use gateway `files.write` if available

### 3. `start-jarvis-voice.sh` — Launcher

```bash
#!/bin/bash
# Start both the web server and voice pipeline

cd /Users/paulvisciano/SCI-FI/apps/JARVIS

# Start pipeline in background
./voice-pipeline.sh &
PIPELINE_PID=$!

# Start web server
npx serve . -l 3000

# Cleanup on exit
trap "kill $PIPELINE_PID 2>/dev/null" EXIT
```

---

## Testing

1. Start pipeline: `./start-jarvis-voice.sh`
2. Open: `http://localhost:3000/voice-ui.html`
3. Click REC, speak, release
4. File downloads
5. Move to `~/RAW/inbox/`
6. Watch pipeline transcribe + send
7. Jarvis replies via TTS

---

## Next: Make It Truly Seamless

**Replace manual download+move with:**

### Option A: Gateway File Write

If gateway supports `files.write`:
```javascript
ws.send(JSON.stringify({
    type: 'req',
    method: 'files.write',
    params: {
        path: '/Users/paulvisciano/RAW/inbox/' + filename,
        content: base64Audio,
        encoding: 'base64'
    }
}));
```

### Option B: Local Server Upload

Run a tiny Node.js server alongside:
```javascript
const express = require('express');
const app = express();
app.post('/upload', (req, res) => {
    // Save audio to inbox
    // Trigger whisper
    // Send to gateway
});
app.listen(3001);
```

Browser uploads to `localhost:3001/upload` instead of downloading.

### Option C: Browser File System Access API

Use `showSaveFilePicker()` to save directly to inbox folder (Chrome/Edge only).

---

## Decision: Start With Option A (Gateway File Write)

**Check if gateway supports it:**

```bash
openclaw agent --help | grep -i file
# Or check gateway methods in protocol docs
```

If not, use Option B (local upload server) — easiest and most reliable.

---

**This is the blueprint. Build it.** 🧠
