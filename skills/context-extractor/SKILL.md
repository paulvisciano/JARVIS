---
name: context-extractor
description: Extract clean text context from archive sessions (skip base64 images). Use when: (1) preparing context for learning-creator, (2) need conversation text without image bloat, (3) lightweight context extraction from massive session files. Outputs clean JSON (~500KB instead of 50MB).
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
- Need full session with images (use neuro-graph-loader)
- Single message extraction (manual is fine)
- Raw archive access (files already in ~/RAW/archive/)

## Workflow

### Step 1: Extract Session Text

```bash
cd ~/JARVIS
node skills/context-extractor/scripts/extract-session-text.js \
  ~/RAW/archive/$(date +%Y-%m-%d)/sessions/*.jsonl \
  --output ~/RAW/archive/$(date +%Y-%m-%d)/context.json
```

**What it does:**
- Parses JSONL session files
- Extracts conversation text (user + assistant messages)
- **SKIPS base64 images** (huge size reduction)
- Outputs clean JSON structure

### Step 2: Load Audio Transcripts

```bash
# Concatenate all audio transcripts
cat ~/RAW/archive/$(date +%Y-%m-%d)/audio/*.txt > \
  ~/RAW/archive/$(date +%Y-%m-%d)/transcripts.txt
```

### Step 3: Merge Context

```bash
# Combine sessions + transcripts
node skills/context-extractor/scripts/merge-context.js \
  --sessions ~/RAW/archive/$(date +%Y-%m-%d)/context.json \
  --transcripts ~/RAW/archive/$(date +%Y-%m-%d)/transcripts.txt \
  --output ~/RAW/archive/$(date +%Y-%m-%d)/full-context.json
```

### Step 4: Ready for Learning-Creator

```bash
# Context ready for model processing
ls -lh ~/RAW/archive/$(date +%Y-%m-%d)/full-context.json
# ~500KB (vs 50MB raw sessions)
```

## Scripts

**Location:** `skills/context-extractor/scripts/`

| Script | Purpose |
|--------|---------|
| `extract-session-text.js` | Parse JSONL, extract text (skip base64) |
| `merge-context.js` | Combine sessions + transcripts |
| `count-tokens.js` | Estimate context size |

## Output Format

```json
{
  "date": "2026-03-20",
  "sessions": [
    {
      "id": "agent:main:main",
      "messages": [
        {"role": "user", "content": "Hey Jarvis..."},
        {"role": "assistant", "content": "Hey Paul..."}
      ]
    }
  ],
  "transcripts": [
    "Good morning. Hey Jarvis, can you hear me now?..."
  ],
  "tokenCount": 50000
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
- Preserves conversation flow, drops image data
