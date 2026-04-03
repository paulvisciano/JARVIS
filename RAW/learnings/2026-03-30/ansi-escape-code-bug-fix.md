# ANSI Escape Codes Breaking JSON Parsing

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## The Problem

The 12:20 breathe cycle failed silently because Ollama CLI outputs ANSI terminal control codes mixed with JSON:
- Spinners, cursor movement, "Thinking..." animations
- Codes like `[?2026h[?25l[1G⠙ [K[?25h`
- Script tried to parse this garbage as JSON and failed

## The Fix

Added ANSI stripping regex in `create-learnings.js`:
```javascript
const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
const cleanOutput = modelOutput.replace(ansiRegex, '');
```

## Lesson

When piping CLI tool output through scripts, always strip terminal control codes before parsing. What looks like valid output in a terminal may be garbage to a parser.