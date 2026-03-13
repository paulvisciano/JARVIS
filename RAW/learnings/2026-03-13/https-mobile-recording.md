# HTTPS Mobile Recording Pipeline

**Date:** March 13, 2026  
**Status:** ✅ Production-ready (desktop + phone)

## Capability Unlocked

Record voice notes from phone → auto-upload to Mac → transcribe locally → archive → respond.

**Physical sovereignty:** Same WiFi/hotspot required. Walk away → connection severs naturally. Proximity IS the security boundary.

## Architecture

### Server (Mac)
- **Process:** JARVIS Server (node, PID variable)
- **Port:** 3001 (HTTPS)
- **Cert:** Self-signed (`https-cert.pem`, `https-key.pem`)
- **Transcription:** whisper-cpp + ggml-large-v3.bin (2.9GB, local)
- **Flow:** Record → Upload → Transcribe → Archive

### Client (Phone/Desktop)
- **URL:** `https://<local-ip>:3001` (QR code scan)
- **Mic access:** HTTPS enables `getUserMedia` on mobile
- **Upload:** WebM audio → multipart POST
- **Status:** Live polling `/transcript/latest`

### Network
- **Topology:** Local subnet (10.129.151.x)
- **Encryption:** TLS 1.3 (self-signed)
- **Range:** WiFi hotspot range (~10-30m)
- **Security:** Physical proximity = trust boundary

## Fixes Applied

1. **API_BASE scoping** — Moved to global scope (was inside IIFE, caused undefined errors)
2. **Health endpoint** — Changed `localhost` to `${API_BASE}` (phone couldn't reach server)
3. **HTTPS support** — Added self-signed cert (mobile browsers require HTTPS for mic)
4. **QR code** — Updated to `https://` protocol (phone scans secure URL)

## Files Modified

- `voice-pipeline-server.js` — HTTPS listener, cert loading, QR HTTPS
- `index.html` — API_BASE global, health check dynamic, version display
- `.gitignore` — `https-*.pem` (machine-specific certs)

## Testing

✅ Desktop recording (macOS, Brave/Chrome)  
✅ Phone recording (iOS Safari, HTTPS mic access)  
✅ Hotspot failover (walk away → disconnects)  
✅ Transcription accuracy (whisper-cpp large-v3)  
✅ Archive flow (live/ → RAW/archive/YYYY-MM-DD/audio/)

## Sovereignty Principles

- **No cloud dependency** — All local, no third-party APIs
- **Physical security** — Range-limited by WiFi physics
- **Encrypted transport** — TLS even on local network
- **Device autonomy** — Phone + Mac direct communication
- **Transparent stack** — Self-signed certs, open tools (whisper-cpp)

## Next

- File sharing over local network (phone → Mac upload)
- Multi-device discovery (show all devices on subnet)
- Background server (launchd for auto-start)
- Neurograph integration (voice → neurons)

---

**Commit:** `44190c7` — "🔒 HTTPS + API_BASE fixes for mobile recording"  
**Ignored:** `e18f16b` — "📝 Ignore SSL cert files (machine-specific)"
