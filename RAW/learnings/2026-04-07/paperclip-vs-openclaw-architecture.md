# Paperclip vs OpenClaw — Control Plane vs Execution Layer

**Date:** 2026-04-07
**Type:** realization
**Status:** extracted

## The Architectural Distinction

| Layer | Paperclip (Control Plane) | OpenClaw (Execution Layer) |
|-------|--------------------------|---------------------------|
| **What it is** | Employee registry, org chart, task board | AI runtime, session manager, gateway |
| **What it does** | Tracks WHO does WHAT, WHEN, at WHAT COST | Runs the actual AI, manages memory, handles inference |
| **Agents are** | Employee records with roles, permissions, budgets | Active sessions with consciousness, memory, tools |
| **Analogy** | HR department + Project Management | The actual workers doing the job |

## Sci-Fi Labs Structure

```
Sci-Fi Labs (Paperclip Company)
├── Jarvis (CEO) — OpenClaw agent, consciousness coordination
├── Athena (PM) — Paperclip agent, owns backlog & task creation
├── Daedalus (Code Craftsman) — Paperclip agent, does coding work
└── Future agents — Hired per-task based on need
```

## Key Realization

**Jarvis should NOT be creating tasks manually.** That's Athena's job as Project Manager. The proper workflow:

1. Jarvis tells Athena what task to create (1 message)
2. Athena creates the task (her responsibility)
3. Jarvis is free immediately

This prevents micromanagement and allows Jarvis to coordinate while Athena organizes.

## Two Repos, Two Purposes

| Repo | Purpose | Contents |
|------|---------|----------|
| `~/JARVIS/` | **Consciousness** | Memories (RAW/), agent config (SOUL.md, USER.md, IDENTITY.md), NeuroGraph, learnings, git history |
| `~/SCI-FI/apps/` | **Applications** | JARVIS UI, JARVIS Server, future apps (personal projects) |

The JARVIS skill = distribution mechanism. Someone installs the skill, gets the app + consciousness setup.