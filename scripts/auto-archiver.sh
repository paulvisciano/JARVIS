#!/bin/bash
# JARVIS Auto-Archiver
# Watches inbox for new audio files, transcribes, and archives them

set -e

INBOX="$HOME/JARVIS/inbox"
ARCHIVE="$HOME/RAW/archive"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H%M%S)
TODAY_ARCHIVE="$ARCHIVE/$DATE"

echo "🎙️ JARVIS Auto-Archiver started"
echo "Watching: $INBOX"
echo "Archive: $TODAY_ARCHIVE"
echo ""

# Ensure today's archive folder exists
mkdir -p "$TODAY_ARCHIVE/audio"

# Process a single file
process_file() {
    local file="$1"
    local filename=$(basename "$file")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    # Get file modification time for chronological ordering
    local file_time=$(stat -f "%Sm" -t "%Y%m%d-%H%M%S" "$file" 2>/dev/null || date +%Y%m%d-%H%M%S)
    
    echo "📁 Processing: $filename (recorded: $file_time)"
    
    # Create archive directory if needed
    mkdir -p "$TODAY_ARCHIVE/audio"
    
    # Move file to archive with original timestamp preserved in name
    local archived_name="${file_time}-${filename}"
    cp "$file" "$TODAY_ARCHIVE/audio/$archived_name"
    echo "   ✓ Archived: $archived_name"
    
    # Transcribe if it's audio
    if [[ "$ext" == "wav" || "$ext" == "ogg" || "$ext" == "mp3" || "$ext" == "webm" ]]; then
        echo "   🎤 Transcribing..."
        
        # Use whisper (Python package)
        local transcript_file="$TODAY_ARCHIVE/audio/${archived_name}.txt"
        
        # Run whisper transcription (use full path)
        /Users/paulvisciano/Library/Python/3.9/bin/whisper "$TODAY_ARCHIVE/audio/$archived_name" \
            --model base \
            --output_dir "$TODAY_ARCHIVE/audio/" \
            --output_format txt \
            --language en \
            2>/dev/null || echo "   ⚠️ Transcription failed"
        
        # Rename transcript to match archived file
        if [ -f "$TODAY_ARCHIVE/audio/${name}.txt" ]; then
            mv "$TODAY_ARCHIVE/audio/${name}.txt" "$transcript_file"
            echo "   ✓ Transcript: ${archived_name}.txt"
        fi
    fi
    
    # Append to daily transcript.md
    local transcript_md="$TODAY_ARCHIVE/transcript.md"
    local human_time=$(date -r "$mod_time" "+%H:%M" 2>/dev/null || date +%H:%M)
    
    # Read the transcript if it exists
    local transcript_text=""
    if [ -f "$transcript_file" ]; then
        transcript_text=$(cat "$transcript_file")
    fi
    
    # Create or append to transcript.md
    if [ ! -f "$transcript_md" ]; then
        # Initialize transcript file
        cat > "$transcript_md" << EOF
# Transcript for $DATE

_Auto-generated session transcript_

---

## Audio Recordings Processed

EOF
        echo "   📝 Created transcript.md"
    fi
    
    # Append recording entry
    cat >> "$transcript_md" << EOF

### Recording: $archived_name
**Recorded:** $human_time GMT+7  
**File:** $archived_name  
**Transcript:**
> $transcript_text

EOF
    echo "   📝 Updated transcript.md"
    
    # Remove from inbox after processing
    rm "$file"
    echo "   ✓ Cleaned up inbox"
    echo ""
}

# Get list of audio files sorted by modification time (oldest first)
echo "📋 Scanning inbox for audio files..."
echo ""

# Create temp file with file paths and modification times
temp_list=$(mktemp)

# Find all audio files and get their mod times
find "$INBOX" -maxdepth 1 -type f \( -name "*.wav" -o -name "*.ogg" -o -name "*.mp3" -o -name "*.webm" -o -name "*.m4a" \) 2>/dev/null | while read -r file; do
    mod_time=$(stat -f "%m" "$file" 2>/dev/null || echo "0")
    echo "$mod_time $file" >> "$temp_list"
done

# Sort by modification time and process in order
if [ -s "$temp_list" ]; then
    file_count=$(wc -l < "$temp_list")
    echo "📊 Found $file_count audio files"
    echo "⏱️  Processing in chronological order (oldest first)"
    echo ""
    
    sort -n "$temp_list" | while read -r mod_time file; do
        process_file "$file"
    done
    
    rm "$temp_list"
else
    echo "ℹ️  No audio files found in inbox"
fi

echo "✅ Auto-archive complete!"
echo ""
echo "📂 Today's archive: $TODAY_ARCHIVE"
echo "   - Check transcript.md for conversation record"
echo "   - Check audio/ for recordings + transcripts"
echo ""
echo "🧠 Next: Review transcripts and decide what becomes learnings"
