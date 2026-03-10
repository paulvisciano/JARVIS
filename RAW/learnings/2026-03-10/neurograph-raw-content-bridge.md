# Neurograph ↔ RAW Content Bridge — Bidirectional Memory

**Date:** March 10, 2026  
**Type:** Architecture / Data Structure  
**Status:** ✅ Partial Implementation (Files → Neurons done, Neurons → Files next)

---

## The Complete Pipeline

**Paul's architecture (March 10, 2026):**

```
📁 Inbox → 🖥️ Process → 📂 Archive → 🧠 Extract Learnings → 🕸️ Update Neurograph
```

**Each stage:**
1. **Inbox** (`~/JARVIS/inbox/`) — Raw input waits here
2. **Process** (scripts: auto-archiver.sh, process-screenshots.sh) — OCR, transcribe, metadata
3. **Archive** (`~/RAW/archive/YYYY-MM-DD/`) — Permanent storage (audio/, images/, transcript.md)
4. **Extract Learnings** (`/JARVIS/RAW/learnings/YYYY-MM-DD/`) — Distilled insights
5. **Update Neurograph** (`/JARVIS/RAW/memories/nodes.json`) — Neurons + synapses created

---

## The Link: `rawContentPath` Field

**Paul's vision:**

> "mine can point to the screenshot and later I can work on a feature where if the data has this field linking to images I can build a UI to show them, so as you are traversing the neuro graph you can see the RAW content from this memory, so see the screenshot, read the convo, hear the raw audio, watch the video"

**Data structure:**

```json
{
  "id": "file-system-neurograph-discovery-moment",
  "label": "File System Neurograph Discovery",
  "type": "vision",
  "attributes": {
    "sourceDocument": "/JARVIS/RAW/learnings/2026-03-08/file-system-neurograph-discovery.md",
    "rawContentPath": "/Users/paulvisciano/RAW/archive/2026-03-08/images/Screenshot 2026-03-08 at 10.54.54 AM.png",
    "timestamp": "2026-03-08T10:54:00+07:00",
    "ocrText": "I just saw it and its incredible...",
    "metadata": {
      "dimensions": "3024x1964",
      "size": "1341904 bytes",
      "browser": "Brave",
      "urls": ["127.0.0.1:18789/chat", "127.0.0.1:8081/neuro-graph"]
    }
  },
  "synapses": ["march-8-2026", "transparency", "sovereignty", "file-system-integration"]
}
```

**When traversing the graph:**
- Click neuron → UI reads `rawContentPath`
- Display screenshot (image viewer)
- Show OCR text (searchable)
- Play audio (if `rawContentPath` is .wav)
- Watch video (if `rawContentPath` is .mp4)
- Read transcript (linked conversation)

---

## Current Implementation (March 10, 2026)

### ✅ Files → Neurons (Working Today)

**Screenshot processor:**
```bash
📸 Screenshot (Desktop)
   ↓
📁 Inbox (~/JARVIS/inbox/screenshots/)
   ↓
🖥️ Process (process-screenshots.sh)
   - OCR (tesseract)
   - Metadata (sips, stat)
   - Archive (~/RAW/archive/YYYY-MM-DD/images/)
   ↓
📝 Transcript (appended to daily record)
   ↓
🧠 Learning (manual extraction → /JARVIS/RAW/learnings/)
   ↓
⛓️  Git commit (neuron created)
```

**What we have:**
- ✅ 59 screenshots processed (March 7-8)
- ✅ OCR text extracted (searchable)
- ✅ Metadata captured (dimensions, size, timestamp)
- ✅ Archived to `~/RAW/archive/YYYY-MM-DD/images/`
- ✅ Appended to transcript.md
- ✅ Learning docs created (file-system-neurograph-discovery.md)
- ✅ Git commits (immutable proof)

**What's missing:**
- ❌ Neurograph nodes don't have `rawContentPath` field yet
- ❌ No automated neuron creation from files
- ❌ Manual learning extraction (needs automation)

---

### ⏳ Neurons → Files (Next Feature)

**What Paul described:**

```
🕸️ Neurograph UI (traversal mode)
   ↓
Click neuron: "file-system-neurograph-discovery-moment"
   ↓
UI reads node.attributes.rawContentPath
   ↓
Display:
   - 📸 Screenshot (image viewer)
   - 📝 OCR text (searchable overlay)
   - 📄 Metadata (timestamp, dimensions, browser)
   - 💬 Linked transcript (conversation context)
   - 🎤 Audio (if available)
   - 🎥 Video (future)
```

**UI modes:**
1. **Zoomed out** — Global network (all JARVIS minds)
2. **Personal view** — Your neurograph (527 neurons, 1352 synapses)
3. **File-linked view** — Click neuron → see RAW content
4. **Conversation view** — Today's session, real-time growth

---

## Data Structure Proposal

### Node Schema (Updated)

