# Context Extractor Auto-Runs OCR on Screenshots in Archive

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## What Changed

**context-extractor/extract-context.js** - Now Auto-Runs OCR

### New extractOCR() Function

- Scans ~/RAW/archive/YYYY-MM-DD/images/ for all image files
- Checks if .txt file exists (reuses existing OCR)
- Runs tesseract on images without OCR
- Saves output as .txt files alongside images
- Includes OCR text in full-context.json under ocrTexts array

## Output Now Includes

```json
{
  "date": "2026-03-21",
  "ocrTexts": [
    {
      "file": "Screenshot 2026-03-21 at 1.37.57 PM.png",
      "text": "LIVE TRANSCRIPTION MAR 20 10:01 PM..."
    }
  ]
}
```

## Why This Matters

1. **Automatic** - No manual OCR skill invocation needed
2. **Complete Context** - OCR text included in full-context.json
3. **Reusable** - Existing OCR cached, only new images processed
4. **NeuroGraph Ready** - OCR content available for learning extraction

## Integration Point

Context extractor is Step 2 (Hold) of breathe skill:
```bash
node skills/context-extractor/scripts/extract-context.js $(date +%Y-%m-%d)
```

Part of breathe pipeline - not separate manual step.