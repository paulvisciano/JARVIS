# Update .env Paths from Old to New SCI-FI Location

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Old Location
`/Users/paulvisciano/SCI-FI/apps/JARVIS` — old standalone SCI-FI folder

## New Location
`$JARVIS_HOME/skills/jarvis-ui/sci-fi/apps` — new bundled location

## Issue
.env file was still pointing to old location. Running server was old process from old folder.

## Fix Required
1. Kill old server
2. Start new server from skills/jarvis-ui/sci-fi/apps
3. Update .env to reference new bundled location

## Lesson
Env files must track code refactors to avoid stale path references.