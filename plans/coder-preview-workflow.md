# Coder Preview Workflow — Review Before Merge

**Date:** 2026-03-30  
**Type:** Architecture / Workflow  
**Priority:** High  
**Status:** Design → Implementation  

---

## Problem

Currently when Coder completes a task:
1. Commits directly to `~/JARVIS/skills/jarvis-ui/sci-fi` (or other skill folder)
2. Native notification says "Done" with a "Show" button
3. Clicking "Show" opens the **production** instance (same port, same code)
4. No way to preview changes before they go live
5. No isolation between "work in progress" and "production"

**This breaks the review flow.** Paul can't see what changed before it's merged.

---

## Solution: Preview Workflow

### 1. **Isolated Workspace for Coder**

When Coder starts a UI task:
- Work in: `~/.openclaw/agents/jarvis-coder/workspace-preview/` (isolated from production)
- OR: Work on a **feature branch** (e.g., `feature/transcript-bubble-tweaks`)
- Never commit directly to the production skills folder

### 2. **Preview Server on Different Port**

When Coder completes a task:
- Spin up a **preview instance** of the JARVIS server
- Port: `18788` (production is `18787`)
- Serve from the **preview workspace** (not the production skills folder)
- Auto-open browser to `https://localhost:18788`

### 3. **"Show" Button Opens Preview**

Native notification includes:
- **Commit hash** (e.g., `07d455c`)
- **Summary of changes** (1-2 lines)
- **"Show" button** → Opens `https://localhost:18788` (preview port)
- **"Merge" button** (optional) → Copies changes to production skills folder

### 4. **Review → Approve → Merge**

**Flow:**
1. Coder finishes task → commits to preview workspace/branch
2. Coder starts preview server on port `18788`
3. Coder sends message: "Task complete. Preview: https://localhost:18788"
4. Paul clicks "Show" → browser opens to preview
5. Paul reviews changes in browser
6. If approved: Paul says "merge" → Coder copies changes to production skills folder
7. If rejected: Paul says "tweak X" → Coder iterates on preview

---

## Technical Implementation

### A. **Preview Server Script**

Create: `~/JARVIS/scripts/start-preview-server.js`

```javascript
// Starts JARVIS server on alternate port (default: 18788)
// Serves from preview workspace or feature branch

const PORT = process.env.PREVIEW_PORT || 18788;
const WORKSPACE = process.env.PREVIEW_WORKSPACE || 
  '/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS';

// Start server on PORT, serve static files from WORKSPACE
// Log: "Preview server running at https://localhost:PORT"
```

### B. **Coder Task Template Update**

When Coder completes a UI task:

```markdown
**Task complete: [Task Name]** ✅

**Commit:** `[hash]`  
**Preview:** https://localhost:18788  
**Changes:**
- Change 1
- Change 2

**To merge:** Say "merge [hash]" or "approve"  
**To tweak:** Say "adjust X" or "try Y"
```

### C. **Merge Command**

When Paul says "merge" or "approve":
1. Coder copies files from preview workspace → production skills folder
2. Commits to production skills folder with same commit message
3. Pushes to production remote
4. Restarts production server (if needed)
5. Confirms: "Merged to production. Live at https://localhost:18787"

---

## File Structure

```
~/JARVIS/
├── skills/
│   └── jarvis-ui/
│       └── sci-fi/              # PRODUCTION (live at 18787)
│           ├── apps/JARVIS/
│           └── ...
├── scripts/
│   └── start-preview-server.js  # Preview server launcher
└── plans/
    └── coder-preview-workflow.md

~/.openclaw/agents/jarvis-coder/
└── workspace-preview/           # ISOLATED (preview at 18788)
    └── apps/JARVIS/
        ├── index.html
        ├── app.js
        └── ...
```

---

## Workflow Example

**Paul:** "Make the transcript bubble feel like a speech bubble"

**Coder:**
1. Works in `workspace-preview/apps/JARVIS/`
2. Commits: `f187339 feat(JARVIS): transcript speech bubble polish`
3. Starts preview server: `node ~/JARVIS/scripts/start-preview-server.js`
4. Reports:

```
**Task complete: Transcript speech bubble polish** ✅

**Commit:** `f187339`  
**Preview:** https://localhost:18788  
**Changes:**
- Added speech bubble arrow pointing to orb
- Lighter glass effect (82% opacity)
- Compact header, smooth animations

**To merge:** Say "merge" or "approve"  
**To tweak:** Describe adjustments
```

**Paul:** Clicks "Show" → browser opens to `https://localhost:18788` → reviews changes

**Paul:** "Looks good, merge it"

**Coder:**
1. Copies `index.html` + `app.js` from preview → production skills folder
2. Commits to production: `f187339 feat(JARVIS): transcript speech bubble polish`
3. Pushes to `origin/main` in sci-fi repo
4. Confirms: "Merged to production. Live at https://localhost:18787"

---

## Benefits

- ✅ **Review before merge** — No accidental breaks in production
- ✅ **Isolated iteration** — Coder can tweak without affecting live UI
- ✅ **Clear approval flow** — Paul explicitly approves before merge
- ✅ **Preview is disposable** — If rejected, just delete preview workspace
- ✅ **Production stays stable** — Only approved changes go live

---

## Implementation Steps

1. **Create preview server script** (`~/JARVIS/scripts/start-preview-server.js`)
2. **Update Coder's task completion template** (include preview URL)
3. **Test flow:**
   - Coder completes task → starts preview
   - Paul reviews → approves → merge
4. **Document workflow** (this file)
5. **Optional:** Add "Merge" button to native notifications (if supported)

---

**Start implementation when ready.** This is a quality-of-life improvement for both Paul and Coder.
