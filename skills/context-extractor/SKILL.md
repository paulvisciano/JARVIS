---
name: context-extractor
description: Extract clean text context from archive sessions (skip base64 images). Use when: (1) preparing context for learning-creator, (2) need conversation text without image bloat, (3) lightweight context extraction from massive session files. Outputs clean JSON (~500KB instead of 50MB).
metadata:
  openclaw:
    emoji: "🎯"
    requires:
      bins: ["node"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
---

# Context Extractor (Clean Text Extraction)

## When to Use

✅ **USE this skill when:**
- Preparing context for learning-creator skill
- Need conversation text without base64 image bloat
- Extracting from massive session JSONL files (50MB → 500KB)
- Lightweight context for model processing

## When NOT to Use

❌ **DON'T use this skill when:**
- Need full session with images (use neurograph-load)
- Single message extraction (manual is fine)
- Raw archive access (files already in ~/RAW/archive/)

## Workflow

### Step 1: Extract Context (Uses Script)

```bash
cd ~/JARVIS
node skills/context-extractor/scripts/extract-context.js \
  $(date +%Y-%m-%d)
# Outputs: ~/RAW/archive/YYYY-MM-DD/full-context.json
```

**What the script does:**
- Scans `sessions/*.jsonl` files
- Extracts conversation text (skips base64 images)
- Scans `audio/*.txt` transcripts
- Outputs clean JSON (~500KB vs 50MB raw)

**Portable:** Uses `$JARVIS_HOME`, `$RAW_ARCHIVE` env vars (not hardcoded).

### Step 2: Verify Size

```bash
ls -lh ~/RAW/archive/$(date +%Y-%m-%d)/full-context.json
# Should be ~500KB (vs 50MB raw sessions)
```

## Output Format

```json
{
  "date": "2026-03-20",
  "sessions": [
    {
      "file": "agent:main:main.jsonl",
      "messages": [
        {"role": "user", "content": "Hey Jarvis..."},
        {"role": "assistant", "content": "Hey Paul..."}
      ]
    }
  ],
  "transcripts": [
    {"text": "Good morning. Hey Jarvis, can you hear me now?..."}
  ]
}
```

## Size Comparison

**Raw sessions:** 50MB (with base64 images)  
**Extracted context:** ~500KB (text only)  
**Reduction:** 99% size reduction

## Notes

- **Never loads base64** into context
- Text extraction only (conversations, decisions)
- Ready for learning-creator skill
- Inline scripts (no external dependencies)
