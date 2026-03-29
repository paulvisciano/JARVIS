# Breath Summary — 2026-03-29

**Date:** 2026-03-29
**Type:** digest
**Status:** extracted

This breath revealed three critical deployment and debugging patterns: (1) Version bumping serves as a reliable cache invalidation strategy when browser caching persists despite technical cache-bust parameters—updating both server and client version numbers forces fresh loads; (2) DOM references defined at the top of a file execute before the DOM is ready, even when init functions run inside an IIFE—references must be obtained dynamically inside functions, not at parse time; (3) The workspace-to-production deploy pattern requires both git push AND process kill—pushing code doesn't auto-reload running services, but killing the process triggers auto-restart with fresh code via LaunchAgent KeepAlive.
