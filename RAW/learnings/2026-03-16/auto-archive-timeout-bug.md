# Auto-Archive Timeout Bug — 30s Delay Loses Files

**Learned:** March 16, 2026, 20:20 GMT+7  
**Type:** Bug discovery  
**Category:** Server reliability

---

## The Bug

**Location:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/jarvis-server.js` line 687

**Code:**
```javascript
setTimeout(() => {
    archiveRecording(filepath, extension, transcript);
}, 30000); // Archive after 30 seconds
```

**Problem:** 30-second timeout creates a race condition:
- If server restarts/crashes before timeout fires → files stay in `live/` **forever**
- No recovery mechanism on startup
- Silent data loss (files never archived, never linked to neurograph)

---

## Evidence (March 16, 2026)

**Stuck in `live/`:** 10 files (1:38 PM - 3:14 PM)
- `recording-1773648880320.wav.txt` (3:14 PM — v2.7.0 test)
- `recording-1773644257320.wav.txt` (1:57 PM)
- `recording-1773643864743.wav.txt` (1:51 PM)
- `recording-1773643284540.wav.txt` (1:41 PM)
- ... 6 more

**Successfully archived:** 108 files (earlier, before server restarts)

**Root cause:** Server restarted multiple times today (version bumps, debugging) → timeouts never fired → files orphaned.

---

## The Fix

**Option 1: Immediate Archive**
```javascript
// Don't wait - archive right after transcription
archiveRecording(filepath, extension, transcript);
```

**Option 2: Archive on Startup**
```javascript
// On server boot, check live/ for leftover files
function archiveLeftovers() {
    const liveFiles = fs.readdirSync(CONFIG.liveDir)
        .filter(f => f.endsWith('.wav.txt'));
    liveFiles.forEach(f => {
        // Move to archive + link to neurograph
    });
}
archiveLeftovers(); // Call on startup
```

**Option 3: Both**
- Archive immediately after transcription
- Also run archiveLeftovers() on startup as safety net

---

## Related Learnings

- `monumental-voice-pipeline.md` (March 16, 16:36) — Voice pipeline architecture
- `chrome-browser-relay-rule.md` (March 16, 20:18) — Browser profile operational rule

---

**Commit to neurograph:** Create neuron `auto-archive-timeout-bug` → links to `jarvis-server.js`, `march-16-2026`, `server-reliability`
