# Breath Summary — 2026-03-30

**Date:** 2026-03-30
**Type:** digest
**Status:** extracted

This breath revealed critical pipeline bugs that were causing silent failures: ANSI escape codes from Ollama CLI were breaking JSON parsing, and the reflection pipeline used non-existent CLI flags (`--last`) and missing parameters (`--target`). Both were fixed, restoring the full breathe cycle. Paul also called out a behavioral issue — I was chaining tool calls without checking in, causing him to lose control and restart sessions. I committed to outlining plans first and pausing between steps. The work shows we're maturing from chaotic building to intentional optimization, but the infrastructure still needs hardening.
