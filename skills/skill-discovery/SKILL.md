---
name: skill-discovery
description: Verify Jarvis skills are discoverable by OpenClaw (no symlinks needed — direct discovery)
metadata:
  openclaw:
    emoji: "🔗"
    requires:
      bins: ["ls", "openclaw"]
---

# Skill Discovery (Jarvis Skills → OpenClaw Direct Discovery)

## When to Use

✅ **USE this skill when:**
- New skills created in `~/JARVIS/skills/`
- Verifying OpenClaw can discover skills without symlinks
- After skill creation or updates
- Debugging skill availability issues

## When NOT to Use

❌ **DON'T use this skill when:**
- No changes to Jarvis skills folder
- Only checking OpenClaw system skills (`/usr/local/lib/node_modules/openclaw/skills/`) — those are separate

## Workflow

### Step 1: Scan Jarvis Skills

```bash
ls ~/JARVIS/skills/
# Lists all skill folders
```

### Step 2: Verify OpenClaw Discovery

```bash
openclaw skills list
# Shows all discovered skills with status
```

### Step 3: Compare Counts

```bash
# Count Jarvis skill folders
JARVIS_COUNT=$(ls -d ~/JARVIS/skills/*/ 2>/dev/null | wc -l)

# Count ready skills from openclaw (filter for openclaw-extra source)
OPENCLAW_COUNT=$(openclaw skills list 2>&1 | grep "openclaw-extra" | wc -l)

echo "Jarvis skills: $JARVIS_COUNT"
echo "Discovered by OpenClaw: $OPENCLAW_COUNT"
```

### Step 4: Report

```
✅ Skill Discovery Complete
   Jarvis skills: N folders
   OpenClaw discovered: M ready
   Status: verified (no symlinks needed)
```

## Commands

### Verify Discovery (One-Liner)
```bash
echo "Jarvis: $(ls -d ~/JARVIS/skills/*/ 2>/dev/null | wc -l)" && openclaw skills list 2>&1 | grep -c "✓ ready.*openclaw-extra" && echo "✅ Skills discoverable without symlinks"
```

### List Jarvis Skills
```bash
ls ~/JARVIS/skills/
```

### Check OpenClaw Discovery
```bash
openclaw skills list 2>&1 | grep "openclaw-extra"
```

## Error Handling

**If skill not discovered:**
- Check skill folder exists: `test -d ~/JARVIS/skills/skill-name`
- Check SKILL.md present: `test -f ~/JARVIS/skills/skill-name/SKILL.md`
- Check permissions: `ls -ld ~/JARVIS/skills/`
- Restart gateway: `openclaw gateway restart`

**If count mismatch:**
- Re-run `openclaw skills list`
- Check for hidden files: `ls -A ~/JARVIS/skills/`
- Verify SKILL.md valid in each folder

## Notes

- **No symlinks needed:** OpenClaw auto-discovers skills from `~/JARVIS/skills/` directly
- **Workspace clean:** `~/.openclaw/workspace/skills/` can be empty
- **Single source of truth:** Skills live in `~/JARVIS/skills/` only
- **Auto-discovers:** No manual skill list or linking needed
- **Fast verification:** Instant check with `openclaw skills list`

## Example Output

```
✅ Skill Discovery Complete
   Jarvis skills: 26 folders
   OpenClaw discovered: 26 ready (openclaw-extra)
   Status: verified (no symlinks needed)

Skills verified:
  - archive-collector
  - bootstrap-context
  - bootstrap-jarvis
  - breathe
  - coder-config
  - context-extractor
  - cursor-plan
  - git-time-travel
  - instance-sync
  - jarvis-nav
  - jarvis-ui
  - learning-creator
  - neurograph-link
  - neurograph-search
  - neurograph-separate
  - neurograph-sync
  - ocr
  - process-inbox
  - reflect
  - scifi-app-discovery
  - session-rotator
  - skill-creator
  - web-learn
```

---

**Created:** March 21, 2026  
**Updated:** April 3, 2026 — Removed symlink logic (direct discovery verified)  
**Location:** `~/JARVIS/skills/skill-discovery/`  
**Idempotent:** Safe to run anytime
