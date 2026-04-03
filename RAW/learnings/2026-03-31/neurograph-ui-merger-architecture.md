# NeuroGraph UI Merger — Unified Interface Architecture

**Date:** 2026-03-31
**Type:** decision
**Status:** extracted

## Architecture Change

The NeuroGraph visualization is no longer a separate UI route or standalone interface. It has been **fully merged** into the main Jarvis UI as the background canvas.

## What Changed

**Before:**
- Separate `neuro-graph/` folder with `neurograph-server.js`
- Dual-panel layout (`dual-index.html`)
- Separate route: `/neuro-graph/`
- Command: `open neurograph`

**After:**
- Unified UI at `~/SCI-FI/apps/JARVIS/`
- Single server: `jarvis-server.js` on port 18787
- NeuroGraph is the **background canvas** with overlays (orb, transcript, vitals, voice controls)
- Only command: `open jarvis ui`
- Old `neuro-graph/` folder is **deprecated**

## Skill Updates Required

All skills referencing the old NeuroGraph UI must be updated:
- Remove references to `neurograph-server.js`
- Remove references to `dual-index.html`
- Update UI URL from `/neuro-graph/` to `/`
- Remove `open neurograph` command (doesn't exist)

## Key Principle

**One interface, one entry point.** The NeuroGraph is not a feature you open—it's the foundation everything else sits on top of.