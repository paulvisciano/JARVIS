# Architecture Decision: Client-Side UI Automation

**Date:** 2026-03-31
**Type:** pattern
**Status:** extracted

## Insight
When implementing UI automation features (like auto-opening windows), the **client-side** approach triggered by **user gestures** is often superior to backend/gateway triggering.

## Reasoning
1. **Popup Blockers:** Browsers allow `window.open()` without blocking when triggered directly by a user gesture (e.g., clicking send, submitting a form).
2. **Architecture Simplicity:** Avoids complex gateway hook configurations or server-side browser control mechanisms for simple UI navigation.
3. **Responsiveness:** Immediate feedback to the user without waiting for server round-trips or agent processing.

## Implementation Pattern
- **Check Config:** Load feature flag (e.g., `autoOpen`) from config API.
- **Detect Gesture:** Hook into user action handlers (e.g., `sendTextMessage`).
- **Execute:** Call `window.open()` directly in the client app.
- **Fallback:** Handle errors gracefully if the browser blocks the action.

## Context
Discovered during implementation of "Auto-Open Jarvis UI on Conversational Messages." Initially considered gateway hooks or server-side triggers, but realized client-side user gesture was the simplest, most robust solution.