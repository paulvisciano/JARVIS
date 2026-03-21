---
name: ocr
description: Extract text from images (screenshots, photos, documents) using tesseract OCR. Use when: (1) screenshot has text to extract, (2) photo contains readable text, (3) document needs digitization, (4) image-to-text conversion needed. Supports PNG, JPG, GIF, WebP, HEIC. Outputs plain text. Auto-integrated into context-extractor for archive images.
metadata: { "openclaw": { "emoji": "📸", "requires": { "bins": ["tesseract"] } } }
---

# OCR Skill — Screenshot/Text Extraction

**Purpose:** Extract text from images (screenshots, photos, documents) using tesseract OCR.

**Usage:** Point at any image file, get text back.

**Auto-Integration:** Called by `context-extractor` skill for all images in `~/RAW/archive/YYYY-MM-DD/images/` without `.txt` files.

---

## How To Use

```bash
# OCR a screenshot
tesseract "/path/to/image.png" stdout -l eng --psm 6

# OCR with different modes
--psm 1  # Automatic page segmentation with OSD
--psm 3  # Fully automatic page segmentation, no OSD
--psm 6  # Assume a single uniform block of text
--psm 7  # Search the image for a single line of text
--psm 11 # Sparse text - find as much text as possible in no particular order
--psm 12 # Sparse text with OSD
--psm 13 # Single line with OSD
```

---

## Workflow

### 1. Find Latest Screenshot

```bash
# Most recent PNG on Desktop
cd ~/Desktop && ls -t *.png | head -1

# Most recent image modified in last hour
find ~/Desktop -name "*.png" -mmin -60 | head -1
```

### 2. Run Tesseract

```bash
# Basic OCR
tesseract "/path/to/image.png" stdout -l eng --psm 6

# Output to file
tesseract "/path/to/image.png" /tmp/output -l eng
cat /tmp/output.txt
```

### 3. Handle Filenames with Spaces

```bash
# Use variable
f="/path/to/file.png"
tesseract "$f" stdout -l eng --psm 6

# Use xargs
echo "/path/to/file.png" | xargs -I {} tesseract "{}" stdout -l eng --psm 6
```

---

## PSM Modes (Page Segmentation)

| Mode | Description | Use Case |
|------|-------------|----------|
| 1 | Automatic + OSD | Full pages |
| 3 | Fully automatic | General purpose |
| 6 | Single uniform block | **Screenshots, messages** |
| 7 | Single line | Short text |
| 11 | Sparse text | Scattered text |
| 12 | Sparse + OSD | Scattered + orientation |
| 13 | Single line + OSD | Single line |

**Recommended for screenshots:** `--psm 6` (single uniform block)

---

## Language Support

```bash
# List installed languages
tesseract --list-langs

# Common languages
-l eng  # English
-l spa  # Spanish
-l fra  # French
-l deu  # German
-l jpn  # Japanese
-1 chi_sim  # Chinese Simplified
```

---

## Error Handling

```bash
# Check if file exists
if [[ -f "$filepath" ]]; then
    tesseract "$filepath" stdout -l eng --psm 6
else
    echo "File not found: $filepath"
fi

# Handle spaces in filenames
cp "$filepath" /tmp/ocr_input.png
tesseract /tmp/ocr_input.png stdout -l eng --psm 6
```

---

## Example: OCR Latest Screenshot

```bash
# One-liner: OCR most recent Desktop screenshot
cd ~/Desktop && f=$(ls -t *.png | head -1) && tesseract "$f" stdout -l eng --psm 6 2>&1 | head -50
```

---

## Output Processing

```bash
# Clean output (remove tesseract warnings)
tesseract "$f" stdout -l eng --psm 6 2>/dev/null

# Save to file
tesseract "$f" /tmp/ocr_output -l eng 2>/dev/null
cat /tmp/ocr_output.txt

# Count words
tesseract "$f" stdout -l eng --psm 6 2>/dev/null | wc -w
```

---

## Common Issues

**Issue:** "No such file or directory"  
**Fix:** Quote filenames, use `$f` variable

**Issue:** Garbage output  
**Fix:** Try different `--psm` mode (6, 11, 13)

**Issue:** Missing text  
**Fix:** Image may be blurry, small, or stylized font

**Issue:** Slow processing  
**Fix:** Add `--dpi 150` for large images

---

## Quick Reference

```bash
# OCR any image file
tesseract "/path/to/image.png" stdout -l eng --psm 6 2>/dev/null

# OCR latest screenshot
cd ~/Desktop && f=$(ls -t *.png | head -1) && tesseract "$f" stdout -l eng --psm 6 2>/dev/null

# OCR with output file
tesseract "/path/to/image.png" /tmp/output -l eng && cat /tmp/output.txt

# List languages
tesseract --list-langs
```

---

**Created:** March 19, 2026 — OCR skill for J.A.R.V.I.S  
**Dependency:** `brew install tesseract` (macOS)  
**Usage:** Point at any image, get text back
