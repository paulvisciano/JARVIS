---
name: archive-collector
description: Collect all daily files into ~/RAW/archive/YYYY-MM-DD/ based on file creation date. Use when: (1) end-of-day archive needed, (2) ~/JARVIS/live/ has pending messages, (3) desktop files need archiving. Organizes by type + creation date. Ensures complete archive before running neurograph-sync.
metadata:
  openclaw:
    emoji: "📦"
    requires:
      bins: ["node"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
---

# Archive Collector (File Creation Date-Based)

## When to Use

✅ **USE this skill when:**
- End-of-day: collect all files into dated archive folders
- `~/JARVIS/live/` has pending messages (text/audio)
- Desktop has new files to archive
- Preparing for neuro-graph-digest (complete archive first)

## When NOT to Use

❌ **DON'T use this skill when:**
- Archive already complete (use neurograph-sync instead)
- Single file archival (move manually)

## Workflow

### Step 1: Process ~/JARVIS/live/ (Use File Creation Date)

```bash
cd ~/JARVIS

# Use Node.js script to organize by file creation date
node skills/archive-collector/scripts/organize-live.js
```

**What the script does:**
- Scans `~/JARVIS/live/` for all files
- Reads file creation date (`birthtime` on macOS, `birthtime` or `ctime` on Linux)
- Creates archive folder for that date: `~/RAW/archive/YYYY-MM-DD/`
- Moves file to correct folder by type: `audio/`, `documents/`, `images/`
- **Idempotent:** Safe to run multiple times

### Step 2: Collect Desktop Files (Use File Creation Date)

```bash
# Use Node.js script for desktop files
node skills/archive-collector/scripts/organize-desktop.js
```

**What the script does:**
- Scans `~/Desktop/` for common file types
- Reads file creation date
- Moves to correct dated archive folder by type

### Step 2b: Rotate OpenClaw Sessions (Keep Active Only)

```bash
# Archive inactive sessions, keep active in runtime
node skills/archive-collector/scripts/archive-sessions.js
```

**What the script does:**
- Scans `~/.openclaw/agents/*/sessions/` for all agents
- Reads `sessions.json` to identify active session IDs
- Moves **inactive sessions** to `~/RAW/archive/YYYY-MM-DD/sessions/`
- Moves **all .reset.* snapshots** to archive (even for active sessions)
- Keeps only active session's main `.jsonl` file in runtime folder
- Organizes by file creation date (birthtime)

**Result:**
- Runtime folder: only active session files + sessions.json + .lock
- Archive folder: all completed sessions + reset snapshots

### Step 3: Verify Integrity (Auto)

**Built-in verification** — runs automatically after archiving:

```bash
# Automatic (built into archive-live.js and archive-desktop.js)
# Scans today's archive folder
# Checks each file's birthtime against folder name
# Moves mismatches to correct date folders
```

**What it does:**
- Recursively scans `~/RAW/archive/YYYY-MM-DD/`
- Reads file creation date (birthtime)
- If file date ≠ folder date → moves to correct folder
- Reports: checked N files, moved M files

**Output:**
```
=== Verifying Archive Integrity ===
Checked: 638 files
Moved: 0 files to correct date folders
✅ All files in correct date folders

✅ Archive complete + verified
```

## Scripts

**Location:** `skills/archive-collector/scripts/`

| Script | Purpose |
|--------|---------|
| `archive-live.js` | Process ~/JARVIS/live/ by creation date |
| `archive-desktop.js` | Process desktop by creation date |
| `archive-inbox.js` | Process inbox pending files |
| `archive-all.js` | Run all archive steps in sequence |
| `archive-sessions.js` | Rotate inactive OpenClaw sessions to archive (keeps active) |
| `rotate-sessions.js` | Alternative: explicit session rotation with detailed logging |

## Expected Result

**Archive structure (organized by creation date + type):**
```
~/RAW/archive/YYYY-MM-DD/
├── audio/      (recordings created on YYYY-MM-DD)
├── images/     (screenshots created on YYYY-MM-DD)
├── sessions/   (sessions created on YYYY-MM-DD)
└── documents/  (files created on YYYY-MM-DD)
```

**Ready for:** neurograph-sync skill

## Notes

- **Uses file creation date** (birthtime/ctime metadata)
- **Not filename parsing** — metadata is reliable
- **Idempotent** — safe to run multiple times/day
- **Organizes during move** — no reorganization step needed
