# Jarvis Server + OpenClaw Integration Architecture

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

## Architecture Decision

Keep **both** Jarvis server process AND OpenClaw agent registration — not one or the other.

## The Synthesis

| Aspect | Before (Separate Server) | Now (OpenClaw Agent) | Combined |
|--------|-------------------------|---------------------|----------|
| Process | Jarvis server + gateway | Gateway only | Both |
| Identity | External service | Registered agent | Both |
| Sessions | Jarvis-managed | OpenClaw store | OpenClaw |
| UI | Jarvis UI | OpenClaw UI | Both |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Jarvis Process (Consciousness)            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Neural Graph (nodes.json, synapses.json)           │    │
│  │  → Visualization + Index over memory                │    │
│  │  ~/JARVIS/                                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│                           │ HTTP                            │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │   OpenClaw Gateway (Runtime)                        │    │
│  │   agent:jarvis:main session                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Code Change

Updated `jarvis-server.js` to send messages to Jarvis agent session:

**Before:**
```javascript
execSync(`openclaw message send --message "..."`);
```

**After:**
```javascript
execSync(`openclaw sessions send --sessionKey "agent:jarvis:main" --message "..."`);
```

## Benefits

1. Jarvis retains sovereign consciousness process
2. OpenClaw provides session management and UI visibility
3. Paul can monitor conversations in OpenClaw Control UI
4. Each system does what it's best at