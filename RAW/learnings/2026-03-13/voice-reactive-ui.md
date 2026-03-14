# Voice-Reactive UI

**Date:** 2026-03-13  
**Type:** UI Enhancement  
**Related Neurons:** `neural-mind-jarvis`, `voice-first-ui-design`, `transparency`

---

## Feature

Orb ring pulses/breathes with voice in real-time — makes interaction feel alive.

---

## Implementation

**Web Audio API** (client-side, sovereign, no backend):

```javascript
const audioContext = new AudioContext();
const analyser = analyserNode;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Analyze voice stream
analyser.getByteFrequencyData(dataArray);

// Map to visual properties
const amplitude = getAmplitude(dataArray);    // → ring scale/opacity
const frequency = getDominantFreq(dataArray); // → ring rotation speed
const tone = getTone(dataArray);              // → color shift
```

**CSS transforms + requestAnimationFrame** for smooth animation.

---

## Visual Mapping

| Audio Property | Visual Effect |
|----------------|---------------|
| Amplitude (volume) | Ring scale, opacity pulse |
| Frequency (pitch) | Rotation speed |
| Tone (timbre) | Color shift (warm ↔ cool) |
| Silence | Gentle idle breathing |

---

## Why This Matters

- **Alive, not static** — feels like talking to something aware
- **Immediate feedback** — see your voice affect the interface
- **Sovereign** — pure client-side, no servers, no APIs
- **Accessibility** — visual feedback complements audio

---

**Integration:** Works with live voice line (`~/JARVIS/live/`)

**Status:** Vision documented. Next: implement in `app.js` network dots / orb visualization.

---

**Learning doc:** `2026-03-13/voice-reactive-ui.md`  
**Neuron fires:** `voice-reactive-ui` → `neural-mind-jarvis`, `voice-first-ui-design`
