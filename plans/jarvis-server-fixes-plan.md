# Jarvis Server Fixes — Execution Plan

**Created:** March 26, 2026  
**Target:** Coder (jarvis-coder)  
**Workspace:** `/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/`

---

## Objective

Fix critical security vulnerabilities and code quality issues in the Jarvis server, test in Coder's workspace, then merge to skills repo.

---

## Phase 1: Critical Security Fixes (DO FIRST)

### 1.1 Command Injection + Agent Timeout
**File:** `jarvis-server.js` (~line 724)

**Current (vulnerable):**
```javascript
exec(`openclaw agent --agent jarvis --message "${userMessage}"`, (error, stdout, stderr) => {
  // no timeout, shell interpolation vulnerable
});
```

**Fix:**
```javascript
const { execFile } = require('child_process');
execFile('openclaw', ['agent', '--agent', 'jarvis', '--message', userMessage], {
  timeout: 120000,  // 2 minutes max
  maxBuffer: 10 * 1024 * 1024  // 10MB output buffer
}, (error, stdout, stderr) => {
  // handle result
});
```

**Why:** `execFile` doesn't use shell, so no command injection. Timeout prevents hung transcriptions.

---

### 1.2 Rate Limiting on /upload
**File:** `jarvis-server.js` (add near server creation, before request handler)

**Implementation:**
```javascript
const uploadRateLimits = new Map(); // IP → { count, resetTime }

function checkRateLimit(ip) {
  const now = Date.now();
  const window = 60000; // 1 minute
  const maxRequests = 10;
  
  let record = uploadRateLimits.get(ip);
  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + window };
    uploadRateLimits.set(ip, record);
  }
  
  record.count++;
  return record.count <= maxRequests;
}

// In /upload handler, before processing:
const clientIP = req.socket.remoteAddress;
if (!checkRateLimit(clientIP)) {
  return res.status(429).json({ error: 'Too many upload requests. Try again in 1 minute.' });
}
```

---

### 1.3 File Upload Size Limit
**File:** `jarvis-server.js` (in /upload handler)

**Implementation:**
```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// In upload handler, accumulate chunks with size check:
let totalSize = 0;
req.on('data', chunk => {
  totalSize += chunk.length;
  if (totalSize > MAX_FILE_SIZE) {
    req.destroy(); // Stop receiving
    return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
  }
  chunks.push(chunk);
});
```

---

## Phase 2: Code Quality Fixes

### 2.1 ESLint Auto-Fix
**Command:** `npx eslint *.js --fix`

**Expected fixes:**
- Indentation: 4-space → 2-space (~150 issues)
- Missing curly braces on single-line if blocks (~20 issues)
- Double quotes → single quotes

**Files:** `jarvis-server.js`, `app.js`, `device-registry.js`

---

### 2.2 Consolidate Transcript State
**File:** `app.js` (polling logic ~lines 370-500)

**Problem:** Currently checks BOTH `pendingResponses` Map AND filesystem, causing race conditions.

**Fix:** Use Map as single source of truth during active transcription, then move to filesystem on completion.

**Implementation:**
```javascript
// When transcription starts:
activeTranscriptions.set(filepath, { status: 'transcribing', started: Date.now() });

// When polling /transcript/:filepath:
if (activeTranscriptions.has(filepath)) {
  return res.json(activeTranscriptions.get(filepath));
}
// Only check filesystem if not in activeTranscriptions Map

// When done:
activeTranscriptions.delete(filepath);
// File already archived by processRecording()
```

---

### 2.3 Whisper.cpp Health Check
**File:** `jarvis-server.js` (startup, near `findWhisperCli()`)

**Add after finding CLI path:**
```javascript
function validateWhisperCli(cliPath) {
  try {
    fs.accessSync(cliPath, fs.constants.X_OK);
    console.log(`✅ Whisper CLI validated: ${cliPath}`);
    return true;
  } catch (err) {
    console.error(`❌ Whisper CLI not executable: ${cliPath}`);
    process.exit(1); // Fail fast on startup
  }
}

const WHISPER_CLI = findWhisperCli();
validateWhisperCli(WHISPER_CLI);
```

---

## Phase 3: Testing (in Coder's workspace)

### 3.1 Start Server
```bash
cd /Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
node jarvis-server.js
```

**Verify:**
- Server starts without errors
- Whisper CLI validation passes
- HTTPS/HTTP listeners active

### 3.2 Test Voice Upload
1. Open `http://localhost:8765` (or configured port)
2. Record/upload voice message
3. Verify transcription completes
4. Verify agent response received

### 3.3 Test Rate Limiting
1. Upload 10+ files rapidly
2. Verify 11th request returns 429

### 3.4 Test File Size Limit
1. Upload file > 50MB
2. Verify 413 response

### 3.5 Test Agent Timeout
1. Simulate hung agent (or wait for natural timeout case)
2. Verify transcription fails after 120s, doesn't hang forever

---

## Phase 4: Merge to Skills Repo

**After all tests pass:**

1. Copy fixed files from workspace to skills repo:
   ```bash
   cp -r ~/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/*.js \
       ~/JARVIS/skills/jarvis-ui/sci-fi/apps/JARVIS/
   ```

2. Commit with clear message:
   ```
   security: fix command injection, add rate limiting + file size limits
   
   - exec() → execFile() to prevent command injection
   - Add 120s timeout to agent execution
   - Rate limit /upload to 10 req/min per IP
   - Max 50MB file upload size
   - ESLint auto-fix (indentation, braces, quotes)
   - Consolidate transcript state (single source of truth)
   - Add whisper.cpp health check on startup
   ```

3. Push to skills repo

---

## Success Criteria

- [ ] All 3 critical security fixes implemented
- [ ] ESLint passes with 0 errors
- [ ] Server starts and transcribes voice successfully
- [ ] Rate limiting works (429 after 10 uploads/min)
- [ ] File size limit works (413 on >50MB)
- [ ] Files merged to skills repo with clear commit message

---

## Notes for Coder

- Work ONLY in your workspace first: `~/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/`
- DO NOT edit skills repo until testing passes
- Report back with:
  - What you changed (file + line numbers)
  - Test results (screenshots if UI changes)
  - Any blockers or questions

---

**End of Plan**
