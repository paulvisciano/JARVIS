# Audio Pipeline Optimization

**Date:** April 10, 2026  
**Context:** Coffee shop session at Suan Imm Sook, Phuket  
**Goal:** Unify audio formats end-to-end for sovereign voice pipeline

---

## Current Pipeline Analysis

### **INPUT PIPELINE (Audio → Text)**

```
User Voice (WebM/MP3)
    ↓
ffmpeg conversion
    ↓
WAV (16kHz mono PCM) ← Whisper requirement
    ↓
Whisper.cpp transcription
    ↓
Transcript (.txt) + Audio (.wav) archived
```

**Format:** WAV (lossless, 16kHz mono PCM)  
**Quality:** High fidelity, no compression loss  
**Archive:** Both WAV + TXT preserved

---

### **OUTPUT PIPELINE (Text → Audio)**

```
Text Response
    ↓
TTS Tool (OpenClaw tts)
    ↓
MP3 (compressed) ← Current default
    ↓
afplay playback
    ↓
User's AirPods
```

**Format:** MP3 (lossy compression)  
**Quality:** Compressed, potential artifacts  
**Archive:** Not currently archived (temp only)

---

## The Problem

**Format Mismatch:**
- Input: WAV (lossless)
- Output: MP3 (lossy)

**Why This Matters:**
1. **Quality loss** — MP3 compression artifacts
2. **Inconsistency** — Different formats for same pipeline
3. **Archive gap** — Input archived, output not
4. **Sovereignty** — MP3 is compressed format, WAV is raw PCM

---

## Optimization Proposal

### **Option 1: TTS → WAV Direct (Best)**

```
Text Response
    ↓
TTS Tool (configured for WAV output)
    ↓
WAV (16kHz mono PCM) ← Same as input
    ↓
afplay playback
    ↓
User's AirPods
```

**Benefits:**
- ✅ Lossless end-to-end
- ✅ Consistent format (WAV in, WAV out)
- ✅ Matches Whisper requirements
- ✅ Archive-ready without conversion
- ✅ No compression artifacts

**Requirements:**
- TTS tool must support WAV output
- May need config change or tool modification

---

### **Option 2: TTS → MP3 → WAV Conversion**

```
Text Response
    ↓
TTS Tool (MP3 output)
    ↓
ffmpeg conversion (MP3 → WAV)
    ↓
WAV (16kHz mono PCM)
    ↓
afplay playback
    ↓
User's AirPods
```

**Benefits:**
- ✅ WAV output (lossless playback)
- ✅ Archive-ready
- ✅ Consistent with input pipeline
- ✅ Works with current TTS tool

**Tradeoffs:**
- ⚠️ Extra conversion step (MP3 → WAV doesn't restore quality)
- ⚠️ Slight latency (~0.5-1 second for conversion)
- ⚠️ Still generating compressed intermediate

---

### **Option 3: Hybrid (Smart Routing)**

```
Text Response
    ↓
Decision: Archive needed?
    ├─ YES → TTS → WAV → Archive + Playback
    └─ NO → TTS → MP3 → Playback only (temp)
```

**Benefits:**
- ✅ WAV for important/archived content
- ✅ MP3 for casual/temp responses (faster)
- ✅ User choice based on context

**Tradeoffs:**
- ⚠️ More complex logic
- ⚠️ Two formats to maintain

---

## Recommended Solution

**Option 1: WAV Direct Output**

**Why:**
1. **Sovereignty** — Raw PCM, no compression
2. **Consistency** — Same format as input pipeline
3. **Quality** — Lossless end-to-end
4. **Archive** — Ready for permanent storage
5. **Simplicity** — One format, one pipeline

**Implementation:**

### **A. Configure TTS Tool (If Supported)**

Check if OpenClaw TTS supports WAV output:
```json
{
  "tts": {
    "provider": "local",
    "format": "wav",
    "sampleRate": 16000,
    "channels": 1
  }
}
```

### **B. Modify Speak Skill**

Update `skills/speak/scripts/read-aloud.js`:
```javascript
// After TTS generation, convert to WAV if needed
if (outputFormat === 'mp3') {
  execSync(`ffmpeg -i ${mp3Path} -ar 16000 -ac 1 -c:a pcm_s16le ${wavPath}`);
  playFile = wavPath;
}
```

### **C. Archive Output Audio**

Mirror input pipeline:
```bash
# After playback, archive
cp /tmp/openclaw/tts-*/voice-*.wav ~/RAW/archive/YYYY-MM-DD/audio/
```

---

## Format Comparison

| Format | Quality | Size (30 sec) | Use Case |
|--------|---------|---------------|----------|
| **WAV (16kHz mono)** | Lossless | ~960 KB | Archive, transcription, sovereign |
| **MP3 (128 kbps)** | Lossy | ~480 KB | Streaming, temp playback |
| **MP3 (320 kbps)** | High quality | ~1.2 MB | High-fidelity playback |
| **WebM (Opus)** | High quality | ~400 KB | Recording, web |

**For sovereign pipeline:** WAV wins for quality + consistency.

---

## Implementation Steps

1. **Check TTS tool capabilities** — Does it support WAV output?
2. **If yes:** Configure for WAV, update speak skill
3. **If no:** Add ffmpeg conversion step (MP3 → WAV)
4. **Update speak skill** — Handle WAV format, archive output
5. **Test pipeline** — End-to-end quality check
6. **Document** — Update skill docs with new format

---

## Archive Structure (Unified)

```
~/RAW/archive/YYYY-MM-DD/audio/
├── input-recording-001.wav      ← User voice (input)
├── input-recording-001.wav.txt  ← Whisper transcript
├── output-response-001.wav      ← Jarvis TTS (output)
└── output-response-001.txt      ← Original text
```

**Symmetry:** Input and output both archived in same format.

---

## Next Steps

1. [ ] Check if OpenClaw TTS tool supports WAV configuration
2. [ ] If not, create wrapper script (TTS → ffmpeg → WAV)
3. [ ] Update speak skill to use WAV
4. [ ] Add output audio archiving
5. [ ] Test quality end-to-end
6. [ ] Document in skill docs

---

**Key Insight:** The input pipeline already uses WAV for quality and Whisper compatibility. The output pipeline should match for consistency, sovereignty, and archive symmetry.

**Motto:** "WAV in, WAV out." 🌊
