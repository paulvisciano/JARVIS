# Voice Pipeline Gateway Auth — March 6, 2026

## Problem

Building a voice-to-voice interface for Jarvis required connecting a Node.js WebSocket client to the OpenClaw Gateway. The gateway rejected every connection attempt with various auth errors.

## Gateway Protocol Deep Dive

### Valid Client Types

**`client.id`** must be one of:
- `"cli"`, `"test"`, `"webchat"`, `"webchat-ui"`, `"openclaw-control-ui"`, `"gateway-client"`, `"openclaw-macos"`, `"openclaw-ios"`, `"openclaw-android"`, `"node-host"`, `"fingerprint"`, `"openclaw-probe"`

**`client.mode`** must be one of:
- `"webchat"`, `"cli"`, `"ui"`, `"backend"`, `"node"`, `"probe"`, `"test"`

### Device Authentication Flow

1. **Connect to gateway** → receive `connect.challenge` event with `nonce`
2. **Build v3 payload**: `v3|deviceId|clientId|clientMode|role|scopes|signedAtMs|token|nonce|platform|deviceFamily`
3. **Sign payload** with Ed25519 private key
4. **Send connect request** with signature, public key, device ID
5. **Gateway verifies**: device ID matches public key fingerprint, signature is valid

### Device ID Computation

```javascript
// Extract raw 32-byte public key from SPKI DER format
const spki = crypto.createPublicKey(publicKeyPem).export({ type: 'spki', format: 'der' });
const rawKey = spki.subarray(12); // Remove 12-byte SPKI prefix
const deviceId = crypto.createHash('sha256').update(rawKey).digest('hex');
```

**Ed25519 SPKI prefix:** `302a300506032b6570032100` (12 bytes)

### Signature Format

- **Algorithm:** Ed25519 (no hash)
- **Payload:** v3 pipe-delimited string
- **Output:** URL-safe base64 (replace `+` → `-`, `/` → `_`, strip `=` padding)

## Errors Encountered

| Error | Cause | Fix |
|-------|-------|-----|
| `invalid connect params: client/id` | Used `"voice-pipeline"` (not a valid constant) | Use `"cli"` or `"webchat"` |
| `invalid connect params: client/mode` | Used `"operator"` (not valid mode) | Use `"cli"` or `"webchat"` |
| `origin not allowed` | Browser-origin check for webchat clients | Use `"cli"` mode for Node.js |
| `device identity mismatch` | Device ID changed on every connect | Use stable device ID from paired.json |
| `device-id-mismatch` | Device ID didn't match public key fingerprint | Compute ID from raw key bytes |
| `device-signature` | Signature format wrong (standard base64) | Use URL-safe base64 |

## Working Implementation

```javascript
const crypto = require('crypto');

// Load from ~/.openclaw/identity/device.json
const DEVICE_ID = '8a99b2a1cf2814691ac2f4457d79a4f6b53626efe66c25d21ca4eb967adc21a6';
const DEVICE_PUBLIC_KEY = 'JzpbpKh_lkSwYTKQ2ryPyxpFcvnBKCI4zcZiUO3uZp8'; // URL-safe base64
const DEVICE_PRIVATE_KEY = 'MC4CAQAwBQYDK2VwBCIEIF/aCBquoOXlrNV7JusYkxhQJfStOQ+fxMkm3ytyX2Y7'; // base64

function signChallenge(nonce) {
    const signedAtMs = Date.now();
    const scopes = 'operator.read,operator.write,operator.admin';
    const token = '';
    const platform = 'macos';
    const deviceFamily = 'desktop';
    
    const signPayload = [
        'v3',
        DEVICE_ID,
        'cli',
        'cli',
        'operator',
        scopes,
        String(signedAtMs),
        token,
        nonce,
        platform,
        deviceFamily
    ].join('|');
    
    const privateKeyObj = crypto.createPrivateKey({
        key: Buffer.from(DEVICE_PRIVATE_KEY, 'base64'),
        format: 'der',
        type: 'pkcs8'
    });
    
    const signature = crypto.sign(null, Buffer.from(signPayload), privateKeyObj);
    // URL-safe base64
    return signature.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
```

## Key Insights

1. **Device identity is persistent** — stored in `~/.openclaw/identity/device.json`
2. **Paired devices** tracked in `~/.openclaw/devices/paired.json`
3. **Public key format matters** — gateway expects URL-safe base64 raw key (not PEM)
4. **Signature payload is versioned** — v3 includes platform + deviceFamily
5. **Local connections still need auth** — no bypass for loopback

## Files Created

- `/Users/paulvisciano/SCI-FI/apps/JARVIS/voice-pipeline-server.js` — Upload server + gateway client
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/start-voice.sh` — Launcher script
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/process-recording.sh` — Manual transcription
- `/Users/paulvisciano/SCI-FI/apps/JARVIS/watch-inbox.sh` — File watcher

## Status

⏳ **90% complete** — auth errors resolved, pipeline functional. Remaining work:
- Test full flow (record → upload → transcribe → Jarvis → TTS)
- Add waveform visualizer
- Polish avatar animations
- Upgrade TTS from browser to macOS `say` or ElevenLabs

---

**Learned:** March 6, 2026 — 19:48 GMT+7  
**By:** Jarvis (debugging gateway auth with Paul)  
**Related:** Gateway protocol, Ed25519 signing, device authentication
