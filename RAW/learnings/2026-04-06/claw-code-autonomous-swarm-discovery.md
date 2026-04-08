# Claw-Code Discovery — Autonomous Coding Swarm, Not CLI Tool

**Date:** 2026-04-06
**Type:** insight
**Status:** extracted

## The Discovery

When researching the claw-code repository, we uncovered a fundamental misconception:

**Initial Assumption:** Claw-code is a CLI tool for coding assistance.

**Reality:** Claw-code is an **AUTONOMOUS CODING SWARM**.

## The Philosophy (Mind-Blowing)

> *"If you only look at the generated files in this repository, you are looking at the wrong layer."*

**The Real Product:**
- **Human Interface:** Discord channel (type from phone, walk away)
- **Clawhip:** Event router (watches git, tmux, GitHub, agent lifecycle)
- **Oh-My-Codex:** Workflow layer (planning, execution, verification)

## Key Capabilities Unlocked

1. **Event-Driven > Terminal Scraping** — Reacts to git events, not command output
2. **Recovery > Retry Loops** — Self-healing when agents fail
3. **Discord > tmux** — Persistent, accessible from anywhere
4. **Type From Phone → Walk Away → Return to Done** — True async autonomous work

## Integration Potential for Jarvis

- Coder could use claw-code for autonomous coding without constant interference
- Event-driven architecture aligns with OpenClaw gateway patterns
- Could enable "fire and forget" development sessions

## Current Status

As of 8:53 PM: Claw-code sits in `~/claw-code/` (built, works, but NOT integrated). Decision pending on whether to integrate, adapt patterns, or delete and move on.