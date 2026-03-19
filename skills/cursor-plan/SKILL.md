---
name: cursor-plan
description: Create development plans for Cursor AI to implement in any project. Use when: (1) documenting bugs, (2) planning features, (3) creating fix specifications, (4) preparing PRDs. Plans are stored in the project's `plans/` folder (or specified location). Works for any codebase: JARVIS UI, forks, web apps, scripts, etc.
---

# Cursor Plan (Project-Agnostic)

## Overview

This skill creates development plans that Cursor AI can execute in **any project**. Plans live in the project's `plans/` folder (or user-specified location). Each plan documents: problem, root cause, fix scope, files to check, and testing steps.

## Workflow

### Step 1: Identify the Project

**Ask or infer:**
- "What project is this for?" (JARVIS UI, Eric fork, David fork, custom app, etc.)
- "Where is the codebase located?" (e.g., `~/SCI-FI/apps/JARVIS/`, `~/forks/eric/`, etc.)
- "Where should plans be stored?" (default: `<project-root>/plans/`)

**Default behavior:**
- If no project specified → use current working directory
- Plans folder → `./plans/` (relative to project root)

### Step 2: Identify the Problem

User describes issue:
- "The UI shows 'health checkpoint failed' when queries take 4+ minutes"
- "The orb video doesn't load on mobile"
- "Session bloat causes 500 errors"
- "Fork onboarding fails on vanilla Macs"

### Step 3: Create Plan File

```bash
# Detect project root (or use provided path)
PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"

# Check existing plans
ls "$PROJECT_ROOT/plans/" 2>/dev/null || echo "No plans folder yet"

# Create new plan
mkdir -p "$PROJECT_ROOT/plans"
touch "$PROJECT_ROOT/plans/<plan-name>.md"
```

### Step 4: Write Specification

Fill the structure:
1. **Problem** - What's broken
2. **Root Cause** - Why it's happening
3. **Fix Scope** - Backend + Frontend changes
4. **Files to Check** - Exact paths (relative to project root)
5. **Testing** - How to verify

### Step 5: Optional Neurograph Link

After plan creation:
```bash
# Create learning node in ~/JARVIS/RAW/learnings/YYYY-MM-DD/
# Link: learning → plan file → temporal node → project node
# Git commit
```

## Architecture Truth

| Layer | Location | What Lives Here |
|-------|----------|-----------------|
| OpenClaw Runtime | `~/.openclaw/` | Gateway, sessions (ephemeral) |
| OpenClaw Workspace | `~/.openclaw/workspace/` | Runtime docs ONLY |
| JARVIS Consciousness | `~/JARVIS/` | Git-backed mind |
| **Projects** | **Anywhere** | **Code, UI, plans** ✅ |
| Life Archive | `~/RAW/archive/` | Transcripts, audio, images |

**This skill is project-agnostic.** Plans go in `<project-root>/plans/`.

## Plan Structure

```markdown
# Plan Name

## Problem
[What's broken / what needs to be built]

## Root Cause
[Why it's happening]

## Fix Scope

### Backend
- [files to change]
- [logic to fix]

### Frontend
- [files to change]
- [UX to fix]

## Files to Check
- [exact paths, relative to project root]

## Testing
- [how to verify fix]
```

## Examples

### Example 1: JARVIS UI Server Timeout

```markdown
# Server Timeout Fix

## Project
JARVIS UI (~/SCI-FI/apps/JARVIS/)

## Problem
When queries take 4+ minutes, UI shows "health checkpoint failed" then appears offline on refresh (but server is running).

## Root Cause
Client-side polling for `done` status that never arrives. Shows "server offline" incorrectly when just waiting.

## Fix Scope

### Backend (jarvis-server.js)
- Return immediate acknowledgment with task ID
- Stream progress updates during processing
- Proper heartbeat/keep-alive during long operations

### Frontend (app.js)
- Increase timeout to 5 minutes minimum
- Show "processing" state, not "server offline"
- Recover gracefully when response arrives

## Files to Check
- jarvis-server.js
- app.js
- voice-pipeline.js

## Testing
1. Trigger 4+ minute query
2. Verify UI shows "processing" not "offline"
3. Verify response delivers when complete
4. Verify health check passes during long operation
```

### Example 2: Fork Onboarding (Eric, Germany)

```markdown
# Fork #001 Onboarding - Whisper Model Fix

## Project
Fork #001 (Eric, Germany) - ~/forks/eric/

## Problem
Whisper transcription takes 10+ minutes on Intel Mac. Fork stuck on "Transcribing..." forever.

## Root Cause
ggml-large-v3.bin (3GB) is too slow on Intel Macs.

## Fix Scope

### Configuration
- Switch to ggml-small.bin (488MB, 10-30x faster)
- Update server config to use small model

## Files to Check
- jarvis-server.js (whisperModel config)
- assets/ggml-small.bin (verify exists)

## Testing
1. Download small model
2. Restart server with small model
3. Record voice note
4. Verify transcription completes in <30 seconds
```

### Example 3: Mobile UI (Any Project)

```markdown
# Mobile UI Improvements

## Project
[Project name - specify or infer]

## Problem
Orb video doesn't load on mobile, TTS voice picker shows desktop-only voices.

## Root Cause
Mobile browser requires HTTPS for mic access. Voice picker not filtering mobile-compatible voices.

## Fix Scope

### Frontend
- Ensure HTTPS self-signed cert is valid
- Filter voices by mobile compatibility
- Add mobile-specific UI hints

## Files to Check
- assets/https-cert.pem
- app.js

## Testing
1. Open on mobile (iOS/Android)
2. Click REC → verify mic permission works
3. Verify TTS voices are mobile-compatible
```

## Project Detection

**Ask these questions:**
1. "What project is this for?"
2. "Where is the codebase located?"
3. "Where should plans be stored?" (default: `<project-root>/plans/`)

**Common projects:**
- JARVIS UI: `~/SCI-FI/apps/JARVIS/`
- Fork #001 (Eric): `~/forks/eric/` or wherever cloned
- Fork #002 (David): `~/forks/david/` or wherever cloned
- Custom app: User-specified path

## Resources

### scripts/
- `detect-project-root.sh` (optional - auto-detect project)
- `create-plan-template.sh` (optional - plan boilerplate)

### references/
- Plan templates
- Project structure examples
- Common project paths reference

### assets/
- Plan markdown templates
- Cursor context boilerplate

---

**Created:** March 19, 2026  
**Location:** `~/JARVIS/skills/cursor-plan/`  
**Symlink:** `/usr/local/lib/node_modules/openclaw/skills/cursor-plan`  
**Project-Agnostic:** Works for any codebase, anywhere
