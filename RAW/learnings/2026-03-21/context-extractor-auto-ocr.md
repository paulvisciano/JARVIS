# Context Extractor Should Auto-Run OCR on Screenshots

**Date:** 2026-03-21
**Type:** decision
**Status:** extracted

## The Enhancement

`context-extractor/extract-context.js` now auto-runs OCR on screenshots in the archive folder.

## New `extractOCR()` Function

```javascript
// Scans ~/RAW/archive/YYYY-MM-DD/images/ for all image files
// Checks if .txt file exists (reuses existing OCR)
// Runs tesseract on images without OCR
// Saves output as .txt files alongside images
// Includes OCR text in full-context.json under ocrTexts array
```

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

- No manual OCR skill calls needed
- Screenshots become searchable context
- Bruce conversation proof captured via OCR
- UI status bugs documented via screenshots
- Full context includes visual information

## Integration with Breathe

Step 2 (Hold/Distill) of breathe pipeline:
- Calls context-extractor
- Auto-runs OCR on new images
- Reuses existing OCR (idempotent)
- Outputs clean `full-context.json`

## Result

11 OCR images processed in today's breathe run:
- 3 existing OCR (Bruce screenshots from earlier)
- 7 new OCR (today's screenshots: 1:54 PM → 3:34 PM)
- 1 newly extracted (UI bug documentation)