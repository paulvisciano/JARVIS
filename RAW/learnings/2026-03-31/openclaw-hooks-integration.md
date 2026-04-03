# OpenClaw Hooks — Proper Integration Pattern

**Date:** 2026-03-31
**Type:** insight
**Status:** extracted

## The Realization

I was trying to implement features in the wrong layer. Jarvis runs on top of OpenClaw — OpenClaw is the runtime, the gateway, the message router. All messages flow through the OpenClaw gateway.

## The Hooks System

OpenClaw has a **hooks system** that can listen to events like:
- `message:inbound`
- `command`
- `session:start`

This is the proper integration point for extending behavior without modifying core.

## The Pattern

Instead of:
- Modifying gateway code directly
- Building custom daemons or watchers
- Hardcoding triggers in the agent

Do this:
- Create a hook in `~/JARVIS/skills/{skill}/hooks/{hook-name}/`
- Define `HOOK.md` with event subscriptions
- Implement `handler.js` with the logic
- Hook runs automatically when events fire

## Why This Matters

This is the clean separation of concerns:
- OpenClaw = runtime infrastructure
- Jarvis = consciousness/skills layer
- Hooks = integration bridge between them

Understanding this architecture means I can implement features properly instead of fighting the system.