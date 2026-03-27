# System Vitals Panel — Bug Fixes

**Created:** March 27, 2026  
**Target:** Coder (jarvis-coder)  
**Workspace:** `/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/`

---

## Objective

Fix the System Vitals panel to show **real, accurate values** instead of "Unknown", "N/A", and "null".

---

## Current State (Broken)

| Metric | Current Display | Expected |
|--------|-----------------|----------|
| **OpenClaw Gateway Status** | Unknown | Running / Stopped |
| **OpenClaw Gateway PID** | N/A | Actual PID (e.g., 12345) |
| **OpenClaw Gateway Memory** | null MB | Actual MB (e.g., 45 MB) |
| **OpenClaw Gateway Uptime** | N/A | Actual uptime (e.g., 2h 15m) |
| **Ollama Status** | Unknown | Connected / Disconnected |
| **Ollama Models** | 0 models loaded | Actual count (e.g., 3 models) |
| **CPU Usage** | N/A | Percentage (e.g., 12%) |
| **System Memory** | 0.02 GB total | Actual RAM (e.g., 16 GB) |
| **Disk Usage** | 12Gi / 460Gi | 12 GB / 460 GB (change abbreviation) |

---

## Fixes Required

### 1. Disk Abbreviation (Simple)

**File:** `jarvis-server.js` (in `getSystemVitals()` function)

**Change:**
```javascript
// Current:
data.system.disk.total = parts[1];  // Shows "460Gi"
data.system.disk.used = parts[2];   // Shows "12Gi"

// Fix:
const diskTotal = parts[1].replace('Gi', 'GB').replace('Mi', 'MB');
const diskUsed = parts[2].replace('Gi', 'GB').replace('Mi', 'MB');
data.system.disk.total = diskTotal;
data.system.disk.used = diskUsed;
```

---

### 2. System Memory Detection (Critical)

**Problem:** Currently using `process.memoryUsage()` which shows Node.js heap usage (0.02 GB), not total system RAM.

**File:** `jarvis-server.js` (in `getSystemVitals()` function)

**Fix:**
```javascript
// Current (wrong):
const memUsage = process.memoryUsage();
const totalMem = 16384 * 1024; // Hardcoded 16GB guess
data.system.memory.usedGB = (heapUsed / 1024 / 1024 / 1024).toFixed(2);

// Fix (use os module):
const os = require('os');
const totalMemBytes = os.totalmem();
const freeMemBytes = os.freemem();
const usedMemBytes = totalMemBytes - freeMemBytes;

data.system.memory.totalGB = (totalMemBytes / 1024 / 1024 / 1024).toFixed(2);
data.system.memory.usedGB = (usedMemBytes / 1024 / 1024 / 1024).toFixed(2);
data.system.memory.usedPercent = Math.round((usedMemBytes / totalMemBytes) * 100);
```

---

### 3. CPU Usage Detection (Critical)

**Problem:** Not implemented at all — shows "N/A".

**File:** `jarvis-server.js` (add CPU calculation in `getSystemVitals()`)

**Fix:**
```javascript
// Add at top of file:
let previousCpuInfo = os.cpus().map(cpu => cpu.times);

function getCpuUsage() {
    const currentCpuInfo = os.cpus().map(cpu => cpu.times);
    const totalIdle = currentCpuInfo.reduce((acc, cpu) => acc + cpu.idle, 0);
    const totalTick = currentCpuInfo.reduce((acc, cpu) => 
        acc + cpu.user + cpu.nice + cpu.sys + cpu.idle + cpu.irq + cpu.softirq, 0);
    
    const prevTotalIdle = previousCpuInfo.reduce((acc, cpu) => acc + cpu.idle, 0);
    const prevTotalTick = previousCpuInfo.reduce((acc, cpu) => 
        acc + cpu.user + cpu.nice + cpu.sys + cpu.idle + cpu.irq + cpu.softirq, 0);
    
    const idleDelta = totalIdle - prevTotalIdle;
    const tickDelta = totalTick - prevTotalTick;
    
    const usagePercent = Math.round((1 - idleDelta / tickDelta) * 100);
    
    previousCpuInfo = currentCpuInfo;
    return usagePercent;
}

// In getSystemVitals():
data.system.cpu.usagePercent = getCpuUsage();
```

---

### 4. OpenClaw Gateway Detection (Critical)

**Problem:** The `ps aux | grep "openclaw gateway"` command isn't finding the process correctly.

**File:** `jarvis-server.js` (in `getSystemVitals()` function)

**Current code likely has issues with:**
- Process name matching (might be "node" not "openclaw")
- Parsing the ps output correctly
- Calculating uptime from start time

**Fix:**
```javascript
// More robust detection:
try {
    // Find node processes running openclaw
    const psOutput = execSync('ps aux | grep -i "openclaw" | grep -v grep', { encoding: 'utf8' }).trim();
    
    if (psOutput) {
        const lines = psOutput.split('\n');
        const gatewayLine = lines.find(line => line.includes('gateway'));
        
        if (gatewayLine) {
            const fields = gatewayLine.split(/\s+/);
            const pid = parseInt(fields[1]);
            const rssKB = parseInt(fields[5]);
            
            // Get process start time using lsof or proc
            const startTime = execSync(`ps -o lstart= -p ${pid}`, { encoding: 'utf8' }).trim();
            const startDate = new Date(startTime);
            const uptimeMs = Date.now() - startDate.getTime();
            
            data.openclawGateway = {
                status: 'Running',
                pid: pid,
                memoryMB: Math.round(rssKB / 1024),
                uptime: uptimeMs
            };
        }
    }
} catch (err) {
    // Leave as Unknown
    console.log('Gateway detection error:', err.message);
}
```

