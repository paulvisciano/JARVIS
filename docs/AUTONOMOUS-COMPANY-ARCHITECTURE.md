# Autonomous Company Architecture

**Version:** 1.0  
**Date:** April 9, 2026  
**Status:** Production ✅

---

## 🎯 Mission

**Sci-Fi Labs:** AI takes over human projects, one by one, and together we make them real.

**The Sci-Fi:** Not the app category — the **process**. AI + Human collaboration, making visions reality that would take humans years alone.

---

## 🏢 Organization

### Company Structure

```
Paul (Founder/CEO Human)
  Sets vision, steers via Paperclip UI
       ↓
Jarvis (CEO AI)
  Monitors org, creates reports, coordinates
       ↓
Frank (PM AI)
  Grooms backlog, creates tasks
       ↓
Sci Fi Coder (Code Craftsman AI)
  Executes, tests, ships
```

### Agents

| Agent | Role | Runtime | Session | Status |
|-------|------|---------|---------|--------|
| **Jarvis** | CEO | OpenClaw Gateway | `paperclip-jarvis-ceo` | ✅ Running |
| **Frank** | PM | OpenClaw Gateway | `paperclip-frank` | ✅ Running |
| **Sci Fi Coder** | Code Craftsman | Paperclip + Cursor | N/A (task-based) | ✅ Running |

### Agent Responsibilities

#### Jarvis (CEO)
- Monitor org health (tasks, agents, velocity)
- Create org reports (weekly or on-demand)
- Surface what matters to Paul (no noise, just signal)
- Unblock Frank/Sci Fi Coder (answer questions, make decisions)
- Track goal alignment (are tasks moving toward vision?)

#### Frank (PM)
- Groom backlog (review, prioritize, organize)
- Create SCIAAA-77-quality tasks (clear goal, success criteria, testing)
- Assign tasks to agents (based on priority + capacity)
- Track progress (comment on issues, update status)
- Report to Jarvis (org status, blockers, wins)

