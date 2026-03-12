#!/bin/bash
# JARVIS Screenshot OCR + Metadata Extraction
# Processes all screenshots in inbox, extracts text + metadata, archives

SCREENSHOT_DIR="$HOME/JARVIS/inbox/screenshots"
ARCHIVE_DIR="$HOME/RAW/archive/$(date +%Y-%m-%d)/screenshots"
OCR_DIR="$ARCHIVE_DIR/ocr"

# Create archive directories
mkdir -p "$ARCHIVE_DIR" "$OCR_DIR"

echo "📸 Processing screenshots from: $SCREENSHOT_DIR"
echo "📂 Archiving to: $ARCHIVE_DIR"
echo ""

# Process each screenshot
for screenshot in "$SCREENSHOT_DIR"/*.png; do
    [ -f "$screenshot" ] || continue
    
    filename=$(basename "$screenshot")
    name="${filename%.*}"
    
    echo "🔍 Processing: $filename"
    
    # Extract metadata
    file_size=$(stat -f%z "$screenshot" 2>/dev/null)
    file_date=$(stat -f"%Sm" -t "%Y-%m-%d %H:%M:%S" "$screenshot" 2>/dev/null)
    
    # Try to extract location from macOS metadata (if available)
    location=$(mdls -name kMDItemWhereFroms "$screenshot" 2>/dev/null | head -1)
    
    # Extract dimensions
    dimensions=$(sips -g pixelWidth -g pixelHeight "$screenshot" 2>/dev/null | awk '/pixelWidth/{w=$2} /pixelHeight/{h=$2} END{print w"x"h}')
    
    # Run OCR
    ocr_output="$OCR_DIR/${name}.txt"
    tesseract "$screenshot" "$OCR_DIR/${name}" -l eng 2>/dev/null
    
    # Get OCR text
    if [ -f "$ocr_output" ]; then
        ocr_text=$(cat "$ocr_output" | tr '\n' ' ' | head -c 500)
        ocr_status="✅ OCR complete"
    else
        ocr_text=""
        ocr_status="❌ OCR failed"
    fi
    
    # Create metadata JSON
    cat > "$ARCHIVE_DIR/${name}.metadata.json" << EOF
{
  "filename": "$filename",
  "originalPath": "$screenshot",
  "capturedDate": "$file_date",
  "fileSize": $file_size,
  "dimensions": "$dimensions",
  "location": "$location",
  "ocrStatus": "$ocr_status",
  "ocrText": "$ocr_text",
  "processedAt": "$(date -Iseconds)",
  "archivePath": "$ARCHIVE_DIR"
}
EOF
    
    # Move screenshot to archive
    mv "$screenshot" "$ARCHIVE_DIR/"
    
    echo "   $ocr_status"
    echo "   Size: $file_size bytes, Dimensions: $dimensions"
    echo "   Location: ${location:-N/A}"
    echo "   Preview: ${ocr_text:0:100}..."
    echo ""
done

# Clean up inbox
rmdir "$SCREENSHOT_DIR" 2>/dev/null || true

echo "✅ Done! Processed $(ls "$ARCHIVE_DIR"/*.png 2>/dev/null | wc -l) screenshots"
echo "📂 Archive: $ARCHIVE_DIR"
