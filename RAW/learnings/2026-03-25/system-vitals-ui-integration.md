# System Vitals Dashboard Integration Pattern

**Date:** 2026-03-25
**Type:** pattern
**Status:** extracted

## Overview

System health monitoring should be visible directly in the UI, not just in logs. This creates immediate awareness of system state.

## Vitals to Display

| Component | Metric | Display Format |
|-----------|--------|----------------|
| **JARVIS Server** | Version, PID, Memory, Uptime | `V2.9.7 - PID 23247 - 105 MB - 0:01.97` |
| **OpenClaw Gateway** | Status, PID, Memory | `Status: Running, PID: 21930, Memory: 535 MB` |
| **Ollama Health** | Status, Models Count | `Status: Connected, Models: 5` |
| **System Resources** | CPU, Memory | `CPU: __%, Memory: __%` |

## UI Integration Approach

1. **Collapsible section** — "System Vitals" dropdown
2. **Click-to-reveal** — Click server version to expand full vitals
3. **Real-time updates** — Refresh on interval or state change
4. **Error states visible** — Red indicators when components fail

## Version Bumping Requirement

**Critical:** Anytime UI or server code changes:
- Bump `CLIENT_VERSION` in `app.js`
- Bump server version in `jarvis-server.js`
- Commit with clear message
- Report version change in commit summary

## Location

Vitals integrated into JARVIS UI at `skills/jarvis-ui/sci-fi/apps/JARVIS/`

## Key Learning

Visibility prevents confusion. When users can see system health at a glance, they diagnose issues faster and trust the system more.