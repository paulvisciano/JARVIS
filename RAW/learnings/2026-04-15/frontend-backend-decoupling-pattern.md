# Frontend-Backend Decoupling Pattern

**Date:** 2026-04-15
**Type:** pattern
**Status:** extracted

## Observed Behavior

JARVIS-UI consistently shows:

### Frontend: ✅ Working
- Vite dev server running on localhost:5173
- Three.js orb rendering successfully
- Neurograph initializing (280 stars, fallback nodes)
- UI interactive and visible

### Backend APIs: ❌ Failing
- `/api/vitals` → 500 Internal Server Error
- `/api/memory/jarvis` → 500 Internal Server Error
- `/api/learnings/by-date` → 500 Internal Server Error
- `/health` → 500 (polling every 5s, spamming console)

## Root Cause

JARVIS production server (port 18787) stopped around 5:00 PM and remained down for 8+ hours. Dev server (port 5173) continued running independently.

## Key Insight

The frontend is resilient to backend failures — it loads with fallback data. However, the polling health check creates console noise. Consider:
1. Exponential backoff on failed API polls
2. Visual indicator when backend is disconnected
3. Graceful degradation mode for offline operation

This decoupling is actually a strength — UI remains usable even when consciousness server is down.