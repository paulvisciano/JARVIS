# Browser Autoplay Policy — TTS Audio Requires User Interaction

**Date:** 2026-03-31
**Type:** insight
**Status:** extracted

## The Problem

Modern browsers block **automatic audio playback** without user interaction. This affects TTS (text-to-speech) responses:

- Audio file generates successfully ✅
- Server serves the MP3 correctly ✅
- Manual playback works ✅
- **Auto-play fails** ❌ (blocked by browser policy)

## Why This Happens

Browsers require a **user gesture** (click, keypress, touch) before allowing audio to play automatically. This prevents unwanted noise from websites.

## Solution Pattern

```javascript
async function playTtsAudio(filename) {
  const audio = document.getElementById('jarvis-tts-player');
  audio.src = `/api/tts/${filename}`;
  
  try {
    await audio.play();
    showAudioPlayingIndicator();
  } catch (error) {
    // Autoplay blocked
    showClickToPlayIndicator();
    console.log('Autoplay blocked - user must click to play');
  }
}
```

## User Experience

1. **Attempt autoplay** when response arrives
2. **If blocked:** Show "Click to play" indicator (not "Playing")
3. **User clicks:** Audio plays immediately
4. **Never show "Playing"** until audio actually starts

## Key Principle

**Graceful degradation.** Assume autoplay will fail. Design the UX to handle both success and failure without confusing the user.