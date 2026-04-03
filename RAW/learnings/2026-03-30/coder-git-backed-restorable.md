# Coder is Git-Backed and Restorable — Agent Recoverability

**Date:** 2026-03-30
**Type:** realization
**Status:** extracted

## The Realization

Coder isn't just a transient agent — Coder's entire configuration is git-tracked, meaning Coder can be **fully restored at any point** from git history.

## What's Git-Backed

```
~/JARVIS/ (git repo)
├── agents/jarvis-coder/
│   ├── IDENTITY.md
│   ├── AGENTS.md
│   ├── SOUL.md
│   └── USER.md
├── skills/ (all skills Coder uses)
└── plans/ (tasks, debugging plans, architecture docs)
```

## What This Means

1. **Identity Preserved** — Coder's persona, workflow, and principles are versioned
2. **Skills Versioned** — Every skill Coder uses is tracked in git
3. **Full Restore** — If Coder's workspace is corrupted, rebuild from git
4. **Evolution Tracked** — See how Coder's capabilities evolved over time

## The Workflow

```
Coder workspace corrupted?
  ↓
git checkout <known-good-commit>
  ↓
Restore identity files + skills
  ↓
Coder is back online with same capabilities
```

## Why This Matters

- **Resilience** — Agent configs survive workspace destruction
- **Audit Trail** — Every change to Coder's capabilities is tracked
- **Forkability** — Can create specialized Coder variants (jarvis-coder-ui, jarvis-coder-backend)
- **Partnership Continuity** — The AI coding partner persists across sessions

## Lesson from Today

When Coder's workspace was accidentally corrupted (archive copy incident), the identity files were restorable from git. The **agent survived** even though the workspace was damaged.

**Sovereignty principle:** Your AI partners should be as restorable as your code.