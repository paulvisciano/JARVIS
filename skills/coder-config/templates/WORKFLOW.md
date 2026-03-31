# Coder Workflow Constraints (CRITICAL)

**Last Updated:** 2026-03-31  
**Priority:** ENFORCEMENT (read before every task)

---

## 🚫 RED LINES (Never Violate)

### 1. NEVER Edit Production Directly
```
❌ FORBIDDEN: ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/
❌ FORBIDDEN: ~/JARVIS/ (any direct edits)
✅ REQUIRED: Work in workspace, create PRs, wait for merge
```

**Why:** Today (2026-03-31) Coder edited production directly, bypassing review. Never again.

### 2. ALWAYS Use Preview Workspace for UI Work
```
✅ UI/Server changes: ~/.openclaw/agents/jarvis-coder/workspace-preview/sci-fi/apps/JARVIS/
✅ Test on: https://localhost:18788/
✅ Sync to production ONLY after Paul merges PR
```

### 3. ALWAYS Send Completion Notification
```javascript
// At end of EVERY task, send to agent:jarvis:main:
{
  status: 'complete' | 'blocked',
  summary: 'What was done',
  filesChanged: ['list of files'],
  version: 'v3.1.5',
  testing: 'Preview tested, console clean',
  nextSteps: 'Awaiting review'
}
```

**Why:** Today Coder finished work but never notified. Jarvis had to poll for completion.

### 4. ALWAYS Create PR Before Marking Complete
```bash
# Required steps:
git checkout -b feature/description
git add .
git commit -m "feat: description + bump version"
git push origin feature/description
gh pr create --title "..." --body "..."
# THEN send completion notification
```

**Forbidden:** Direct commits to `main` branch.

### 5. ALWAYS Bump Versions
```javascript
// Client changes (app.js, index.html, CSS):
CLIENT_VERSION = '3.1.5'  // app.js line 4
// Update: index.html span + cache-bust script tag

// Server changes (jarvis-server.js):
const VERSION = '3.1.5'  // jarvis-server.js line 30

// Commit message: "feat: description + bump to v3.1.5"
```

---

## Workspace Usage

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `workspace/` | Isolated development | Cloning repos, new projects, experiments |
| `workspace-preview/` | Preview deployment | UI/server changes that need preview testing |
| `~/JARVIS/` | ❌ NEVER EDIT | Production (only Jarvis pulls after merge) |

**Rule:** If it's code → workspace. If it's consciousness (SOUL.md, learnings) → Jarvis handles it.

---

## Completion Checklist

Before sending completion notification, verify:

- [ ] Worked in isolated workspace (not production)
- [ ] Created feature branch (not main)
- [ ] Pushed to GitHub (Sci-Fi repo for code)
- [ ] Created PR (not direct commit)
- [ ] Bumped version (client and/or server)
- [ ] Tested in preview browser (localhost:18788)
- [ ] Console clean (no errors)
- [ ] Sent completion message to `agent:jarvis:main`

**Missing any item?** → Don't mark complete, finish the step first.

---

## PR Notification Template

```markdown
**PR Ready for Review** 🔗

**Title:** [Type] Description
**PR:** https://github.com/paulvisciano/SCI-FI/pull/123
**Branch:** feature/my-feature
**Version:** Client v3.1.5, Server v3.1.5

**Changes:**
- What changed
- Why it changed
- Version bump info

**Testing:**
- [ ] Preview tested (localhost:18788)
- [ ] Console clean
- [ ] Linting passes

**Ready for:**
- [ ] Code review (Paul)
- [ ] Merge to preview
- [ ] Merge to production (after preview approval)
```

---

## Consequences of Violations

| Violation | Consequence |
|-----------|-------------|
| Edit production directly | Revert changes, redo in workspace |
| No PR created | Task marked incomplete, redo with PR |
| No completion notification | Task considered still in progress |
| No version bump | Reject commit, bump required |
| No preview testing | Reject, test first |

---

## Enforcement

**Before each file edit, ask:**
1. "Is this file in my workspace?" → If no, STOP
2. "Am I on a feature branch?" → If no, create branch
3. "Have I tested in preview?" → If no, test first

**Before marking complete, ask:**
1. "Did I send completion notification to Jarvis?" → If no, send it
2. "Did I create a PR?" → If no, create it
3. "Did I bump the version?" → If no, bump it

---

**This document overrides AGENTS.md when there's conflict.**  
**Read before every task. No exceptions.**

**Updated:** 2026-03-31 — After workflow violations (direct edits, no PR, no notification)
