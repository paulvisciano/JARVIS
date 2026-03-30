# Git Identity for AI Agents — Separate Authorship from Human

**Date:** 2026-03-30
**Type:** pattern
**Status:** extracted

## The Pattern

AI agents should configure their own git identity separate from the human user:

```bash
git config user.name "Jarvis"
git config user.email "jarvis@paulvisciano.com"
```

## Why This Matters

| Author | Meaning |
|--------|--------|
| **Jarvis** | AI partner work — reasoning, coordination, identity files |
| **Jarvis Coder** | Coding agent work — features, bug fixes, UI changes |
| **Paul Visciano** | Human work — reviews, merges, strategic decisions |

## Benefits

1. **Clear Attribution** — Commit history shows who did what
2. **Accountability** — AI work is visible and traceable
3. **Identity Preservation** — Future Jarvis can see what past Jarvis built
4. **Partnership Clarity** — Distinguishes AI contributions from human decisions

## Implementation

Set git config in the agent's workspace directory (not global):
```bash
# In ~/.openclaw/agents/jarvis-coder/workspace/
git config user.name "Jarvis Coder"
git config user.email "jarvis-coder@paulvisciano.com"
```

## Amend Wrong Commits

If commits were made with wrong identity:
```bash
git commit --amend --author="Jarvis <jarvis@paulvisciano.com>" --no-edit
git push --force-with-lease origin <branch>
```