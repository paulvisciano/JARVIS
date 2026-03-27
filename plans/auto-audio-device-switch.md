# Task: Auto Audio Device Switching + Mic Status UI

**Date:** 2026-03-27
**Complexity:** 🟡 Medium (browser audio API, device detection, UI updates)
**Expected Time:** 45-90 minutes

---

## Vision

**"Plug in AirPods → Jarvis automatically uses them. No manual switching."**

Currently:
1. Connect AirPods
2. Browser still uses laptop mic
3. User must: Settings → Privacy → Microphone → Reset permissions → Refresh → Select AirPods
4. **Non-techies will never figure this out**

**Goal:**
- Auto-detect when new audio devices connect
- Automatically switch to the new device (or prompt user)
- Show current mic status in UI (near recording button)
- Make it seamless, like native apps (Zoom, Slack, etc.)

---

## Requirements

### 1. **Audio Device Detection (Backend)**

**Node.js + Web Audio API:**

**Option A: Poll-based detection (simple, reliable)**
```javascript
// Check every 5 seconds for new audio devices
async function detectAudioDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const audioInputs = devices.filter(d => d.kind === 'audioinput');
  
  // Compare with cached list
  if (audioInputs.length !== cachedDevices.length) {
    // Device added/removed
    emit('audio-device-change', { 
      type: 'added' | 'removed',
      device: audioInputs[audioInputs.length - 1],
      allDevices: audioInputs
    });
  }
  
  cachedDevices = audioInputs;
}

setInterval(detectAudioDevices, 5000);
```

**Option B: Event-based detection (cleaner, but browser support varies)**
```javascript
navigator.mediaDevices.ondevicechange = () => {
  // Device connected/disconnected
  detectAudioDevices();
};
```

**Backend endpoint (jarvis-server.js):**
```javascript
// GET /api/audio/devices
{
  "devices": [
    { "deviceId": "default", "label": "Default", "kind": "audioinput" },
    { "deviceId": "airpods-xxx", "label": "Paul's AirPods", "kind": "audioinput" },
    { "deviceId": "macbook-mic", "label": "MacBook Pro Microphone", "kind": "audioinput" }
  ],
  "currentDevice": "airpods-xxx",
  "lastChanged": "2026-03-27T17:52:00Z"
}
```

---

### 2. **Auto-Switch Logic**

**When a new audio device is detected:**

**Option A: Auto-switch (aggressive, seamless)**
```javascript
// If new device is Bluetooth (likely AirPods/headset), switch immediately
if (device.label.includes('AirPods') || device.label.includes('Bluetooth')) {
  await switchAudioDevice(device.deviceId);
  showNotification('Switched to ' + device.label);
}
```

**Option B: Prompt user (safer, more control)**
```javascript
// Show toast notification: "New microphone detected: Paul's AirPods. Switch?"
// [Yes] [No] [Always switch to this device]
```

