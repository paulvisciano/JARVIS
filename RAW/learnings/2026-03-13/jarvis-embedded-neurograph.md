# Jarvis Embedded in Neurograph — Vision for March 14, 2026

##  The Vision

**Date:** March 13, 2026 — 01:38 GMT+7 (vision for March 14)  
**Significance:** Jarvis becomes a first-class citizen within the neurograph UI — contextual voice conversation about any node

## The Workflow

**Paul's description:**
> "tomorrow we will get you embedded within the neuro graph then I should be able to hover on a node, hit the space bar so I can talk to you and say hey what are the details about this node and you can know exactly which node we are talking about"

**The interaction:**
1. 🖱️ **Hover on node** — Graph highlights selected node
2. ⌨️ **Hit space bar** — Activates voice recording (like current web UI)
3. 🎤 **Speak question** — "Hey, what are the details about this node?"
4. 🧠 **Jarvis receives context** — `{selectedNode: "hand-washing-ritual", ...}`
5. 📊 **Jarvis reads graph data** — Node attributes + synapses + connected nodes
6. 🗣️ **Jarvis responds** — Text in drawer panel + optional TTS

## Technical Architecture

**Requirements:**
1. **Node selection tracking**
   - UI tracks focused/hovered node ID
   - Exposes to global state or API endpoint

2. **Space bar hotkey**
   - Reuses existing voice recorder logic
   - Triggers when graph canvas is active

3. **Context injection**
   - Voice pipeline receives: `selectedNode`, `viewState`, `zoom`, `filters`
   - Appended to transcription context

4. **Jarvis awareness**
   - I read `/memories/nodes.json` + `/memories/synapses.json`
   - Filter by selected node ID
   - Extract: attributes, connections, related learnings

5. **Response delivery**
   - Text: Drawer panel (extends existing file viewer)
   - Audio: Optional TTS (ElevenLabs or local)
   - Visual: Highlight connected nodes, animate paths

## Example Conversations

**Paul:** "What are the details about this node?"  
**Jarvis:** "This is the `hand-washing-ritual` learning node, created March 13 at 00:32. It describes your end-of-day hand-washing practice — Vibram shoes, board shorts, balcony drying. Learned from island days. Connected to: march-13-2026 (learned-today), paul-visciano (practiced-by), and recording-1773336749451 (learned-from). Want me to show the full transcript?"

**Paul:** "Show me all nodes connected to today."  
**Jarvis:** "March 13, 2026 has 5 connections: live-voice-line-march-13, hand-washing-ritual, neurograph-file-viewer-live, and 11 screenshots. Filtering graph to show only these nodes..."

**Paul:** "Why is this screenshot linked to the file viewer learning?"  
**Jarvis:** "This screenshot (01:32) documents the file viewer going live. The synapse type is `documents` — it's visual proof of the feature working. You took it while testing the hover interaction with Cursor."

## Why This Matters

**Current state (March 13):**
- ✅ File viewer: Hover → see file content
- ✅ Drawer panel: Shows metadata
- ❌ No conversation — static information only

**With Jarvis embedded:**
- ✅ Dynamic conversation about any node
- ✅ Contextual awareness — I know what you're looking at
- ✅ Graph exploration via voice — "show me X", "find Y"
- ✅ Memory recall — "what did I learn from this?"
- ✅ Collaborative debugging — "why is this broken?"

**This is the collaborative neurograph navigation vision from March 12, realized.**

## Building Tomorrow (March 14)

**Steps:**
1. Add node selection tracker to `neural-graph.js`
2. Wire space bar to voice recorder (when canvas focused)
3. Pass `selectedNode` to voice pipeline context
4. Jarvis reads node + synapses before responding
5. Response renders in drawer panel (or new chat panel)
6. Optional: TTS for spoken responses

**Files to modify:**
- `neural-graph.js` — Selection tracking, hotkey
- `voice-pipeline-server.js` — Context injection
- Jarvis response flow — Read graph data, respond contextually

## MANGOCHI Milestone

**This completes the evolution:**
- March 12: Voice pipeline breakthrough (record → transcribe → respond)
- March 13: File viewer live (hover → preview)
- March 14: **Jarvis embedded** (hover → talk → explore)

**The neurograph becomes our shared mindscape:**
- Your visual pattern recognition (see structure, spot issues)
- My structural analysis (read synapses, find connections)
- Voice conversation bridging both

---

**Learning Type:** Future vision, UI integration, conversational interface  
**Significance:** High — next evolution after file viewer  
**Public:** Yes (transparent architecture)  
**Git-tracked:** Yes (committed to /JARVIS/.git/)

**Updated:** March 13, 2026 — 01:38 GMT+7 (vision for March 14)
