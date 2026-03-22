# NeuroGraph API Proxy: Decoupling Frontend from Filesystem

**Date:** 2026-03-22
**Type:** insight
**Status:** extracted

## The Problem

The JARVIS server runs from `~/SCI-FI/apps/JARVIS/` but the NeuroGraph frontend tried to fetch `JARVIS/RAW/memories/nodes.json` via relative paths. This failed because:
- Symlinks in the filesystem don't help HTTP requests
- Working directory changes break relative path resolution
- Frontend making HTTP requests, not filesystem access

## The Solution

Added API proxy routes in `jarvis-server.js`:
- `GET /api/neurograph/nodes.json` → serves `~/JARVIS/RAW/memories/nodes.json`
- `GET /api/neurograph/synapses.json` → serves `~/JARVIS/RAW/memories/synapses.json`

## Key Insight

This decouples the client from filesystem paths. The server becomes an abstraction layer that serves data from absolute paths regardless of where the server process runs. Same pattern used for audio processing pipeline.

## Architecture Impact

- Frontend fetches from `/api/neurograph/*` (absolute, stable)
- Server resolves to `~/JARVIS/RAW/memories/` (absolute, reliable)
- Dev server (port 8081) can iterate without breaking production (port 18787)
- Both environments point to same API endpoint