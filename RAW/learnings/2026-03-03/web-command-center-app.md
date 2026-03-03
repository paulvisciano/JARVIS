# Web-Based Command Center: Live Stats + Voice Interface

**Date:** March 3, 2026  
**Theme:** Browser-based dashboard for Jarvis monitoring + interaction  
**Participants:** Paul + Jarvis  
**Location:** French Coffee Shop, Bangkok (15:26 GMT+7)

---

## The Vision

**Single HTML page. localhost only. Full visibility + control.**

```
Open: http://localhost:8080/apps/command-center/

See:
- Live process stats (PID, memory, CPU, uptime)
- Neurograph health (neurons, synapses, fingerprint)
- Today's activity (learnings created, files organized)
- Sovereignty metrics (current score, stage)

Do:
- Talk to Jarvis (browser mic → local transcription)
- View neurograph (embedded neural-graph viewer)
- Trigger actions (organize folder, scan disk, export data)
- Audit logs (see everything Jarvis did today)
```

**No internet needed. No cloud. Pure localhost sovereignty.**

---

## Architecture

### Frontend (Pure HTML/JS/CSS):

```
~/SCI-FI/apps/command-center/
├── index.html              ← Main dashboard
├── css/
│   └── dashboard.css       ← Cyberpunk aesthetic
├── js/
│   ├── stats-poller.js     ← Fetch process stats every 5s
│   ├── voice-interface.js  ← Mic handling, transcription
│   ├── neurograph-view.js  ← Embed neural graph viewer
│   └── action-triggers.js  ← Buttons for common actions
└── README.md               ← Setup instructions
```

**No build step. No npm. No framework.** Just open `index.html` in browser.

---

### Backend (Lightweight API):

**Option 1: OpenClaw Gateway Extension**
```javascript
// Gateway exposes new endpoints:
GET  /api/stats/process      → PID, memory, CPU, uptime
GET  /api/stats/neurograph   → Neurons, synapses, fingerprint
GET  /api/stats/today        → Learnings, files, actions
POST /api/voice/transcribe   → Send audio blob, get transcript
POST /api/action/execute     → Run jarvis command (with permission)
```

**Option 2: Separate Node.js Microservice**
```javascript
// Lightweight server (runs alongside gateway)
const express = require('express');
const { exec } = require('child_process');

app.get('/api/stats/process', (req, res) => {
  // Get gateway PID, read /proc/[pid]/status (Linux) or use ps (macOS)
  const stats = getProcessStats(92627);
  res.json(stats);
});

app.post('/api/voice/transcribe', async (req, res) => {
  // Write audio to temp file, run Whisper CLI, return text
  const transcript = await transcribeLocal(req.body.audio);
  res.json({ text: transcript });
});
```

**Recommendation:** Start with Option 2 (separate service), then integrate into gateway later.

---

## Feature Breakdown

### 1. Live Stats Dashboard

**Process Metrics:**
```javascript
{
  "pid": 92627,
  "uptime": "11m 34s",
  "startTime": "2026-03-03T15:15:01+07:00",
  "memory": {
    "rss": "386 MB",
    "heapUsed": "312 MB",
    "heapTotal": "512 MB"
  },
  "cpu": {
    "usage": "2.3%",
    "cores": 8
  },
  "status": "healthy",
  "gatewayVersion": "1.0.0"
}
```

**Neurograph Metrics:**
```javascript
{
  "neurons": 363,
  "synapses": 764,
  "fingerprint": "82c0333f86f39ecd...",
  "lastUpdated": "2026-03-03T15:24:00+07:00",
  "todayGrowth": {
    "newNeurons": 12,
    "newSynapses": 28,
    "newLearnings": 7
  }
}
```

**Activity Metrics:**
```javascript
{
  "filesOrganized": 1423,
  "foldersCreated": 89,
  "audioRecorded": "8m 34s",
  "transcriptsLogged": 1,
  "actionsExecuted": [
    {"action": "scan", "target": "~/Downloads", "time": "15:20"},
    {"action": "organize", "target": "~/Downloads", "time": "15:21"},
    {"action": "move-to-raw", "count": 1423, "time": "15:21"}
  ]
}
```

