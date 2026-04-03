# Gateway-Level vs UI-Level Concerns — Architectural Separation

**Date:** 2026-03-31
**Type:** insight
**Status:** extracted

## The Problem

Auto-open logic was placed in the **UI code** (`app.js`):

```javascript
// WRONG: In UI code
function triggerAutoOpen() {
  if (autoOpenEnabled && !autoOpenTriggered) {
    window.open('https://localhost:18787/');
    autoOpenTriggered = true;
  }
}
```

This creates confusion: **If the UI is already running, why is it trying to open itself?**

## The Correct Architecture

**Auto-open is a gateway-level concern:**

```
Incoming Message → Gateway Hook → Opens Browser → UI Loads
                                                    ↓
                                    (UI is now open, no need to auto-open again)
```

## Separation of Concerns

| Concern | Location | Why |
|---------|----------|-----|
| **Detecting conversational messages** | Gateway hook (`skills/jarvis-ui/hooks/`) | Happens before UI loads |
| **Opening browser** | Gateway hook | System-level action |
| **Rendering UI** | UI code (`app.js`) | Display logic only |
| **TTS playback** | UI code | Browser-based feature |
| **Panel interactions** | UI code | User interface behavior |

## Key Principle

**Concerns belong where they originate.** Gateway handles gateway concerns (message routing, process management). UI handles UI concerns (rendering, user interaction). Don't mix layers.