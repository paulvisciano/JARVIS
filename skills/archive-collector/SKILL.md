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

## When NOT to Use

❌ **DON'T use this skill when:**
- Archive already complete (use neuro-graph-digest instead)
- Single file archival (move manually)
- Mid-day collection (wait for end-of-day)

## Workflow

### Step 1: Create Archive Structure

```bash
DATE=$(date +%Y-%m-%d)
mkdir -p ~/RAW/archive/$DATE/{audio,images,sessions,documents}
```

### Step 2: Collect Desktop Files

```bash
# Move common file types from desktop
mv ~/Desktop/*.{png,jpg,jpeg,heic,pdf,txt,md} \
   ~/RAW/archive/$(date +%Y-%m-%d)/documents/ 2>/dev/null || true
```

### Step 3: Process ~/JARVIS/live/

```bash
# Move recordings to audio
mv ~/JARVIS/live/recording-*.webm \
   ~/RAW/archive/$(date +%Y-%m-%d)/audio/ 2>/dev/null || true

# Move text messages to documents
mv ~/JARVIS/live/text-*.txt \
   ~/RAW/archive/$(date +%Y-%m-%d)/documents/ 2>/dev/null || true
```

### Step 4: Organize by Type

```bash
DATE=$(date +%Y-%m-%d)
ARCHIVE=~/RAW/archive/$DATE

# Sort audio files
mv $ARCHIVE/*.{wav,webm,m4a} $ARCHIVE/audio/ 2>/dev/null || true

# Sort images
mv $ARCHIVE/*.{png,jpg,jpeg,heic,gif} $ARCHIVE/images/ 2>/dev/null || true

# Sort sessions
mv $ARCHIVE/*.jsonl $ARCHIVE/sessions/ 2>/dev/null || true
```

### Step 5: Report Status

```bash
echo "Archive complete: $(find ~/RAW/archive/$(date +%Y-%m-%d) -type f | wc -l) files"
ls -lh ~/RAW/archive/$(date +%Y-%m-%d)
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
