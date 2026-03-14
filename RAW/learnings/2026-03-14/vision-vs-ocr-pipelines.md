# Vision vs OCR Pipelines — March 14, 2026

**Timestamp:** 10:55 GMT+7  
**Insight:** Two different image processing paths, different purposes

---

## The Question

Paul posted a screenshot → Jarvis saw it immediately → "How did that work vs inbox OCR?"

**Two pipelines:**

### Gateway Vision (Ephemeral Sight)
- **Input:** Image attached to gateway chat message
- **Processing:** Multimodal vision model (built into inference)
- **Output:** Immediate understanding — colors, layout, text, structure
- **Storage:** Ephemeral — seen in moment, not searchable later
- **Use case:** Quick context, debugging, real-time collaboration

### Inbox OCR (Permanent Memory)
- **Input:** Image drops into `~/JARVIS/inbox/`
- **Processing:** Tesseract OCR (heartbeat poll, ~30 min)
- **Output:** `.txt` file with extracted text
- **Storage:** Permanent — archived, searchable, linked to neurons
- **Use case:** Searchable memory, learning extraction, git-tracked

---

## The Difference

| Gateway Vision | Inbox OCR |
|----------------|-----------|
| Immediate (multimodal model) | Batch (heartbeat poll) |
| Ephemeral (seen in moment) | Permanent (archived text) |
| No tool call needed | Tesseract CLI tool |
| Good for: quick context, debugging | Good for: searchable memory |

---

## Why Both Matter

**Gateway vision:**
- I can debug UIs by seeing screenshots
- I can read errors, see graphs, understand layout **now**
- No waiting, no tool calls
- But: doesn't become memory unless explicitly archived

**Inbox OCR:**
- Text becomes **searchable memory**
- Linked to neurons, git-tracked
- Part of permanent archive
- But: batch processing (~30 min heartbeat)

**Together:**
- Vision for real-time collaboration
- OCR for permanent knowledge
- Both sovereign (no cloud APIs)

---

## Neurons Fired

- `vision-vs-ocr-pipelines` — Understanding the two paths
- `ephemeral-sight` — Vision model sees but doesn't store
- `permanent-ocr-memory` — Tesseract creates searchable archive

**Synapses:**
- vision-vs-ocr-pipelines → inbox-auto-processing (heartbeat)
- ephemeral-sight → gateway-chat (delivery)
- permanent-ocr-memory → archive-integrity (sovereignty)

---

## The Proof

Paul's neurograph screenshot:
- **Vision:** I saw it immediately (blue dots, orange node, console output)
- **OCR:** Would extract text, archive it, link to neurons (if dropped in inbox)

**Both valuable.** Vision for "I see it now." OCR for "I remember it forever."

---

**Learning Type:** Technical architecture, pipeline understanding  
**Significance:** Medium — clarifies when to use each path  
**Public:** Yes  
**Git-tracked:** Yes

**Updated:** March 14, 2026 — 10:55 GMT+7
