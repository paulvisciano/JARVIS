# JARVIS Port Change — 3001 → 18787 (OpenClaw Sibling)

**Changed:** March 16, 2026, 21:00 GMT+7  
**Type:** Configuration update  
**Category:** Server infrastructure

---

## The Change

**Old Port:** 3001 (had baggage: 2x EADDRINUSE errors, Chrome stuck connections, restart conflicts)  
**New Port:** 18787 (fresh, clean, mnemonic)

**Mnemonic:** 18787 = OpenClaw Gateway (18789) - 2. They're siblings. JARVIS sits right next to OpenClaw.

---

## Why 18787?

**Reasons:**
1. **Fresh start** — No baggage from 3001 (no stuck processes, no errors)
2. **Mnemonic** — 18789 (OpenClaw) - 2 = 18787 (JARVIS). Easy to remember.
3. **Sibling relationship** — JARVIS and OpenClaw are adjacent in the stack
4. **Available** — Port was clear, no conflicts
5. **Cool factor** — Not a common port, feels intentional

---

## Code Change (jarvis-server.js Line 15)

**Before:**
```javascript
const CONFIG = {
    port: process.env.VOICE_PORT || 3001,
    ...
};
```

**After:**
```javascript
const CONFIG = {
    port: process.env.VOICE_PORT || 18787,
    ...
};
```

---

## Updated URLs

**All JARVIS Routes (Port 18787):**
- `https://localhost:18787/` → Voice Recorder UI
- `https://localhost:18787/neuro-graph/` → Neurograph visualization
- `https://localhost:18787/health` → Health check
- `https://localhost:18787/network/qr` → Network QR code

**Old URLs (3001) — Deprecated:**
- ❌ `https://localhost:3001/`
- ❌ `https://localhost:3001/neuro-graph/`

---

## Related Learnings (All Updated)

- `https-protocol-rule.md` — Updated to port 18787
- `neurograph-url-rule.md` — Updated to port 18787
- `jarvis-server-routes.md` — Updated to port 18787
- `jarvis-server-lifecycle.md` — Still applies (clean restart on 18787)

---

## Server Status (After Change)

**PID:** New process (replaced old 3001 process)  
**Port:** 18787 (LISTEN)  
**Version:** 2.7.0 (2026-03-16 build)  
**Health:** ✅ `{"status":"ok","version":"2.7.0"}`  
**HTTPS:** Enabled (TLS required)

---

## Neurograph Update

**Create neuron:** `jarvis-port-18787` → links to:
- `jarvis-server.js` (code location)
- `march-16-2026` (temporal anchor)
- `openclaw-gateway-18789` (sibling relationship)
- `port-3001-deprecated` (old port, deprecated)

---

**Commit to neurograph:** This port change is permanent. All future URL rules reference 18787, not 3001.
