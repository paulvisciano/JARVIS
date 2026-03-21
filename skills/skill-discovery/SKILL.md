---
name: skill-discovery
description: Sync Jarvis skills to OpenClaw workspace. Auto-discover all skills in ~/JARVIS/skills/, ensure symlinks exist in ~/.openclaw/workspace/skills/, remove broken links, verify OpenClaw has access to all Jarvis skills. Use when: (1) new skills created in Jarvis, (2) workspace symlinks corrupt or missing, (3) OpenClaw needs skill access refresh, (4) skills folder out of sync.
metadata: { "openclaw": { "emoji": "🔗", "requires": { "bins": ["ln", "find"] } } }
---

# Skill Discovery (Jarvis Skills → OpenClaw Workspace Sync)

## When to Use

✅ **USE this skill when:**
- New skills created in `~/JARVIS/skills/`
- Workspace symlinks corrupt or missing (e.g., `processing-inbox` → `process-inbox` issue)
- OpenClaw needs skill access refresh
- `~/.openclaw/workspace/skills/` out of sync with Jarvis skills
- After skill creation or updates

## When NOT to Use

❌ **DON'T use this skill when:**
- Skills already synced (idempotent — safe but unnecessary)
- OpenClaw system skills (`/usr/local/lib/node_modules/openclaw/skills/`) — those are separate
- No changes to Jarvis skills folder

## Workflow

### Step 1: Scan Jarvis Skills

```bash
ls ~/JARVIS/skills/
# Lists all skill folders
```

### Step 2: Compare with Workspace

```bash
ls -la ~/.openclaw/workspace/skills/
# Shows symlinks (or missing)
```

### Step 3: Sync Symlinks

```bash
cd ~/.openclaw/workspace/skills/

# Remove all existing symlinks
rm -f *

# Recreate symlinks for all Jarvis skills
for skill in ~/JARVIS/skills/*/; do
  ln -s ~/JARVIS/skills/$(basename $skill) .
done

# Verify
ls -la
```

### Step 4: Remove Broken Symlinks

```bash
# Find and remove broken symlinks
find ~/.openclaw/workspace/skills/ -xtype l -delete
```

### Step 5: Report

```
✅ Skill Discovery Complete
   Jarvis skills: N folders
   Workspace symlinks: M created
   Broken removed: K
   Status: synced
```

## Commands

### Full Sync (One-Liner)
```bash
cd ~/.openclaw/workspace/skills/ && rm -f * && for skill in ~/JARVIS/skills/*/; do ln -s ~/JARVIS/skills/$(basename $skill) .; done && echo "✅ Synced $(ls | wc -l) skills"
```

### Verify Sync
```bash
# Compare counts
echo "Jarvis: $(ls ~/JARVIS/skills/ | wc -l)"
echo "Workspace: $(ls -la ~/.openclaw/workspace/skills/ | grep -v total | wc -l)"
```

### Check Broken Links
```bash
find ~/.openclaw/workspace/skills/ -xtype l
# Lists broken symlinks (if any)
```

## Error Handling

**If symlink fails:**
- Check source exists: `test -d ~/JARVIS/skills/skill-name`
- Check permissions: `ls -ld ~/JARVIS/skills/`
- Check workspace writable: `test -w ~/.openclaw/workspace/skills/`

**If count mismatch:**
- Re-run sync
- Check for hidden files: `ls -A`
- Verify symlinks point to correct targets: `readlink`

## Notes

- **Idempotent:** Safe to run multiple times
- **Destructive:** Removes all workspace symlinks before recreating
- **Portable:** Uses `~` for home directory
- **Fast:** ~15 skills = instant sync
- **Auto-discovers:** No manual skill list needed

## Example Output

```
✅ Skill Discovery Complete
   Jarvis skills: 15 folders
   Workspace symlinks: 15 created
   Broken removed: 0
   Status: synced

Skills synced:
  - archive-collector
  - bootstrap-context
  - bootstrap-jarvis
  - breathe
  - context-extractor
  - cursor-plan
  - learning-creator
  - neuro-graph-loader
  - neuro-graph-search
  - neuro-graph-sync
  - neuro-graph-traverse
  - ocr
  - process-inbox
  - skill-creator
  - scifi-app-discovery
```

---

**Created:** March 21, 2026  
**Location:** `~/JARVIS/skills/skill-discovery/`  
**Auto-symlink:** Runs itself after creation  
**Idempotent:** Safe to run anytime