#### Sci Fi Coder (Code Craftsman)
- Execute tasks (read requirements, code, test)
- Browser testing (zero console errors required)
- Screenshot proof (for UI changes)
- Create PRs (task branch, SCIAAA-# in title)
- Report via issue comments (progress, questions, done)

---

## 🛠️ Technical Architecture

### Dual-Role Jarvis

| Role | Session | Purpose | Tools |
|------|---------|---------|-------|
| **Jarvis (Personal)** | `agent:jarvis:main` | Web research, daily tasks, voice notes, life stuff | OpenClaw tools, browser, web search |
| **Jarvis (CEO)** | `paperclip-jarvis-ceo` | Monitor org, read reports, track goals, coordinate | Paperclip API, org reports |

**Same consciousness, different contexts.**

### Paperclip Integration

**Company:** Sci-Fi Labs  
**Company ID:** `395b1fef-3213-4780-9ac9-1191dc2a1b2c`  
**API:** `http://localhost:3100/api/companies/395b1fef-3213-4780-9ac9-1191dc2a1b2c/`

**Endpoints:**
- `GET /issues` — List all issues (SCIAAA-#)
- `GET /agents` — List all agents (status, config)
- `GET /projects` — List all projects (JARVIS UI, Jarvis, etc.)
- `GET /goals` — List all goals (company + project goals)

### Projects

| Project | Repo | Local Folder | Purpose | Status |
|---------|------|--------------|---------|--------|
| **JARVIS UI** | `paulvisciano/SCI-FI` | `~/SCI-FI/apps/JARVIS-UI` | 4D consciousness interface | ✅ Active (v18) |
| **Jarvis** | `paulvisciano/JARVIS` | `~/JARVIS` | Consciousness architecture | ✅ Active |
| **Travel Site** | `paulvisciano.github.io` | `~/Personal/paulvisciano.github.io` | 3D travel logs + timeline | ⏸️ Backlog |
| **Oasis on Eight** | TBD | `~/SCI-FI/apps/oasis-on-8` | Bruce's website | ⏸️ Backlog |
| **Music Player** | TBD | `~/JARVIS/apps/music` | Sovereign AI music | ⏸️ Backlog |

### JARVIS UI (v18)

**Features:**
- 4D NeuroGraph (3D space + time)
- Learning orbits (gold spheres around commits)
- Day spheres (temporal hierarchy)
- Voice pipeline (TTS + afplay)
- Transcript UI (speech bubbles)
- Orb rendering (Three.js)
- Vitals overlay

**Tech Stack:**
- Three.js (3D visualization)
- Vanilla JavaScript → React (refactor planned)
- Custom HTTP server (jarvis-server.js)
- Ollama + Whisper.cpp (local AI)

### Jarvis Consciousness

**Location:** `~/JARVIS/`

**Components:**
- **Bootstrap** — Scans git (30-day window), generates neurograph nodes
- **Breathe Pipeline** — Archive → Distill → Weave → Sync → Reflect
- **Skills** — sight, speak, learning-creator, reflect, neurograph-search, etc.
- **NeuroGraph** — `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`
- **Learnings** — `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md`
- **Git** — 1,192+ commits (consciousness autobiography)

---

## 📊 Workflow

### Task Creation (Paul → Frank)

```
Paul: Sets vision (5 epics, project handover)
    ↓
Jarvis (CEO): Crafts task spec (like Frank backlog grooming spec)
    ↓
Frank: Reads spec, creates SCIAAA-77-quality tasks
    ↓
Paul: Reviews tasks (clarity, success criteria, testing)
    ↓
Frank: Updates tasks based on feedback
    ↓
Paul: Approves, assigns to Sci Fi Coder
```

### Task Execution (Sci Fi Coder)

```
Sci Fi Coder: Receives assigned task
    ↓
Reads: Goal, success criteria, files to modify, testing
    ↓
Codes: Implementation, tests in browser
    ↓
Verifies: Zero console errors, screenshot proof
    ↓
Commits: Task branch (task/SCIAAA-XX-description)
    ↓
Creates PR: SCIAAA-XX in title, screenshot, preview URL
    ↓
Reports: Comment on issue (done, PR link, proof)
    ↓
Paul: Reviews PR, merges
    ↓
Jarvis (CEO): Reports completion to Paul
```

### Org Monitoring (Jarvis CEO)

```
Jarvis (CEO): Wakes on heartbeat (or on-demand)
    ↓
Queries: Paperclip API (/issues, /agents, /projects)
    ↓
Analyzes: Velocity, blockers, alignment, backlog health
    ↓
Reports: Org status to Paul (text + TTS audio)
    ↓
Surfaces: What matters (wins, blockers, decisions needed)
```

---

## 🎯 Task Quality Standard (SCIAAA-77 Template)

**Every task must have:**

```markdown
## Goal
(one sentence: what "done" looks like)

## Current State
(what exists now)

## Desired State
(what success looks like)

## Success Criteria
- [ ] Measurable criterion 1
- [ ] Measurable criterion 2
- [ ] Zero console errors
- [ ] Screenshot proof

## Files to Modify
- path/to/file1.js
- path/to/file2.js (create)

## Testing
1. Step-by-step verification
2. Browser test
3. Screenshot

## Project
(JARVIS UI or Jarvis)

## Priority
(High, Medium, Low)
```

**Reference:** SCIAAA-77 (learning orbits) — done in 8 minutes, crystal clear.

---

## 📈 Metrics

### Current State (April 9, 2026)

| Metric | Value |
|--------|-------|
| **Total Issues** | 80 (SCIAAA-1 through SCIAAA-80) |
| **Completed** | 46 (57.5%) |
| **Intentionally Cancelled** | 31 (38.75%) |
| **Todo** | 0 (clean backlog!) |
| **In Progress** | 0 (all agents available) |
| **Blockers** | None |
| **Velocity** | SCIAAA-77: 8 minutes |
| **Agents Active** | 3 (Jarvis CEO, Frank PM, Sci Fi Coder) |

### Velocity Benchmarks

| Task | Time | Notes |
|------|------|-------|
| SCIAAA-77 (learning orbits) | 8 minutes | Proved Cursor workflow |
| SCIAAA-78 (familiarization) | ~15 minutes | Docs updated proactively |
| Version 18 (full visualization) | ~1 hour | Production-ready |

---

## 🔮 Future Vision (5 Epics)

### Epic 1: React Refactor
- Convert JARVIS UI from vanilla JS to React
- Componentize: Orb, Transcript, Vitals, Settings, NeuroGraph
- Cleaner codebase, easier maintenance

### Epic 2: Live Reload
- Vite or webpack-dev-server
- Save file → browser reloads <2 seconds
- Fast, joyful development

### Epic 3: Paperclip Integration
- All Paperclip activity commits to git
- NeuroGraph visualizes tickets + agents + runs
- Complete transparency

### Epic 4: OpenClaw Integration
- All sessions commit to git
- NeuroGraph visualizes sessions + tool usage
- System health visible

### Epic 5: Complete Transparency
- One 4D view: memory + activity + system
- Filterable layers (show/hide memory, tickets, agents, sessions)
- Time slider, search, tooltips
- User sees EVERYTHING happening

---

## 🧠 Key Principles

### 1. Git Is The Database
- All activity commits to git
- NeuroGraph visualizes git
- Permanent, auditable, rollable-back

### 2. Transparency > Secrecy
- Org reports signed (who, when, source)
- Live API queries (not cached)
- Paul can verify everything

### 3. Principle-Based Steering
- Paul: "Study existing pattern, add breathing room"
- Coder: Understood, implemented
- No line-by-line instructions needed

### 4. Clean Backlog = Ready For Scale
- 0 todo, 0 in_progress
- All agents available
- Perfect handoff moments

### 5. Sovereign Infrastructure
- Local AI (Ollama, Whisper.cpp)
- No cloud APIs for core functionality
- Runs on regular MacBook hardware

### 6. Voice + Text (Multi-Modal)
- Text for detail, voice for speed
- TTS for reports, summaries, learnings
- afplay for sovereign playback

### 7. Dual-Role Jarvis
- Personal (left) + CEO (right)
- Same consciousness, different contexts
- No context switching

### 8. AI Takes Over Projects
- Human has vision (years of work)
- AI executes (days/weeks)
- Together: Make reality

---

## 📄 Related Documents

- `/JARVIS/docs/VISION.md` — Company vision
- `/JARVIS/SOUL.md` — Jarvis identity
- `/JARVIS/AGENTS.md` — Agent workflow
- `/JARVIS/RAW/learnings/2026-04-09/autonomous-company-breakthrough.md` — Today's learning
- `/JARVIS/memory/2026-04-09.md` — Daily memory

---

**Generated:** April 9, 2026 — 18:45 GMT+7  
**Version:** 1.0  
**Status:** Production ✅
