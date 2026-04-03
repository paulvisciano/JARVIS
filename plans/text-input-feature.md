# Text Input Feature Plan

**Created:** March 29, 2026  
**Priority:** High  
**Assigned To:** Coder (jarvis-coder)  
**Status:** Ready for implementation

---

## Overview

Add a text input field to the JARVIS UI so users can type messages directly (not just voice). This gives users an alternative interaction mode — some people prefer typing, especially for complex thoughts or when voice isn't practical.

**Key Principle:** Text input should follow the **same processing pipeline** as voice transcriptions. Both end up as messages in Jarvis's OpenClaw session.

---

## User Experience

### Current Behavior
- Click/tap orb → Orb animates
- Hold space bar → Records voice
- Release → Whisper transcribes → Transcript posted to Jarvis

### New Behavior
- **Click orb** → Orb animates + **text input field appears**
- **Type message** → Press Enter or click Send → Message posted to Jarvis
- **Hold space bar** → Still records voice (when input field is NOT focused)
- **Click outside input** → Input field hides

### Visual Design
```
┌─────────────────────────────────────┐
│           [ JARVIS ORB ]            │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ Type a message...       [→] │    │  ← Appears on orb click
│  └─────────────────────────────┘    │
│                                     │
│  [Hold SPACE to record voice]       │
└─────────────────────────────────────┘
```

**Input Field Specs:**
- Position: Below orb, centered
- Width: ~300-400px (responsive)
- Height: ~40px
- Style: Matches existing UI (dark theme, cyan/gold accents)
- Placeholder: "Type a message..."
- Send button: Arrow icon (→) or "Send" text
- Auto-focus: When revealed
- Escape key: Hides input field

---

## Technical Architecture

### Data Flow Comparison

**Voice (existing):**
```
Browser records audio → POST /api/upload → 
Whisper transcribes → Transcript saved to inbox → 
OpenClaw inbox monitor picks up → Jarvis session receives message
```

**Text (new):**
```
Browser: User types + sends → POST /api/message → 
OpenClaw gateway receives → Jarvis session receives message
```

**Key Point:** Both flows end with Jarvis receiving a message in their OpenClaw session. The only difference is the input method.

---

## Implementation Tasks

### Task 1: Server-Side Endpoint (`jarvis-server.js`)

**Add new endpoint:** `POST /api/message`

**What it does:**
1. Receives `{ message: "user's text" }`
2. Validates input (length, dangerous characters)
3. Posts message to OpenClaw gateway (same as voice transcription does)
4. Returns success/error response

**Reference Implementation:**
- Look at how voice transcription results are posted to OpenClaw
- Should use the same gateway URL + session targeting
- Probably reuses existing OpenClaw client code in the server

**Endpoint Spec:**
```javascript
POST /api/message
Content-Type: application/json
Body: { "message": "Hello Jarvis, how are you?" }

Response:
{
  "success": true,
  "timestamp": "2026-03-29T13:10:00.000Z"
}
```

**Error Handling:**
- 400: Invalid input (empty, too long, dangerous chars)
- 500: Gateway unreachable
- 503: OpenClaw not available

---

### Task 2: Client-Side UI (`index.html`)

**Add HTML element:**
```html
<div id="text-input-container" class="hidden">
  <input 
    type="text" 
    id="jarvis-text-input" 
    placeholder="Type a message..." 
    autocomplete="off"
  />
  <button id="jarvis-send-btn">
    <span>→</span>
  </button>
</div>
```

**CSS Requirements:**
- `.hidden` class: `display: none`
- Input container: centered, below orb
- Input field: dark background, cyan border, readable text
- Send button: gold accent, hover state
- Responsive: works on mobile + desktop

**Positioning:**
- Appears on orb click (toggle visibility)
- Disappears on Escape key or click outside

---

### Task 3: Client-Side Logic (`app.js`)

**New Functions:**

1. **`showTextInput()`**
   - Reveals input container
   - Focuses input field
   - Called on orb click

2. **`hideTextInput()`**
   - Hides input container
   - Clears input value
   - Called on Escape or click outside

3. **`sendTextMessage()`**
   - Reads input value
   - Validates (not empty, not too long)
   - POSTs to `/api/message`
   - Shows loading state while sending
   - Clears input on success
   - Shows error toast on failure
   - Hides input after send (optional — could stay open)

