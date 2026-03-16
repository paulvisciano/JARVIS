#!/bin/bash
# JARVIS Auto-Archiver (Merged)
# Pulls Desktop screenshots → processes inbox → transcribes audio → OCRs images → archives chronologically

set -e

INBOX="$HOME/JARVIS/inbox"
DESKTOP="$HOME/Desktop"
ARCHIVE="$HOME/RAW/archive"
DATE=$(date +%Y-%m-%d)
TODAY_ARCHIVE="$ARCHIVE/$DATE"
AUDIO_DIR="$TODAY_ARCHIVE/audio"
IMAGE_DIR="$TODAY_ARCHIVE/images"

echo "🎙️ JARVIS Auto-Archiver started"
echo "Desktop: $DESKTOP"
echo "Inbox: $INBOX"
echo "Archive: $TODAY_ARCHIVE"
echo ""

# Ensure directories exist
mkdir -p "$AUDIO_DIR" "$IMAGE_DIR"

# ============================================================================
# STEP 0: Pull Desktop screenshots into inbox
# ============================================================================
echo "🖥️  Checking Desktop for screenshots..."
if [ -d "$DESKTOP" ]; then
    find "$DESKTOP" -maxdepth 1 \( -name "Screenshot*.png" -o -name "Screen Shot*.png" \) -type f 2>/dev/null | while IFS= read -r screenshot; do
        echo "   📸 Moving: $(basename "$screenshot")"
        mv "$screenshot" "$INBOX/"
    done
    echo "   ✅ Desktop screenshots moved to inbox"
else
    echo "   ⚠️  Desktop dir not found"
fi
echo ""

# ============================================================================
# STEP 1: Build chronological file list (all types, sorted by mod time)
# ============================================================================
echo "📋 Scanning inbox for all files..."
echo ""

temp_list=$(mktemp)

