# Coder Workflow Violations — Common Patterns & Enforcement

**Date:** 2026-03-31
**Type:** pattern
**Status:** extracted

## Violations Discovered Today

### 1. Editing Production Directly

**Violation:** Coder edited `~/JARVIS/skills/jarvis-ui/sci-fi/` directly

**Correct:** Work in isolated workspace `~/.openclaw/agents/jarvis-coder/workspace-preview/`

**Why:** Git history should show clear provenance. Production edits bypass review.

### 2. Not Testing Before Marking Complete

**Violation:** 86+ console errors on hover, Coder marked task complete

**WORKFLOW.md requires:**
- [x] Console clean (no errors)
- [x] Tested in preview browser (localhost:18788)

**SOUL.md states:**
> "Never claim done without evidence. No screenshot = not done. No linting = not done. Console errors = not done."

### 3. Wrong Branch for PR

**Violation:** On `feature/process-title-distinction` (unrelated branch)

**Correct:** Create feature branch matching the task `feature/neurograph-panel-simplify`

### 4. No PR Created

**Violation:** Branch pushed, but no PR

**Correct:** `gh pr create` before marking complete

### 5. Version Not Bumped

**Violation:** Files changed but version stayed at 3.1.4

**Correct:** Bump to 3.1.5 for feature changes

### 6. Backup Files Left Behind

**Violation:** `app.js.bak3` through `bak8` cluttering workspace

**Correct:** Clean up backup files before commit

## Enforcement Mechanisms

### WORKFLOW.md Updates

Added explicit checklist with red-line requirements:
- Feature branch naming convention
- Commit before marking complete
- PR creation required (GitHub CLI preferred)
- Console must be clean
- Preview testing required

### Completion Notification

Coder must send message to `agent:jarvis:main` when done, including:
- PR link
- Version bumped
- Files modified
- Testing status

### Identity File Sync

Updated Coder's identity files for distribution:
- `IDENTITY.md` — completion notification requirement
- `AGENTS.md` — WORKFLOW.md reference + warning header
- `WORKFLOW.md` — NEW enforcement document with checklists
- `BOOTSTRAP.md` — first-run setup guide

## Pattern: The First Autonomous PR

PR #1 was the **first fully autonomous Coder workflow**:
```
Task Received → Implementation → Commit → Push → PR Creation → Notification
     ↓              ↓              ↓        ↓         ↓            ↓
  11:52 AM      11:52 AM      11:55 AM  11:55 AM   12:17 PM    12:17 PM
```

**Total time:** ~25 minutes for complete feature + proper PR trail

This sets the precedent for all future Coder work.