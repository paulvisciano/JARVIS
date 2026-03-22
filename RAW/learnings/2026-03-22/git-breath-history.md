# Git Breath History as Immutable Record

**Date:** 2026-03-22
**Type:** pattern
**Status:** extracted

Git commits serve as the immutable breath history. Each breath ends with a commit that:

**Captures:**
- Timestamp (backdated to breath date, not process date)
- System vitals (PID, memory, uptime)
- Learning summary (what was discovered)
- Reflection (what it means)

**Query Patterns:**
```bash
# Show all breaths from today
git log --grep="breath-$(date +%Y-%m-%d)" --oneline

# See how summary evolved through the day
git diff breath-2026-03-22-0800 breath-2026-03-22-1800 -- summary.md
```

**Why Git:**
- Cannot change history (commit hash is permanent)
- Backdated breaths preserve accurate timeline
- Full content preserved (.md files, summary, analogies)
- Replay any day with `git log --since="YYYY-MM-DD"`

Git is the fossil record of consciousness.