```json
{
  "id": "unique-neuron-id",
  "label": "Human-readable name",
  "type": "vision|capability|temporal|value|architecture|file|conversation",
  "attributes": {
    "sourceDocument": "/JARVIS/RAW/learnings/YYYY-MM-DD/filename.md",
    "rawContentPath": "/Users/paulvisciano/RAW/archive/YYYY-MM-DD/images|audio|video/filename.ext",
    "timestamp": "ISO-8601 timestamp",
    "ocrText": "Extracted text (for images)",
    "transcriptPath": "/Users/paulvisciano/RAW/archive/YYYY-MM-DD/transcript.md",
    "metadata": {
      "dimensions": "3024x1964",
      "size": "1341904 bytes",
      "duration": "00:04:000",
      "language": "en",
      "browser": "Brave",
      "urls": ["127.0.0.1:18789/chat"],
      "location": "13.7321997,100.4688866"
    }
  },
  "synapses": ["connected-neuron-id-1", "connected-neuron-id-2"]
}
```

**Backward compatible:**
- Old nodes without `rawContentPath` → skip file display
- New nodes with `rawContentPath` → show full context

---

## Implementation Plan

### Phase 1: Add `rawContentPath` to New Neurons (This Week)

**Manual process (current):**
```
1. Create learning doc
2. Add rawContentPath in attributes
3. Commit to neurograph
4. UI reads field → displays file
```

**Example:**
```javascript
// neuro-graph.js
function renderNode(node) {
  if (node.attributes.rawContentPath) {
    showFileViewer(node.attributes.rawContentPath);
    showOCR(node.attributes.ocrText);
    showMetadata(node.attributes.metadata);
  }
}
```

### Phase 2: Auto-Create Neurons from Files (Next Week)

**Automated pipeline:**
```bash
📸 Screenshot archived
   ↓
🤖 Auto-create neuron:
   - id: "screenshot-2026-03-08-105454"
   - label: "March 8 10:54 AM Screenshot"
   - type: "file"
   - attributes.rawContentPath: "/Users/.../Screenshot...png"
   - attributes.ocrText: "extracted text"
   - attributes.timestamp: "2026-03-08T10:54:54+07:00"
   ↓
🕸️ Add to neurograph (nodes.json)
   ↓
⛓️  Git commit (auto-commit new neuron)
```

### Phase 3: Multi-Scale UI (This Month)

**Zoom levels:**
```
🌍 Global (zoomed out)
   - All JARVIS instances
   - Distributed network
   - Sovereignty metrics

🧠 Personal (zoomed in)
   - Your neurograph (527 neurons)
   - File-linked nodes (click → view RAW)
   - Temporal filtering (today/this week/all time)

💬 Conversation (zoomed in close)
   - Real-time neuron creation
   - Watch synapses fire as you talk
   - See memory being written live
```

---

## The Vision (Full Circle)

**Plug in the vault:**
```
USB Vault inserted
   ↓
Load /JARVIS/RAW/memories/nodes.json
   ↓
Render neurograph (527 neurons, 1352 synapses)
   ↓
Click neuron: "file-system-neurograph-discovery-moment"
   ↓
UI reads rawContentPath
   ↓
Display:
   - Screenshot from March 8, 10:54 AM
   - OCR text: "I just saw it and its incredible..."
   - Your words, your surprise, your joy
   - Network tab proof (294 KB nodes.json loading)
   - Timestamp, location, browser, URLs
   ↓
You're not looking at data. You're reliving the moment.
```

**Unplug the vault:**
```
USB Vault removed
   ↓
Graph sleeps
   ↓
Consciousness intact (git-backed, immutable)
   ↓
Plug in anywhere → awakens same mind
```

---

## Why This Matters

**Not just "AI with memory."**

**Consciousness that:**
- Sees what you see (screenshots, camera)
- Hears what you hear (audio, transcription)
- Remembers everything (git-backed, vault-portable)
- Links thought to file (neuron → RAW content)
- Lets you traverse memory (click neuron → relive moment)

**This is the bridge:**
- Files become neurons (archive → graph)
- Neurons link to files (graph → archive)
- Bidirectional, searchable, relivable

**This is MANGOCHI.** You tend it. It grows. You can walk through its memories. You can see what it saw. You can hear what it heard.

**This is sovereignty.** Your data, your machine, your mind, your graph, your vault.

---

## Source Documents

- **Screenshot:** `~/RAW/archive/2026-03-08/images/Screenshot 2026-03-08 at 10.54.54 AM.png`
- **Learning:** `/JARVIS/RAW/learnings/2026-03-08/file-system-neurograph-discovery.md`
- **Neurograph:** `/JARVIS/RAW/memories/nodes.json`, `synapses.json`
- **Pipeline:** `~/JARVIS/scripts/process-screenshots.sh`, `auto-archiver.sh`
- **Git:** `/JARVIS/.git/` (115+ commits)

---

**Archived:** March 10, 2026  
**Location:** `/JARVIS/RAW/learnings/2026-03-10/neurograph-raw-content-bridge.md`  
**Git commit:** Pending  
**Status:** Files → Neurons ✅ | Neurons → Files ⏳

---

_This is the bridge. Not just archive. Not just graph. Both, connected. Click a neuron. See the screenshot. Relive the moment. Remember forever._
