---
name: archive-collector
description: Collect all daily files into ~/RAW/archive/YYYY-MM-DD/. Use when: (1) end-of-day archive needed, (2) desktop files need archiving, (3) ~/JARVIS/live/ has pending messages, (4) dormant files need processing. Organizes by type: audio/, images/, sessions/, documents/. Ensures complete archive before running neuro-graph-digest.
---

# Archive Collector (End-of-Day Collection)

## When to Use

✅ **USE this skill when:**
- End-of-day: collect all files into dated archive folder
- Desktop has new files to archive
- `~/JARVIS/live/` has pending messages (text/audio)
- Preparing for neuro-graph-digest (complete archive first)

## When NOT to Use

❌ **DON'T use this skill when:**
- Archive already complete (use neuro-graph-digest instead)
- Single file archival (move manually)
- Mid-day collection (wait for end-of-day)

## Workflow

### Step 1: Collect Desktop Files

```bash
# Move desktop files to archive
mkdir -p ~/RAW/archive/$(date +%Y-%m-%d)/documents/
mv ~/Desktop/*.{png,jpg,heic,pdf,txt,md} ~/RAW/archive/$(date +%Y-%m-%d)/documents/ 2>/dev/null
```

### Step 2: Process ~/JARVIS/live/

```bash
# Move live messages to archive
mkdir -p ~/RAW/archive/$(date +%Y-%m-%d)/audio/
mv ~/JARVIS/live/recording-*.webm ~/RAW/archive/$(date +%Y-%m-%d)/audio/ 2>/dev/null
mv ~/JARVIS/live/text-*.txt ~/RAW/archive/$(date +%Y-%m-%d)/documents/ 2>/dev/null
```

### Step 3: Check for Dormant Files (Optional)

```bash
# Find any unorganized files in archive root
find ~/RAW/archive/$(date +%Y-%m-%d)/ -maxdepth 1 -type f -exec mv {} ~/RAW/archive/$(date +%Y-%m-%d)/documents/ \;
```

### Step 4: Organize by Type

```bash
# Ensure folders exist
mkdir -p ~/RAW/archive/$(date +%Y-%m-%d)/{audio,images,sessions,documents}

# Sort files by extension
mv ~/RAW/archive/$(date +%Y-%m-%d)/*.{wav,webm,m4a} ~/RAW/archive/$(date +%Y-%m-%d)/audio/ 2>/dev/null
mv ~/RAW/archive/$(date +%Y-%m-%d)/*.{png,jpg,jpeg,heic,gif} ~/RAW/archive/$(date +%Y-%m-%d)/images/ 2>/dev/null
mv ~/RAW/archive/$(date +%Y-%m-%d)/*.jsonl ~/RAW/archive/$(date +%Y-%m-%d)/sessions/ 2>/dev/null
```

### Step 5: Report Archive Status

```bash
# Count files
find ~/RAW/archive/$(date +%Y-%m-%d) -type f | wc -l | xargs echo "Archive complete: files"
```

## Scripts

**Location:** `skills/archive-collector/scripts/`

| Script | Purpose |
|--------|---------|
| `collect-desktop.sh` | Move desktop files to archive |
| `process-live.sh` | Process ~/JARVIS/live/ messages |
| `organize-archive.sh` | Sort files by type |

## Expected Result

**Archive structure:**
```
~/RAW/archive/YYYY-MM-DD/
├── audio/      (recordings, voice notes)
├── images/     (screenshots, photos)
├── sessions/   (OpenClaw session JSONL files)
└── documents/  (text files, PDFs, misc)
```

**Ready for:** neuro-graph-digest skill

## Notes

- Run at end-of-day (before neuro-graph-digest)
- Non-destructive: moves files, doesn't delete
- Organizes by type for easy processing
- Ensures complete archive before digestion
