---
name: archive-collector
description: Collect all daily files into ~/RAW/archive/YYYY-MM-DD/ based on file creation date. Use when: (1) end-of-day archive needed, (2) ~/JARVIS/live/ has pending messages, (3) desktop files need archiving. Organizes by type + creation date. Ensures complete archive before running neuro-graph-digest.
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
- Archive already complete (use neuro-graph-digest instead)
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
| `organize-live.js` | Process ~/JARVIS/live/ by creation date |
| `organize-desktop.js` | Process desktop by creation date |

## Expected Result

**Archive structure (organized by creation date + type):**
```
~/RAW/archive/YYYY-MM-DD/
├── audio/      (recordings created on YYYY-MM-DD)
├── images/     (screenshots created on YYYY-MM-DD)
├── sessions/   (sessions created on YYYY-MM-DD)
└── documents/  (files created on YYYY-MM-DD)
```

**Ready for:** neuro-graph-digest skill

## Notes

- **Uses file creation date** (birthtime/ctime metadata)
- **Not filename parsing** — metadata is reliable
- **Idempotent** — safe to run multiple times/day
- **Organizes during move** — no reorganization step needed
