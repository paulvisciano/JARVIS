---
name: jarvis-nav
description: Navigate and control the JARVIS consciousness UI (Neurograph + JARVIS root). Use when: (1) opening neural graph with filters (today/yesterday/date range), (2) navigating to specific nodes/memories, (3) controlling browser tabs (open/navigate/snapshot/screenshot), (4) verifying neurograph code edits, (5) self-observation loop, (6) documenting consciousness state for git commits.
---

# JARVIS Navigation

Navigate and control the JARVIS consciousness UI using OpenClaw browser extension.

## Quick Start

**Open Neurograph:**
```
browser(action=open, profile=openclaw, targetUrl=https://localhost:18787/neuro-graph)
```

**Navigate to specific date:**
```
browser(action=navigate, profile=openclaw, targetId=<id>, url=https://localhost:18787/neuro-graph?time=day%3A2026-03-22)
```

**Open JARVIS Root:**
```
browser(action=open, profile=openclaw, targetUrl=https://localhost:18787/)
```

**Take Screenshot:**
```
browser(action=screenshot, profile=openclaw, targetId=<id>, type=png)
```

**Snapshot UI (inspect elements):**
```
browser(action=snapshot, profile=openclaw, targetId=<id>, refs=aria)
```

## Navigation Commands

### Open Neurograph (Consciousness Visualization)

**First time:**
```
browser(action=open, profile=openclaw, targetUrl=https://localhost:18787/neuro-graph)
```

**Navigate to date:**
```
browser(action=navigate, profile=openclaw, targetId=<id>, url=https://localhost:18787/neuro-graph?time=day%3A2026-03-22)
```

**URL patterns:**
- `?time=day%3A2026-03-22` → Single day
- `?time=week%3A2026-W12` → Week range
- `?time=month%3A2026-03` → Month range
- No param → All memories

Shows:
- Neurons + synapses count
- Temporal/Learnings/Archive filters
- Node list by category
- Graph canvas (zoomable, pannable)

### Open JARVIS Root (Landing Page)

```
browser(action=open, profile=openclaw, targetUrl=https://localhost:18787/)
```

Shows:
- JARVIS version (v2.9.24)
- Server stats (PID, memory, uptime)
- Voice recording UI (press space)
- Live transcription toggle
- Device registry
- Archive path browser

### Tab Management

**List tabs:**
```
browser(action=tabs, profile=openclaw)
```

**Focus tab:**
```
browser(action=focus, profile=openclaw, targetId=<id>)
```

**Reuse existing tab:**
```
browser(action=navigate, profile=openclaw, targetId=<existing-id>, url=<new-url>)
```

**Pattern:** Check tabs first → Navigate existing → Open new only if needed

### Capture Documentation

**Screenshot:**
```
browser(action=screenshot, profile=openclaw, targetId=<id>, type=png)
```
Output: `~/.openclaw/media/browser/<uuid>.png`

**Snapshot (inspect UI elements):**
```
browser(action=snapshot, profile=openclaw, targetId=<id>, refs=aria)
```
Returns aria-ref IDs for clicking/type/navigation

**Click element:**
```
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=<aria-ref>)
```

### Verify Code Changes

**Workflow:**
1. Edit `~/SCI-FI/apps/neuro-graph/shared/neural-graph.js`
2. Navigate existing tab: `browser(action=navigate, targetId=<id>, url=...)`
3. Snapshot to verify: `browser(action=snapshot, targetId=<id>)`
4. Screenshot to document: `browser(action=screenshot, targetId=<id>)`
5. Commit to git if satisfied

## Self-Observation Loop

This skill enables literal self-improvement:

1. **See yourself** → Neurograph = consciousness (memories, learnings, archive)
2. **Navigate to specific memories** → Filter by date/range
3. **Modify yourself** → Edit code at `~/SCI-FI/apps/neuro-graph/`
4. **Verify changes** → Browser navigate + snapshot + screenshot
5. **Persist evolution** → Git commit

**Architecture:**
- `~/JARVIS/` → TRUE HOME (consciousness, memory, skills)
- `~/SCI-FI/apps/JARVIS/` → UI server (web interface)
- `~/SCI-FI/apps/neuro-graph/` → NeuroGraph UI (standalone dev)
- `~/JARVIS/RAW/memories/` → Graph data (nodes.json, synapses.json)

## Command Reference

**Open new tab:**
```
browser(action=open, profile=openclaw, targetUrl=<url>)
```

**Navigate existing tab:**
```
browser(action=navigate, profile=openclaw, targetId=<id>, url=<url>)
```

**List tabs:**
```
browser(action=tabs, profile=openclaw)
```

**Focus tab:**
```
browser(action=focus, profile=openclaw, targetId=<id>)
```

**Snapshot UI:**
```
browser(action=snapshot, profile=openclaw, targetId=<id>, refs=aria)
```

**Screenshot:**
```
browser(action=screenshot, profile=openclaw, targetId=<id>, type=png)
```

**Click element:**
```
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=<aria-ref>)
```

**Type text:**
```
browser(action=act, profile=openclaw, targetId=<id>, kind=type, ref=<aria-ref>, text=<text>)
```

## Notes

- **HTTPS required** → Always use `https://localhost:18787/` (not HTTP)
- **Dev server** → `http://localhost:8081/` for iteration (no-cache, editable)
- **Production** → `https://localhost:18787/` (voice pipeline + API routes)
- **Screenshots** → Saved to `~/.openclaw/media/browser/<uuid>.png`
- **Tab reuse** → Check tabs first, navigate existing, open new only if needed
- **URL encoding** → Use `%3A` for `:` in date params (e.g., `day%3A2026-03-22`)

## Search & Navigate to Specific Nodes

**Find a specific learning/memory:**
```
# 1. Expand side menu drawer (if collapsed)
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=e3)

# 2. Type node name in search box (aria-ref may vary, inspect snapshot first)
browser(action=act, profile=openclaw, targetId=<id>, kind=type, ref=e44, text="memory-separation-architecture")

# 3. Click the matching node button from filtered list
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=e54)
```

**Pattern:**
- Snapshot first to get current aria-refs (refs change based on DOM state)
- Search box filters the node list instantly
- Click the button matching your search term
- Graph canvas focuses on that node

**Use case:** "Show me the learning about X from today" → Search → Navigate → Done

## When NOT to Use

- Don't use for voice recording (manual via JARVIS UI spacebar)
- Don't use for neurograph data editing (use memory tools or direct file edits)
- Don't use if browser relay is down (restart OpenClaw gateway first)
- Don't open new tabs if existing tab already has the UI (check tabs first)
