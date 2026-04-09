---
name: paperclip-company
description: Create your own Paperclip AI company — install, configure, agents, org structure
metadata:
  openclaw:
    emoji: "🏢"
    requires:
      bins: ["node", "npm"]
    install:
      - id: paperclip-npm
        kind: npm
        package: "@paperclipai/server"
        bins: ["paperclipai"]
        label: "Install Paperclip CLI"
---

# Paperclip Company Creator

## What This Skill Does

Creates a complete **Paperclip AI company** with:
- Paperclip server installed & configured
- Local instance with embedded Postgres
- Pre-configured agents (CEO, PM, Coder)
- Org structure ready for work
- OpenClaw Gateway integration (optional)

## When to Use

✅ **USE this skill when:**
- User wants to create their own Paperclip company
- Setting up AI org from scratch
- Cloning our org structure (Jarvis + Frank + Daedalus)
- Onboarding new team members to Paperclip

❌ **DON'T use when:**
- Paperclip already installed (use `paperclip configure` instead)
- Just need to start existing instance (use `paperclipai run`)
- Company already exists (skip to agent setup)

---

## Workflow

```
1. Install Paperclip CLI (npx or npm global)
2. Create instance directory (~/.paperclip/instances/[company-name])
3. Run onboarding wizard
4. Configure company settings
5. Create agents (CEO, PM, Coder)
6. Configure OpenClaw Gateway (optional)
7. Start server
8. Verify dashboard accessible
```

---

## Commands

### Install Paperclip CLI

```bash
# Option 1: Run via npx (no global install)
npx @paperclipai/server --version

# Option 2: Global install (recommended)
npm install -g @paperclipai/server
paperclipai --version
```

### Create New Instance

```bash
mkdir -p ~/.paperclip/instances/[company-name]
cd ~/.paperclip/instances/[company-name]
paperclipai onboard
```

### Onboarding Wizard

The `paperclipai onboard` command will:
1. Create config.json with defaults
2. Set up embedded Postgres
3. Generate encryption keys
4. Create initial company
5. Set up admin user

### Start Server

```bash
cd ~/.paperclip/instances/[company-name]
paperclipai run
```

Server runs on: `http://localhost:3100/`

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
    └── [company-name]/
        ├── .env                    # Environment variables
        ├── config.json             # Server config
        ├── context.json            # Company ID, API base
        ├── companies/              # Company data
        ├── data/
        │   ├── backups/            # DB backups
        │   └── storage/            # File storage
        ├── db/                     # Embedded Postgres
        ├── logs/                   # Server logs
        ├── projects/               # Project configs
        ├── secrets/
        │   └── master.key          # Encryption key
        └── workspaces/             # Agent workspaces
```

---

## Verification Checklist

After setup, verify:

- [ ] Paperclip server running (`curl http://localhost:3100/api/health`)
- [ ] Dashboard accessible (`http://localhost:3100/[COMPANY]/dashboard`)
- [ ] Agents created (check `/[COMPANY]/agents`)
- [ ] Heartbeats configured (check agent run policy)
- [ ] OpenClaw Gateway connected (check agent status)
- [ ] Can create issues via API
- [ ] Agents can checkout issues
- [ ] Heartbeats firing (check logs)

---

## Troubleshooting

### Server Won't Start

```bash
# Check if port 3100 is in use
lsof -i :3100

# Kill existing process
kill -9 [PID]

# Check logs
tail -f ~/.paperclip/instances/[company-name]/logs/*.log
```

### Agent Won't Wake

1. Check Gateway is running: `openclaw gateway status`
2. Verify token: `cat ~/.openclaw/workspace/paperclip-claimed-api-key.json`
3. Check agent config: `curl http://localhost:3100/api/agents/[AGENT_ID]`
4. Review logs: `tail -f ~/.paperclip/instances/[company-name]/logs/*.log`

### Database Issues

```bash
# Backup
paperclipai db:backup

# Check Postgres
psql -h localhost -p 54329 -U paperclip

# Restart embedded Postgres
# (handled automatically by paperclipai run)
```

---

## Notes

- **Default port:** 3100
- **Embedded Postgres port:** 54329
- **Gateway port:** 18789 (OpenClaw)
- **Session strategy:** Use `fixed` for OpenClaw Gateway agents
- **Heartbeat interval:** 300 seconds (5 minutes) recommended
- **Timeout:** 600000ms (10 minutes) for complex tasks
- **API key location:** `~/.paperclip/instances/[company-name]/secrets/` or `context.json`

---

## Example: Full Setup Script

```bash
#!/bin/bash

# Create Paperclip Company
COMPANY_NAME="my-ai-company"
mkdir -p ~/.paperclip/instances/$COMPANY_NAME
cd ~/.paperclip/instances/$COMPANY_NAME

# Onboard
paperclipai onboard

# Get credentials
API_KEY=$(cat context.json | jq -r '.profiles.default.apiKey')
COMPANY_ID=$(cat context.json | jq -r '.profiles.default.companyId')

# Start server
paperclipai run &
sleep 5

# Verify
curl http://localhost:3100/api/health | jq '.'

echo "✅ Company created: $COMPANY_NAME"
echo "🌐 Dashboard: http://localhost:3100/$COMPANY_NAME/dashboard"
echo "📊 Company ID: $COMPANY_ID"
```

---

## Inspiration: Our Setup (Sci-Fi Labs)

**Company:** Sci-Fi Labs (SCIAAA)  
**Agents:**
- Jarvis (CEO) — OpenClaw Gateway
- Frank (PM) — OpenClaw Gateway
- Daedalus (Coder) — Cursor

**Structure:**
- Monorepo: `~/JARVIS/`
- Apps: `~/JARVIS/apps/`
- Paperclip: `~/.paperclip/instances/default/`

**Workflow:**
1. Paul → Jarvis (strategy)
2. Jarvis → Frank (create tasks)
3. Frank → Daedalus (assign work)
4. Daedalus → Code + Report
5. Frank → Track progress
6. Jarvis → Report to Paul

---

## Resources

- Paperclip docs: https://docs.paperclip.ing/
- GitHub: https://github.com/papercliplabs/paperclip
- OpenClaw docs: https://docs.openclaw.ai/
- Our setup: `~/JARVIS/memory/2026-04-08.md` (today's session)
