# Plan: Auto-Open Jarvis UI on Conversational Messages

**Date:** March 31, 2026  
**Priority:** Medium  
**Owner:** Coder  

## Goal

When a user sends a conversational message to Jarvis (not a command, not a system event), automatically open the unified Jarvis UI in the browser.

## Context

- The unified UI lives at `https://localhost:18787/` (NeuroGraph is root view, no `/neuro-graph/` route)
- Config file: `/Users/paulvisciano/JARVIS/.jarvis-config.json`
- New config field: `autoOpen: true` (root level, no sub-node)
- This should work for any Jarvis instance owner (portable feature)

## Implementation

### 1. Config Schema
Add `autoOpen` as an optional boolean at root level of `.jarvis-config.json`:
```json
{
  "desktopArchiving": { "enabled": false },
  "autoOpen": true
}
```
Default: `false` (don't auto-open unless explicitly enabled)

### 2. Detection Logic
Detect when to auto-open:
- Message is a direct user message (not a slash command like `/status`, `/help`)
- Not a system event or heartbeat
- Not a message from the bot itself
- Session doesn't already have the UI open (avoid duplicate opens)

### 3. Browser Action
When trigger conditions are met and `autoOpen: true`:
- Open `https://localhost:18787/` in the browser
- Use browser tool or gateway event to trigger the open
- Handle gracefully if the server isn't running (no errors, just skip)

### 4. Edge Cases
- First message of session → open UI
- Subsequent messages → only open if UI was closed
- If browser is already on the Jarvis UI → do nothing (no-op)
- If `autoOpen` is missing or `false` → skip entirely

## Files to Modify
- Config loader (read `autoOpen` from `.jarvis-config.json`)
- Message handler (detect conversational messages)
- Browser/UI opener (trigger the open action)

## Success Criteria
- [ ] Add `autoOpen: true` to config → UI opens on first conversational message
- [ ] Remove or set `false` → UI doesn't auto-open
- [ ] Works for any Jarvis instance (no hardcoded paths or user-specific logic)
- [ ] No duplicate opens (idempotent behavior)
- [ ] No errors if server isn't running

## Notes
- Keep it simple: no complex trigger phrases, just "direct message = open UI"
- This is UX polish — should feel invisible when it works, harmless when it doesn't
