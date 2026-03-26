# System Vitals Dashboard — Live Metrics Architecture

**Date:** 2026-03-26
**Type:** decision
**Status:** extracted

## The Dashboard Components

Built three-panel system vitals display:

### 1. OpenClaw Gateway
- Status: Running/Stopped
- PID
- Memory usage
- Uptime

### 2. Ollama Health
- Connection status
- Models loaded (with names, not just count)
- Model list visibility

### 3. System Resources
- Memory: Full computer memory (not just process)
- CPU: Full computer CPU
- Disk: Full disk usage

## The Workflow

1. Click server info bar → expands vitals panel
2. Live metrics display (not cached/stale)
3. Screenshot proof captured for archive
4. Breathe pipeline moves screenshots to dated archive

## Technical Decisions

- **Removed weekly quota from UI** — Creates confusion, not actionable
- **Real system metrics** — Not process-level, full machine stats
- **Screenshot verification** — Coder must prove work via browser screenshot, not just claim completion
- **Archive integration** — Screenshots become permanent work history via breathe skill

## The Principle

**Visibility creates accountability.** If you can see the system's health, you can diagnose issues before they become failures. The dashboard isn't decoration — it's diagnostic infrastructure.

## Future Augmentation

- Ollama weekly usage tracking (when API allows)
- Automated UI tests for dashboard functionality
- Model-specific metrics per agent

**This turns the UI from a chat interface into a control center.**