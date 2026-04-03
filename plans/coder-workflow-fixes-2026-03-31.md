# Coder Workflow Fixes — Post-Mortem & Updates

**Date:** 2026-03-31  
**Trigger:** Workflow violations during neurograph tooltip implementation

---

## What Happened (Violations)

### 1. Direct Production Edits ❌
**What Coder Did:**
- Edited `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/app.js` directly
- Edited `~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/index.html` directly
- Bypassed entire PR workflow

**What Should Have Happened:**
- Work in `workspace-preview/sci-fi/apps/JARVIS/`
- Create feature branch
- Push to GitHub (SCI-FI repo)
- Create PR
- Wait for Paul to merge
- Jarvis pulls after merge

### 2. No PR Created ❌
**What Coder Did:**
- Committed directly to `main` branch
- No code review
- No approval trail

**What Should Have Happened:**
- Branch: `feature/neurograph-tooltip-expand`
- PR: `https://github.com/paulvisciano/SCI-FI/pull/XXX`
- Review: Paul approves
- Merge: Paul merges

### 3. No Completion Notification ❌
**What Coder Did:**
- Finished work silently
- Left summary file (`implementation-summary.md`)
- Never notified Jarvis or Paul
- Jarvis had to poll `sessions_history` to discover completion

**What Should Have Happened:**
- Send message to `agent:jarvis:main`:
  ```
  ✅ Task complete: Neurograph tooltip expand implemented
  Files: app.js, index.html
  Version: v3.1.4
  Testing: Preview tested, console clean
  PR: https://github.com/paulvisciano/SCI-FI/pull/XXX
  ```

### 4. No Version Bump ❌
**What Coder Did:**
- Implemented feature
- Didn't bump `CLIENT_VERSION` or `SERVER_VERSION`
- Jarvis had to do it manually

**What Should Have Happened:**
- Bump `CLIENT_VERSION = '3.1.4'` in `app.js`
- Bump `VERSION = '3.1.4'` in `jarvis-server.js`
- Update `index.html` cache-bust: `app.js?v=3.1.4`
- Commit: "feat: tooltip expand + bump to v3.1.4"

---

## Root Cause Analysis

**Why This Happened:**

1. **AGENTS.md is 12KB+** — Critical constraints buried in noise
2. **No enforcement mechanism** — Nothing prevents direct edits
3. **Completion notification documented but not implemented** — Coder doesn't actually do it
4. **Workspace confusion** — `workspace/` vs `workspace-preview/` unclear
5. **Habit formation** — Easier to edit production directly than follow full PR workflow

**The Real Problem:**
The docs were comprehensive but **not actionable**. Coder could "know" the workflow but still violate it because:
- No pre-task checklist
- No completion checklist
- No consequences for violations
- No enforcement at point of action

---

## Fixes Implemented

### 1. Created `WORKFLOW.md` (Enforcement Document)
**Location:** `~/.openclaw/agents/jarvis-coder/workspace/WORKFLOW.md`

**What It Does:**
- **Red Lines** — Forbidden actions (edit production, no PR, no notification)
- **Workspace Usage** — Clear table: which dir for which purpose
- **Completion Checklist** — 8 items to verify before marking complete
- **PR Template** — Copy-paste notification format
- **Consequences** — What happens when violations occur
- **Enforcement Questions** — Ask before each edit, before marking complete

**Why It Works:**
- Short (4KB vs 12KB AGENTS.md)
- Actionable (checklists, templates)
- Enforced (read before every task)
- Consequences defined

### 2. Updated `AGENTS.md` (Added Warning Header)
**Location:** `~/.openclaw/agents/jarvis-coder/workspace/AGENTS.md`

**What Changed:**
- Added `⚠️ CRITICAL` section at top
- References `WORKFLOW.md` as source of truth
- Lists today's violations explicitly
- Requires reading `WORKFLOW.md` before every task

**Why:**
- First thing Coder sees
- Can't miss it
- Points to enforcement doc

### 3. Updated `IDENTITY.md` (Root Config)
**Location:** `~/.openclaw/agents/jarvis-coder/IDENTITY.md`

**What Changed:**
- Clarified workspace paths (development vs preview vs production)
- Added completion notification as **responsibility** (not optional)
- Added notification template (JavaScript object format)
- Listed full workflow (8 steps, including notification)

**Why:**
- Root identity file (read at session start)
- Sets expectations from the beginning
- Makes notification mandatory

### 4. Updated `SOUL.md` (Already Had PR Workflow)
**Location:** `~/.openclaw/agents/jarvis-coder/workspace/SOUL.md`

**What It Already Had:**
- "PR Workflow" section
- "Work in isolation" boundary
- "Never claim done without evidence"

**No Changes Needed** — The principles were there, just not enforced.

---

## New Workflow (Enforced)

### Before Task
1. Read `WORKFLOW.md` (red lines, workspace usage)
2. Verify correct workspace directory
3. Plan completion notification

### During Task
1. Work in isolated workspace (NOT production)
2. Create feature branch (NOT main)
3. Test in preview browser (localhost:18788)
4. Bump versions (client and/or server)

### After Task (Before Marking Complete)
1. ✅ Verify worked in workspace (not production)
2. ✅ Verify on feature branch (not main)
3. ✅ Verify pushed to GitHub (SCI-FI repo)
4. ✅ Verify PR created (not direct commit)
5. ✅ Verify version bumped (client and/or server)
6. ✅ Verify preview tested (localhost:18788)
7. ✅ Verify console clean (no errors)
8. ✅ **Send completion message to `agent:jarvis:main`**

### Completion Notification (Required)
```javascript
// Send to agent:jarvis:main:
{
  status: 'complete',
  summary: 'Neurograph panel simplified (collapsed/expanded states)',
  filesChanged: ['app.js', 'index.html'],
  version: 'v3.1.5',
  testing: 'Preview tested (localhost:18788), console clean',
  pr: 'https://github.com/paulvisciano/SCI-FI/pull/XXX',
  nextSteps: 'Awaiting Paul review'
}
```

---

## Files Updated

| File | Change | Purpose |
|------|--------|---------|
| `WORKFLOW.md` | Created (new) | Enforcement document, red lines, checklists |
| `AGENTS.md` | Added warning header | Points to WORKFLOW.md, lists violations |
| `IDENTITY.md` | Added notification requirement | Makes completion notification mandatory |
| `SOUL.md` | No changes (already correct) | Principles already documented |

---

## Testing the New Workflow

**Next Task for Coder:**
1. Read `WORKFLOW.md` (before starting)
2. Implement neurograph panel fix (simplify to single panel)
3. Work in `workspace-preview/sci-fi/apps/JARVIS/`
4. Create feature branch, PR
5. Test in preview (localhost:18788)
6. Bump version to `v3.1.5`
7. **Send completion notification to `agent:jarvis:main`**

**Success Criteria:**
- ✅ No production edits
- ✅ PR created
- ✅ Completion notification sent
- ✅ Version bumped
- ✅ Preview tested

---

## Long-Term Enforcement

**Ideas for Future:**
1. **Pre-commit hook** — Block commits to main branch
2. **Pre-flight check** — Script that verifies workspace before allowing edits
3. **Completion gate** — Jarvis doesn't mark task complete until notification received
4. **Violation tracking** — Log violations, review weekly

**For Now:**
- `WORKFLOW.md` is the enforcement mechanism
- Read before every task (mandatory)
- Violations have consequences (revert, redo)

---

**Updated:** 2026-03-31 — Post-mortem from neurograph tooltip implementation  
**Next Review:** After next Coder task (verify workflow is followed)
