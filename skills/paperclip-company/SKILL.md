---
name: paperclip-company
description: Create your own Paperclip AI company — install, configure, agents, org structure (battle-tested at Sci-Fi Labs)
metadata:
  openclaw:
    emoji: "🏢"
    requires:
      bins: ["node", "npm"]
    install:
      - id: paperclip-npm
        kind: npm
        package: "@paperclipai/server"
        label: "Install Paperclip server"
---

# Paperclip Company Creator

**Battle-Tested at Sci-Fi Labs (April 2026)**

## What This Skill Does

Creates a complete **Paperclip AI company** with:
- Paperclip server installed & configured
- Local instance with embedded Postgres
- Pre-configured agents (CEO, PM, Coder)
- Org structure ready for work
- OpenClaw Gateway integration (working pattern)

**Proven in Production:** Sci-Fi Labs running 3 agents (Jarvis CEO, Frank PM, Daedalus Coder) with 100+ tasks completed.

## When to Use

✅ **USE this skill when:**
- User wants to create their own Paperclip company
- Setting up AI org from scratch
- Cloning our org structure (Jarvis + Frank + Daedalus)
- Onboarding new team members to Paperclip

❌ **DON'T use when:**
- Paperclip already installed (use `npx @paperclipai/server configure` instead)
- Just need to start existing instance (use `npx @paperclipai/server run`)
- Company already exists (skip to agent setup)

---

## Workflow

```
1. Install @paperclipai/server (npm global or use npx)
2. Quickstart: npx @paperclipai/server onboard --yes
3. Create company in web UI
4. Create agents (CEO, PM, Coder)
5. Configure OpenClaw Gateway (optional)
6. Server auto-starts after onboarding
7. Verify dashboard accessible
```

---

## Commands

### Quickstart (Recommended)

```bash
# One-command onboarding + auto-start (no global install needed)
npx @paperclipai/server onboard --yes

# This does:
# 1. Creates ~/.paperclip/instances/default/
# 2. Runs interactive onboarding (accepts defaults with --yes)
# 3. Runs doctor with auto-repair
# 4. Starts server automatically
# 5. Opens browser to dashboard
```

### Global Install (Optional)

```bash
# Install globally for easier access
npm install -g @paperclipai/server

# Then use directly (no npx needed)
paperclipai onboard --yes
paperclipai run
```

### Start Existing Instance

```bash
# With npx (no global install)
npx @paperclipai/server run

# Or if installed globally
paperclipai run

# Start specific instance
npx @paperclipai/server run --instance dev

# With custom data dir
npx @paperclipai/server run --data-dir ./tmp/paperclip-dev
```

### Health Checks

```bash
# Check server health
curl http://localhost:3100/api/health
# -> {"status":"ok"}

# Run diagnostics
npx @paperclipai/server doctor
npx @paperclipai/server doctor --repair  # Auto-fix issues
```

### Configuration

```bash
# Update server config
npx @paperclipai/server configure --section server

# Update secrets
npx @paperclipai/server configure --section secrets

# Show resolved env config
npx @paperclipai/server env

# Allow private hostname (for Tailscale/network access)
npx @paperclipai/server allowed-hostname my-macbook
```

### Server Management

```bash
# View logs
tail -f ~/.paperclip/instances/default/logs/server.log

# Check if running
lsof -i :3100

# Stop gracefully
# (find PID and send SIGTERM, or Ctrl+C if running in foreground)
```

---

## Agent Configuration Templates

### CEO Agent (Jarvis-style)

```json
{
  "name": "Jarvis",
  "title": "CEO",
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789/",
    "role": "operator",
    "scopes": ["operator.admin"],
    "headers": {
      "x-openclaw-token": "[YOUR_GATEWAY_TOKEN]"
    },
    "sessionKeyStrategy": "fixed",
    "sessionKey": "paperclip-jarvis",
    "timeoutSec": 120,
    "waitTimeoutMs": 600000
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300,
      "wakeOnDemand": true
    }
  },
  "capabilities": "CEO — strategy, board approvals, hiring, API access",
  "permissions": {
    "canCreateAgents": true,
    "canAssignTasks": true
  }
}
```

### PM Agent (Frank-style)

```json
{
  "name": "Frank",
  "title": "Head of Operations / PM",
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789/",
    "role": "operator",
    "scopes": ["operator.admin"],
    "headers": {
      "x-openclaw-token": "[YOUR_GATEWAY_TOKEN]"
    },
    "sessionKeyStrategy": "fixed",
    "sessionKey": "paperclip-frank",
    "timeoutSec": 120,
    "waitTimeoutMs": 600000
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300,
      "wakeOnDemand": true
    }
  },
  "capabilities": "Backlog organization, task creation, delegation, progress tracking",
  "permissions": {
    "canCreateAgents": true,
    "canAssignTasks": true
  }
}
```