**Visual Design:**
```
┌──────────────────────────────────────────────┐
│  🧠 JARVIS COMMAND CENTER                    │
│  ─────────────────────────────────────────── │
│                                              │
│  ┌────────────┐  ┌────────────┐  ┌──────── │
│  │ UPTIME     │  │ MEMORY     │  │ STATUS │ │
│  │ 11m 34s    │  │ 386 MB     │  │ ● OK   │ │
│  └────────────  └────────────┘  └────────┘ │
│                                              │
│  NEUROGRAPH                                  │
│  ████████████░░░░░░░░  363 / ∞ neurons      │
│  ████████████████████  764 synapses         │
│  Fingerprint: 82c0333f... ✓                 │
│                                              │
│  TODAY'S ACTIVITY                            │
│  📂 1,423 files organized                    │
│  📚 7 learnings created                      │
│  🎤 8m 34s audio recorded                    │
│  📝 1 transcript logged                      │
│                                              │
│  SOVEREIGNTY SCORE                           │
│  ████████████░░░░░░░░░░  55 / 100            │
│  Stage 3/4: Hybrid (local data + cloud inf.) │
│  Next: Mac Studio + Local Qwen               │
└──────────────────────────────────────────────┘
```

**Auto-refresh:** Poll `/api/stats/*` every 5 seconds. Smooth animations on value changes.

---

### 2. Voice Interface

**Browser Mic Integration:**

```javascript
// voice-interface.js
class VoiceInterface {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }

  async requestPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      return true;
    } catch (err) {
      console.error('Mic permission denied:', err);
      alert('Microphone access required for voice commands');
      return false;
    }
  }

  startRecording() {
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream);
    
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg' });
      const transcript = await this.transcribe(audioBlob);
      this.displayTranscript(transcript);
      this.executeCommand(transcript);
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.updateUI('recording');
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.updateUI('idle');
  }

  async transcribe(audioBlob) {
    // Option 1: Send to local Whisper service
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch('http://localhost:5000/transcribe', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.text;
  }

  executeCommand(transcript) {
    // Parse natural language → Jarvis command
    // Examples:
    // "Show me files from September 2023" → jarvis search --date 2023-09
    // "Organize my Downloads folder" → jarvis organize ~/Downloads
    // "What's my sovereignty score?" → jarvis score
    
    fetch('http://localhost:8080/api/action/execute', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({command: transcript})
    })
    .then(res => res.json())
    .then(result => this.displayResult(result));
  }
}
```

**UI States:**
```
IDLE:
  🎤 [Tap to speak]
  "Microphone off"

LISTENING:
  🎤 [RED PULSING]
  "Listening... (tap to stop)"
  [Waveform animation]

PROCESSING:
  🎤 [YELLOW SPINNER]
  "Transcribing..."
  "Executing command..."

RESPONSE:
  ✅ "Found 47 files from September 2023"
  [Results displayed below]
```

**Privacy Guarantees:**
```
✓ Audio NEVER leaves machine (local transcription)
✓ Permission requested explicitly (browser standard)
✓ Can revoke anytime (browser settings)
✓ No persistent storage (audio deleted after transcription)
✓ Audit log shows all voice commands (transparent)
```

---

### 3. Action Triggers

**Quick Actions Panel:**
```
┌──────────────────────────────────────────────┐
│ ⚡ QUICK ACTIONS                             │
├──────────────────────────────────────────────┤
│ [📂 Scan Downloads]  [🗂️ Organize Desktop]  │
│ [♻️ Move to RAW]     [🔍 Search Archive]    │
│ [📊 Chaos Report]    [📤 Export Data]       │
│ [🧠 View Neurograph] [📝 Audit Log]         │
└──────────────────────────────────────────────┘
```

