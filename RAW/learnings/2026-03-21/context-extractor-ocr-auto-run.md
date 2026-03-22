# Context Extractor Should Auto-Run OCR on Screenshots

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Update

Added `extractOCR()` function to context-extractor/extract-context.js:

1. Scans `~/RAW/archive/YYYY-MM-DD/images/` for all image files
2. Checks if `.txt` file exists (reuses existing OCR)
3. Runs `tesseract` on images without OCR
4. Saves output as `.txt` files alongside images
5. Includes OCR text in `full-context.json` under `ocrTexts` array

## Why This Matters

Screenshots contain critical context (UI states, conversations, NeuroGraph views). Auto-OCR ensures:
- No manual OCR steps needed
- All visual context captured
- OCR text searchable in NeuroGraph
- Bruce screenshots, UI captures all indexed

## Output Now Includes

```json
"ocrTexts": [
  {"file": "Screenshot 2026-03-21 at 1.37.57 PM.png", "text": "..."}
]
```