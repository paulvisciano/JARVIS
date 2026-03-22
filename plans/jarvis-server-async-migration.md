# JARVIS Server Async Migration Plan

**Created:** 2026-03-22 23:00 GMT+7  
**Priority:** Critical (blocks NeuroGraph UI during agent processing)  
**Root Cause:** `execSync` blocks Node.js single-threaded event loop  

---

## Problem

**Blocking operations in `jarvis-server.js`:**

1. **Line 555** — `/api/process-inbox` endpoint:
   ```javascript
   const agentOutput = execSync(`openclaw agent --agent main --message "..."`, { encoding: 'utf8' });
   ```

2. **Line 860** — `handleTranscript()` function:
   ```javascript
   const agentOutput = execSync(`openclaw agent --agent main --message "..."`, { encoding: 'utf8' });
   ```

3. **Multiple `fs.readFileSync`** — File I/O blocks event loop (lines 548, 678, 826, 963)

**Impact:**
- While agent runs (10-30 seconds), **all HTTP requests block**
- NeuroGraph UI → ERR_TIMED_OUT
- Static files → Not served
- Health checks → Timeout

---

## Solution: Convert to Async

### 1. Replace `execSync` → `exec` (Callback-based)

**File:** `~/SCI-FI/apps/JARVIS/jarvis-server.js`

**Line 555 (`/api/process-inbox` endpoint):**
```javascript
// BEFORE (blocking):
const agentOutput = execSync(`openclaw agent --agent main --message "${userMessage.replace(/"/g, '\\"')}" 2>&1`, { encoding: 'utf8' });

// AFTER (async):
exec(`openclaw agent --agent main --message "${userMessage.replace(/"/g, '\\"')}" 2>&1`, { encoding: 'utf8' },
    (agentErr, agentOutput) => {
        if (agentErr) {
            console.error(`[${new Date().toISOString()}] ❌ Agent failed:`, agentErr.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: agentErr.message }));
            return;
        }
        // Process output...
    }
);
```

**Line 860 (`handleTranscript()` function):**
```javascript
// BEFORE (blocking):
const agentOutput = execSync(`openclaw agent --agent main --message "${userMessage.replace(/"/g, '\\"')}" 2>&1`, { encoding: 'utf8' });

// AFTER (async):
exec(`openclaw agent --agent main --message "${userMessage.replace(/"/g, '\\"')}" 2>&1`, { encoding: 'utf8' },
    (agentErr, agentOutput) => {
        if (agentErr) {
            console.error(`[${new Date().toISOString()}] ❌ Agent failed:`, agentErr.message);
            return;
        }
        const responseText = agentOutput.split('\n')
            .filter(line => !line.includes('[') && !line.includes('✅') && !line.includes('❌') && line.trim().length > 10)
            .join('\n').trim();
        if (responsePath && responseText) {
            fs.writeFileSync(responsePath, responseText);
        }
        // Continue with response...
    }
);
```

---

### 2. Replace `fs.readFileSync` → `fs.readFile` (Optional optimization)

**Lines affected:** 548, 678, 826, 963

**Example:**
```javascript
// BEFORE (blocking):
const transcript = fs.readFileSync(transcriptPath, 'utf8').trim();

// AFTER (async):
fs.readFile(transcriptPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Read error:', err);
        return;
    }
    const transcript = data.trim();
    // Continue...
});
```

**Note:** `fs.writeFileSync` for saving responses can stay sync (fast, small writes).

---

### 3. Add Timing Logs (Observability)

```javascript
// Around agent execution:
const agentStart = Date.now();
console.log(`[${new Date().toISOString()}] ⏱️ Agent START`);

exec(`openclaw agent ...`, (err, output) => {
    const agentDuration = Date.now() - agentStart;
    console.log(`[${new Date().toISOString()}] ⏱️ Agent COMPLETE (${agentDuration}ms)`);
    // ...
});
```

---

## Implementation Steps

1. **Backup current file:**
   ```bash
   cp ~/SCI-FI/apps/JARVIS/jarvis-server.js ~/SCI-FI/apps/JARVIS/jarvis-server.js.bak-$(date +%Y%m%d-%H%M)
   ```

2. **Edit line 555** (`/api/process-inbox`):
   - Convert `execSync` → `exec` with callback
   - Move response handling inside callback
   - Add error handling

3. **Edit line 860** (`handleTranscript`):
   - Convert `execSync` → `exec` with callback
   - Ensure response file write happens inside callback
   - Add timing logs

4. **Optional: Convert `fs.readFileSync` → `fs.readFile`**:
   - Lines 548, 678, 826, 963
   - Lower priority (file I/O is faster than agent exec)

5. **Test:**
   - Restart JARVIS server
   - Record voice → Verify agent runs async
   - Open NeuroGraph during agent processing → Should NOT block

6. **Monitor logs:**
   ```bash
   tail -f ~/JARVIS/logs/server.log | grep "⏱️"
   ```

---

## Expected Outcome

**Before:**
- Agent runs 10-30 seconds → NeuroGraph UI blocked → ERR_TIMED_OUT

**After:**
- Agent runs 10-30 seconds → NeuroGraph UI responsive → No timeout

---

## Files to Edit

| File | Lines | Change |
|------|-------|--------|
| `~/SCI-FI/apps/JARVIS/jarvis-server.js` | 555 | `execSync` → `exec` |
| `~/SCI-FI/apps/JARVIS/jarvis-server.js` | 860 | `execSync` → `exec` |
| `~/SCI-FI/apps/JARVIS/jarvis-server.js` | 548, 678, 826, 963 | `readFileSync` → `readFile` (optional) |

---

## Testing Checklist

- [ ] Server restarts without errors
- [ ] Voice recording → transcription works
- [ ] Agent processes message → response saved
- [ ] NeuroGraph opens during agent processing (no timeout)
- [ ] `/health` endpoint responds during agent run
- [ ] Logs show timing (⏱️ START/COMPLETE)

---

**Status:** Plan created, ready for implementation.
