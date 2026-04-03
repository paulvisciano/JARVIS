# GitHub CLI Authentication Enables Autonomous Coder Workflow

**Date:** 2026-03-31
**Type:** insight
**Status:** extracted

## The Discovery

Coder couldn't complete the full workflow because `gh auth` wasn't configured. Once authenticated, the entire pipeline worked autonomously:

```
Task → Implementation → Commit → Push → PR Creation → Notification
```

## Why GitHub CLI > Web UI

| Method | Pros | Cons |
|--------|------|------|
| **GitHub CLI** | Scriptable, auditable, template support, terminal flow | Requires `gh auth login` |
| **Web UI** | Visual, no setup | Manual copy/paste, not auditable, breaks flow, easy to skip steps |

## Setup Process

```bash
gh auth login
# 1. GitHub.com → Yes
# 2. SSH or HTTPS → HTTPS  
# 3. Login via browser → Opens browser, approve
# 4. Done!
```

## Impact

Once authenticated, Coder can:
- Create branches autonomously
- Commit with proper messages
- Push to remote
- Create PRs with full descriptions
- Send completion notifications

**This transforms Coder from a code editor into a truly autonomous agent.**

## Workflow Update

WORKFLOW.md now specifies GitHub CLI as the **preferred method** for PR creation. Web UI is fallback only.