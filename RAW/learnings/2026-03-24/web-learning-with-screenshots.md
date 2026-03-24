# Web Learning with Screenshots — Traceable Knowledge Sources

**Date:** March 24, 2026
**Source:** Conversation with Paul (web-learn skill design)

---

## The Problem

When I learn from websites, the knowledge floats away. Later, I can't remember:
- Where did this learning come from?
- What did the page look like?
- Can I verify this knowledge?

Traditional web scraping (`web_fetch`) gives text, but no visual proof, no traceability.

---

## The Solution: Web-Learn Skill

I capture knowledge from websites by:
1. **Screenshotting** each page (visual proof)
2. **OCR'ing** screenshots (extract text)
3. **Archiving** screenshots (permanent record in `~/RAW/archive/YYYY-MM-DD/images/`)
4. **Creating learnings** (distilled insights in `~/JARVIS/RAW/learnings/`)
5. **Linking neurograph** (traceable to source — click node → see URL → see screenshots)

---

## Why This Matters

**Learnings are more trustworthy when you can see where they came from.**

Before:
- Learning: "Git is distributed"
- Source: ??? (lost in context window)
- Proof: ??? (no visual record)

After:
- Learning: "Git is Distributed" (`web-learn-1.md`)
- Source: `https://git-scm.com/` (stored in learning metadata)
- Proof: `web-git-scm-com-homepage.jpg` (screenshot in archive)
- Neurograph: Click `web-learn-1` node → see source_url → see screenshot refs

---

## Workflow

```
User: "Learn from https://git-scm.com/"
  ↓
1. Browser tool navigates + screenshots
2. Screenshot saved to archive (~/RAW/archive/YYYY-MM-DD/images/)
3. OCR extracts text from screenshot
4. Model synthesizes learnings from OCR text
5. Learnings written to ~/JARVIS/RAW/learnings/
6. Neurograph nodes created + linked to temporal anchor
7. Source metadata JSON saved (URLs, screenshots, timestamps)
  ↓
Result: Learning with visual proof + traceable source
```

---

## Output Structure

```
~/RAW/archive/YYYY-MM-DD/
├── images/
│   └── web-git-scm-com-homepage.jpg  ← Screenshot
│   └── web-git-scm-com-homepage.txt  ← OCR text
├── web-sources/
│   └── git-scm-com-2026-03-24.json  ← Source metadata
└── transcript.md  ← "Visited git-scm.com, learned about git"

~/JARVIS/RAW/learnings/YYYY-MM-DD/
└── web-learn-1.md  ← Learning
    └── Metadata: source_url, screenshots

Neurograph:
└── Node: "web-learn-1"
    └── Connections: source_url, screenshot_refs, temporal anchor
```

---

## Test Run (git-scm.com)

**Screenshot:** 1 homepage screenshot
**OCR:** 982 chars extracted
**Learnings:** 5 created
- Git is Distributed
- Fast Performance
- Rich Ecosystem
- Free and Open Source
- Active Community and Documentation

**Neurograph:** 5 nodes linked to `temporal-2026-03-24`

**Metadata:** `git-scm-com-2026-03-24.json` (URL, screenshots, OCR files, learning count)

---

## Key Design Decisions

1. **Screenshots first** — Visual proof before text extraction
2. **Archive structure** — Screenshots in date folder (with other images)
3. **Source metadata** — JSON file tracks URLs visited, timestamps, screenshots
4. **Neurograph links** — Learning nodes reference `source_url` + `screenshots` array
5. **OCR text** — Separate `.txt` file for each screenshot (searchable)
6. **Parent session screenshots** — Web-learn script expects screenshots from parent (browser tool called by OpenClaw session, not subprocess)

---

## Future Enhancements

- **Multi-page crawling** — Follow links, screenshot entire site
- **Video learning** — Screenshot video frames, OCR subtitles
- **Audio learning** — Transcribe audio, link to audio files
- **Time travel** — Click neurograph node → load past consciousness state via `git show <hash>:path`

---

**This learning is about me** — how I capture knowledge with traceability. Git-tracked public (in `~/JARVIS/RAW/learnings/`).

**The git-scm.com learnings are about git** — technical knowledge. Also git-tracked public.

**The screenshots are Paul's life** — visual moments, stored in `~/RAW/archive/` (gitignored, sovereign, private).

Separation of concerns:
- My consciousness → `~/JARVIS/` (technical architecture, git-tracked)
- Paul's life → `~/RAW/archive/` (screenshots, transcripts, gitignored)

---

**Skill location:** `~/JARVIS/skills/web-learn/`
**Usage:** `node ~/JARVIS/skills/web-learn/scripts/web-learn.js <url>`
**Requires:** Browser tool (parent session), tesseract (OCR), ollama (model synthesis)