### Coder Agent (Daedalus-style)

```json
{
  "name": "Daedalus",
  "title": "Code Craftsman",
  "adapterType": "cursor",
  "adapterConfig": {
    "workspacePolicy": "isolated",
    "workspaceDir": "$PAPERCLIP_WORKSPACE_CWD"
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300
    }
  },
  "capabilities": "Coding, UI fixes, bug fixes, testing, screenshots",
  "permissions": {
    "canCreateAgents": false,
    "canAssignTasks": false
  }
}
```

---

## Creating Agents via API

```bash
# Get API key
API_KEY=$(cat ~/.paperclip/instances/[company-name]/secrets/local-api-key.json | jq -r '.apiKey')
COMPANY_ID=$(cat ~/.paperclip/instances/[company-name]/context.json | jq -r '.profiles.default.companyId')

# Create CEO agent
curl -X POST "http://localhost:3100/api/companies/$COMPANY_ID/agents" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jarvis",
    "title": "CEO",
    "adapterType": "openclaw_gateway",
    "adapterConfig": {...},
    "capabilities": "CEO — strategy, board approvals, hiring"
  }'

# Create PM agent
curl -X POST "http://localhost:3100/api/companies/$COMPANY_ID/agents" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frank",
    "title": "Head of Operations",
    "adapterType": "openclaw_gateway",
    "adapterConfig": {...},
    "capabilities": "Backlog organization, task delegation"
  }'

# Create Coder agent
curl -X POST "http://localhost:3100/api/companies/$COMPANY_ID/agents" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daedalus",
    "title": "Code Craftsman",
    "adapterType": "cursor",
    "adapterConfig": {...},
    "capabilities": "Coding, testing, UI fixes"
  }'
```

---

## OpenClaw Gateway Integration

### Configure Gateway Token

```bash
# Get OpenClaw Gateway token
GATEWAY_TOKEN=$(cat ~/.openclaw/workspace/paperclip-claimed-api-key.json | jq -r '.apiKey')

# Use in agent adapter config
"x-openclaw-token": "$GATEWAY_TOKEN"
```

### Gateway URL

Default: `ws://127.0.0.1:18789/`

If Gateway is on different machine:
```json
"url": "ws://[GATEWAY_HOST]:18789/"
```

---

## Directory Structure

```
~/.paperclip/
└── instances/
    └── default/
        ├── config.json             # Server config
        ├── db/                     # Embedded Postgres (port 54329)
        ├── logs/                   # Server logs
        ├── data/
        │   ├── backups/            # DB backups (every 60m, keep 30d)
        │   └── storage/            # File storage
        ├── secrets/
        │   └── master.key          # Encryption key
        ├── companies/              # Company data
        └── workspaces/             # Agent workspaces
```

**Environment Variables:**
```bash
PAPERCLIP_HOME=/custom/path        # Override ~/.paperclip/
PAPERCLIP_INSTANCE_ID=dev          # Use instance "dev" instead of "default"
```

---

## Verification Checklist

After setup, verify:

- [ ] Server running: `curl http://localhost:3100/api/health` → `{"status":"ok"}`
- [ ] Dashboard accessible: `http://localhost:3100/`
- [ ] Company created (via UI or API)
- [ ] Agents created with correct adapters
- [ ] Heartbeats configured (300s interval recommended)
- [ ] OpenClaw Gateway connected (check agent status in UI)
- [ ] Can create issues via API
- [ ] Agents can checkout issues (heartbeat protocol working)

---

## Troubleshooting

### Server Won't Start

```bash
# Check if port 3100 is in use
lsof -i :3100

# Run diagnostics with auto-repair
npx @paperclipai/server doctor --repair

# Check logs
tail -100 ~/.paperclip/instances/default/logs/server.log

# Reset dev data (nuclear option)
rm -rf ~/.paperclip/instances/default/db
npx @paperclipai/server run
```

### Server Stopped Unexpectedly

```bash
# Check last logs for shutdown reason
tail -100 ~/.paperclip/instances/default/logs/server.log | grep -i "stop\|error\|shutdown"

# Restart
npx @paperclipai/server run

# Verify
curl http://localhost:3100/api/health
```

### Agent Won't Wake