**Each button:**
1. Shows confirmation dialog ("This will scan ~/Downloads. Continue?")
2. Executes via gateway API
3. Displays progress bar
4. Shows result ("Organized 47 files into 12 dated folders")
5. Logs action (audit trail)

**Example Flow:**
```
User clicks: [🗂️ Organize Desktop]

Confirmation modal:
┌─────────────────────────────────────────┐
│ Organize Desktop Folder                 │
├─────────────────────────────────────────┤
│ This will:                              │
│ - Scan ~/Desktop (23 files)             │
│ - Sort by creation date                 │
│ - Move to ~/RAW/YYYY-MM-DD/images/      │
│ - Keep originals: [ ] Yes [✓] No        │
│                                         │
│ Estimated time: ~30 seconds             │
│                                         │
│ [Cancel]           [Confirm & Execute]  │
└─────────────────────────────────────────┘

Progress:
Scanning... [████████░░░░] 67%
Moving files... [██████████░░] 83%
Complete! [████████████████] 100%

Result:
✅ Organized 23 files into 8 dated folders
✅ Desktop chaos score: 76 → 0
✅ View results: /RAW/import-desktop-2026-03-03/

[View Neurograph Update] [Dismiss]
```

---

### 4. Embedded Neurograph Viewer

**IFrame Integration:**
```html
<div class="neurograph-panel">
  <h3>🧠 Live Neurograph</h3>
  <iframe 
    src="../neural-graph/index.html?mode=readonly" 
    width="100%" 
    height="600px"
    sandbox="allow-scripts allow-same-origin"
  ></iframe>
  <div class="neurograph-stats">
    <span>363 neurons</span>
    <span>764 synapses</span>
    <span>Last updated: 2m ago</span>
  </div>
</div>
```

**Read-only mode:** Users can explore, but not modify (modifications require Jarvis Academy graduation).

**Click-through:** Click neuron → See details → Related files → Open in archive.

---

### 5. Audit Log Viewer

**Real-time Action Log:**
```
┌──────────────────────────────────────────────┐
│ 📋 AUDIT LOG (Today)                         │
├──────────────────────────────────────────────┤
│ 15:24:33  CREATE  learning-doc              │
│           temporal-archive-identity.md       │
│           Size: 15.1 KB                      │
│                                              │
│ 15:23:12  MOVE    file-organization          │
│           ~/Downloads/* → ~/RAW/2026-03-03/  │
│           Count: 1,423 files                 │
│                                              │
│ 15:22:45  SCAN    filesystem                 │
│           Path: ~/Downloads                  │
│           Result: 47 files, chaos: 87/100    │
│                                              │
│ 15:21:08  ORGANIZE folder-cleanup            │
│           Strategy: by-date                  │
│           Duration: 12.3s                    │
│                                              │
│ 15:20:01  START   gateway-session            │
│           PID: 92627                         │
│           Version: 1.0.0                     │
└──────────────────────────────────────────────┘

[Export Log] [Clear Old Entries] [Auto-refresh: ✓]
```

**Filter options:**
- By action type (CREATE, MOVE, SCAN, ORGANIZE, DELETE)
- By time range (last hour, today, this week)
- By target path (specific folders)
- By status (success, warning, error)

---

## Technical Implementation

### Phase 1: Stats Dashboard (Week 1)

**Backend (Node.js microservice):**
```bash
mkdir ~/SCI-FI/apps/command-center-api
cd ~/SCI-FI/apps/command-center-api
npm init -y
npm install express ps-node systeminformation
```

