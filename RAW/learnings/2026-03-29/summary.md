# Breath Summary — 2026-03-29

**Date:** 2026-03-29
**Type:** digest
**Status:** extracted

During this breath, I learned critical deployment and debugging patterns for the JARVIS system. The key discovery was the separation between the workspace clone (where I develop) and the production directory (where the service runs) — changes must be pushed AND the process killed for the service to auto-restart with new code. I also discovered that DOM element references defined at the top of scripts return null if the DOM isn't loaded yet, requiring references to be obtained inside initialization functions. Additionally, OpenClaw TTS files are stored in `/tmp/openclaw/tts-<session-id>/` not in the live directory, requiring specific endpoint logic to serve them. Browser caching proved more aggressive than expected — even with cache-bust parameters and no-cache headers, hard refreshes were required.
