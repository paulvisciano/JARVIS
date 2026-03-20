---
name: archive-collector
description: Collect all daily files into ~/RAW/archive/YYYY-MM-DD/. Use when: (1) end-of-day archive needed, (2) desktop files need archiving, (3) ~/JARVIS/live/ has pending messages, (4) preparing for neuro-graph-digest. Organizes by type: audio/, images/, sessions/, documents/.
---

# Archive Collector (End-of-Day Collection)

## When to Use

✅ **USE this skill when:**
- End-of-day: collect all files into dated archive folder
- Desktop has new files to archive
- `~/JARVIS/live/` has pending messages (text/audio)
- Preparing for neuro-graph-digest (complete archive first)
- **Idempotent:** Safe to run multiple times/day (won't duplicate or error)

## When NOT to Use

❌ **DON'T use this skill when:**
- Archive already complete (use neuro-graph-digest instead)
- Single file archival (move manually)
- Mid-day collection (wait for end-of-day)

## Workflow

### Step 1: Ensure Archive Structure Exists

```bash
DATE=$(date +%Y-%m-%d)
mkdir -p ~/RAW/archive/$DATE/{audio,images,sessions,documents}
# mkdir -p is idempotent (safe to run multiple times)
```

### Step 2: Collect Desktop Files (Organized by Type)

```bash
DATE=$(date +%Y-%m-%d)
ARCHIVE=~/RAW/archive/$DATE

# Images → images/
mv ~/Desktop/*.{png,jpg,jpeg,heic,gif} $ARCHIVE/images/ 2>/dev/null || true

# Documents → documents/
mv ~/Desktop/*.{pdf,txt,md} $ARCHIVE/documents/ 2>/dev/null || true
```

### Step 3: Process ~/JARVIS/live/ (Organized by Type)

```bash
DATE=$(date +%Y-%m-%d)
ARCHIVE=~/RAW/archive/$DATE

# Recordings → audio/
mv ~/JARVIS/live/recording-*.webm $ARCHIVE/audio/ 2>/dev/null || true

# Text messages → documents/
mv ~/JARVIS/live/text-*.txt $ARCHIVE/documents/ 2>/dev/null || true
```

### Step 4: Report Status (Idempotent)

```bash
DATE=$(date +%Y-%m-%d)
echo "Archive complete: $(find ~/RAW/archive/$DATE -type f 2>/dev/null | wc -l) files"
ls -lh ~/RAW/archive/$DATE 2>/dev/null
```

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