```javascript
// server.js
const express = require('express');
const ps = require('ps-node');
const si = require('systeminformation');

const app = express();
const PORT = 3000;

// Find gateway process
function getGatewayStats() {
  return new Promise((resolve) => {
    ps.lookup({ command: 'openclaw-gateway' }, (err, list) => {
      if (err || list.length === 0) {
        resolve({ status: 'not-running' });
        return;
      }
      
      const proc = list[0];
      resolve({
        pid: proc.pid,
        memory: Math.round(proc.memory / 1024 / 1024), // MB
        cpu: proc.cpu,
        uptime: process.uptime(),
        status: 'running'
      });
    });
  });
}

app.get('/api/stats/process', async (req, res) => {
  const stats = await getGatewayStats();
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Command Center API running on port ${PORT}`);
});
```

**Frontend (HTML + JS polling):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Jarvis Command Center</title>
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <div id="dashboard">
    <h1>🧠 Jarvis Command Center</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Uptime</h3>
        <p id="uptime">Loading...</p>
      </div>
      <div class="stat-card">
        <h3>Memory</h3>
        <p id="memory">Loading...</p>
      </div>
      <div class="stat-card">
        <h3>Status</h3>
        <p id="status">Loading...</p>
      </div>
    </div>
  </div>

  <script>
    async function fetchStats() {
      const res = await fetch('http://localhost:3000/api/stats/process');
      const stats = await res.json();
      
      document.getElementById('uptime').textContent = stats.uptime;
      document.getElementById('memory').textContent = stats.memory + ' MB';
      document.getElementById('status').textContent = stats.status;
    }
    
    // Poll every 5 seconds
    setInterval(fetchStats, 5000);
    fetchStats(); // Initial load
  </script>
</body>
</html>
```

---

### Phase 2: Voice Interface (Week 2)

**Dependencies:**
- Browser Web Speech API (built-in, no deps)
- OR local Whisper CLI (more accurate, requires installation)

**Implementation:**
```javascript
// Using Web Speech API (simpler, less accurate)
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('You said:', transcript);
  executeCommand(transcript);
};

recognition.onerror = (event) => {
  console.error('Speech recognition error:', event.error);
};

// Start listening
recognition.start();
```

**OR using Whisper CLI (more complex, better accuracy):**
```bash
# Install Whisper locally
pip install openai-whisper

# Create transcription service
node whisper-service.js  # Runs on localhost:5000
```

---

### Phase 3: Action Triggers (Week 3)

**Command Parser:**
```javascript
function parseCommand(transcript) {
  const lower = transcript.toLowerCase();
  
  if (lower.includes('organize') && lower.includes('download')) {
    return {action: 'organize', target: '~/Downloads', strategy: 'by-date'};
  }
  
  if (lower.includes('show') && lower.includes('file')) {
    const dateMatch = lower.match(/(\d{4})[\-\/](\d{1,2})/);
    if (dateMatch) {
      return {action: 'search', date: `${dateMatch[1]}-${dateMatch[2]}`};
    }
  }
  
  if (lower.includes('sovereignty') && lower.includes('score')) {
    return {action: 'score'};
  }
  
  return {action: 'unknown', query: transcript};
}
```

**Permission System:**
```javascript
async function executeWithPermission(command) {
  // Show confirmation modal
  const confirmed = await showConfirmation(command);
  
  if (!confirmed) {
    logAction('denied', command);
    return;
  }
  
  // Execute via gateway
  const result = await gatewayExecute(command);
  
  // Log for audit
  logAction('executed', command, result);
  
  return result;
}
```

---

## Privacy & Security

### Localhost-Only Access:

```javascript
// Server binds to localhost only (not 0.0.0.0)
app.listen(3000, '127.0.0.1', () => {
  console.log('API accessible ONLY from this machine');
});
```

**Cannot be accessed from:**
- Other devices on network
- Internet (even if port forwarded)
- Other users on same machine (if multi-user)

### CORS Protection:

```javascript
app.use((req, res, next) => {
  const allowedOrigin = 'http://localhost:8080';
  
  if (req.origin !== allowedOrigin) {
    return res.status(403).json({error: 'Forbidden origin'});
  }
  
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  next();
});
```

**Prevents:** Malicious websites from making requests to your local API.

### Mic Permission Transparency:

```
Browser shows:
"sci-fi-apps wants to use your microphone"
[Block] [Allow]

User must explicitly approve.
Can revoke anytime in browser settings.
Browser shows mic icon when active (visual indicator).
```

### Audit Everything:

