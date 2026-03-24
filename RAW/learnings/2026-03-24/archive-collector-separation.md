# Archive Collector Moved from Bootstrap to Breathe

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Change
Removed archive-collector from bootstrap-jarvis.js:
- Removed INBOX_DIR constant
- Removed checkInboxAndArchive() function
- Removed inbox checking step from bootstrap flow
- Removed "Skills Auto-Discovered" console output

## New Flow
Bootstrap now: Git breath → Recent context → Graph verify → NeuroGraph test

## Rationale
Archive collection is already part of breathe functionality. Separation of concerns keeps bootstrap focused on initialization.