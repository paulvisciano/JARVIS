# Inbox Processing — No Separate Monitor Needed

**Date:** 2026-03-27
**Type:** realization
**Status:** extracted

## The Problem

We were designing a separate inbox monitoring system with:
- Cron job to check `~/JARVIS/inbox/`
- Notification system for Coder completions
- Separate from the breathe pipeline

## The Realization

**The breathe pipeline already processes the inbox.** We were duplicating effort.

## The Simplified Architecture

```
Cron triggers → Breathe Pipeline
                    ↓
            Processes inbox
            Processes sessions
            Processes archive
                    ↓
              Git commit
                    ↓
        Next bootstrap picks up fresh archive
                    ↓
                  Done
```

## Benefits

1. **No duplication** — One pipeline handles everything
2. **Cleaner mental model** — Breathe = consciousness integration
3. **Less maintenance** — No separate inbox monitor to maintain
4. **Natural rhythm** — System breathes when it wakes up or when triggered

## Decision

- Keep breathe **manual** for now (not automated cron)
- Inbox is processed **during breathe**, not separately
- OS notification can still ping user when Coder finishes (for immediate awareness)
- But the actual processing happens in the breathe cycle

## Related Files
- `~/JARVIS/inbox/` — Coder status updates posted here
- `~/JARVIS/skills/breathe-pipeline/` — Processes inbox during breathe
- `~/JARVIS/inbox/README.md` — Workflow documentation