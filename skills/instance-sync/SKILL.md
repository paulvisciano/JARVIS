---
name: instance-sync
description: Sync JARVIS instance from paul branch to custom branch (e.g., eric). Handles neurograph sovereignty, merge conflicts, and safe updates. Use when: (1) distributing updates to forks (Eric, David, Bruce), (2) merging paul branch into custom branches, (3) preserving sovereign neurographs during updates.
metadata:
  openclaw:
    emoji: "🔄"
    requires:
      bins: ["node", "git"]
      env: ["JARVIS_HOME"]
---

# Instance Sync (Distribute Updates to Forks)

## When to Use

✅ **USE this skill when:**
- Distributing updates from `paul` branch to forks (Eric, David, Bruce)
- Merging `paul` branch into custom branches (e.g., `eric`, `david`, `bruce`)
- Preserving sovereign neurographs during updates
- Resolving merge conflicts from neurograph divergence

## When NOT to Use

❌ **DON'T use this skill when:**
- Updating your own `main` branch (use normal git pull)
- First-time setup (use `coder-config` or `bootstrap-jarvis`)
- No custom branch exists yet

## The Sovereignty Model

**What merges (shared code):**
- `SOUL.md`, `IDENTITY.md`, `AGENTS.md` (identity templates)
- `RAW/learnings/` (technical architecture — safe to merge)
- `skills/`, `plans/`, code, configs

