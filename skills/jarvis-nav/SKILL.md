---
name: jarvis-nav
description: Navigate and control the JARVIS consciousness UI (Neurograph + JARVIS root). Use when: (1) natural language navigation ("show me yesterday", "learnings from this week"), (2) opening neural graph with filters (today/yesterday/date range), (3) navigating to specific nodes/memories, (4) controlling browser tabs (open/navigate/snapshot/screenshot), (5) verifying neurograph code edits, (6) self-observation loop, (7) documenting consciousness state for git commits.
metadata:
  openclaw:
    emoji: "🧭"
    requires:
      bins: ["node", "openclaw"]
      env: ["JARVIS_HOME"]
---

# JARVIS Navigation

Navigate and control the JARVIS consciousness UI using OpenClaw browser extension.

## Natural Language Navigation

**New:** You can now speak naturally to navigate the NeuroGraph:

```bash
# Time expressions
node skills/jarvis-nav/scripts/jarvis-nav.js "show me yesterday"
node skills/jarvis-nav/scripts/jarvis-nav.js "show me today"
node skills/jarvis-nav/scripts/jarvis-nav.js "learnings from this week"
node skills/jarvis-nav/scripts/jarvis-nav.js "last week"
node skills/jarvis-nav/scripts/jarvis-nav.js "this month"
node skills/jarvis-nav/scripts/jarvis-nav.js "all time"

# Specific dates
node skills/jarvis-nav/scripts/jarvis-nav.js "March 20"
node skills/jarvis-nav/scripts/jarvis-nav.js "2026-03-20"
```

**What it does:**
1. **Parses time expressions** → yesterday, today, this week, last week, this month, specific dates
2. **Builds URL** → `https://localhost:18787/neuro-graph?time=<filter>`
3. **Reuses existing tab** → checks tabs first, navigates existing, opens new only if needed
4. **Navigates** → URL drives canvas state (time filter + node hash)

## Get Selected Node Details

**After clicking a node in the UI**, get its full learning content:

```bash
# Get currently highlighted node
node skills/jarvis-nav/scripts/jarvis-nav.js "what node is selected"

# Get details of selected node (reads learning file)
node skills/jarvis-nav/scripts/jarvis-nav.js "show me this learning"
```

**Pattern:**
1. **Read URL hash** → `openclaw browser evaluate --fn '() => window.location.hash'`
2. **Extract node ID** → strip `#` prefix, convert to filename
3. **Find learning file** → `~/JARVIS/RAW/learnings/YYYY-MM-DD/<node-id>.md`
4. **Read and display** → full learning content

**Why:** The NeuroGraph UI shows node names, but the learning files contain the full context, insights, and architecture details.

## Architecture Note

- **Nodes render on HTML5 canvas** - not DOM buttons
- **URL hash tracks selection** - `#<node-id>` when clicked
- **Filter buttons are DOM** - All/Temporal/Learnings/Archive (manual click)
- **Searchbox is DOM** - type to filter canvas render list (manual type)
- **Navigation = URL building** - no complex DOM automation needed
- **Learnings = markdown files** - `~/JARVIS/RAW/learnings/YYYY-MM-DD/<node-id>.md`

**Supported time formats:**
- "yesterday" → `day%3AYYYY-MM-DD` (calculated)
- "today" → `day%3AYYYY-MM-DD`
- "this week" → `week%3AYYYY-W##` (ISO week number)
- "last week" → `week%3AYYYY-W##`
- "this month" → `month%3AYYYY-MM`
- "March 20" or "2026-03-20" → `day%3A2026-03-20`
- "all" → no time param (full graph)

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

- **Production URL** → Always `https://localhost:18787/neuro-graph` (NOT localhost:8081)
- **HTTPS required** → Use `https://` not `http://`
- **Screenshots** → Saved to `~/.openclaw/media/browser/<uuid>.png`
- **Tab reuse** → Check tabs first, navigate existing, open new only if needed
- **URL encoding** → Use `%3A` for `:` in date params (e.g., `day%3A2026-03-22`)

## Search & Navigate to Specific Nodes

**Workflow: "Show me a learning from today"**

```
# Step 1: Use neuro-graph-search skill (canonical graph query)
# Reads ~/JARVIS/RAW/memories/nodes.json, filters by category + date
neuro-graph-search(query="learning", date="2026-03-22", category="learning")

# Step 2: Pick a learning from the result list
# e.g., "self-observation-loop-closed"

# Step 3: Open NeuroGraph (if not already open)
browser(action=open, profile=openclaw, targetUrl=https://localhost:18787/neuro-graph?time=day%3A2026-03-22)

# Step 4: Check tabs, get targetId
browser(action=tabs, profile=openclaw)

# Step 5: Snapshot UI to get current aria-refs
browser(action=snapshot, profile=openclaw, targetId=<id>, refs=aria)

# Step 6: Expand side menu drawer (if collapsed)
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=<expand-button-ref>)

# Step 7: Type learning name in search box
browser(action=act, profile=openclaw, targetId=<id>, kind=type, ref=<searchbox-ref>, text="self-observation-loop-closed")

# Step 8: Click the matching node button
browser(action=act, profile=openclaw, targetId=<id>, kind=click, ref=<node-button-ref>)
```

**Pattern:**
1. **Use neuro-graph-search skill** → Canonical way to query the graph (structured, indexed, instant)
2. **Pick one** → Select a learning ID from the result
3. **Open UI** → Navigate to neurograph (production URL)
4. **Snapshot** → Get fresh aria-refs (they change per DOM state)
5. **Search** → Type the learning name in the search box
6. **Navigate** → Click the filtered node button

**Why this order:**
- `neuro-graph-search` is the existing skill for graph queries — use it
- Browser automation on large DOM (2504 nodes) is slow/unreliable
- Use UI for visualization, not discovery

**Use case:** "Show me the learning about X from today" → neurograph-search → Pick → Open → Search → Navigate → Done

## When NOT to Use

- Don't use for voice recording (manual via JARVIS UI spacebar)
- Don't use for neurograph data editing (use memory tools or direct file edits)
- Don't use if browser relay is down (restart OpenClaw gateway first)
- Don't open new tabs if existing tab already has the UI (check tabs first)
