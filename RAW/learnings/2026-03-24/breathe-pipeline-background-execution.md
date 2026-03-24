# Breathe Pipeline Should Run Background + Auto-Report

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## Problem
The breathe pipeline was running in foreground and yielding the session before completion, causing users to never receive responses even when the pipeline succeeded.

## Solution
1. Run breathe pipeline in background mode
2. Write completion marker to `~/JARVIS/.breathe-complete.json` with status, date, breathId, learnings dir, graph dir
3. Auto-report completion to user when done
4. Pattern documented in SKILL.md as `metadata.execution: { pattern: "background+poll", completionMarker: ".breathe-complete.json", autoReport: true }`

## Outcome
Users now get proper responses after breathe completes, maintaining conversation continuity.