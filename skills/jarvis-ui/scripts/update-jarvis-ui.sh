#!/bin/bash
# update-jarvis-ui.sh — Automated JARVIS UI update script
# Usage: ./update-jarvis-ui.sh [--force-restart] [--dry-run]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCI_FI_DIR="$SKILL_DIR/sci-fi"
OLD_APP_DIR="$SCI_FI_DIR/apps/JARVIS"
NEW_APP_DIR="$SCI_FI_DIR/apps/JARVIS-UI"
ASSETS_DIR="$NEW_APP_DIR/assets"
LOG_FILE="/tmp/jarvis-ui-update.log"
SERVER_PID_FILE="/tmp/jarvis-ui.pid"

# Parse arguments
FORCE_RESTART=false
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --force-restart)
            FORCE_RESTART=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
    esac
done

# Helper functions
log() {
    echo -e "${BLUE}[UPDATE]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[!]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$LOG_FILE"
}

# Step 1: Check current state
log "=== JARVIS UI Update Script ==="
log "Skill directory: $SKILL_DIR"
log "SCI-FI directory: $SCI_FI_DIR"

if [ ! -d "$SCI_FI_DIR" ]; then
    error "SCI-FI directory not found: $SCI_FI_DIR"
    exit 1
fi

cd "$SCI_FI_DIR"

# Step 2: Check git status
log "Checking for updates..."
git fetch origin 2>&1 | tee -a "$LOG_FILE"
BEHIND_COUNT=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")

if [ "$BEHIND_COUNT" -eq 0 ]; then
    success "Already up to date!"
    CURRENT_COMMIT=$(git rev-parse --short HEAD)
    log "Current commit: $CURRENT_COMMIT"
else
    log "Found $BEHIND_COUNT commit(s) behind origin/main"
fi

# Step 3: Show what will change (dry run)
if [ "$DRY_RUN" = true ]; then
    log "=== DRY RUN ==="
    log "Would pull $BEHIND_COUNT commit(s):"
    git log --oneline HEAD..origin/main 2>/dev/null | tee -a "$LOG_FILE"
    exit 0
fi

# Step 4: Pull latest
if [ "$BEHIND_COUNT" -gt 0 ]; then
    log "Pulling latest from GitHub..."
    git pull origin main 2>&1 | tee -a "$LOG_FILE"
    success "Pulled latest changes"
    
    # Show what changed
    log "New commits:"
    git log --oneline HEAD~$BEHIND_COUNT..HEAD 2>/dev/null | tee -a "$LOG_FILE"
else
    log "No new commits to pull"
fi

# Step 5: Handle directory rename (JARVIS → JARVIS-UI)
if [ -d "$OLD_APP_DIR" ] && [ ! -d "$NEW_APP_DIR" ]; then
    warning "Detected directory rename: JARVIS → JARVIS-UI"
    log "Renaming directory..."
    mv "$OLD_APP_DIR" "$NEW_APP_DIR"
    success "Directory renamed to JARVIS-UI"
elif [ -d "$NEW_APP_DIR" ]; then
    success "Using JARVIS-UI directory (already renamed)"
else
    error "Neither JARVIS nor JARVIS-UI directory found!"
    exit 1
fi

# Step 6: Sync assets (SSL certs, whisper model, video)
log "Syncing assets..."
OLD_ASSETS="$SKILL_DIR/sci-fi/apps/JARVIS/assets"
NEW_ASSETS="$NEW_APP_DIR/assets"

if [ -d "$OLD_ASSETS" ]; then
    # Copy missing assets (SSL certs, models)
    for file in https-key.pem https-cert.pem ggml-large-v3.bin; do
        if [ -f "$OLD_ASSETS/$file" ] && [ ! -f "$NEW_ASSETS/$file" ]; then
            log "Copying $file to new assets directory..."
            cp "$OLD_ASSETS/$file" "$NEW_ASSETS/$file"
        fi
    done
    success "Assets synced"
else
    success "Assets already in correct location"
fi

# Step 7: Check current version
log "Checking current version..."
if [ -f "$NEW_APP_DIR/app.js" ]; then
    CLIENT_VERSION=$(grep "CLIENT_VERSION = " "$NEW_APP_DIR/app.js" | head -1 | sed "s/.*'\(.*\)'.*/\1/")
    log "Client version: $CLIENT_VERSION"
fi

if [ -f "$NEW_APP_DIR/jarvis-server.js" ]; then
    SERVER_VERSION=$(grep "^const VERSION = " "$NEW_APP_DIR/jarvis-server.js" | head -1 | sed "s/.*'\(.*\)'.*/\1/")
    log "Server version: $SERVER_VERSION"
fi

# Step 8: Restart server
log "Checking if server is running..."
OLD_PID=$(lsof -t -i :18787 2>/dev/null || echo "")

if [ -n "$OLD_PID" ] || [ "$FORCE_RESTART" = true ]; then
    if [ -n "$OLD_PID" ]; then
        log "Stopping old server (PID: $OLD_PID)..."
        kill $OLD_PID 2>/dev/null || kill -9 $OLD_PID 2>/dev/null
        sleep 2
        success "Old server stopped"
    fi
    
    log "Starting new server..."
    cd "$NEW_APP_DIR"
    nohup node jarvis-server.js > /tmp/jarvis-ui-latest.log 2>&1 &
    NEW_PID=$!
    echo $NEW_PID > "$SERVER_PID_FILE"
    success "Server started (PID: $NEW_PID)"
    
    # Wait for server to start
    log "Waiting for server to initialize..."
    sleep 5
    
    # Verify server is running
    if lsof -i :18787 > /dev/null 2>&1; then
        success "Server is running on port 18787"
        
        # Get version from health endpoint
        HEALTH=$(curl -k -s https://localhost:18787/health 2>/dev/null)
        if [ -n "$HEALTH" ]; then
            VERSION=$(echo "$HEALTH" | jq -r '.version' 2>/dev/null || echo "unknown")
            BUILD=$(echo "$HEALTH" | jq -r '.build' 2>/dev/null || echo "unknown")
            success "Version: v$VERSION (build: $BUILD)"
        fi
    else
        error "Server failed to start! Check logs: /tmp/jarvis-ui-latest.log"
        exit 1
    fi
else
    log "Server not running, starting it..."
    cd "$NEW_APP_DIR"
    nohup node jarvis-server.js > /tmp/jarvis-ui-latest.log 2>&1 &
    NEW_PID=$!
    echo $NEW_PID > "$SERVER_PID_FILE"
    success "Server started (PID: $NEW_PID)"
fi

# Step 9: Summary
echo ""
success "=== Update Complete! ==="
log "JARVIS UI is now running at: https://localhost:18787/"
log "Log file: $LOG_FILE"
log "Server log: /tmp/jarvis-ui-latest.log"

# Step 10: Cleanup old files (optional)
if [ -d "$OLD_ASSETS" ] && [ "$OLD_ASSETS" != "$NEW_ASSETS" ]; then
    warning "Old assets directory still exists: $OLD_ASSETS"
    log "You can safely delete it after confirming everything works:"
    log "  rm -rf $OLD_ASSETS"
fi

exit 0