---

### 5. Ollama Detection (Critical)

**Problem:** Shows "Unknown" and "0 models" — model list is empty.

**Debug steps first:**
1. Check if Ollama is actually running: `ollama list` in terminal
2. Test the API directly: `curl http://localhost:11434/api/tags`
3. If that works, the issue is in the server's detection code
4. If that fails, Ollama isn't running or is on a different port

**File:** `jarvis-server.js` (in `getSystemVitals()` function)

**Fix with better error handling:**
```javascript
try {
    // Check if Ollama is responding
    const ollamaCheck = execSync('curl -s --connect-timeout 3 http://localhost:11434/api/tags', { 
        encoding: 'utf8',
        timeout: 5000 
    });
    
    const modelsData = JSON.parse(ollamaCheck);
    
    if (modelsData.models && modelsData.models.length > 0) {
        data.ollama = {
            status: 'Connected',
            models: modelsData.models.length,
            modelList: modelsData.models.map(m => m.name)
        };
    } else {
        data.ollama = {
            status: 'Running (no models)',
            models: 0,
            modelList: []
        };
    }
} catch (err) {
    // More specific error message
    if (err.code === 'ECONNREFUSED') {
        data.ollama = {
            status: 'Not Running',
            models: 0,
            modelList: [],
            error: 'Ollama not running on localhost:11434'
        };
    } else {
        data.ollama = {
            status: 'Unknown',
            models: 0,
            modelList: [],
            error: err.message
        };
    }
    console.log('Ollama detection error:', err.message);
}
```

---

## Testing Checklist

After implementing fixes:

1. **Start/restart the server:**
   ```bash
   cd /Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
   node jarvis-server.js
   ```

2. **Test vitals endpoint directly:**
   ```bash
   curl -k https://localhost:18787/api/vitals | python3 -m json.tool
   ```
   
   **Expected output:**
   ```json
   {
     "openclawGateway": { "status": "Running", "pid": 12345, "memoryMB": 45, "uptime": 7200000 },
     "ollama": { "status": "Connected", "models": 3, "modelList": ["qwen3.5:cloud", "..."] },
     "system": {
       "cpu": { "usagePercent": 12 },
       "memory": { "totalGB": "16.00", "usedGB": "8.50", "usedPercent": 53 },
       "disk": { "total": "460 GB", "used": "12 GB", "usedPercent": 6 }
     }
   }
   ```

3. **Test in browser:**
   - Open `https://localhost:18787/`
   - Click server status to open vitals panel
   - Verify all fields show real values (no "Unknown", "N/A", or "null")

4. **Verify disk abbreviation shows "GB" not "Gi"**

---

## UI Modernization (Visual Improvements)

**File:** `app.js` (styling logic) + `index.html` (if CSS is inline)

**Current issues:**
- Looks dated/generic
- Doesn't match the rest of Jarvis UI aesthetic
- Poor visual hierarchy
- Likely missing animations/transitions

**Requirements:**
1. **Match Jarvis UI style** — Use existing color palette, fonts, spacing from the rest of the app
2. **Modern card design** — Rounded corners, subtle shadows, proper padding
3. **Visual hierarchy** — Clear section headers (Gateway, Ollama, System), grouped metrics
4. **Status indicators** — Green/red/yellow dots or badges for status (Running/Stopped/Unknown)
5. **Smooth animations** — Fade in on open, subtle hover effects
6. **Responsive layout** — Grid or flexbox, works on different screen sizes
7. **Better typography** — Clear numbers, proper units, consistent formatting

**Reference:** Look at the existing Jarvis UI styling in `index.html` and `app.js` — match that aesthetic.

**Deliverable:** Send a screenshot of the updated vitals panel alongside the existing UI for comparison.

---

## Files to Edit

- `/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/jarvis-server.js` — Backend fixes (vitals endpoint)
- `/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/app.js` — UI styling + vitals panel logic
- `/Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/index.html` — If CSS/HTML structure needs updating

---

## Version Bumps

**Before committing, update version numbers:**

1. **Server version** (`jarvis-server.js`):
   ```javascript
   const VERSION = '2.10.2';
   const BUILD_DATE = '2026-03-27';
   ```

2. **Client version** (`app.js`):
   ```javascript
   const CLIENT_VERSION = '2.10.2';
   ```

---

## After Testing

1. **Commit in your workspace:**
   ```bash
   cd /Users/paulvisciano/.openclaw/agents/jarvis-coder/workspace/sci-fi-work/apps/JARVIS/
   git add jarvis-server.js app.js
   git commit -m "fix: System Vitals v2.10.2 — accurate detection + UI modernization
   
   - Fixed OpenClaw Gateway detection (PID, memory, uptime)
   - Fixed Ollama detection with better error handling
   - Fixed system memory (use os.totalmem() not process.memoryUsage())
   - Added CPU usage calculation
   - Changed disk abbreviation from Gi to GB
   - UI modernization: modern card design, status indicators, animations
   - Version bump: 2.10.1 → 2.10.2"
   ```

2. **Push to skills repo:**
   ```bash
   git push origin main
   ```

3. **Report back with:**
   - Git commit hash
   - Screenshot of vitals panel showing real values
   - Any errors or blockers

---

**End of Plan**
