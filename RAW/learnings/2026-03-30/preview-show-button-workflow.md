# Preview Show Button Workflow — Native Notification to Browser

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Magic Moment

Coder completes a task → Native macOS notification appears → User clicks "Show" → Browser opens preview URL with latest changes.

This handoff feels magical because:
- Task sent in browser
- Notification arrives at OS level
- "Show" button opens isolated preview environment
- User sees changes without leaving their workflow

## The Architecture

### 1. Preview Server (`start-preview-server.js`)
```javascript
// Runs full jarvis-server.js on alternate port
PORT = 18788 (production is 18787)
JARVIS_PREVIEW = true (environment flag)
WORKSPACE = ~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS/
```

### 2. Visual Distinction
- **PREVIEW badge** — Orange gradient, top-right corner
- **Port detection** — Badge only shows on 18788
- **Page title** — `[PREVIEW] JARVIS` in browser tab
- **Separate PIDs** — Each server isolated

### 3. Notification Template
```markdown
Task complete: [Task Name] ✅

Commit: [hash]
Preview: https://localhost:18788/

[Show] [Dismiss]
```

### 4. "Show" Button Action
- Opens `https://localhost:18788/` in browser
- NOT production URL (18787)
- NOT blank page
- NOT outdated cached version

## The Workflow

1. **Coder commits** to preview workspace
2. **Preview server restarts** with updated code
3. **Native notification sent** with preview URL
4. **User clicks "Show"** → Browser opens 18788
5. **User tests** in isolated environment
6. **User approves** → Merge to production
7. **Production restarts** → Changes go live

## Why This Matters

- **Safe testing** — Production never broken during development
- **Clear distinction** — User always knows which environment they're viewing
- **Seamless handoff** — Native notification bridges terminal and browser
- **Version discipline** — Preview and production versions tracked separately

## Lesson

The "Show" button is more than convenience — it's a contract. When Coder says "done," the user should see the actual changes, not a stale page or wrong environment. This workflow makes that promise real.