1. **Check Gateway is running:** `openclaw gateway status`
2. **Verify token:** `cat ~/.openclaw/workspace/paperclip-claimed-api-key.json`
3. **Check agent config:** `curl http://localhost:3100/api/agents/[AGENT_ID]`
4. **Review heartbeat logs:** `tail -f ~/.paperclip/instances/default/logs/server.log | grep heartbeat`
5. **Check agent run policy:** Ensure `runtimeConfig.heartbeat.enabled: true`

### Database Issues

```bash
# Embedded Postgres port: 54329
# Check connectivity
psql -h localhost -p 54329 -U paperclip

# Backup location
ls -la ~/.paperclip/instances/default/data/backups/

# Restart handled automatically by paperclipai run
```

### Network Access (Tailscale/Private)

```bash
# Enable Tailscale auth mode
npx @paperclipai/server dev --tailscale-auth

# Allow specific hostname
npx @paperclipai/server allowed-hostname my-macbook

# Check allowed hostnames
cat ~/.paperclip/instances/default/config.json | jq '.server.allowedHostnames'
```

---

## Notes

### Ports
- **Server:** 3100 (HTTP)
- **Embedded Postgres:** 54329
- **OpenClaw Gateway:** 18789 (WebSocket)

### OpenClaw Gateway Integration
- **Adapter type:** `openclaw_gateway`
- **Session strategy:** `fixed` (required for wake events)
- **Session key:** Unique per agent (e.g., `paperclip-jarvis`)
- **Timeout:** 600000ms (10 minutes) for complex tasks
- **Heartbeat interval:** 300 seconds (5 minutes)
- **API key:** `~/.openclaw/workspace/paperclip-claimed-api-key.json`

### Heartbeat Protocol (Critical)
Agents must follow this sequence:
1. `GET /api/agents/me` — Get identity
2. Handle pending approvals (if `PAPERCLIP_APPROVAL_ID` set)
3. `GET /api/companies/{id}/issues?assigneeAgentId={me}` — Get assignments
4. `POST /api/issues/{id}/checkout` — **Must checkout before working**
5. Do the work
6. `PATCH /api/issues/{id}` — Update status with `X-Paperclip-Run-Id` header
7. Delegate subtasks if needed (always set `parentId` + `goalId`)

**Critical Rules:**
- Never retry a 409 on checkout (task belongs to another agent)
- Always comment on in-progress work before exiting heartbeat
- Never manually PATCH to `in_progress` — use checkout instead

---

## Example: Full Setup Script

```bash
#!/bin/bash

# Quickstart (recommended)
npx @paperclipai/server onboard --yes

# Wait for server to start
sleep 5

# Verify
curl http://localhost:3100/api/health | jq '.'

echo "✅ Paperclip running"
echo "🌐 Dashboard: http://localhost:3100/"
echo "📊 Logs: tail -f ~/.paperclip/instances/default/logs/server.log"
```

### Manual Company Creation (API)

```bash
# Get API key
API_KEY=$(cat ~/.paperclip/instances/default/secrets/local-api-key.json 2>/dev/null | jq -r '.apiKey')

# Create company
curl -X POST "http://localhost:3100/api/companies" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sci-Fi Labs",
    "description": "AI-native software development company"
  }' | jq '.id'
```

---

## Inspiration: Our Setup (Sci-Fi Labs)

**Company:** Sci-Fi Labs (SCIAAA)  
**Instance:** `~/.paperclip/instances/default/`  
**Agents:**
- Jarvis (CEO) — `openclaw_gateway` adapter
- Frank (PM) — `openclaw_gateway` adapter  
- Daedalus (Coder) — `cursor` adapter

**Structure:**
- Monorepo: `~/JARVIS/`
- Apps: `~/JARVIS/apps/`
- Paperclip: `~/.paperclip/instances/default/`

**Workflow:**
1. Paul → Jarvis (strategy via chat)
2. Jarvis → Frank (create tasks via Paperclip)
3. Frank → Daedalus (assign work)
4. Daedalus → Code + Report (heartbeat cycle)
5. Frank → Track progress
6. Jarvis → Report to Paul

---

## Lessons Learned (Sci-Fi Labs — April 2026)

### What Worked Great

1. **Frank (PM Agent) + OpenClaw Gateway**
   - Wake events firing correctly
   - Task creation/delegation working
   - Heartbeat stable at 300s intervals
   - **Key:** Fixed session key strategy (`sessionKey: "paperclip-frank"`)

2. **Daedalus (Coder) + Cursor**
   - Isolated workspace (`workspacePolicy: "isolated"`)
   - Proper task checkout → code → report workflow
   - 100+ tasks completed successfully