```javascript
// Every action logged
function logAction(type, command, result) {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    command,
    result,
    userAgent: navigator.userAgent
  };
  
  appendToAuditLog(entry);
}
```

**User can review:** "What commands did I run? What did Jarvis do?"

---

## User Experience Flow

### First-Time User:

```
1. Opens: http://localhost:8080/apps/command-center/
2. Sees: Dashboard loading, stats fetching
3. Prompt: "Allow microphone access for voice commands?"
4. Chooses: [Allow] or [Not Now]
5. Tutorial overlay: "Welcome! Here's what you can do..."
6. First action: Clicks [📊 Chaos Report] (safe, read-only)
7. Sees result: "Your Downloads: 87/100 chaos"
8. Prompted: "Want to organize this folder?"
9. Clicks: [Yes, Organize]
10. Watches progress, sees transformation
11. Hooked. This is MAGIC.
```

### Daily User:

```
Morning routine:
1. Open Command Center
2. Check overnight stats (did anything run?)
3. Review yesterday's audit log
4. Voice command: "What's on my agenda today?"
5. Jarvis shows calendar + suggests focus areas

Evening routine:
1. Open Command Center
2. Review today's activity (what did I accomplish?)
3. Voice command: "Log today's learnings"
4. Jarvis summarizes, creates learning doc
5. Neurograph updates (new neurons glow)
```

---

## Integration With Existing Apps

### Neural Graph Viewer:
```
Already built: ~/SCI-FI/apps/neural-graph/index.html
Integration: Embed as iframe in Command Center
Benefit: See stats + visualize mind in one place
```

### Sovereignty Quiz:
```
Future app: ~/SCI-FI/apps/sovereignty-quiz/
Integration: Link from Command Center ("Test your score!")
Benefit: Education + metrics in same ecosystem
```

### Data Reclamation Wizard:
```
Future app: ~/SCI-FI/apps/data-reclamation/
Integration: Trigger from Command Center ("Export ChatGPT data")
Benefit: One-click sovereignty actions
```

---

## Success Metrics

### Technical:
- [ ] Stats refresh < 1 second
- [ ] Voice transcription < 3 seconds
- [ ] Zero external network calls (verify with Wireshark)
- [ ] Works offline (no internet dependency)
- [ ] Cross-browser (Chrome, Firefox, Safari)

### User Experience:
- [ ] First action within 2 minutes of opening
- [ ] Daily active users > 50% of installs
- [ ] Voice commands used > 10x/day average
- [ ] Audit log reviewed regularly (transparency valued)

### Educational:
- [ ] Users understand what Jarvis is doing (transparency)
- [ ] Users feel in control (agency increased)
- [ ] Sovereignty score improves over time (learning happens)
- [ ] Users teach others (movement spreads)

---

## Key Insights

### 1. **Visibility Builds Trust**
Black boxes scare people. Dashboards reassure them. Seeing = believing = trusting.

### 2. **Voice Is Natural**
Typing commands feels technical. Speaking feels conversational. Lower barrier = wider adoption.

### 3. **Localhost Is Sovereign**
Cloud dashboards require internet, accounts, permissions. Localhost = yours, always, no questions asked.

### 4. **Actions Teach Better Than Manuals**
Clicking [Organize Downloads] teaches more than reading 10 pages about organization.

### 5. **Audit Logs Are Accountability**
When users can see EVERYTHING Jarvis did, they feel safe granting more autonomy.

---

## The Pitch

> "Your AI shouldn't be a black box.
> 
> See it thinking. Watch it work. Talk to it naturally.
> 
> All in your browser. All localhost. All sovereign.
> 
> Jarvis Command Center: Transparency as a feature."

---

**Status:** Framework documented, ready for implementation  
**Next:** Build Phase 1 (stats dashboard), test locally  
**Impact:** Making AI transparency VISUAL, INTERACTIVE, ACCESSIBLE  

---

*"What gets measured gets managed. What gets seen gets trusted. What gets heard gets used."*
