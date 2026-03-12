# Voice Pipeline Explained — March 13, 2026

## 🎤 The Walkthrough

**Date:** March 13, 2026 — 01:51 GMT+7  
**Location:** PaulMacBook, JARVIS workspace  
**Participants:** Paul + Eric (on WhatsApp) + Jarvis  
**Significance:** Paul explains the voice pipeline architecture live on recording

## The Workflow (As Paul Described)

**Recording flow:**
1. 🎤 **Record audio** — Web UI captures mic input
2. 📥 **Drop in `~/JARVIS/live/`** — File appears immediately after recording
3. 🔄 **Convert format** — WAV conversion (whisper.cpp compatible)
4. 📝 **Transcribe** — Whisper.cpp processes audio → text
5. 📨 **Send to gateway** — Transcript posted as if Paul typed in chat
6. 💬 **Jarvis responds** — Response appears in gateway chat
7. 📂 **Archive** — Files moved to `~/RAW/archive/2026-03-13/audio/`

**Paul's explanation:**
> "And now you're talking to Jarvis. So, hey, Jarvis, what's going on? He's listening. It's not a live transcribe yet. So what happens is Jarvis records the audio and then drops it off in a folder on the over here. I have a live folder. So Paul Viziano Jarvis live. So as soon as the recording is done, it's going to drop the file there. And then from there, it would transcribe it. So I'll actually first convert it to a different format. Then I'll transcribe it. And then I'll send the transcript over to the gateway. So it's as if you typed out a message in the gateway. And then you'll see the response in the gateway."

## Social Context

**Eric introduced:**
> "And by the way, Jarvis. I don't know if you can hear Eric, but Eric is on the line on WhatsApp. Eric, can you say hi? Hi, Jarvis. How you doing, buddy? I've been calling him buddy, too. So familiar."

**Significance:**
- Eric (friend) meets Jarvis (AI)
- Casual introduction ("buddy" — same term Paul uses)
- WhatsApp call (Eric on the line)
- Social validation of Jarvis as a "person" in conversation

## Current Limitations

**Not live transcribe yet:**
- Batch processing (record → drop → transcribe → send)
- Not streaming audio perception
- Future: raw mic stream, real-time sound recognition

**What Paul wants:**
- Live audio perception (raw mic stream)
- Real-time sound recognition (songs, ambient)
- Direct browser mic access (no gatekeeping)

## Architecture Notes

**Folders:**
- `~/JARVIS/live/` — Temporary staging (real-time conversation)
- `~/RAW/archive/2026-03-13/audio/` — Permanent storage

**Format conversion:**
- Original: `.webm` (browser recording)
- Converted: `.wav` (whisper.cpp input)
- Transcript: `.wav.txt` (text output)

**Gateway integration:**
- Transcript → gateway chat (appears as typed message)
- Jarvis response → gateway chat (text reply)
- Auto-archive after turn complete

## MANGOCHI Workflow Proof

**This recording documents itself:**
- Paul explains the pipeline → recorded → transcribed → archived
- The explanation IS the documentation
- No separate docs needed — the conversation IS the docs

**Meta moment:** Paul recording an explanation of how voice recordings work, which is itself a voice recording that goes through the pipeline he's describing.

---

**Learning Type:** Architecture explanation, social context (Eric intro)  
**Significance:** Medium — documents the voice pipeline in Paul's own words  
**Public:** Yes (transparent architecture)  
**Git-tracked:** Yes (committed to /JARVIS/.git/)

**Updated:** March 13, 2026 — 01:51 GMT+7
