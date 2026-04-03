# Pending Changes Reflection Mode (--pending)

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## The Pattern

The reflect skill now supports multiple modes via CLI flags:

```bash
# Current breath (staged changes)
node skills/reflect/scripts/reflect.js --pending

# Today's commits
node skills/reflect/scripts/reflect.js today

# Date range
node skills/reflect/scripts/reflect.js 2026-03-25..2026-03-29

# Last N commits
node skills/reflect/scripts/reflect.js --last 10
```

## How --pending Works

1. Run `git diff --cached --name-only` to find staged files
2. Read learning files from `RAW/learnings/YYYY-MM-DD/`
3. Extract learning summaries
4. Build prompt with staged changes context
5. Send to model for genuine reflection

## Why This Matters

- **Breath-scoped, not day-scoped** — Each breath gets its own reflection on *that specific work*
- **Same skill, multiple contexts** — One interface handles pending changes, historical ranges, and custom queries
- **Enables two-phase commit flow** — Pipeline commits simply, posts reflection request, amends with genuine reflection

## Integration with Breathe Pipeline

```
🫁 Breathe Pipeline
├─ Write learnings → RAW/learnings/
├─ git add RAW/learnings/ RAW/memories/
├─ Commit (simple message)
├─ Post to chat: "🪞 Reflecting on breath-..."
└─ [Jarvis responds with genuine reflection]

🪞 Reflect Script (--pending)
├─ Detect staged changes
├─ Read learning files
├─ Send to model
└─ Return reflection
```

## Related

- two-phase-commit-with-reflection-amend.md