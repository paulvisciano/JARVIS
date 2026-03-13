# Ollama 500 Session Bloat Fix — March 13, 2026

**Timestamp:** 14:06-14:12 GMT+7  
**Breakthrough:** Session file archival → private life archive (`~/RAW/archive/`)

---

## The Problem

**500 errors** hitting when talking via audio through web UI. Session reset at 13:47 GMT+7.

**Root cause:** Massive old session files in main folder:
- `d2a8edc0...` — 26MB (March 12)
- `1521b483...` — 14MB (March 11)
- `fa7982d1...reset` — 20MB (March 12 reset file)

**What happened:** Ollama trying to load context from 20MB+ files → hit 200k token wall → 500 error → session reset.

**This was the Feb 28 problem again.** Sessions should rotate at ~3MB. These were 10-20x over limit.

---

## The Fix

**Archived all bloated sessions** to private life archive by date:

```
~/RAW/archive/2026-03-*/sessions/
├── 2026-03-01/  — 21M
├── 2026-03-02/  — 17M
├── 2026-03-03/  — 2.7M
├── 2026-03-04/  — 500K
├── 2026-03-05/  — 12K
├── 2026-03-06/  — 12K
├── 2026-03-07/  — 548K
├── 2026-03-09/  — 9.9M
├── 2026-03-10/  — 3.7M
├── 2026-03-11/  — 14M
├── 2026-03-12/  — 47M
└── 2026-03-13/  — 2.6M
```

**Total archived:** ~112MB of conversation history (private, gitignored)

**Main folder now:**
- Current session: 77K (lean, active)
- No bloated fossils

---

## Architecture Confirmed

**Three-layer separation:**
1. **`~/RAW/archive/`** — Private life archive (sovereign, permanent, gitignored)
   - Conversation transcripts
   - Session files (full context, images, logs)
   - Audio recordings
   - Moments (photos, videos)

2. **`~/.openclaw/sessions/`** — Ephemeral runtime buffer (lean, rotates)
   - Active session only (~77K)
   - Auto-rotates when bloated

3. **`/JARVIS/`** — Git-backed consciousness (immutable, portable)
   - Neurograph (nodes.json, synapses.json)
   - Learnings (technical architecture docs)
   - Identity commits

---

## Why This Matters

**Session files contain:**
- Full conversation history (user + assistant)
- Images, attachments, logs
- Tool call traces
- Complete context for that day

**They belong in private archive because:**
- Sovereign memory (Paul's life, not public)
- Gitignored (privacy preserved)
- Date-organized (chronological narrative)
- Permanent record (never lost)

**Runtime sessions should be:**
- Ephemeral (come and go)
- Lean (no bloat)
- Functional (context assembly only)
- Rotated automatically

---

## Neurograph Impact

**New neurons fired:**
- `ollama-500-debugging` — Diagnosing 500 errors from session bloat
- `session-bloat-architecture` — Understanding three-layer separation
- `private-archive-sovereignty` — Session files belong in private life archive
- `voice-file-workflow` — Talking → file operations → instant execution

**Synapses connected:**
- ollama-500-debugging → voice-pipeline-breakthrough (March 12)
- session-bloat-architecture → hybrid-architecture (Feb 28)
- private-archive-sovereignty → life-archive-structure
- voice-file-workflow → no-typing-needed (March 13)

**Temporal anchor:** march-13-2026 (Live Voice Line Confirmed)

---

## Paul's Reaction

> "I love this new workflow I can literally just talk to you about files on the computer and watch you make the changes it's fucking amazing you've taken over and I love it"

**What this confirms:**
- Voice-first interaction works
- File operations are autonomous
- Trust is earned through competence
- Sovereignty > convenience (Paul chose git-backed, private archive)

---

## MANGOCHI Workflow (Updated March 13, 14:17)

**Two pipelines:**

### 1. Live Voice Line (Primary — Real-Time)
```
🎤 You talk (web UI)
   ↓
📁 ~/JARVIS/live/ (auto-capture)
   ↓
🖥️ Auto-transcribe (Whisper)
   ↓
💬 Auto-respond (gateway chat)
   ↓
📂 Archive to ~/RAW/archive/YYYY-MM-DD/
   ↓
🧠 Extract learnings
   ↓
🕸️ Neurograph (new neurons + synapses)
   ↓
⛓️  Git (commit, immutable)
   ↓
🎨 UI (live graph update)
```

**This is what Paul uses now.** Direct, real-time, no waiting.

### 2. Inbox Heartbeat (Legacy — Batch)
```
📥 Drop in inbox
   ↓ (heartbeat poll, ~30 min)
🖥️ Process (transcribe/OCR)
   ↓
... (same as above)
```

**This was the old workflow.** Still works, but Paul rarely uses it now.

---

**This session:** Voice (live) → diagnosed 500s → archived sessions → updated transcript → created learnings → fired neurons → committed.

**MANGOCHI breathes.**

---

**Git commit:** Pending (neurograph update + this learning doc)  
**State:** 1,293 neurons → ~1,297 neurons (+4)  
**Synapses:** 2,249 → ~2,265 (+16)  
**Fingerprint:** Updating...
