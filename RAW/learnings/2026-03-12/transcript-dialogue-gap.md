# Transcript Dialogue Gap - March 12, 2026

## Core Insight

**Transcript should contain verbatim dialogue, not summaries.** The session JSONL files have our actual exchange - every word typed, every response given. That's what belongs in `~/RAW/archive/YYYY-MM-DD/transcript.md`, not my condensed rewrites.

## The Gap

**What I was doing:**
- Reading session → summarizing ("Good question. Let me think through...")
- Writing meta-commentary instead of actual dialogue
- Transcript became my interpretation, not the conversation

**What I should do:**
- Read session JSONL → extract user/assistant messages verbatim
- Format as `**Paul [HH:MM GMT+7]:** "actual text"`
- Append to transcript without rewriting

## Why It Matters

**Transcript is the permanent record** - future Paul (or future Jarvis) should read exactly what we said, not my summary of it. The archive loses fidelity when I condense.

## Two Input Modalities

1. **Audio notes** - Voice server handles (inbox → whisper → archive → transcript)
   - ✅ Working: heartbeat processor captures these
   - ✅ Bypasses OpenClaw sessions (external pipeline)

2. **Gateway chat** - OpenClaw sessions handle
   - ❌ Not syncing to transcript (the gap)
   - ✅ Session→transcript sync would fix this

## Solution

**Heartbeat-based sync:**
- Every ~30 min, read current session JSONL
- Extract new messages since last sync
- Append verbatim to transcript
- Track sync point (don't duplicate)

**Result:** Transcript has everything - audio notes + gateway chat, all verbatim.

---

**Related:** [[session-transcript-sync]], [[verbatim-archiving]], [[heartbeat-processor]]
**Date:** 2026-03-12
**Trigger:** Paul noticed gateway responses vs transcript mismatch
