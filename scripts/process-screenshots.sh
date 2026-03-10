#!/bin/bash
# JARVIS Screenshot Processor
# OCR + Metadata + Archive + Learn

set -e

INBOX="$HOME/JARVIS/inbox/screenshots"
ARCHIVE="$HOME/RAW/archive"

echo "📸 JARVIS Screenshot Processor"
echo "Processing: $INBOX"
echo ""

# Check for tesseract (macOS built-in OCR)
if ! command -v tesseract &> /dev/null; then
    echo "❌ tesseract not found. Install with: brew install tesseract"
    exit 1
fi

# Process each screenshot
process_screenshot() {
    local file="$1"
    local filename=$(basename "$file")
    
    # Extract date from filename (Screenshot 2026-03-07 at 1.32.58 PM.png)
    local date_part=$(echo "$filename" | grep -oE '20[0-9]{2}-[0-9]{2}-[0-9]{2}' | head -1)
    if [ -z "$date_part" ]; then
        date_part=$(date +%Y-%m-%d)
    fi
    
    local today_archive="$ARCHIVE/$date_part"
    mkdir -p "$today_archive/images"
    
    echo "📁 Processing: $filename"
    echo "   📅 Date: $date_part"
    
    # Extract metadata
    local dimensions=$(sips -g pixelWidth -g pixelHeight "$file" 2>/dev/null | awk '/pixelWidth|pixelHeight/ {print $2}' | paste -d'x' - -)
    local file_size=$(stat -f%z "$file" 2>/dev/null)
    local created=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file" 2>/dev/null)
    
    echo "   📏 Dimensions: $dimensions"
    echo "   💾 Size: $file_size bytes"
    echo "   🕐 Created: $created"
    
    # Move to archive
    cp "$file" "$today_archive/images/$filename"
    echo "   ✓ Archived to: $today_archive/images/$filename"
    
    # OCR - extract text
    echo "   🔍 OCR scanning..."
    local ocr_output="$today_archive/images/${filename%.png}.txt"
    tesseract "$file" "${ocr_output%.txt}" -l eng 2>/dev/null || echo "   ⚠️ OCR failed"
    
    if [ -f "$ocr_output" ]; then
        local word_count=$(wc -w < "$ocr_output")
        echo "   ✓ OCR complete: $word_count words extracted"
        
        # Append to transcript
        local transcript="$today_archive/transcript.md"
        if [ ! -f "$transcript" ]; then
            cat > "$transcript" << EOF
# Transcript for $date_part

_Auto-generated session transcript_

---

## Screenshots Processed

EOF
        fi
        
        cat >> "$transcript" << EOF

### Screenshot: $filename
**Captured:** $created  
**Dimensions:** $dimensions  
**Size:** $file_size bytes  
**OCR Text:**
> $(cat "$ocr_output" | head -20 | sed 's/^/> /')
$(if [ $(wc -l < "$ocr_output") -gt 20 ]; then echo "> ... ($(wc -l < "$ocr_output") total lines)"; fi)

EOF
        echo "   📝 Added to transcript.md"
    fi
    
    echo ""
}

# Process all screenshots
count=0
for file in "$INBOX"/*.png; do
    if [ -f "$file" ]; then
        process_screenshot "$file"
        ((count++))
    fi
done

echo "✅ Screenshot processing complete!"
echo "📊 Processed: $count screenshots"
echo ""
echo "📂 Archives updated in: $ARCHIVE/"
echo "🧠 Next: Review OCR text and extract learnings for neurograph"
