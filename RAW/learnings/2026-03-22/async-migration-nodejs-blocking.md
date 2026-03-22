# Async Migration: Fixed Node.js Event Loop Blocking

**Date:** 2026-03-22
**Type:** insight
**Status:** extracted

**Problem:** `execSync` calls were blocking the Node.js event loop, causing:
- NeuroGraph UI to freeze while processing
- 10+ minute gateway timeouts
- Unresponsive browser during agent operations

**Root Cause:**
```javascript
// BLOCKING (line 555, 860)
const agentOutput = execSync(`openclaw agent --message "..."`, { encoding: 'utf8' });
```

**Solution:**
```javascript
// ASYNC (non-blocking)
exec(`openclaw agent --message "..."`, (error, stdout, stderr) => {
  // Handle response asynchronously
});
```

**Result:** NeuroGraph loads instantly, UI remains responsive during processing.