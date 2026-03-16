# HTTPS Protocol Rule — JARVIS Server Requires TLS

**Learned:** March 16, 2026, 20:51 GMT+7  
**Type:** Operational rule  
**Category:** Server configuration

---

## The Rule

**When opening JARVIS URLs:**
- ✅ Use `https://localhost:3001` (TLS encrypted, with S)
- ❌ Do NOT use `http://localhost:3001` (plain HTTP, no S)

**Why:**
- Server runs with `HTTPS_ENABLED = true` (jarvis-server.js line 12)
- Uses TLS certificates: `https-key.pem` + `https-cert.pem`
- Only accepts encrypted connections
- HTTP requests fail or redirect

---

## The Mistake (1x Today)

**Pattern:**
1. Opened `http://localhost:3001` (no S) → wrong
2. Server responded but Chrome couldn't load properly
3. Fixed: Reopened with `https://localhost:3001` (with S)

**Root Cause:** Habit of typing `http://` by default. JARVIS server requires `https://`.

---

## Correct Usage

```bash
# ✅ RIGHT - HTTPS with TLS, Port 18787
open -a "Google Chrome" https://localhost:18787
open -a "Google Chrome" https://localhost:18787/neuro-graph

# ❌ WRONG - Plain HTTP (no TLS)
open -a "Google Chrome" http://localhost:18787

# ❌ OLD PORT - Don't use 3001 anymore
open -a "Google Chrome" https://localhost:3001
```

**All JARVIS Routes (Port 18787):**
- `https://localhost:18787/` → Voice Recorder UI
- `https://localhost:18787/neuro-graph/` → Neurograph visualization
- `https://localhost:18787/health` → Health check endpoint
- `https://localhost:18787/network/qr` → Network QR code

**Mnemonic:** 18787 = OpenClaw Gateway (18789) - 2. Siblings.

---

## Server Configuration (jarvis-server.js)

**Line 12:**
```javascript
const HTTPS_ENABLED = true;
const HTTPS_OPTIONS = {
    key: fs.readFileSync(path.join(__dirname, 'https-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'https-cert.pem'))
};
```

**Port:** 3001  
**Protocol:** HTTPS (TLS)  
**Certificates:** In `/Users/paulvisciano/SCI-FI/apps/JARVIS/`

---

## Related Learnings

- `neurograph-url-rule.md` (March 16, 20:45) — Correct URL path
- `jarvis-server-routes.md` (March 16, 20:47) — Server route architecture
- `chrome-browser-relay-rule.md` (March 16, 20:18) — Browser profile rule

---

**Commit to neurograph:** Create neuron `https-protocol-rule` → links to `jarvis-server.js`, `march-16-2026`, `localhost-3001`