**Recommended: Hybrid**
- **Bluetooth devices** → Auto-switch (they're almost always intentional)
- **Unknown devices** → Prompt user
- **Remember preference** → Store in localStorage: `{ preferredDevice: "airpods-xxx" }`

---

### 3. **Audio Device Switching (Web Audio API)**

**Update media stream constraints:**
```javascript
async function switchAudioDevice(deviceId) {
  // Stop current stream
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  
  // Get new stream with selected device
  const constraints = {
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  };
  
  const newStream = await navigator.mediaDevices.getUserMedia(constraints);
  currentStream = newStream;
  
  // Update recorder with new stream
  mediaRecorder = new MediaRecorder(newStream);
  
  // Emit event for UI update
  emit('audio-device-switched', { deviceId, label: /* device label */ });
  
  return { success: true, deviceId };
}
```

**Persist preference:**
```javascript
localStorage.setItem('preferredAudioDevice', deviceId);
```

---

### 4. **UI: Mic Status Indicator**

**Location:** Next to recording button (bottom of screen)

**Current UI:**
```
[🎤 Press Space to record]
```

**Enhanced UI:**
```
[🎤 Paul's AirPods] [Press Space to record]
     ↑
  Click to switch
```

**States:**
- ✅ **Connected:** Green dot + device name
- ⚠️ **No input:** Orange dot + "No microphone"
- ❌ **Permission denied:** Red dot + "Mic access denied"
- 🔄 **Switching:** Spinner + "Switching..."

**Dropdown menu (on click):**
```
┌────────────────────────────────┐
│ 🎤 Select Microphone           │
├────────────────────────────────┤
│ ● Paul's AirPods               │
│ ○ MacBook Pro Microphone       │
│ ○ Default                      │
│                                │
│ [Auto-switch: On]              │
└────────────────────────────────┘
```

---

### 5. **UI: Device Change Notification**

**Toast notification (top-right corner):**
```
┌─────────────────────────────────────┐
│ 🔔 New Microphone Detected          │
│                                     │
│ Paul's AirPods connected            │
│                                     │
│ [Switch to AirPods] [Keep Current]  │
│ [ ] Always switch to this device    │
└─────────────────────────────────────┘
```

**Auto-dismiss after 10 seconds if no action.**

---

### 6. **Permission Handling**

**Current problem:** When AirPods connect, browser doesn't automatically get permission.

**Solution:**
```javascript
// On device change, re-request permission with new device
async function handleNewDevice(device) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: { exact: device.deviceId } }
    });
    
    // Permission granted — switch to new device
    switchAudioDevice(device.deviceId);
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      // Show UI: "Microphone permission needed for Paul's AirPods"
      // [Grant Permission] button → opens browser permission prompt
    }
  }
}
```

**Note:** Some browsers require user gesture (click) to request permissions. May need a "Grant Mic Access" button for first-time setup.

---

## Testing Checklist

- [ ] Open Jarvis UI in browser
- [ ] Check current mic shows in UI (next to recording button)
- [ ] Connect AirPods
- [ ] Verify: Device change notification appears
- [ ] Verify: Auto-switches to AirPods (or prompts user)
- [ ] Verify: UI updates to show "Paul's AirPods"
- [ ] Test recording: Audio comes from AirPods, not laptop
- [ ] Disconnect AirPods
- [ ] Verify: Switches back to laptop mic (or prompts)
- [ ] Test manual switch: Click mic name → select different device
- [ ] Test "Always switch" preference: Reconnect AirPods → auto-switches
- [ ] Console: No errors
- [ ] Screenshot: UI showing AirPods selected

---

## Version Bumps

- `jarvis-server.js`: VERSION = '2.11.0', BUILD_DATE = '2026-03-27'
- `app.js`: CLIENT_VERSION = '2.11.0'
- `index.html`: Update if adding new UI elements

---

## Deliverables

1. **Backend changes:**
   - Audio device detection (poll or event-based)
   - Device switch endpoint/logic
   - Preference persistence (localStorage)

2. **Frontend changes:**
   - Mic status indicator (next to recording button)
   - Device dropdown menu
   - Device change notification (toast)
   - Auto-switch logic (Bluetooth = auto, others = prompt)

3. **Testing:**
   - Test with AirPods (connect/disconnect)
   - Test with other Bluetooth mics
   - Test manual device switch
   - Test permission flow
   - Screenshot: UI with AirPods selected

4. **Auto-report:**
   - Update `inbox/coder-status.md` with completion
   - Send system notification
   - Include screenshot path + commit hash

---

## Design Notes

**UI placement:**
```
┌─────────────────────────────────┐
│                                 │
│         (main content)          │
│                                 │
│  [🎤 Paul's AirPods]            │
│  [Press Space to record]        │
│                                 │
└─────────────────────────────────┘
```

**Color coding:**
- ✅ Active device: Green dot + white text
- ⚠️ No device: Orange dot
- ❌ Permission denied: Red dot

**Animation:**
- Smooth fade-in on device change
- Subtle pulse when switching (2 seconds)

**Accessibility:**
- Keyboard navigation for dropdown (arrow keys + Enter)
- Screen reader labels for device names
- High contrast mode support

---

## Complexity Notes

**🟡 Medium because:**
- Browser audio API can be finicky (permissions, device access)
- Need to handle edge cases (device removed mid-recording, permission denied)
- UI state management (current device, switching, available devices)

**Not complex because:**
- Web Audio API is well-documented
- No backend infrastructure needed (all client-side)
- Vitals panel already has similar UI patterns (dropdowns, status indicators)

---

## Browser Compatibility

| Browser | `ondevicechange` | `enumerateDevices` | Notes |
|---------|------------------|-------------------|-------|
| Chrome | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | Full support |
| Safari | ⚠️ | ✅ | `ondevicechange` limited |
| Edge | ✅ | ✅ | Full support |

**Fallback:** If `ondevicechange` not supported, use poll-based detection (5-second interval).

---

**Ready to build?** Read this plan, then:
1. Start with device detection (backend/client-side)
2. Add switching logic
3. Build UI (mic status + dropdown)
4. Test with AirPods (connect/disconnect)
5. Report back with screenshot + commit hash

Let's make audio seamless for non-techies. 🎧
