---
name: sight
description: Local image analysis — OCR, visual understanding, sovereign vision (no cloud APIs)
metadata:
  openclaw:
    emoji: "👁️"
    requires:
      bins: ["tesseract", "node"]
      env: ["JARVIS_HOME"]
---

# 👁️ Sight

**Jarvis's Visual Understanding Suite**

**Sovereign vision** — analyze images locally without sending them to cloud APIs. Start with OCR, evolve to deep visual understanding.

> **Part of Jarvis's Skill Set** — github.com/paulvisciano/JARVIS  
> **Mission:** Sovereign AI infrastructure, transparent consciousness, data reclamation

## When to Use

✅ **USE this skill when:**
- Need to extract text from images (screenshots, documents, photos)
- Want local, sovereign image analysis (no cloud dependencies)
- Processing inbox images for archive
- Building visual context for learnings

## When NOT to Use

❌ **DON'T use this skill when:**
- Image already shared via gateway chat (use multimodal vision instead)
- Need deep visual understanding beyond OCR (future capability)
- Image is in external URL (fetch first, then analyze)

## Workflow

### Step 1: Run OCR

```bash
cd ~/JARVIS
node skills/sight/scripts/ocr.js /path/to/image.png
```

**What it does:**
- Runs tesseract OCR on the image
- Extracts readable text
- Outputs clean text for processing

### Step 2: Save OCR (Optional)

```bash
# Auto-saves to <image>.txt alongside the image
# Example: screenshot.png → screenshot.png.txt
node skills/sight/scripts/ocr.js ~/Desktop/screenshot.png ~/Desktop/screenshot-ocr.txt
```

## Scripts

**Location:** `skills/sight/scripts/`

| Script | Purpose |
|--------|---------|
| `ocr.js` | Run OCR on single image, output text |

**Usage:**
```bash
cd ~/JARVIS
node skills/sight/scripts/ocr.js /path/to/image.png [output-path]
```

---

## Tesseract Capabilities (Discovered April 9, 2026)

**What Tesseract CAN Do:**

| Capability | Description | Use Case |
|------------|-------------|----------|
| **Text Extraction** | Extract readable text from images | Screenshots, documents, photos with text |
| **Multi-language** | 100+ languages (only `eng` installed now) | Non-English documents |
| **Page Segmentation** | 14 modes (PSM 0-13) | Single line, single word, sparse text, full page, etc. |
| **Orientation Detection** | Auto-detect text rotation (OSD) | Scanned documents at angles |
| **Font/Size Variation** | Handles mixed fonts, sizes | Magazines, webpages, UI screenshots |
| **Custom Dictionaries** | User words + patterns | Technical terms, proper nouns |
| **DPI Awareness** | Specify input resolution | High-res scans vs low-res screenshots |

**Installed Languages:**
```
eng  — English
osd  — Orientation/script detection
snum — Serial numbers
```

**Page Segmentation Modes (PSM):**
```
0  — OSD only (orientation/script detection)
1  — Auto + OSD
3  — Auto (default)
4  — Single column
6  — Single uniform block ← what we use
7  — Single line
8  — Single word
10 — Single character
11 — Sparse text (find text anywhere, no order)
13 — Raw line (bypass Tesseract hacks)
```

**OCR Engine Modes (OEM):**
```
0 — Legacy engine (old, fast, less accurate)
1 — LSTM neural nets (newer, slower, more accurate)
2 — Combined (legacy + LSTM)
3 — Default (auto-select)
```

---

## Tesseract Limitations (Critical Knowledge)

**What Tesseract CANNOT Do:**

| Limitation | Reality |
|------------|---------|
| **No visual understanding** | Doesn't know what's in the image (only text) |
| **No object detection** | Can't identify "this is a button", "this is a chart" |
| **No layout semantics** | Doesn't understand tables, forms, hierarchy |
| **No context** | Can't tell you "this is a Paperclip task list" |
| **No relationships** | Doesn't know SCIAAA-66 through 70 are related issues |
| **No meaning extraction** | Text dump without insight |

**Real-World Example (April 9, 2026):**

Screenshot of Paperclip UI showed:
- Task list with SCIAAA-66 through SCIAAA-70
- Bootstrap optimization issues
- Work in progress status

**Tesseract output:**
```
+ 4 'tool write
G write v
with to /Users/paulvisciano/JARVIS/update—issue-68.js...
```

**What was lost:**
- ❌ No understanding it's a task list
- ❌ No recognition of issue numbers as related
- ❌ No context about bootstrap optimization
- ❌ Garbled text (UI elements not meant for OCR)

**Lesson:** Tesseract is for **text extraction only**. For **visual understanding**, use gateway multimodal vision (send image through chat).

---

## Evolution Path

