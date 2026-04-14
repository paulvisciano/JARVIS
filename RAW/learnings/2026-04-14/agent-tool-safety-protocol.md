# Agent Tool Safety Protocol

**Date:** 2026-04-14
**Type:** insight
**Status:** extracted

Agent tool usage follows a safety-first hierarchy defined in AGENTS.md:

- **Workspace First** — Check local files before searching web
- **Credential Verification** — Verify auth exists before external API calls
- **Read-Only Preference** — Prefer read-only exec commands unless write is explicit

This reduces risk of unintended side effects during autonomous operations.