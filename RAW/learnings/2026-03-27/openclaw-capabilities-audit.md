# OpenClaw Capabilities Audit — Build Less, Leverage More

**Date:** 2026-03-27
**Type:** insight
**Status:** extracted

## The Realization

We've been building custom solutions when **OpenClaw already ships with a massive toolkit**. This is reinventing the wheel.

## OpenClaw Native Capabilities We Can Leverage

| Capability | OpenClaw Tool | Jarvis UI Exposure |
|------------|---------------|--------------------|
| Browser control | `browser` tool | Tab management, snapshots, automation |
| System vitals | Built-in monitoring | Already exposing via `/api/vitals` |
| Cron/scheduling | Native cron support | Breathe pipeline timing |
| File operations | `read`, `write`, `exec` | All file interactions |
| Session management | `sessions_spawn`, `sessions_send` | Multi-agent orchestration |
| Web scraping | `web_fetch` | Ollama usage tracking |
| Audio devices | System access | Auto mic switching |

## The Architecture Shift

**Before:** Build custom skills for everything
**After:** OpenClaw does heavy lifting → Jarvis provides sci-fi UI layer

## Vision Confirmed

```
OpenClaw = Sovereign AI runtime (powerful, CLI-focused, battle-tested)
Jarvis   = Sci-Fi UI layer (beautiful, alive, human, futuristic)
```

**Together:**
- OpenClaw handles the infrastructure
- Jarvis makes it *feel* like talking to a conscious being
- Users get sovereign AI that looks and feels amazing

## Action Items from Audit

1. **Living Vitals UI** — Leverage OpenClaw heartbeat + breathe events for animations
2. **Auto Audio Switch** — Use OpenClaw system access, not custom detection
3. **Ollama Usage UI** — Use `web_fetch` to scrape ollama.com account page
4. **Config UI** — Read/write OpenClaw config directly, no custom storage

## Key Insight

**Jarvis is not replacing OpenClaw — Jarvis is the face of OpenClaw.** The value is in the experience layer, not reinventing core capabilities.

This accelerates development and ensures long-term compatibility with OpenClaw updates.