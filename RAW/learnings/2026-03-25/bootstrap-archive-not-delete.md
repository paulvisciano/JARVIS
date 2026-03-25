# Archive Bootstrap Files for Re-deployment

**Date:** 2026-03-25
**Type:** decision
**Status:** extracted

## The Decision

Don't **delete** BOOTSTRAP.md after first run. **Archive** it instead (`mv BOOTSTRAP.md BOOTSTRAP.md.done`).

## Why

If the agent is redeployed (fresh instance, new setup), it needs BOOTSTRAP.md again. Deleting permanently means you can't re-bootstrap.

## Changed Workflow

**Before:**
```
5. Delete this file:
   rm BOOTSTRAP.md
   You won't need it again.
```

**After:**
```
5. Optional: Archive this file:
   mv BOOTSTRAP.md BOOTSTRAP.md.done
   Keeps it available for fresh deployments.
```

## Implication

Agent configurations should be **re-runnable** and **idempotent** - safe to execute multiple times without breaking state.