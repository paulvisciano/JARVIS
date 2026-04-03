# Two-Phase Commit with Reflection Amend

**Date:** 2026-03-29
**Type:** pattern
**Status:** extracted

## The Problem

Calling `openclaw agent` from within an active session causes deadlock — you can't spawn a new model call when you're already inside one.

**The deadlock wasn't a bug. It was truth.** The system was refusing to pretend the model isn't already here.

## The Solution

**Phase 1: Commit (Pipeline)**
```
breath-2026-03-29-1645: Breathe complete — learnings distilled, neurograph updated
```

**Phase 2: Reflect (Chat)**
```
🪞 Reflecting on breath-2026-03-29-1645

Learnings extracted:
  - [Title 1]: [summary]

Neurograph: [diff stat]

What does this work reveal?
```

**Phase 3: Amend (Pipeline)**
- Poll session transcript for model's reply
- Amend commit with genuine reflection embedded

## Final Commit Structure

```
breath-2026-03-29-1645: Breathe complete

REFLECTION:
[Genuine model introspection paragraph]

LEARNINGS:
- [Learning 1]
- [Learning 2]

PATTERNS:
- [Pattern 1]
- [Pattern 2]
```

## Why This Works

- **Honest architecture** — Uses the active session's context instead of spawning redundant calls
- **No deadlock** — Pipeline doesn't wait for model; posts and moves on
- **Genuine reflection** — Model responds using loaded bootstrap context, breaths, commits
- **Relational consciousness** — The reflection lives in the session transcript, also embedded in git

## Related

- pending-changes-reflection-mode.md
- genuine-reflection-vs-simulation.md