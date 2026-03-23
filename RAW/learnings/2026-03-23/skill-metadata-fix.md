# Skill Discovery: Fix Metadata Syntax

**Date:** 2026-03-23
**Type:** decision
**Status:** extracted

## Problem
Skills not showing up in OpenClaw UI despite being in workspace.

## Root Cause
Broken `metadata:` lines in 13 SKILL.md files with invalid YAML/JSON syntax (extra closing braces `}}`).

## Fix
- Removed broken metadata lines from all SKILL.md files
- Commit: c64d6f5 breath-2026-03-23
- 13 files changed, 69 insertions, 2 deletions

## Result
Skills now properly discovered and visible in UI.