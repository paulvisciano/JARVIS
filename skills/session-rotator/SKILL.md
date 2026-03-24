# Session Rotator Skill

**Purpose:** Aggressive session rotation with size-based + time-based triggers to prevent bloat-induced failures.

**Triggers:**
- Size: Rotate at 5 MB
- Time: Rotate after 2 hours inactive
- Lock cleanup: Remove locks > 10 mins old
- Schedule: Hourly checks

## Usage

```bash
# Manual run
node ~/JARVIS/skills/session-rotator/scripts/rotate.js

# Check health (dry-run)
node ~/JARVIS/skills/session-rotator/scripts/check-health.js

# Cleanup stale locks
node ~/JARVIS/skills/session-rotator/scripts/cleanup-locks.js
```

## Config

```json
{
  "sessionRotation": {
    "maxSizeMB": 5,
    "inactiveThresholdHours": 2,
    "lockAgeThresholdMinutes": 10,
    "checkIntervalHours": 1,
    "sessionsDir": "~/.openclaw/agents"
  }
}
```

## Output

```
🔄 Session Rotator — 2026-03-24 17:15
   Checking sessions in ~/.openclaw/agents/
   
   Size checks:
   ✓ jarvis/main: 969 KB (ok)
   ⚠️ jarvis/old: 5.2 MB → rotating...
   
   Age checks:
   ✓ coder/main: active 5 mins ago
   ⚠️ main/heartbeat: inactive 3 hours → rotating...
   
   Lock cleanup:
   ✓ No stale locks found
   
   Summary:
   - Checked: 7 sessions
   - Rotated: 2 (size + age)
   - Locks cleaned: 0
   - Active kept: 5
✅ Rotation complete
```

## Why This Matters

**Prevents:**
- 10 MB bloat → timeout cascade
- Stale locks blocking all access
- Silent failures (no warnings)

**Production pattern:** Run hourly via cron or LaunchAgent.
