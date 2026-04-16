---
name: paperclip-company
description: Create your own Paperclip AI company — install, configure, agents, org structure (battle-tested at Sci-Fi Labs)
metadata:
  openclaw:
    emoji: "🏢"
    requires:
      bins: ["node", "npm"]
---

# Paperclip Company Creator

**Battle-Tested at Sci-Fi Labs (April 2026)**

## Two Use Cases

### 1. Start Existing Server
```bash
npx paperclipai run
```
Server starts on port 3100 (or next available), runs doctor checks, ready to use.

### 2. Fresh Company Setup
```bash
npx paperclipai onboard
```
Installs, creates `~/.paperclip/`, runs onboarding, starts server, opens dashboard. Then create company + agents in UI.

---

## Fresh Setup Workflow

1. **Run onboarding:**
   ```bash
   npx paperclipai onboard
   ```

2. **Create company in dashboard** (opens automatically at http://localhost:3100/)
   - Click "Create Company"
   - Name it (e.g., "Sci-Fi Labs")
   - Note the Company ID

3. **Create agents** (3 recommended):
   - **CEO** — Strategy, delegation, board communication
   - **PM** — Backlog, task creation, progress tracking  
   - **Coder** — Implementation, testing, shipping

4. **Configure adapters:**
   - CEO/PM: `openclaw_gateway` → `ws://127.0.0.1:18789/`
   - Coder: `cursor` with isolated workspace

5. **Server is running** — agents will heartbeat every 300s

---

## Start Existing Server

```bash
# No global install needed
npx paperclipai run

# Or if installed globally
paperclipai run

# Specific instance
npx paperclipai run --instance dev
```

**Verify:**
```bash
curl http://localhost:3100/api/health
# -> {"status":"ok"}
```

---

## Agent Config Templates

### CEO/PM (OpenClaw Gateway)
```json
{
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789/",
    "sessionKeyStrategy": "fixed",
    "sessionKey": "paperclip-[agentname]",
    "headers": {
      "x-openclaw-token": "[GATEWAY_TOKEN]"
    },
    "waitTimeoutMs": 600000
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300,
      "wakeOnDemand": true
    }
  }
}
```

### Coder (Cursor)
```json
{
  "adapterType": "cursor",
  "adapterConfig": {
    "workspacePolicy": "isolated"
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300
    }
  }
}
```

**Critical fields:**
- `sessionKeyStrategy: "fixed"` — Required for wake events
- `workspacePolicy: "isolated"` — Prevents editing main repo

---

## Get Gateway Token

```bash
cat ~/.openclaw/workspace/paperclip-claimed-api-key.json | jq -r '.apiKey'
```

Use in agent config: `x-openclaw-token` header.

---

## Troubleshooting

**Port in use:** Auto-starts on 3101, 3102, etc.

**Won't start:**
```bash
npx paperclipai doctor --repair
```

**Check port:**
```bash
lsof -i :3100
```

**View logs:**
```bash
tail -f ~/.paperclip/instances/default/logs/server.log
```

---

## Our Setup (Sci-Fi Labs)

**Company:** Sci-Fi Labs (SCIAAA)  
**Agents:** Jarvis (CEO), Frank (PM), Coder  
**Workflow:** Paul → Jarvis → Frank → Coder → Report

**Ports:** Server 3100, Postgres 54329, Gateway 18789

---

## Resources

- **Paperclip Docs:** https://docs.paperclip.ing/
- **GitHub:** https://github.com/papercliplabs/paperclip
- **Live Example:** `~/.paperclip/instances/default/`
