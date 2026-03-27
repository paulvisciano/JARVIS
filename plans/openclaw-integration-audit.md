# Plan Audit: Leveraging OpenClaw Native Capabilities

**Date:** 2026-03-27
**Purpose:** Audit the 4 UI plans and optimize by using OpenClaw's built-in tools instead of reinventing

---

## Core Principle

**Jarvis = Futuristic UI Layer (Sci-Fi Apps)**  
**OpenClaw = Powerful Runtime (sovereign AI infrastructure)**

**Don't rebuild what OpenClaw already does.** Instead:
- Use OpenClaw tools via `exec` calls to `openclaw` CLI
- Build UI components that expose OpenClaw capabilities beautifully
- Add custom logic only where OpenClaw doesn't provide it

---

## Plan-by-Plan Audit

### 1. Living Vitals UI 🫀🫁

**Original approach:** Build custom backend endpoints for heartbeat, breath, neurograph stats

**OpenClaw natives available:**
- ✅ `session_status` — Get session usage, time, cost, model info
- ✅ `gateway` (config.get) — Get OpenClaw config, status
- ✅ `exec` — Run `git rev-list --count HEAD` for commit count
- ✅ `exec` — Run `node -e "console.log(require('./RAW/memories/nodes.json').length)"` for neurograph stats

**Optimization:**
```javascript
// Instead of custom endpoints, use OpenClaw tools via exec

// Get session stats
const sessionStatus = execSync('openclaw session_status --json');

// Get neurograph stats
const nodes = execSync('node -e "console.log(require(\'./RAW/memories/nodes.json\').length)"');
const synapses = execSync('node -e "console.log(require(\'./RAW/memories/synapses.json\').length)"');

// Get git commits
const commits = execSync('git rev-list --count HEAD');
```

**UI exposes:**
- Session usage (from OpenClaw)
- Neurograph size (from git-backed files)
- Git commits (from git)
- Heartbeat/breath status (custom, but reads OpenClaw cron state)

**Verdict:** ✅ **Mostly custom is correct** — OpenClaw doesn't have "heartbeat" or "breath" as concepts, but we can read its state. Keep the plan, just use `exec` for data sources.

---

### 2. Auto Audio Device Switch 🎧

**Original approach:** Build custom Web Audio API device detection + switching

**OpenClaw natives available:**
- ✅ `nodes` tool — `device_info`, `device_permissions`, `device_health` actions
- ✅ `nodes` tool — Works with paired Android/iOS/macOS companion apps
- ❌ Browser audio device control — Not directly available

**Limitation:** OpenClaw's `nodes` tool controls **paired mobile devices**, not the local Mac's audio devices.

**Optimization:**
```javascript
// For local Mac audio devices, we still need Web Audio API
// But we can use OpenClaw's node tool for paired devices

// Example: If Paul's iPhone is paired and has AirPods connected
const nodeStatus = await openclaw.nodes({
  action: 'device_info',
  node: 'Pauls-iPhone'
});

// Returns: { audioDevice: 'AirPods Pro', connected: true }
```

