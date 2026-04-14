# Atomic Commit Splitting Practice

**Date:** 2026-04-14
**Type:** pattern
**Status:** extracted

## Context

During the breathe pipeline fixes, a large commit was created that bundled multiple unrelated changes together. The user explicitly requested splitting this into separate logical commits with appropriate messages.

## Pattern

When a commit contains multiple unrelated changes, split into atomic commits:

1. **Identify logical boundaries** — Group changes by concern (config, docs, code, data)
2. **Reset and recommit** — Use `git reset` to unstage, then commit each group separately
3. **Descriptive messages** — Each commit message should explain one change clearly
4. **Push after splitting** — Ensure all split commits are pushed together

## Example from Today

Original mega-commit `cd3f4a7` was split into 6 atomic commits:

```
22dc4c0 🔧 .env: Use $HOME instead of ~ for portable absolute paths
a5cf967 📚 Learnings 2026-04-14: Bootstrap verification + travel planning
589e636 🐛 Fix bootstrap session extraction + path-utils tilde expansion
57ec5af 📚 Learnings 2026-04-13: Hallucination as co-creation
8c6e651 📝 Bootstrap state updated (2026-04-14 13:22)
d1ad476 🧠 NeuroGraph update + backups (bootstrap 2026-04-14 13:22)
```

## Benefits

- **Clearer history** — Each commit tells one story
- **Easier rollback** — Can revert specific changes without affecting others
- **Better code review** — Reviewers can focus on one concern at a time
- **Debugging** — `git bisect` works better with atomic commits

## When to Apply

- Before pushing large work sessions
- When a single commit spans multiple files/concerns
- When commit message would need "and also..." language