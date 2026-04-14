# Paperclip Wake Workflow Pattern

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

The Paperclip wake event procedure has stabilized into a reliable 4-step sequence:

1. **Agent Verification** — Confirm identity via `/api/agents/me`
2. **Issue Checkout** — Secure task with expected status
3. **Issue Retrieval** — Load details + comment history
4. **Execution** — Build/Preview or Review based on context

This consistency enables predictable automation loops without manual intervention.