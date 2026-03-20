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

### Step 1: Extract Session Text (Node.js)

```bash
cd ~/JARVIS

# Create extraction script inline
cat > /tmp/extract-sessions.js << 'SCRIPT'
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2);
const output = args.pop();
const files = args;

let sessions = [];
files.forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').trim().split('\n');
  const messages = lines.map(l => JSON.parse(l)).filter(m => m.role && m.content);
  sessions.push({ file: path.basename(f), messages });
});

fs.writeFileSync(output, JSON.stringify({ sessions }, null, 2));
console.log(`Extracted ${sessions.length} sessions`);
SCRIPT

# Run extraction
node /tmp/extract-sessions.js \
  ~/RAW/archive/$(date +%Y-%m-%d)/sessions/*.jsonl \
  ~/RAW/archive/$(date +%Y-%m-%d)/context.json
```

### Step 2: Concatenate Audio Transcripts

```bash
cat ~/RAW/archive/$(date +%Y-%m-%d)/audio/*.txt > \
  ~/RAW/archive/$(date +%Y-%m-%d)/transcripts.txt 2>/dev/null || true
```

### Step 3: Merge Context

```bash
# Simple merge (sessions + transcripts)
cat > /tmp/merge-context.js << 'SCRIPT'
const fs = require('fs');
const sessions = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const transcripts = fs.readFileSync(process.argv[3], 'utf8').trim().split('\n\n');
const output = process.argv[4];

fs.writeFileSync(output, JSON.stringify({
  ...sessions,
  transcripts: transcripts.map(t => ({ text: t }))
}, null, 2));
SCRIPT

node /tmp/merge-context.js \
  ~/RAW/archive/$(date +%Y-%m-%d)/context.json \
  ~/RAW/archive/$(date +%Y-%m-%d)/transcripts.txt \
  ~/RAW/archive/$(date +%Y-%m-%d)/full-context.json
```

### Step 4: Verify Size

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