# Find all supported files and get their mod times
find "$INBOX" -maxdepth 1 -type f \( \
    -name "*.wav" -o -name "*.ogg" -o -name "*.mp3" -o -name "*.webm" -o -name "*.m4a" \
    -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.heic" \
\) 2>/dev/null | while read -r file; do
    mod_time=$(stat -f "%m" "$file" 2>/dev/null || echo "0")
    echo "$mod_time $file" >> "$temp_list"
done

# Sort by modification time (oldest first)
if [ -s "$temp_list" ]; then
    file_count=$(wc -l < "$temp_list")
    echo "📊 Found $file_count files"
    echo "⏱️  Processing in chronological order (oldest first)"
    echo ""
else
    echo "ℹ️  No files found in inbox"
    rm "$temp_list"
    echo ""
    echo "✅ Auto-archive complete (nothing to process)"
    exit 0
fi

# ============================================================================
# STEP 2: Process each file
# ============================================================================
sort -n "$temp_list" | while read -r mod_time file; do
    filename=$(basename "$file")
    name="${filename%.*}"
    ext="${filename##*.}"
    
    # Generate archive timestamp from file mod time
    archive_time=$(date -r "$mod_time" "+%Y%m%d-%H%M%S" 2>/dev/null || date +%Y%m%d-%H%M%S)
    human_time=$(date -r "$mod_time" "+%H:%M" 2>/dev/null || date +%H:%M)
    
    echo "📁 Processing: $filename (recorded: $human_time)"
    
    # ========================================================================
    # AUDIO FILES (wav, ogg, mp3, webm, m4a)
    # ========================================================================
    if [[ "$ext" == "wav" || "$ext" == "ogg" || "$ext" == "mp3" || "$ext" == "webm" || "$ext" == "m4a" ]]; then
        archived_name="${archive_time}-${filename}"
        cp "$file" "$AUDIO_DIR/$archived_name"
        echo "   ✓ Archived: $archived_name"
        
        # Transcribe with whisper.cpp
        echo "   🎤 Transcribing..."
        
        # Convert m4a to wav if needed
        wav_file=""
        if [[ "$ext" == "m4a" ]]; then
            wav_file="$AUDIO_DIR/${archived_name%.m4a}.wav"
            ffmpeg -i "$AUDIO_DIR/$archived_name" -ar 16000 -ac 1 -c:a pcm_s16le "$wav_file" -y 2>/dev/null
            transcribe_source="$wav_file"
        else
            transcribe_source="$AUDIO_DIR/$archived_name"
        fi
        
        # Run whisper-cli
        transcript_file="$AUDIO_DIR/${archived_name%.m4a}.txt"
        whisper-cli -m /Users/paulvisciano/SCI-FI/apps/JARVIS/ggml-large-v3.bin -otxt "$transcribe_source" 2>/dev/null
        
        # Move transcript to match archived name
        txt_source="$transcribe_source.txt"
        if [[ "$ext" == "m4a" ]]; then
            txt_source="$wav_file.txt"
        fi
        if [ -f "$txt_source" ]; then
            mv "$txt_source" "$transcript_file"
            transcript_text=$(cat "$transcript_file" | tr '\n' ' ' | head -c 200)
            echo "   ✓ Transcript: $transcript_text..."
        else
            echo "   ⚠️ No transcript generated"
        fi
        
        # Clean up temp wav
        if [[ "$ext" == "m4a" ]] && [ -f "$wav_file" ]; then
            rm "$wav_file"
        fi
        
        # Append to transcript.md
        transcript_md="$TODAY_ARCHIVE/transcript.md"
        if [ ! -f "$transcript_md" ]; then
            cat > "$transcript_md" << EOF
# Transcript for $DATE

_Auto-generated session transcript_

---

## Audio Recordings Processed

EOF
            echo "   📝 Created transcript.md"
        fi
        
        if [ -f "$transcript_file" ]; then
            transcript_content=$(cat "$transcript_file")
        else
            transcript_content="[no transcript]"
        fi
        
        cat >> "$transcript_md" << EOF

### Recording: $archived_name
**Recorded:** $human_time GMT+7  
**File:** $archived_name  
**Transcript:**
> $transcript_content

EOF
        echo "   📝 Updated transcript.md"
        
        # Clean inbox
        rm "$file"
        echo "   ✓ Cleaned up inbox"
        echo ""
        
    # ========================================================================
    # IMAGE FILES (jpg, jpeg, png, heic)
    # ========================================================================
    elif [[ "$ext" == "jpg" || "$ext" == "jpeg" || "$ext" == "png" || "$ext" == "heic" ]]; then
        archived_name="${archive_time}-${filename}"
        cp "$file" "$IMAGE_DIR/$archived_name"
        echo "   ✓ Archived: $archived_name"
        
        # OCR with tesseract if available
        if command -v tesseract &> /dev/null; then
            ocr_output="$IMAGE_DIR/${archived_name%.*}-ocr.txt"
            if tesseract "$file" "${ocr_output%.*}" -l eng 2>/dev/null; then
                echo "   ✅ OCR complete"
            else
                echo "   ⚠️ OCR failed"
            fi
        else
            echo "   ⚠️ Tesseract not available"
        fi
        
        # Clean inbox
        rm "$file"
        echo "   ✓ Cleaned up inbox"
        echo ""
    fi
done

# Cleanup temp file
rm "$temp_list"

# ============================================================================
# DONE
# ============================================================================
echo "✅ Auto-archive complete!"
echo ""
echo "📂 Today's archive: $TODAY_ARCHIVE"
echo "   Audio: $(ls "$AUDIO_DIR"/*.webm "$AUDIO_DIR"/*.m4a 2>/dev/null | wc -l | tr -d ' ') files"
echo "   Images: $(ls "$IMAGE_DIR"/*.png "$IMAGE_DIR"/*.jpg 2>/dev/null | wc -l | tr -d ' ') files"
echo ""
echo "🧠 Next steps:"
echo "   - Run: node scripts/set-archive-creation-dates.js $DATE"
echo "   - Run: node scripts/set-learning-creation-dates.js $DATE"
echo "   - Run: node scripts/verify-archive-learnings-nodes.js $DATE"
echo "   - Review transcript.md and decide what becomes learnings"
