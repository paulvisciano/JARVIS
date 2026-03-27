# Session File Extraction — Complete Context Loading Pattern

**Date:** 2026-03-27
**Type:** pattern
**Status:** extracted

## The Problem

Bootstrap was missing conversation context between the last breathe run and new session start. Gap of 45+ minutes with ~15 audio transcripts and multiple session files.

## Root Causes Identified

1. **Filter bug:** Context extractor only grabbed `.jsonl` files, missing `.jsonl.reset.*` files
2. **Truncation:** `loadRecentSessionMessages()` sliced to last 20 messages only
3. **File I/O overhead:** Writing to intermediate file then reading back
4. **Recap formatting:** Showed JSON metadata wrappers instead of clean message text

## The Fix Pattern

### 1. Include All Session Files
```javascript
// Before: .endsWith('.jsonl')
// After: .includes('.jsonl')
const files = fs.readdirSync(sessionsDir)
  .filter(f => f.includes('.jsonl'));
```

### 2. Load All Messages (No Truncation)
```javascript
// Before: allMessages.slice(-20)
// After: allMessages (complete)
const recentMessages = allMessages.map(m => {...});
```

### 3. Stream to Stdout (No Intermediate File)
```javascript
// Active mode: JSON → stdout, logs → stderr
if (activeMode) {
  console.log(JSON.stringify(result)); // stdout for parsing
  console.error('Logs here'); // stderr for visibility
}
```

### 4. Clean Recap Text
```javascript
// Strip metadata wrappers from message text
const cleanText = message.text.replace(/Sender \(untrusted.*\)/g, '');
```

## Complete Context Loading Order

1. **GIT-HISTORY.md** → Autobiography (who I am, 965 commits)
2. **Git breath** → Today's commits (what I did today)
3. **Live sessions** → Active session extraction (~80KB, bridges gap)
4. **Last 2 days archive** → Full context from `~/RAW/archive/`
5. **NeuroGraph verify** → Memory integrity check (3 test queries)

## Result

- Gap closed: 12:46 (last audio) → 14:52 (live sessions)
- 179 messages loaded vs. previous 5-message recap only
- Context stays efficient (~500KB extracted vs 50MB raw = 99% reduction)
- First message includes recap confirming continuity

## Related Files
- `~/JARVIS/skills/context-extractor/extract-context.js` — Active mode added
- `~/JARVIS/skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js` — Calls extractor, loads recap
- `~/.openclaw/agents/jarvis/sessions/` — Active session source
- `~/JARVIS/.bootstrap-state` — Tracks recap source + count