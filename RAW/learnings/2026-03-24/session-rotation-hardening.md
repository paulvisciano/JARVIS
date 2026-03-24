# Session Rotation Hardening

**Problem:** Sessions can grow unbounded (10 MB+), leading to stale lock files, timeouts, and complete radio silence.

**Solution:** Aggressive rotation with size-based + time-based triggers.

## Current Pattern (OpenClaw)

OpenClaw has session rotator as a LaunchAgent:
- Runs periodically
- Moves inactive sessions to archive
- Keeps active sessions in place

**What's missing:**
- No size-based rotation (10 MB sessions allowed)
- No lock file age cleanup
- No early warnings

## Hardening Pattern

### 1. Size-Based Rotation
```javascript
// Rotate when session exceeds 5 MB
const MAX_SESSION_SIZE_MB = 5;
const MAX_SESSION_SIZE_BYTES = MAX_SESSION_SIZE_MB * 1024 * 1024;

function checkSessionSize(sessionFile) {
  const stats = fs.statSync(sessionFile);
  if (stats.size > MAX_SESSION_SIZE_BYTES) {
    console.warn(`⚠️ Session ${sessionFile} exceeds ${MAX_SESSION_SIZE_MB} MB (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    rotateSession(sessionFile);
  }
}
```

### 2. Time-Based Rotation
```javascript
// Rotate sessions inactive for > 2 hours
const INACTIVE_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2 hours

function checkSessionAge(sessionFile) {
  const stats = fs.statSync(sessionFile);
  const ageMs = Date.now() - stats.mtimeMs;
  if (ageMs > INACTIVE_THRESHOLD_MS) {
    console.warn(`⚠️ Session ${sessionFile} inactive for ${Math.round(ageMs / 60000)} mins`);
    rotateSession(sessionFile);
  }
}
```

### 3. Lock File Cleanup
```javascript
// Clean stale lock files (> 10 mins old)
const LOCK_AGE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

function cleanupStaleLocks(sessionsDir) {
  const files = fs.readdirSync(sessionsDir);
  const lockFiles = files.filter(f => f.endsWith('.lock'));
  
  for (const lockFile of lockFiles) {
    const stats = fs.statSync(path.join(sessionsDir, lockFile));
    const ageMs = Date.now() - stats.mtimeMs;
    
    if (ageMs > LOCK_AGE_THRESHOLD_MS) {
      console.warn(`🔓 Removing stale lock: ${lockFile} (${Math.round(ageMs / 60000)} mins old)`);
      fs.unlinkSync(path.join(sessionsDir, lockFile));
    }
  }
}
```

### 4. Hourly Checks
```bash
# LaunchAgent: Run every hour
<key>StartInterval</key>
<integer>3600</integer>
```

## Implementation

**Create as skill:** `session-rotator`
- Location: `~/JARVIS/skills/session-rotator/`
- Scripts: `rotate.js`, `cleanup-locks.js`, `check-health.js`
- Schedule: Hourly via LaunchAgent or cron

**Config pattern:**
```json
{
  "sessionRotation": {
    "maxSizeMB": 5,
    "inactiveThresholdHours": 2,
    "lockAgeThresholdMinutes": 10,
    "checkIntervalHours": 1
  }
}
```

## Why This Matters

**Prevents:**
- 10 MB bloat → timeout cascade
- Stale locks blocking all access
- Silent failures (no warnings)

**Enables:**
- Early warnings (size, age, lock)
- Graceful rotation (before failure)
- Fast recovery (clean sessions)

**Share upstream:** This should be part of OpenClaw core or a recommended skill for production deployments.