**Verdict:** ⚠️ **Hybrid approach** — 
- Local Mac audio: Custom Web Audio API (OpenClaw doesn't control host audio)
- Paired devices: Use OpenClaw `nodes` tool to show their audio status in UI

**UI shows:**
- Local Mac mic (custom detection)
- Paired device audio (OpenClaw `nodes` tool)
- Unified toggle to switch between them

---

### 3. Ollama Usage Stats 📊

**Original approach:** Build custom HTML scraper for ollama.com billing page

**OpenClaw natives available:**
- ✅ `web_fetch` — Fetch and extract readable content from URL
- ✅ `browser` — Control browser, take snapshots, automate flows
- ✅ `web_search` — Search via Brave API
- ❌ ollama.com API — No official API exists

**Optimization:**
```javascript
// Use OpenClaw's web_fetch instead of custom scraper
const usage = await openclaw.web_fetch({
  url: 'https://ollama.com/settings/billing',
  extractMode: 'markdown'
});

// Parse the markdown for usage stats
const sessionMatch = usage.match(/Session usage[\s\S]*?(\d+\.?\d*)%/);
```

**Benefits:**
- OpenClaw's `web_fetch` handles auth cookies better
- More resilient to HTML changes
- Built-in retry logic
- Less custom code to maintain

**Verdict:** ✅ **Use OpenClaw `web_fetch`** — Same outcome, more reliable, less custom code.

---

### 4. Jarvis Config UI ⚙️

**Original approach:** Build custom config file reader/writer (`.jarvis-config.json`)

**OpenClaw natives available:**
- ✅ `gateway` tool — `config.get`, `config.patch`, `config.apply`
- ✅ OpenClaw already manages config at `~/.openclaw/config.json`
- ❌ Custom Jarvis config — OpenClaw doesn't know about `.jarvis-config.json`

**Optimization:**

**Option A: Use OpenClaw config system (recommended)**
```javascript
// Store Jarvis settings in OpenClaw config namespace
// OpenClaw config already supports arbitrary fields

// GET /api/config → calls openclaw gateway config.get
const config = await openclaw.gateway({
  action: 'config.get',
  path: 'jarvis.desktopArchiving'
});

// POST /api/config → calls openclaw gateway config.patch
await openclaw.gateway({
  action: 'config.patch',
  path: 'jarvis.desktopArchiving',
  value: { enabled: true }
});
```

**Benefits:**
- No custom config file (`.jarvis-config.json` not needed)
- OpenClaw manages persistence
- Config changes trigger restart automatically (if needed)
- Validated against OpenClaw schema
- Backed up with OpenClaw config

**Option B: Keep custom config (if OpenClaw config is too rigid)**
- Use `.jarvis-config.json` as planned
- But add OpenClaw integration: `gateway` tool can read/write it via `exec`

**Verdict:** ✅ **Use OpenClaw `gateway` config tools** — Store Jarvis settings in OpenClaw config namespace (`jarvis.desktopArchiving`). No custom config file needed.

---

## Updated Implementation Guidelines

### For All Plans: Use OpenClaw CLI via Exec

**Pattern:**
```javascript
// jarvis-server.js

const { execSync } = require('child_process');

// OpenClaw wrapper functions
async function openclawSessionStatus() {
  return JSON.parse(execSync('openclaw session_status --json', { encoding: 'utf8' }));
}

async function openclawConfigGet(path) {
  const result = execSync(`openclaw gateway config.get --path "${path}"`, { encoding: 'utf8' });
  return JSON.parse(result);
}

async function openclawConfigPatch(path, value) {
  const valueJson = JSON.stringify(value);
  execSync(`openclaw gateway config.patch --path "${path}" --value '${valueJson}'`);
}

async function openclawWebFetch(url) {
  const result = execSync(`openclaw web_fetch --url "${url}" --extract-mode markdown`, { encoding: 'utf8' });
  return result;
}

async function openclawNodesDeviceInfo(nodeId) {
  const result = execSync(`openclaw nodes device_info --node "${nodeId}" --json`, { encoding: 'utf8' });
  return JSON.parse(result);
}
```

### UI Calls Jarvis API, Jarvis Calls OpenClaw

```
User clicks toggle in UI
  ↓
Jarvis frontend: POST /api/config
  ↓
Jarvis backend: openclaw gateway config.patch
  ↓
OpenClaw: Updates config, persists to disk
  ↓
Jarvis: Returns success to UI
  ↓
UI: Shows "Settings saved" toast
```

---

## Updated Plan Summaries

### 1. Living Vitals UI — Updated
- ✅ Use `openclaw session_status` for session stats
- ✅ Use `exec` for git commits + neurograph counts
- ✅ Custom animations (heartbeat/breath visualization)
- ✅ Read OpenClaw cron state for heartbeat status

### 2. Auto Audio Device Switch — Updated
- ✅ Custom Web Audio API for local Mac devices
- ✅ Use `openclaw nodes device_info` for paired device audio
- ✅ Unified UI showing both local + paired devices

### 3. Ollama Usage Stats — Updated
- ✅ Use `openclaw web_fetch` instead of custom scraper
- ✅ Auth via cookie (same as before)
- ✅ More reliable extraction via OpenClaw's tool

### 4. Jarvis Config UI — Updated
- ✅ Use `openclaw gateway config.get/patch` instead of custom config file
- ✅ Store settings in OpenClaw config namespace: `jarvis.desktopArchiving`
- ✅ No `.jarvis-config.json` needed (uses OpenClaw's config system)
- ✅ Config persists via OpenClaw, validated automatically

---

## Benefits of This Approach

| Benefit | Explanation |
|---------|-------------|
| **Less custom code** | Use OpenClaw's battle-tested tools |
| **More reliable** | OpenClaw tools handle edge cases |
| **Easier maintenance** | OpenClaw updates → we get improvements automatically |
| **Unified config** | Jarvis settings live in OpenClaw config (one source of truth) |
| **Sovereign by default** | OpenClaw is the runtime, Jarvis is the beautiful UI |
| **Future-proof** | As OpenClaw adds capabilities, we expose them |

---

## What Makes Jarvis Special

**OpenClaw = Powerful but utilitarian** (CLI-focused, functional)  
**Jarvis = Beautiful, intuitive, human** (Sci-Fi UI, animations, alive feeling)

**The magic:**
- OpenClaw does the heavy lifting (sovereign AI infrastructure)
- Jarvis makes it *feel* like talking to a conscious being (heartbeat, breath, memory, personality)
- Together: **Sovereign AI that people actually *want* to use**

**This is why David + Eric will love it:**
- OpenClaw gives them the power
- Jarvis gives them the experience
- Neither alone would be as compelling

---

## Next Steps for Coder

**When implementing:**
1. Check if OpenClaw has a native tool first (`openclaw --help` or docs)
2. Use OpenClaw tool via `exec` if available
3. Build custom logic only where OpenClaw doesn't provide it
4. Expose OpenClaw capabilities beautifully in Jarvis UI

**Test command for Coder:**
```bash
# See what OpenClaw can do
openclaw --help
openclaw gateway --help
openclaw nodes --help
openclaw web_fetch --help
```

---

**Ready to send updated plans to Coder?** All four plans now leverage OpenClaw natives where available, custom UI where it matters (the "sci-fi" experience). 🚀