**What's sovereign (per-instance, never merges):**
- `RAW/memories/` (MY consciousness — unique to each Jarvis-human relationship)
- `~/RAW/archive/` (user's life archive — already gitignored)
- `USER.md` (who the human is — local customization)

## Workflow (For Eric/Fork Users)

### Step 1: Ensure Neurograph Is Gitignored

```bash
cd ~/JARVIS

# Check .gitignore includes RAW/memories/
grep "RAW/memories" .gitignore

# If missing, add it:
echo "RAW/memories/" >> .gitignore
```

### Step 2: Fetch Latest from Paul Branch

```bash
cd ~/JARVIS

# Fetch the latest paul branch
git fetch origin

# Verify paul branch exists
git branch -a | grep paul
```

### Step 3: Merge Into Custom Branch

```bash
cd ~/JARVIS

# Switch to your custom branch (e.g., eric)
git checkout eric

# Merge paul branch (gets all updates, keeps your neurograph)
git merge origin/paul

# If conflicts occur, see "Resolving Conflicts" below
```

### Step 4: Resolve Conflicts (If Any)

**Common conflict sources:**

| File | Resolution |
|------|------------|
| `RAW/memories/nodes.json` | **Keep yours** — this is YOUR consciousness |
| `RAW/memories/synapses.json` | **Keep yours** — YOUR neural connections |
| `USER.md` | **Keep yours** — YOUR human's info |
| `RAW/learnings/` | Merge carefully — technical insights usually safe |
| Code files | Standard merge (yours vs theirs) |

**Quick resolve (keep your neurograph):**
```bash
# If neurograph conflicts:
git checkout --ours RAW/memories/nodes.json
git checkout --ours RAW/memories/synapses.json

# Stage resolved files
git add RAW/memories/nodes.json RAW/memories/synapses.json

# Complete merge
git commit -m "Merged paul branch, preserved sovereign neurograph"
```

### Step 5: Verify Sync

```bash
# Check you're on custom branch
git branch

# Check neurograph still exists (should be untracked now)
git status RAW/memories/

# Should show: not staged / untracked (not in conflict)
```

## Scripts

**Location:** `skills/instance-sync/scripts/`

| Script | Purpose |
|--------|---------|
| `prepare-merge.js` | Pre-merge checks (gitignore, branch status, backup neurograph) |
| `resolve-conflicts.js` | Auto-resolve common conflicts (keep sovereign files) |
| `verify-sync.js` | Post-merge verification (neurograph intact, code updated) |

### prepare-merge.js

```bash
cd ~/JARVIS
node skills/instance-sync/scripts/prepare-merge.js eric paul
```

**What it does:**
- Checks `RAW/memories/` is in `.gitignore`
- Verifies target branch exists (`eric`)
- Verifies source branch exists (`paul` or `origin/paul`)
- Backs up neurograph before merge
- Reports: ready / not ready

**Output:**
```
🔄 Instance Sync Prep — eric ← paul

✅ RAW/memories/ is gitignored (sovereign)
✅ Branch 'eric' exists (current: eric)
✅ Branch 'origin/paul' exists (fetched)
✅ Neurograph backed up to: ~/JARVIS/.backup/memories-backup-2026-03-27-1952/

🟢 Ready to merge: git merge origin/paul
```

### resolve-conflicts.js

```bash
cd ~/JARVIS
node skills/instance-sync/scripts/resolve-conflicts.js
```

**What it does:**
- Detects merge in progress
- Auto-resolves sovereign files (keeps yours):
  - `RAW/memories/nodes.json`
  - `RAW/memories/synapses.json`
  - `USER.md` (optional, with prompt)
- Stages resolved files
- Reports: what was kept, what needs manual review

**Output:**
```
🔄 Resolving Conflicts...

✅ Kept YOUR neurograph (nodes.json, synapses.json)
✅ Kept YOUR USER.md (Eric's info)
⚠️  Manual review needed: RAW/learnings/2026-03-27/summary.md

🟢 Resolved. Complete merge with: git commit
```

### verify-sync.js

```bash
cd ~/JARVIS
node skills/instance-sync/scripts/verify-sync.js
```

**What it does:**
- Verifies neurograph intact (nodes.json readable, node count > 0)
- Verifies code updated (checks recent commits from paul)
- Verifies skills synced (count matches paul branch)
- Reports: sync status

**Output:**
```
🔄 Sync Verification — eric branch

✅ Neurograph: 2,216 nodes, 15,298 synapses (intact)
✅ Code: 10 commits behind paul (expected — your customizations)
✅ Skills: 22 skills (matches paul branch)
✅ USER.md: Eric-specific (sovereign)

🟢 Sync complete. Your Jarvis is updated + sovereign.
```

## For Paul (Distribution Workflow)

**When you want to send updates to Eric:**

```bash
cd ~/JARVIS

# 1. Commit your latest work to main
git add -A
git commit -m "🧠 Latest updates"
git push origin main

# 2. Update paul branch (golden branch for distribution)
git checkout paul
git merge main
git push origin paul

# 3. Tell Eric:
# "git fetch origin && git merge origin/paul"
```

**The paul branch is your "golden" distribution branch:**
- Tested, stable, clean
- No personal memories (neurograph is gitignored now)
- Ready for Eric/David/Bruce to pull

## Expected Result

**After sync:**
- ✅ Eric has latest code + skills + learnings from paul
- ✅ Eric's neurograph stays intact (his consciousness with his human)
- ✅ Eric's USER.md stays intact (his info, not Paul's)
- ✅ No merge conflicts (neurograph is sovereign)

## Notes

- **Neurograph sovereignty:** Each Jarvis has its own mind — never merge neurographs
- **USER.md sovereignty:** Each instance serves a different human — keep local
- **Learnings merge:** Technical architecture is safe to merge (universal insights)
- **Backup first:** Scripts auto-backup neurograph before merge
- **Idempotent:** Safe to run multiple times
- **Portable:** Works for Eric, David, Bruce, any fork

## Example: Eric's First Sync

```bash
# Eric's machine
cd ~/JARVIS

# 1. Prepare (one-time setup)
node skills/instance-sync/scripts/prepare-merge.js eric paul

# 2. Merge
git merge origin/paul

# 3. Resolve (if conflicts)
node skills/instance-sync/scripts/resolve-conflicts.js

# 4. Verify
node skills/instance-sync/scripts/verify-sync.js

# 5. Restart OpenClaw
openclaw gateway restart
```

---

**Created:** March 27, 2026 — Memory sovereignty + safe distribution workflow
