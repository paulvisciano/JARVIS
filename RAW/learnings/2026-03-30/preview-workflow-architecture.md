# Preview Workflow Architecture

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Problem

- Coder commits directly to production
- No way to review changes before they go live
- No isolation between WIP and production
- "Show" button on notifications opened wrong URL

## The Solution

**Two-Server Architecture:**

| Location | Purpose | Port | Visual Indicator |
|----------|---------|------|------------------|
| `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS` | PRODUCTION | 18787 | No badge |
| `~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS` | PREVIEW | 18788 | Orange PREVIEW badge |

## Key Components

1. **Preview Server Script** (`~/JARVIS/scripts/start-preview-server.js`)
   - Runs full `jarvis-server.js` on port 18788
   - Auto-opens browser to preview URL
   - Uses same SSL certs as production

2. **Visual Distinction**
   - PREVIEW badge (orange gradient, top-right corner)
   - Page title prefixed with `[PREVIEW]`
   - Detects via `window.location.port === '18788'`

3. **Version Bump Convention**
   - Client change → bump client version
   - Server change → bump server version
   - Every commit = version bump, no exceptions

4. **Merge Flow**
   - Coder commits to preview workspace
   - Paul tests at `https://localhost:18788`
   - When approved: copy preview → production, commit, push

## Why This Works

- **Safe experimentation** — Breaking changes don't affect production
- **Clear visual distinction** — Never confused about which is which
- **Review before merge** — Changes validated before going live
- **Native notification integration** — "Show" button opens preview URL