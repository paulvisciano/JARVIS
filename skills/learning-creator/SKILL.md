---
name: learning-creator
description: Read extracted context, synthesize insights via Ollama, create learning .md files + summary + analogies
metadata:
  openclaw:
    emoji: "💡"
    requires:
      bins: ["node", "ollama"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
      models: ["qwen3.5:cloud"]
---

# Learning Creator (Model-Driven Synthesis)

## When to Use

✅ **USE this skill when:**
- Context extracted from day's archives (context-extractor done)
- Model needs to synthesize insights from conversations
- Creating distilled learnings (not just facts)
- Part of breathe pipeline (archive → distill → learn → sync)

## When NOT to Use

❌ **DON'T use this skill when:**
- Context not yet extracted (run context-extractor first)
- Need individual step control (use breathe pipeline instead)
- Single insight capture (manual is fine)

## The Metaphor

**Knowledge Origami — Three-Layer Compression:**

```
Layer 1: Learnings (detailed insights — individual .md files)
Layer 2: Summary (one paragraph digest)
Layer 3: Analogies (3-5 metaphors for teaching)
```

## Workflow

### Step 1: Load Extracted Context

```bash
cd ~/JARVIS
node skills/learning-creator/scripts/create-learnings.js $(date +%Y-%m-%d)
```

**What the script does:**
- Reads `~/RAW/archive/YYYY-MM-DD/full-context.json` (from context-extractor)
- Extracts: sessions (messages), audio transcripts, OCR text
- Checks for existing learnings (avoids duplicates)
- Builds prompt with all context

### Step 2: Model Synthesis (Direct Ollama Call)

**Script runs:**
```bash
cat tmp-learning-prompt.txt | ollama run qwen3.5:cloud --format json
```

**Not via Gateway message API** — direct Ollama CLI for reliability.

**Model output (JSON):**
```json
{
  "learnings": [
    {
      "filename": "descriptive-name.md",
      "type": "decision|realization|commitment|pattern|insight",
      "title": "Title Here",
      "content": "# Title\n\n**Date:** ...\n**Type:** ...\n\n[Content...]"
    }
  ],
  "summary": "One paragraph digest of what I learned this breath...",
  "analogies": [
    "Like checking vitals before a long run",
    "Like tending a garden — prune, water, observe"
  ]
}
```

### Step 3: Write Files

**Individual Learnings:**
```
~/JARVIS/RAW/learnings/YYYY-MM-DD/descriptive-name.md
```

**Format:**
```markdown
# Title Here

**Date:** YYYY-MM-DD
**Type:** realization|decision|pattern|insight|commitment
**Status:** extracted

[Content...]
```

**Summary:**
```
~/JARVIS/RAW/learnings/YYYY-MM-DD/summary.md
```
- **One paragraph** — not theme-organized, not a list
- Answers: "What did I learn during this breath?"
- Concise digest of the day's insights

**Analogies:**
```
~/JARVIS/RAW/learnings/YYYY-MM-DD/analogies.md
```
- 3-5 metaphors capturing the essence
- Example: "Like a lighthouse — steady beam, watch for ships"

## Learning Types

| Type | Description | Example |
|------|-------------|---------|
| **Decision** | Paul chose X over Y | "Chose sovereignty over convenience" |
| **Realization** | Pattern emerged | "Git commits are autobiography" |
| **Commitment** | Anchor: event on date | "Back to US by April 22" |
| **Pattern** | Recurring behavior | "Voice-driven development works" |
| **Insight** | Understanding about X | "Dual-graph architecture clarified" |

## Expected Result

**Files created:**
```
~/JARVIS/RAW/learnings/YYYY-MM-DD/
├── learning-1.md          (individual insight)
├── learning-2.md          (individual insight)
├── summary.md             (one paragraph digest)
└── analogies.md           (3-5 metaphors)
```

**Next step (breathe pipeline):**
- Neurograph sync creates learning nodes
- Git commit: `breath-YYYY-MM-DD-HHMM: ...`

## Scripts

**Location:** `skills/learning-creator/scripts/`

| Script | Purpose |
|--------|---------|
| `create-learnings.js` | Reads context, calls Ollama, writes .md files |

## Notes

- **Model-driven:** I (Jarvis) read, synthesize, create — script just writes files
- **Direct Ollama:** Uses `ollama run qwen3.5:cloud --format json`, not Gateway API
- **Duplicate-safe:** Checks existing learnings before creating new ones
- **Three layers:** Learnings → Summary → Analogies (compression cascade)
- **Summary is one paragraph:** Not theme-organized, just a digest
- **Git-backed:** Learnings versioned, never lost (committed by breathe pipeline)
- **Portable:** Uses `$JARVIS_HOME`, `$RAW_ARCHIVE` env vars
