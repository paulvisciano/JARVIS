#!/bin/bash
# JARVIS Inbox Processor - Handles filenames with spaces safely

set -e

INBOX_DIR="$HOME/JARVIS/inbox"
ARCHIVE_DIR="$HOME/RAW/archive/$(date +%Y-%m-%d)"
AUDIO_DIR="$ARCHIVE_DIR/audio"
IMAGE_DIR="$ARCHIVE_DIR/images"

# Ensure directories exist
mkdir -p "$AUDIO_DIR" "$IMAGE_DIR"

echo "📥 Processing inbox: $INBOX_DIR"
echo "📂 Archiving to: $ARCHIVE_DIR"
echo ""

# Process audio files (webm + wav.txt pairs)
find "$INBOX_DIR" -maxdepth 1 -name "*.webm" -type f 2>/dev/null | while IFS= read -r webm_file; do
    # Get base filename without extension
    base=$(basename "$webm_file" .webm)
    txt_file="$INBOX_DIR/${base}.wav.txt"
    
    echo "🎤 Audio: $(basename "$webm_file")"
    
    # Generate archive filename with timestamp
    timestamp=$(date +%Y-%m-%d-%H%M%S)
    archived_name="${timestamp}-${base}.webm"
    
    # Copy audio file
    cp "$webm_file" "$AUDIO_DIR/$archived_name"
    
    # Copy transcript if exists
    if [ -f "$txt_file" ]; then
        cp "$txt_file" "$AUDIO_DIR/${archived_name%.webm}.txt"
        transcript=$(cat "$AUDIO_DIR/${archived_name%.webm}.txt" | tr '\n' ' ' | head -c 200)
        echo "   📝 Transcript: $transcript..."
    else
        echo "   ⚠️ No transcript found"
    fi
    
    echo "   ✅ Archived: $archived_name"
    
    # Remove from inbox
    rm -f "$webm_file" "$txt_file"
done

# Process image files (jpg, jpeg, png, heic)
find "$INBOX_DIR" -maxdepth 1 \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.heic" \) -type f 2>/dev/null | while IFS= read -r img_file; do
    echo "📸 Image: $(basename "$img_file")"
    
    # Generate archive filename with timestamp
    timestamp=$(date +%Y-%m-%d-%H%M%S)
    ext="${img_file##*.}"
    archived_name="${timestamp}-$(basename "$img_file")"
    
    # Copy image file
    cp "$img_file" "$IMAGE_DIR/$archived_name"
    
    # OCR if tesseract available
    if command -v tesseract &> /dev/null; then
        ocr_output="$IMAGE_DIR/${archived_name%.*}-ocr.txt"
        tesseract "$img_file" "${ocr_output%.*}" -l eng 2>/dev/null && \
            echo "   ✅ OCR complete" || \
            echo "   ⚠️ OCR failed"
    else
        echo "   ⚠️ Tesseract not available"
    fi
    
    echo "   ✅ Archived: $archived_name"
    
    # Remove from inbox
    rm -f "$img_file"
done

echo ""
echo "✅ Inbox processing complete"
echo "📂 Archive: $ARCHIVE_DIR"
ls -lh "$AUDIO_DIR"/*.webm 2>/dev/null | tail -3 || true
ls -lh "$IMAGE_DIR"/*.jpg "$IMAGE_DIR"/*.png 2>/dev/null | tail -3 || true
