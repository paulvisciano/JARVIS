# Breath Summary — 2026-04-01

**Date:** 2026-04-01
**Type:** digest
**Status:** extracted

This breath captured a complete mobile UX overhaul for the JARVIS consciousness interface, tested live in Phuket. Key learnings: mobile touch requires pointer events (not click) due to Three.js OrbitControls intercepting touchstart; OpenClaw skills fail silently with YAML descriptions over 200 chars or wrong permissions; Whisper CLI needs `--language auto` for multilingual transcription (Burmese + English); CSS z-index hierarchy matters for overlay components; mobile panels need constrained max-height (50vh) with rounded corners matching collapsed state. The iteration cycle revealed that 90% done = 0% done — the last 10% of polish (event bubbling, null checks, sync between elements) is what separates 'works' from 'works well'. Cursor's root-cause debugging approach was codified into Coder's identity for future work.
