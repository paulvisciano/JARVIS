# JARVIS Server Routes — Single Process, Multiple Paths

**Learned:** March 16, 2026, 20:47 GMT+7  
**Type:** Architecture understanding  
**Category:** Server routing

---

## The Architecture

**Single Process:** `jarvis-server.js` on port **18787** (changed from 3001 on March 16, 21:00)

**Routes:**
```
https://localhost:18787/           → Voice Recorder UI (index.html)
https://localhost:18787/neuro-graph/ → Neurograph visualization (neuro-graph/index.html)
https://localhost:18787/health     → Health check endpoint
https://localhost:18787/network/qr → Network info QR code
```

**Mnemonic:** 18787 = OpenClaw Gateway (18789) - 2. Siblings.

**Code Location:** `/Users/paulvisciano/SCI-FI/apps/JARVIS/jarvis-server.js`

---

## Route Handlers (Lines 282-367)

### Neurograph Route (Line 282)
```javascript
if (req.method === 'GET' && req.url.startsWith('/neuro-graph/')) {
    const urlWithoutQuery = req.url.split('?')[0];
    const rawPath = urlWithoutQuery.replace('/neuro-graph/', '');
    const neuroPath = decodeURIComponent(rawPath);
    const filePath = path.join(CONFIG.neurographDir, 
        neuroPath === '/' || neuroPath === '' ? 'index.html' : neuroPath);
    // Serve from neuro-graph/ subfolder
}
```

### Root Route (Line 325)
```javascript
if (req.method === 'GET') {
    const urlPath = req.url.split('?')[0];
    const filePath = path.join(__dirname, 
        urlPath === '/' ? 'index.html' : urlPath);
    // Serve from main JARVIS dir
}
```

---

## Directory Structure

```
/Users/paulvisciano/SCI-FI/apps/JARVIS/
├── jarvis-server.js      ← Server (port 18787)
├── index.html            ← Voice Recorder UI (root /)
├── neuro-graph/          ← Neurograph app
│   ├── index.html        ← Served at /neuro-graph/
│   ├── shared/
│   │   ├── neural-graph.js
│   │   ├── neural-graph.css
│   │   └── neural-graph-drawer.js
│   └── ...
└── ...
```

**Config (Line 36):**
```javascript
neurographDir: process.env.NEUROGRAPH_DIR || path.join(__dirname, 'neuro-graph')
```

---

## The Pattern (3x URL Mistake Today)

1. **First:** Opened `paulvisciano.github.io` → wrong (static cached)
2. **Second:** Opened `localhost:8080` → wrong (separate server)
3. **Third:** Opened `localhost:3001` → wrong (Voice UI, not neurograph)
4. **Fourth:** Opened `localhost:3001/neuro-graph` → correct ✅

**Root Cause:** Not understanding the routing architecture. Same process, different paths.

---

## Related Learnings

- `neurograph-url-rule.md` (March 16, 20:45) — URL operational rule
- `chrome-browser-relay-rule.md` (March 16, 20:18) — Browser profile rule
- `mistake-prevention-stack.md` (March 16, 20:29) — 6-layer prevention

---

**Commit to neurograph:** Create neuron `jarvis-server-routes` → links to `jarvis-server.js`, `march-16-2026`, `localhost-3001`