4. **`initTextInput()`**
   - Sets up event listeners:
     - Orb click → `showTextInput()`
     - Input Enter key → `sendTextMessage()`
     - Send button click → `sendTextMessage()`
     - Escape key → `hideTextInput()`
     - Click outside → `hideTextInput()`
   - Called during page initialization

**Space Bar Conflict Resolution:**
- Space bar recording should **only work when input is NOT focused**
- When input is focused: space bar types spaces (normal behavior)
- When input is hidden/not focused: space bar records voice (existing behavior)

**Implementation:**
```javascript
// In existing space bar handler:
const inputFocused = document.activeElement === textInput;
if (inputFocused) return; // Don't record when typing

// OR: Only listen for space bar when input is hidden
```

---

### Task 4: Testing Checklist

**Manual Testing:**
- [ ] Click orb → input appears + focused
- [ ] Type message + press Enter → message sends
- [ ] Type message + click Send button → message sends
- [ ] Press Escape → input hides
- [ ] Click outside input → input hides
- [ ] Hold space bar (input hidden) → voice recording starts
- [ ] Hold space bar (input focused) → types space character
- [ ] Send empty message → validation error
- [ ] Send very long message → validation error
- [ ] Network error → shows error message to user
- [ ] Success → input clears, shows confirmation

**Integration Testing:**
- [ ] Message appears in Jarvis's OpenClaw session
- [ ] Jarvis can reply (message shows in UI)
- [ ] Session history includes text messages
- [ ] No conflicts with voice recording flow

---

## Success Criteria

1. **Functional:**
   - Text input appears on orb click
   - Messages send to Jarvis successfully
   - Jarvis receives messages in OpenClaw session
   - Space bar recording still works (when input not focused)

2. **UX:**
   - Input feels responsive (no lag)
   - Clear visual feedback (loading, success, error)
   - Keyboard shortcuts work (Enter, Escape)
   - Mobile-friendly (touch targets, responsive)

3. **Architecture:**
   - Follows same pipeline as voice (message → gateway → Jarvis)
   - No hardcoded script execution
   - OpenClaw serves as runtime layer
   - Jarvis session tracks all interactions

---

## Task 5: TTS Audio Playback (Bonus)

**Problem:** Jarvis's TTS responses generate MP3 files, but webchat can't deliver them to the browser.

**Solution:** Add an audio player to the JARVIS UI that can play TTS responses.

**Implementation:**

### Server-Side (`jarvis-server.js`)
- Add endpoint: `GET /api/tts/:filename` — serves TTS audio files
- TTS files stored in a known directory (e.g., `CONFIG.ttsDir`)
- When Jarvis generates TTS, save to this directory + notify UI

### Client-Side (`index.html`)
- Add hidden audio element: `<audio id="jarvis-tts-player" style="display:none"></audio>`
- Or add visible player UI (play button, waveform visualization)

### Client-Side (`app.js`)
- Add function: `playTTS(filename)` — sets audio src + plays
- Add function: `stopTTS()` — stops playback
- Server can notify UI via SSE or poll for new TTS files
- Or UI can request TTS on-demand when Jarvis replies

**Alternative Simpler Approach:**
- Jarvis TTS saves file to known location
- Server returns TTS file path in API response
- Client plays it directly: `audio.src = '/api/tts/' + filename; audio.play()`

---

## Notes for Coder

**Priority Order:**
1. Server endpoint (`/api/message`) — foundation
2. Client UI (HTML + CSS) — visible progress
3. Client logic (send/focus/hide) — functionality
4. Space bar conflict resolution — polish
5. Error handling + loading states — robustness
6. TTS audio playback — bonus (if time permits)

**Code Style:**
- Match existing code style in `jarvis-server.js` + `app.js`
- Use existing CONFIG patterns for gateway URL
- Reuse existing validation utilities (`isValidInput()`)
- Add console logs for debugging: `[TextInput] Message sent`

**Don't:**
- Don't create a separate message pipeline — use the same one as voice
- Don't bypass OpenClaw — gateway must receive the message
- Don't break existing voice recording functionality

**Do:**
- Do add clear error messages for users
- Do test on mobile + desktop
- Do comment the code for future maintainability

---

## Questions?

If anything is unclear, ask Jarvis (me) for clarification. I'll coordinate with Paul on decisions.

**Estimated Effort:** 2-4 hours (depending on OpenClaw gateway integration complexity)

---

**Next Step:** Review this plan with Paul, then implement.