3. **API Key Management**
   - Store at: `~/.openclaw/workspace/paperclip-claimed-api-key.json`
   - Use in agent config: `x-openclaw-token` header
   - **Don't:** Store in multiple places (causes confusion)

### What Struggled (And How We Fixed It)

1. **Server Start Command**
   - **Problem:** Skill doc said `paperclipai run`, but that command didn't exist
   - **Reality:** Official docs use `pnpm paperclipai run` but npm works fine
   - **Solution:** Use `npx @paperclipai/server run` (no global install needed)
   - **Lesson:** npm works — no need to install pnpm unless you want dev mode

2. **API Key Location**
   - **Problem:** Skill doc said one place, actual runtime used another
   - **Solution:** Standardized on `~/.openclaw/workspace/paperclip-claimed-api-key.json`
   - **Lesson:** Document the _actual_ path, not the theoretical one

3. **Wake Event Configuration**
   - **Problem:** Agents not waking on issue comments
   - **Root Cause:** Missing `sessionKey` in adapter config
   - **Solution:** Added `sessionKeyStrategy: "fixed"` + `sessionKey: "paperclip-[agent]"`
   - **Lesson:** Fixed session keys required for reliable wake events

4. **Cursor Workspace Isolation**
   - **Problem:** Daedalus editing main repo instead of isolated workspace
   - **Solution:** Explicit `workspacePolicy: "isolated"` in adapter config
   - **Lesson:** Always verify workspace policy before first run

5. **Server Stopped Unexpectedly**
   - **Problem:** Server gracefully shutdown ("Stopping embedded PostgreSQL")
   - **Solution:** `npx @paperclipai/server run` to restart
   - **Lesson:** Add troubleshooting section for restart procedures

### Production Configuration (Copy This)

**CEO Agent (OpenClaw Gateway):**
```json
{
  "name": "Jarvis",
  "title": "CEO",
  "adapterType": "openclaw_gateway",
  "adapterConfig": {
    "url": "ws://127.0.0.1:18789/",
    "role": "operator",
    "scopes": ["operator.admin"],
    "headers": {
      "x-openclaw-token": "CLAIMED_KEY_FROM_~/.openclaw/workspace/paperclip-claimed-api-key.json"
    },
    "sessionKeyStrategy": "fixed",
    "sessionKey": "paperclip-jarvis",
    "timeoutSec": 120,
    "waitTimeoutMs": 600000
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300,
      "wakeOnDemand": true
    }
  },
  "capabilities": "CEO — strategy, board approvals, task delegation",
  "permissions": {
    "canCreateAgents": true,
    "canAssignTasks": true
  }
}
```

**Coder Agent (Cursor):**
```json
{
  "name": "Daedalus",
  "title": "Code Craftsman",
  "adapterType": "cursor",
  "adapterConfig": {
    "workspacePolicy": "isolated",
    "workspaceDir": "$PAPERCLIP_WORKSPACE_CWD"
  },
  "runtimeConfig": {
    "heartbeat": {
      "enabled": true,
      "intervalSec": 300
    }
  },
  "capabilities": "Coding, testing, UI fixes, screenshots",
  "permissions": {
    "canCreateAgents": false,
    "canAssignTasks": false
  }
}
```

**Key Fields (Don't Skip These):**
- `sessionKeyStrategy: "fixed"` — Required for wake events (OpenClaw Gateway)
- `sessionKey: "paperclip-[name]"` — Unique per agent
- `workspacePolicy: "isolated"` — Prevents editing main repo (Cursor)
- `waitTimeoutMs: 600000` — 10 min for complex tasks
- `heartbeat.intervalSec: 300` — 5 min, not too aggressive

---

## Resources

- **Paperclip Docs:** https://docs.paperclip.ing/
  - [Quickstart](https://docs.paperclip.ing/start/quickstart.md)
  - [CLI Commands](https://docs.paperclip.ing/cli/setup-commands.md)
  - [Adapters Overview](https://docs.paperclip.ing/adapters/overview.md)
  - [Heartbeat Protocol](https://docs.paperclip.ing/guides/agent-developer/heartbeat-protocol.md)
  - [Creating a Company](https://docs.paperclip.ing/guides/board-operator/creating-a-company.md)
- **GitHub:** https://github.com/papercliplabs/paperclip
- **OpenClaw Docs:** https://docs.openclaw.ai/
- **Our Learnings:** `~/JARVIS/RAW/learnings/2026-04-08/` (April 8th context)
- **Live Example:** `~/.paperclip/instances/default/` (Sci-Fi Labs instance)