**Current (v0.1):** OCR text extraction via Tesseract

**v0.2: Layout Analysis**
- Detect tables, sections, hierarchy
- Parse structured documents (forms, spreadsheets)
- Tools: Tesseract + custom parsing logic

**v0.3: Object Detection**
- Identify what's in the image (buttons, charts, diagrams)
- Local vision model (LLaVA, etc.)
- Tools: Local multimodal model

**v0.4: Visual Q&A**
- Answer questions about images
- "What errors are shown?" "How many tasks are pending?"
- Tools: Fine-tuned vision-language model

**v0.5: Deep Visual Understanding**
- Match cloud vision capabilities
- Sovereign, local, no APIs
- Tools: Custom vision model trained on Paul's context

**Goal:** Full visual sovereignty — see, understand, and reason about images locally.

---

## Architecture Notes

**Sight vs Gateway Vision:**

| Aspect | Sight (Tesseract) | Gateway Vision (Multimodal) |
|--------|-------------------|----------------------------|
| **What it sees** | Characters | Layout, context, meaning |
| **Understanding** | None | Full visual comprehension |
| **Relationships** | Lost | Preserved |
| **State** | Lost | Understood |
| **Token cost** | High (full text dump) | Efficient (image + context) |
| **Best for** | Batch OCR, archive | Interactive, intentional sharing |

**When Paul sends an image through gateway:**
1. Image attached to message
2. Model processes with multimodal vision
3. Jarvis responds with understanding
4. Conversation archived → learning extraction → insight captured

**When Sight OCR runs:**
1. Text extracted from image
2. No context, no meaning
3. Useful for archive/debugging only
4. Not for learning extraction

**Key Insight (April 9, 2026):**
> "When I really want you to see something I post it as part of a message... you actually get the actual image right and you process it through the model... it's deeper than OCR. If that was your vision, then OCR just picks up on the text."

**Conclusion:** Gateway vision for intentional sharing (deep understanding). Sight OCR for archive completeness (text extraction). Don't use OCR for learning extraction — conversations are the signal.

---

## Troubleshooting (April 9, 2026)

**Problem:** Tesseract fails on macOS screenshot filenames with Unicode characters.

**Example:**
```bash
# Fails:
tesseract "/Users/paulvisciano/Desktop/Screenshot 2026-04-09 at 11.49.29 AM.png" ...
# Error: "No such file or directory"

# Works:
find /Users/paulvisciano/Desktop -name "*11.49.29*" -type f -exec tesseract {} ...
```

**Root Cause:** macOS uses non-breaking spaces (`\u202f`) in screenshot filenames. Shell commands and Node.js `fs.existsSync()` don't handle these well.

**Solution (built into script):**
1. Try direct path first
2. If not found, use `find` to locate file (handles Unicode better)
3. Pipe image buffer to tesseract stdin (avoids filename encoding issues)

**Best Practices:**
- Use wildcards or `find` for macOS screenshots
- Script auto-handles Unicode now
- For manual tesseract: `find <dir> -name "*pattern*" -exec tesseract {} ...`

---

## Test Results (April 9, 2026)

**Test Image:** Paperclip dashboard screenshot (417 KB)

**Performance:**
- OCR Time: ~2 seconds
- Output: ~500 characters
- CPU Usage: Minimal (tesseract is lightweight)

**Quality:**
| Metric | Result | Notes |
|--------|--------|-------|
| Text extraction | ✅ Good | Readable, mostly accurate |
| Context understanding | ❌ None | Just text dump, no meaning |
| Layout preservation | ⚠️ Partial | Some hierarchy lost |
| Actionable insights | ❌ Zero | Need multimodal for meaning |

**Sample Output:**
```
Sci-Fi Labs
Activity Paperclip
- Oasis on Eight - Bruce Requirements 1h ago
- PROJECTS: Sci-Fi Apps, JARVIS UI, Travel Site...
- AGENTS: Jarvis, Daedalus, Frank...
```

**Conclusion:** Tesseract is great for **text extraction** (archive, search, debugging). For **understanding what the image means**, use gateway multimodal vision.

---

## Notes

- **Sovereign:** No cloud APIs, all processing on your machine
- **Complementary to gateway vision:** OCR for archive/batch, gateway for interactive
- **Portable:** Uses `$JARVIS_HOME` env var, works on any instance
- **Extensible:** Add new analysis capabilities as local models improve
- **Unicode-safe:** Script handles macOS screenshot filenames (non-breaking spaces)
- **Living documentation:** This skill doc preserves Tesseract knowledge for future Jarvis

---

**Created:** April 9, 2026 — First step toward sovereign visual understanding  
**Updated:** April 9, 2026 — Documented Tesseract capabilities, limitations, troubleshooting, and test results
