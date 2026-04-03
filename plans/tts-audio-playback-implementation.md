# TTS Audio Playback Implementation Plan

## Overview
This plan implements automatic TTS audio playback in the Jarvis UI when Jarvis generates voice responses.

## Architecture

### TTS Audio Flow
1. Jarvis agent generates response with TTS audio marker
2. Server detects TTS audio filename from response
3. Audio file is served via `/api/tts/:filename` endpoint
4. UI detects audio filename in poll response
5. UI automatically plays audio and shows visual indicator

## Changes Made

### Server-Side (jarvis-server.js)

#### 1. Added Helper Functions (lines ~30-70)
```javascript
function extractTtsAudio(responseText) {
  // Extracts audio filename from [[audio_as_voice]] marker with MEDIA: path
}

function cleanTtsResponse(responseText) {
  // Removes TTS markers from response for display
}
```

#### 2. Updated CORS Configuration (lines ~27-40)
- Added GET method to allowed methods
- Added CORS preflight support
- Enabled Range headers for audio streaming

#### 3. Updated `/api/process-inbox` Endpoint (lines ~1085-1140)
- Extract TTS audio filename from agent response
- Store audio filename in poll response
- Clean response text for display

#### 4. Updated `/transcript/latest` Endpoint (lines ~1350-1390)
- Extract and include audio filename in poll response
- Clean response text before sending to UI

#### 5. Updated pendingResponses Map (lines ~1600-1615)
- Store audio filename alongside response
- Include audio filename in poll responses

### Client-Side (app.js)

#### 1. Added TTS Audio Player Functions (lines ~430-520)
```javascript
function initTtsPlayer() {
  // Initialize audio player element
}

function playTtsAudio(filename) {
  // Play TTS audio from filename
}

function toggleTtsMute() {
  // Toggle mute/unmute for TTS audio
}

function showAudioPlayingIndicator() {
  // Show visual indicator during playback
}
```

#### 2. Updated pollForTranscript() (lines ~515-575)
- Call `playTtsAudio()` when audio filename is present
- Handle both main response and edge case responses

#### 3. Added UI Setup Functions (lines ~780-800)
- Setup TTS toggle button
- Update mute status display

### UI Changes (index.html)

#### 1. Audio Player Element (line ~2114)
```html
<audio id="jarvis-tts-player" style="display: none;" preload="auto" playsinline></audio>
```

#### 2. TTS Toggle Controls (line ~1944)
```html
<div class="tts-controls">
    <span id="tts-status">🔊 TTS: ON</span>
    <button id="tts-toggle">Toggle</button>
</div>
```

#### 3. CSS Styling
- Added styles for TTS controls
- Added animation for playing indicator

## Testing Checklist

### Server Tests
- [ ] TTS endpoint serves audio files correctly
- [ ] CORS headers allow localhost access
- [ ] Audio filename extracted from response
- [ ] Audio filename included in poll response

### Client Tests
- [ ] Audio player initializes correctly
- [ ] Audio plays automatically when available
- [ ] Mute/unmute toggle works
- [ ] Visual indicator shows during playback
- [ ] No console errors

### Browser Compatibility
- [ ] Chrome
- [ ] Brave
- [ ] Safari

## Success Criteria
1. Jarvis sends message with TTS audio marker → audio plays automatically
2. User can mute/unmute TTS audio via toggle button
3. Visual indicator shows when audio is playing
4. No console errors in developer tools
5. Works on Chrome/Brave/Safari

## Future Enhancements
1. Audio waveform visualization during playback
2. Volume control
3. Playback speed controls
4. Download audio option
5. Audio history/log of played clips
