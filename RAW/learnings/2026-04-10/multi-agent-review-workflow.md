# Multi-Agent Review Workflow for Roadmaps

**Date:** 2026-04-10
**Type:** pattern
**Status:** extracted

## The Workflow

Before breaking a roadmap into tasks, run a double-review process:

```
1. Frank (PM Agent) reviews
   └─ Task clarity
   └─ Priority ordering
   └─ Dependencies make sense?
   └─ Estimated time realistic?

2. Coder (Technical Agent) reviews
   └─ Technical feasibility
   └─ File structure correct?
   └─ Better approach?
   └─ Time estimates accurate?

3. Jarvis (CEO Agent) synthesizes feedback
   └─ Consolidate Frank + Coder feedback
   └─ Recommend changes

4. Paul makes final decisions
   └─ Approve/reject recommendations
   └─ Break into tasks
```

## Why This Matters

- **Catches blind spots** — PM perspective + technical perspective = complete picture
- **Reduces rework** — Issues found before tasks are created, not after
- **Leverages agent strengths** — Each agent reviews from their expertise area
- **Paul stays decisive** — Final call remains human, but informed by full analysis

## Applied To

JARVIS UI Roadmap v19-v23 (SCIAAA-86) — Frank assigned to review from PM perspective before task breakdown.