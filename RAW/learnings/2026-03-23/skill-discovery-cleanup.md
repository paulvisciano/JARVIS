# Skill Discovery Cleanup

**Date:** 2026-03-23
**Type:** commitment
**Status:** extracted

## Changes

1. **Renamed Skills** — All neurograph skills now follow `neurograph-` prefix pattern:
   - `neurograph-load` → deprecated/removed
   - `neurograph-search`
   - `neurograph-link`
   - `neurograph-separate`
   - `neurograph-sync`

2. **Removed Symlinks** — Skills auto-detect from agent workspace (`/Users/paulvisciano/JARVIS`) without needing `extraDirs` pointer

3. **Fixed Metadata** — Removed broken `metadata:` lines from 13 SKILL.md files (invalid YAML/JSON syntax was filtering skills out)

## Result

Clean multi-agent skill discovery. Skills live in JARVIS folder, auto-detected.