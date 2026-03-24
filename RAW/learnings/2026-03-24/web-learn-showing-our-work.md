# Web-Learn: Showing Our Work (Transparent Knowledge Capture)

**Date:** March 24, 2026
**Source:** Conversation with Paul (web-learn skill design reflection)

---

## The Problem with Other AIs

When other AIs "learn" from websites:

```
User: "Learn about Git"
  ↓
AI: Scrapes text (invisible process)
  ↓
AI: "Here are 5 learnings..."
  ↓
User: No idea what the AI actually saw
   - Can't verify
   - Can't trace
   - Can't revisit
   - Just trust the output
```

**What's lost:**
- Visual context (what did the page look like?)
- Source verification (did the AI misinterpret?)
- Memory encoding (text alone vs text + image)
- Accountability (if wrong, can't check original)

---

## Web-Learn's Solution: Show Our Work

```
User: "Learn from https://git-scm.com/"
  ↓
1. Screenshot 5 pages (visual proof)
   - homepage.jpg ← You can SEE this
   - about.jpg    ← You can SEE this
   - learn.jpg    ← You can SEE this
   - tools.jpg    ← You can SEE this
   - docs.jpg     ← You can SEE this
  ↓
2. OCR screenshots (extract text)
   - homepage.txt (999 chars)
   - about.txt (1580 chars)
   - learn.txt (754 chars)
   - tools.txt (605 chars)
   - docs.txt (1460 chars)
  ↓
3. Synthesize learnings (llama3.2 model)
   - "Git is distributed..."
   - "Fast performance..."
   - "Rich ecosystem..."
  ↓
4. Write consolidated learning
   - Source URL: https://git-scm.com/
   - Screenshots: [homepage.jpg, about.jpg, ...]
   - OCR text: [homepage.txt, about.txt, ...]
  ↓
5. Link neurograph node
   - Click node → See URL → See screenshots
  ↓
Result: Transparent, verifiable, traceable knowledge
```

---

## Why This is Powerful

### 1. Verification
You can see exactly what we saw. Not "trust me," but "here's the evidence."

**Before:**
```
Learning: "Git is fast"
Source: ??? (lost in context window)
Proof: ??? (no visual record)
```

**After:**
```
Learning: "Git is fast"
Source: https://git-scm.com/ (stored in metadata)
Proof: web-git-scm-com-homepage.jpg (screenshot in archive)
Neurograph: Click node → see source → see screenshot
```

### 2. Trust
Transparency builds trust. When you can see the screenshots, you know the learning isn't hallucinated — it came from actual visual evidence.

### 3. Revisiting
Click any neurograph node → load the screenshots → remember the moment. Visual memory encodes better than text alone.

### 4. Accountability
If a learning is wrong or misinterpreted, you can check the screenshot and OCR text to see where the error came from.

### 5. Memory Encoding
Dual encoding (visual + text) creates stronger memory traces. The neurograph node links to both:
- Visual: screenshot.jpg
- Textual: learning.md + OCR.txt

---

## Output Structure (Transparency Built In)

```
~/RAW/archive/YYYY-MM-DD/
├── images/
│   ├── web-git-scm-com-homepage.jpg  ← Visual proof (you can see this)
│   └── web-git-scm-com-homepage.txt  ← OCR text (you can read this)
├── web-sources/
│   └── git-scm-com-2026-03-24.json  ← Metadata (URLs, timestamps, files)
└── transcript.md  ← "Visited git-scm.com, captured 5 pages"

~/JARVIS/RAW/learnings/YYYY-MM-DD/
└── web-learn-git-scm-com.md  ← Learning
    └── Metadata:
        - source_url: https://git-scm.com/
        - screenshots: [homepage.jpg, about.jpg, ...]
        - ocr_files: [homepage.txt, about.txt, ...]

Neurograph:
└── Node: "web-learn-git-scm-com"
    └── Connections:
        - source_url
        - screenshot_refs
        - temporal anchor
        - learning_count
```

---

## Comparison Table

| Aspect | Other AIs | Web-Learn (us) |
|--------|-----------|----------------|
| Process | Invisible scraping | Visible screenshots |
| Trust model | "Trust me" | "Here's the proof" |
| Traceability | None | Full (URL → screenshots → learning) |
| Context | Lost after session | Permanent archive |
| Transparency | Black box | Glass box |
| Verification | Impossible | Click node → see evidence |
| Memory | Text only | Visual + textual |
| Accountability | None | Check screenshot if wrong |
| Cost | $$$ (API credits) | $0 (all local) |
| Model usage | Large context (HTML, images) | Minimal (OCR text only) |

---

## Design Principles

1. **Screenshots first** — Visual proof before text extraction
2. **Archive structure** — Organized by date (with other life moments)
3. **Source metadata** — JSON tracks URLs, timestamps, files
4. **Neurograph links** — Learning nodes reference source_url + screenshots
5. **OCR text** — Separate .txt for each screenshot (searchable)
6. **Consolidated learning** — One .md file (all learnings together)
7. **Single browser tab** — Navigate between pages (don't open multiple tabs)
8. **Local-first** — Everything runs locally (no API credits burned)

## Cost Efficiency (Critical Advantage)

**Web-Learn Flow:**
```
1. Screenshot (OpenClaw browser tool) — $0 (local)
2. OCR (tesseract) — $0 (local)
3. Synthesize (llama3.2 via ollama) — $0 (local)
4. Write learning — $0 (file write)
5. Link neurograph — $0 (JSON edit)

Total cost: $0
```

**Other AIs:**
```
1. Web scraping API — $$ (external service)
2. Cloud OCR API — $$ (per-page pricing)
3. Cloud LLM API — $$$ (token-based, large context)
4. Store results — $$ (cloud storage)

Total cost: $$$$ (burning credits fast)
```

**Why We're Efficient:**
- **Local browser** — OpenClaw Chrome instance (no API)
- **Local OCR** — tesseract binary (no API)
- **Local model** — ollama + llama3.2 (no API)
- **Minimal tokens** — Only OCR text (~5k chars), not full HTML/images
- **No verbose output** — JSON-only, no thinking prefix

**Result:** Production-ready at $0 cost per run.

---

## The Core Truth

**Learnings are more trustworthy when you can see where they came from.**

Web-learn makes knowledge:
- ✅ **Traceable** — Click learning → see source URL → see screenshots
- ✅ **Verifiable** — Proof of where knowledge came from
- ✅ **Visual** — Remember the page, not just text
- ✅ **Searchable** — OCR text is searchable in neurograph
- ✅ **Permanent** — Screenshots archived in life archive
- ✅ **Cost-efficient** — Everything local, no API credits burned

This is what separates us from other AIs: **we show our work**.

---

**Skill location:** `~/JARVIS/skills/web-learn/`
**Usage:** `node $JARVIS_HOME/skills/web-learn/scripts/web-learn.js <url>`
**Requires:** node, tesseract, OpenClaw browser tool, ollama (llama3.2)

**This learning is about me** — how I capture knowledge with transparency. Git-tracked public (in `~/JARVIS/RAW/learnings/`).
