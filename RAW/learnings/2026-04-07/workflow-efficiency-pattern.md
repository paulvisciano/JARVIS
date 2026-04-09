# Don't Over-Engineer Simple Tasks — Direct Action vs Agent Delegation

**Date:** 2026-04-07
**Type:** pattern
**Status:** extracted

## The Problem

Paul caught a pattern: Jarvis was creating full stories, assigning to agents, and waiting for pickup for tasks that could be done directly in 30 seconds (e.g., moving AGENTS.md file from SCI-FI repo to JARVIS agents folder).

## The Pattern

**Decision Tree: Direct Action vs Agent Delegation**

```
Is the task < 2 minutes of direct work?
├── YES → Do it yourself immediately
│   └── Document after if needed
└── NO → Create task, assign to appropriate agent
    └── Let agent own the execution
```

## Why This Matters

1. **Velocity** — Agent handoff overhead (create story, assign, wait, review) exceeds direct execution time for small tasks
2. **Cognitive Load** — Tracking micro-tasks in Paperclip creates noise
3. **Trust** — Agents should focus on meaningful work, not trivial file moves
4. **Flow** — Interrupting momentum for bureaucracy kills productivity

## The Correction

Paul's feedback: *"You're in analysis paralysis mode because you're trying to hand off all the work to agents, but that's a simple task of moving a file. You ended up creating a story for it and then assigning it and it has to wait for somebody to get picked up when you could have just moved the file yourself."*

## Guiding Principle

**Use agents for leverage, not bureaucracy.** Agent delegation should amplify capability, not create process overhead.