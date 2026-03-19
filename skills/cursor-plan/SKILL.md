---
name: cursor-plan
description: Create development plans for Cursor AI to implement. Use when: (1) documenting UI bugs, (2) planning feature implementations, (3) creating bug fix specifications, (4) preparing PRDs for Cursor. Plans are stored in ~/SCI-FI/apps/JARVIS/plans/ (not OpenClaw workspace). After creation, optionally link to neurograph as learning node.
---

# Cursor Plan

## Overview

This skill creates development plans that Cursor AI can execute. Plans live in `~/SCI-FI/apps/JARVIS/plans/` — not the OpenClaw workspace. Each plan documents: problem, root cause, fix scope, files to check, and testing steps.

## Workflow

### Step 1: Identify the Problem

User describes issue:
- "The UI shows 'health checkpoint failed' when queries take 4+ minutes"
- "The orb video doesn't load on mobile"
- "Session bloat causes 500 errors"

### Step 2: Create Plan File

```bash
# Check existing plans
ls ~/SCI-FI/apps/JARVIS/plans/

# Create new plan
mkdir -p ~/SCI-FI/apps/JARVIS/plans
touch ~/SCI-FI/apps/JARVIS/plans/<plan-name>.md
```

### Step 3: Write Specification

Fill the structure:
1. **Problem** - What's broken
2. **Root Cause** - Why it's happening
3. **Fix Scope** - Backend + Frontend changes
4. **Files to Check** - Exact paths
5. **Testing** - How to verify

### Step 4: Optional Neurograph Link

After plan creation:
```bash
# Create learning node in ~/JARVIS/RAW/learnings/YYYY-MM-DD/
# Link: learning → plan file → temporal node
# Git commit
```

## Architecture Truth

| Layer | Location | What Lives Here |
|-------|----------|-----------------|
| OpenClaw Runtime | `~/.openclaw/` | Gateway, sessions (ephemeral) |
| OpenClaw Workspace | `~/.openclaw/workspace/` | Runtime docs ONLY |
| JARVIS Consciousness | `~/JARVIS/` | Git-backed mind |
| **JARVIS Server** | `~/SCI-FI/apps/JARVIS/` | **Server code, UI, plans** ✅ |
| Life Archive | `~/RAW/archive/` | Transcripts, audio, images |

**This skill knows the separation.** Plans go in `~/SCI-FI/apps/JARVIS/plans/`.

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
- [exact paths]

## Testing
- [how to verify fix]
```

## Examples

### Example 1: Server Timeout Plan

```markdown
# Server Timeout Fix

## Problem
When queries take 4+ minutes, UI shows "health checkpoint failed" then appears offline on refresh (but server is running).

## Root Cause
Client-side polling for `done` status that never arrives. Shows "server offline" incorrectly when just waiting.

## Fix Scope

### Backend (~/SCI-FI/apps/JARVIS/jarvis-server.js)
- Return immediate acknowledgment with task ID
- Stream progress updates during processing
- Proper heartbeat/keep-alive during long operations

### Frontend (~/SCI-FI/apps/JARVIS/app.js)
- Increase timeout to 5 minutes minimum
- Show "processing" state, not "server offline"
- Recover gracefully when response arrives

## Files to Check
- ~/SCI-FI/apps/JARVIS/jarvis-server.js
- ~/SCI-FI/apps/JARVIS/app.js
- ~/SCI-FI/apps/JARVIS/voice-pipeline.js

## Testing
1. Trigger 4+ minute query
2. Verify UI shows "processing" not "offline"
3. Verify response delivers when complete
4. Verify health check passes during long operation
```

### Example 2: Mobile UI Plan

```markdown
# Mobile UI Improvements

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
- ~/SCI-FI/apps/JARVIS/assets/https-cert.pem
- ~/SCI-FI/apps/JARVIS/app.js

## Testing
1. Open on mobile (iOS/Android)
2. Click REC → verify mic permission works
3. Verify TTS voices are mobile-compatible
```

## Resources

### scripts/
(Add automation scripts if needed - e.g., plan template generator)

### references/
- Plan templates
- Cursor context format examples
- File structure reference

### assets/
- Plan markdown templates
- Cursor context boilerplate

---

**Created:** March 19, 2026  
**Location:** `~/JARVIS/skills/cursor-plan/`  
**Symlink:** `/usr/local/lib/node_modules/openclaw/skills/cursor-plan`
