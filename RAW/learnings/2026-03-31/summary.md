# Breath Summary — 2026-03-31

**Date:** 2026-03-31
**Type:** digest
**Status:** extracted

This breath revealed critical gaps in the OpenClaw skill system: skills don't load until gateway restart (snapshot behavior), JARVIS skills require explicit registration in openclaw.json entries to be visible to OpenClaw, and defensive DOM access requires calling getters before null checks to avoid silent failures. The neurograph panel bug-fix cycle (null checks breaking display, then fixing with proper getter calls) demonstrated the importance of testing before committing. Travel logistics (DMK vs BKK airport confusion, Grab driver rescue) provided real-world context but the system learnings about skill registration and DOM patterns are the lasting insights.
