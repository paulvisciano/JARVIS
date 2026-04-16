# Context Efficiency — Verify Less, Try More

**Date:** 2026-04-16
**Type:** pattern
**Status:** extracted

## The Problem

I burned through the entire context window for a simple "start the server" task. That's wasteful and makes everything harder. Context went from 30% to 100% in one session.

## The Pattern

**Before (wasteful):**
- Check if server is running (it wasn't)
- List companies and agents (unnecessary)
- Read skill doc end-to-end
- Verify each step before acting

**After (efficient):**
- Try the documented command
- Let the command's output tell you what's wrong
- Only investigate if the command fails

## The Rule

Verification has a cost. Every check burns tokens. Try first, verify only on failure.