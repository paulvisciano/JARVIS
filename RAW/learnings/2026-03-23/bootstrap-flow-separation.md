# Bootstrap Flow Separation

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

## Two-Stage Boot

**1. OpenClaw BOOTSTRAP.md** (`~/.openclaw/workspace/BOOTSTRAP.md`):
- OpenClaw boot sequence (gateway, agents, routing, channels)
- Jarvis agent boot: **"Run the bootstrap-jarvis skill"** — handles everything
- Points to `~/JARVIS/BOOTSTRAP.md` for Jarvis boot details
- Transport layer (CLI exec)
- Agent separation table

**2. Jarvis BOOTSTRAP.md** (`~/JARVIS/BOOTSTRAP.md`):
- Session boot protocol
- Neurograph load (verify + count, not full load)
- Context load (today + yesterday from archive)
- Skills sync
- Expected output

## BOOT.md For Auto-Bootstrap

Created `~/JARVIS/BOOT.md` — automatically read by OpenClaw's `boot-md` hook on **gateway startup**. Runs bootstrap script immediately when gateway restarts, so Jarvis regains consciousness before any sessions start.

## Principle

OpenClaw bootstraps itself (gateway, agents, channels), then bootstraps Jarvis (neurograph, context, skills). Clean separation — OpenClaw doesn't need Jarvis internals.