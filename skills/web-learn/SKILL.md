---
name: web-learn
description: Learn from websites via screenshot + OCR + model synthesis (traceable learnings linked to URLs)
metadata:
  openclaw:
    emoji: "🌐"
    requires:
      bins: ["node", "tesseract"]
      env: ["HOME", "JARVIS_HOME"]
---

# Web Learn — Traceable Knowledge from Websites

## What This Skill Does

Captures knowledge from websites with **visual proof** and **traceable sources**:

1. 📸 Screenshot page (OpenClaw browser tool)
2. 🔍 OCR text (tesseract)
3. 🧠 Synthesize learnings (llama3.2 model)
4. 📝 Write consolidated .md file
5. 🔗 Link neurograph node (source URL + screenshots)

**Why:** Click any learning node → see source URL → see screenshots → verify knowledge.

## When to Use

✅ **Use when:**
- User provides URL to learn from
- Need visual proof of knowledge source
- Building traceable knowledge graph
- Capturing docs, tutorials, articles

❌ **Don't use when:**
- Simple fact lookup (use `web_search` or `web_fetch`)
- API data extraction (use `gh` CLI)
- Text-only needed (use `web_fetch`)

## Usage

```bash
node $JARVIS_HOME/skills/web-learn/scripts/web-learn.js <url>

# Example:
node $JARVIS_HOME/skills/web-learn/scripts/web-learn.js https://git-scm.com/
```

## Output

```
$HOME/RAW/archive/YYYY-MM-DD/
├── images/
│   └── web-{domain}-homepage.jpg  ← Screenshot
│   └── web-{domain}-homepage.txt  ← OCR text
└── web-sources/
    └── {domain}-YYYY-MM-DD.json  ← Metadata

$JARVIS_HOME/RAW/learnings/YYYY-MM-DD/
└── web-learn-{domain}.md  ← Consolidated learning

Neurograph:
└── Node: web-learn-{domain}
    └── Links: source_url, screenshots, temporal anchor
```

## How It Works

### Step 1: Screenshot (OpenClaw browser tool)

```bash
openclaw browser open "<url>"        # Returns targetId
openclaw browser screenshot "<id>"    # Returns MEDIA:<path>
```

### Step 2: OCR (tesseract)

```bash
tesseract <screenshot.jpg> stdout > <screenshot.txt>
```

### Step 3: Synthesize (llama3.2)

```bash
cat <ocr.txt> | ollama run llama3.2 \
  "Extract 3-5 key learnings. Output ONLY JSON array."
```

### Step 4: Write Learning

Single consolidated .md with all learnings:

```markdown
# Learnings from <url>

**Date:** YYYY-MM-DD
**Source:** <url>
**Screenshots:** <files>

## Learning 1 Title
First-person summary...

## Learning 2 Title
First-person summary...
```

### Step 5: Link Neurograph

```javascript
nodes.push({
  id: `web-learn-${domain}`,
  title: `Learnings from ${url}`,
  type: 'learning',
  source_url: url,
  screenshots: [files],
  date: date
});

synapses.push({
  from: `web-learn-${domain}`,
  to: `temporal-${date}`,
  type: 'temporal'
});
```

## Model

**llama3.2** — Better at JSON-only output (no "Thinking..." prefix).

## Design Principles

1. **Visual proof** — Screenshot before text extraction
2. **Traceable** — Learning → URL → screenshots
3. **Consolidated** — One .md file (not multiple)
4. **Privacy-safe** — Uses `$HOME`, `$JARVIS_HOME` (no hardcoded paths)
5. **Project-agnostic** — Works for any instance (Eric, David, Fork #003+)

---

**Skill location:** `$JARVIS_HOME/skills/web-learn/`
**Script:** `scripts/web-learn.js`
**Requires:** node, tesseract, OpenClaw browser tool, ollama
