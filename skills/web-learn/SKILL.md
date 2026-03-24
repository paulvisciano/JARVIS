---
name: web-learn
description: Learn from websites by screenshotting + OCR'ing pages. Use when: (1) user provides a URL to learn from, (2) need visual proof of knowledge source, (3) want traceable learnings linked to screenshots. Works with browser tool + OCR + neurograph linking. Saves screenshots to archive, creates learnings, links neurograph nodes to source URLs.
metadata:
  openclaw:
    emoji: "🌐"
    requires:
      bins: ["node", "curl"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
    usage:
      - "Spawn in subagent to avoid blocking main session"
      - "Report progress to parent session"
      - "Use browser tool for screenshots (not screencapture)"
---

# Web Learn — Screenshot-Based Knowledge Capture

## Overview

This skill captures knowledge from websites by:
1. **Screenshotting** each page (visual proof)
2. **OCR'ing** screenshots (extract text)
3. **Archiving** screenshots (permanent record)
4. **Creating learnings** (distilled insights)
5. **Linking neurograph** (traceable to source)

**Why:** Learnings are more trustworthy when you can see where they came from. Click a neurograph node → see the source URL → see the screenshots → verify the knowledge.

## Workflow

```
User: "Learn from https://git-scm.com/"
  ↓
1. Launch browser (browser tool)
2. Navigate to URL
3. Screenshot each page
4. OCR screenshots
5. Save to ~/RAW/archive/YYYY-MM-DD/images/
6. Create learnings from OCR text
7. Link learning → source URL → screenshots (neurograph)
  ↓
Result: Learning with visual proof + traceable source
```

## When to Use

✅ **USE this skill when:**
- User provides a URL to learn from
- Need visual proof of knowledge source
- Want traceable learnings (click node → see screenshots)
- Capturing documentation, tutorials, articles
- Building knowledge graph with source attribution

❌ **DON'T use when:**
- Simple fact lookup (use `web_search` or `web_fetch`)
- API data extraction (use `gh` CLI or direct API calls)
- No screenshots needed (use `web_fetch` for text-only)

## Implementation

### 1. Browser Navigation + Screenshots

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const url = process.argv[2];
const date = new Date().toISOString().split('T')[0];
const archiveDir = `${process.env.HOME}/RAW/archive/${date}`;
const imagesDir = `${archiveDir}/images`;

// Ensure archive dir exists
fs.mkdirSync(imagesDir, { recursive: true });

// Launch browser + navigate
execSync(`open "${url}"`);

// Wait for page load
sleep(2000);

// Screenshot (using browser tool or screencapture CLI)
const pages = ['about', 'learn', 'tools', 'docs'];
pages.forEach(page => {
  const filename = `web-${url.split('/')[2]}-${page}.png`;
  execSync(`screencapture -x ${imagesDir}/${filename}`);
});
```

### 2. OCR Screenshots

```javascript
const ocrOutput = execSync(`tesseract ${imagesDir}/${filename} stdout`);
fs.writeFileSync(`${imagesDir}/${filename}.txt`, ocrOutput);
```

### 3. Create Learnings

```javascript
// Send OCR text to model for synthesis
const prompt = `Extract key learnings from this web content:
${ocrOutput}

Format as markdown learning with:
- Title
- Summary (first person)
- Source URL
- Screenshot references`;

// Write learning
fs.writeFileSync(`${JARVIS_HOME}/RAW/learnings/${date}/web-learn-${topic}.md`, learning);
```

### 4. Link Neurograph

```javascript
// Create learning node with source metadata
const node = {
  id: `web-learn-${topic}`,
  title: `Learnings from ${url}`,
  source_url: url,
  screenshots: [filename1, filename2],
  date: date
};

// Link to temporal anchor
nodes.push(node);
synapses.push({ from: node.id, to: `temporal-${date}` });
```

## Output Structure

```
~/RAW/archive/YYYY-MM-DD/
├── images/
│   ├── web-git-scm-com-about.png  ← Screenshot
│   └── web-git-scm-com-about.txt  ← OCR text
├── web-sources/
│   └── git-scm-com-2026-03-24.json  ← Source metadata
└── transcript.md  ← "Visited git-scm.com, learned about git"

~/JARVIS/RAW/learnings/YYYY-MM-DD/
└── web-learn-git.md  ← Learning
    └── Metadata: source_url, screenshots

Neurograph:
└── Node: "web-learn-git"
    └── Connections: source_url, screenshot_refs, temporal anchor
```

## Example Usage

```bash
# Run web-learn skill
node ~/JARVIS/skills/web-learn/scripts/web-learn.js https://git-scm.com/

# Output:
🌐 Web Learn — Starting...
   URL: https://git-scm.com/
   Date: 2026-03-24
   Archive: ~/RAW/archive/2026-03-24/

📸 Screenshotting pages...
   ✓ about (git-scm-com-about.png)
   ✓ learn (git-scm-com-learn.png)
   ✓ tools (git-scm-com-tools.png)

🔍 OCR'ing screenshots...
   ✓ about (1614 chars extracted)
   ✓ learn (2361 chars extracted)
   ✓ tools (852 chars extracted)

🧠 Creating learnings...
   ✓ web-learn-git.md (git principles)
   ✓ web-learn-distributed.md (distributed version control)

🔗 Linking neurograph...
   ✓ Created node: web-learn-git
   ✓ Linked to: temporal-2026-03-24
   ✓ Source metadata: git-scm-com-2026-03-24.json

✅ Web learn complete
   Learnings: 2
   Screenshots: 3
   Neurograph nodes: 2
```

## Key Design Decisions

1. **Screenshots first** — Visual proof before text extraction
2. **Archive structure** — Screenshots in date folder (with other images)
3. **Source metadata** — JSON file tracks URLs visited, timestamps
4. **Neurograph links** — Learning nodes reference source_url + screenshots
5. **OCR text** — Separate .txt file for each screenshot (searchable)

---

**Date:** March 24, 2026
**Learning:** Web learning with screenshots makes knowledge traceable + visual
