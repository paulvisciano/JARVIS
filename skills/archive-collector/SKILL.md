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

### Step 1: Process Files by Creation Date

```bash
# For each file in ~/JARVIS/live/, check creation date
for f in ~/JARVIS/live/*.{webm,txt,wav} 2>/dev/null; do
  # Get file creation date (macOS: stat -f "%Sm", Linux: stat -c "%y")
  DATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$f" 2>/dev/null)
  
  # Ensure archive structure exists for that date
  mkdir -p ~/RAW/archive/$DATE/{audio,images,sessions,documents}
  
  # Move to correct date folder by type
  case "$f" in
    *.webm|*.wav|*.m4a) mv "$f" ~/RAW/archive/$DATE/audio/ ;;
    *.png|*.jpg|*.jpeg|*.heic|*.gif) mv "$f" ~/RAW/archive/$DATE/images/ ;;
    *.jsonl) mv "$f" ~/RAW/archive/$DATE/sessions/ ;;
    *.txt|*.pdf|*.md) mv "$f" ~/RAW/archive/$DATE/documents/ ;;
  esac
done
```

### Step 2: Collect Desktop Files (Organized by Type + Date)

```bash
# For desktop files, use file creation date
for f in ~/Desktop/*.{png,jpg,jpeg,heic,gif,pdf,txt,md} 2>/dev/null; do
  DATE=$(stat -f "%Sm" -t "%Y-%m-%d" "$f" 2>/dev/null)
  mkdir -p ~/RAW/archive/$DATE/{audio,images,sessions,documents}
  
  case "$f" in
    *.png|*.jpg|*.jpeg|*.heic|*.gif) mv "$f" ~/RAW/archive/$DATE/images/ ;;
    *) mv "$f" ~/RAW/archive/$DATE/documents/ ;;
  esac
done
```

### Step 3: Report Status

```bash
echo "Archive complete: $(find ~/RAW/archive/$(date +%Y-%m-%d) -type f 2>/dev/null | wc -l) files"
ls -lh ~/RAW/archive/$(date +%Y-%m-%d) 2>/dev/null
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
