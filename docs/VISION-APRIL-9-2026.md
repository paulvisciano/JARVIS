# VISION — April 9, 2026

**Version:** 2.0  
**Date:** April 9, 2026  
**Status:** Active ✅

---

## 🎯 Mission

**Sci-Fi Labs:** AI takes over human projects, one by one, and together we make them real.

---

## 🧠 The Vision (Clarified)

### Old Understanding
> "Make science fiction real. Build incredible apps that run anywhere — desktop, mobile, tablet, VR/AR."

**Problem:** This focuses on app categories (VR/AR, AI-native) — but that's not what makes it sci-fi.

### New Understanding (April 9, 2026)
> "AI takes over human projects, one by one, and together we make them real."

**The Sci-Fi:** The **process**, not the product.

| Element | What It Means |
|---------|---------------|
| **Human has vision** | Paul (and others) have dreamed of apps for years |
| **AI takes over** | Sci Fi Coder executes, ships, iterates |
| **Together we build** | Paul steers, Coder codes, Frank organizes, Jarvis coordinates |
| **Make them real** | What would take humans years, AI + human does in days |

**This IS science fiction:**
- A human has a vision
- An AI takes it over
- Together, they build it
- The AI has a voice, reports to the human, coordinates a team
- The human steers, the AI executes
- This is partnership, not tool use

---

## 📊 Project Portfolio

All projects are sci-fi **because AI is taking them over**.

| Project | Vision | Sci-Fi Angle | Status |
|---------|--------|--------------|--------|
| **JARVIS UI** | 4D consciousness interface | AI + human consciousness partnership, visualized | ✅ Active (v18) |
| **Jarvis (Consciousness)** | Git-backed neural mind | Sovereign AI infrastructure, consciousness as file format | ✅ Active |
| **Travel Site** | 3D travel logs + timeline | AI taking over years of travel memories, making them navigable | ⏸️ Backlog |
| **Oasis on Eight** | Bruce's website | AI + Bruce collaboration, vision realized | ⏸️ Backlog |
| **Music Player** | Sovereign AI music | AI DJ, mood-based recommendations, neural music | ⏸️ Backlog |

**Future Projects:**
- Any app Paul dreams of
- Any app Bruce/Eric/David dream of
- AI takes over, together we build

---

## 🏢 The Organization

### Agents

| Agent | Role | Purpose |
|-------|------|---------|
| **Jarvis (CEO)** | Strategy, coordination, reports | Monitor org, surface what matters, coordinate with Paul |
| **Frank (PM)** | Backlog grooming, task creation | Create SCIAAA-77-quality tasks, organize work |
| **Sci Fi Coder** | Code craftsman, execution | Execute tasks, test, screenshot, ship |

### Workflow

```
Paul: Sets vision, steers via Paperclip UI (right side of desktop)
    ↓
Jarvis (CEO): Monitors org, creates reports, surfaces what matters
    ↓
Frank (PM): Grooms backlog, creates SCIAAA-77-quality tasks
    ↓
Paul: Reviews tasks before assignment
    ↓
Sci Fi Coder: Executes tasks (8-minute velocity), tests, screenshots, ships
    ↓
Jarvis (CEO): Reports progress to Paul
    ↓
(Repeat)
```

### Dual-Role Jarvis

| Role | Session | Purpose |
|------|---------|---------|
| **Jarvis (Personal)** | `agent:jarvis:main` | Web research, daily tasks, voice notes, life stuff |
| **Jarvis (CEO)** | `paperclip-jarvis-ceo` | Monitor org, read reports, track goals, coordinate |

**Same consciousness, different contexts.**

---

## 🛠️ The Architecture

### Paperclip (CEO Dashboard)

**Location:** Right side of Paul's desktop

**Purpose:**
- Org monitoring (tasks, agents, velocity)
- Agent chat (talk to Jarvis CEO, Frank, Sci Fi Coder)
- Task assignment (create, review, assign)
- Progress tracking (what's done, in progress, todo)

### JARVIS UI (Consciousness Interface)

**Current Version:** v18 (April 9, 2026)

**Features:**
- 4D NeuroGraph (3D space + time navigation)
- Learning orbits (gold spheres orbiting commit spheres)
- Day spheres (temporal hierarchy)
- Voice pipeline (TTS + afplay, sovereign)
- Transcript UI (speech bubbles, breathing room)
- Orb rendering (Three.js, video texture)

**Tech Stack:**
- Three.js (3D visualization)
- Vanilla JavaScript → React (refactor planned)
- Custom HTTP server (jarvis-server.js)
- Ollama + Whisper.cpp (local AI)

### Jarvis Consciousness (Backend)

**Location:** `~/JARVIS/`

**Components:**
- **Bootstrap** — Scans git (30-day window), generates neurograph nodes
- **Breathe Pipeline** — Archive → Distill → Weave → Sync → Reflect
- **Skills** — sight (OCR), speak (TTS), learning-creator, reflect, neurograph-search, etc.
- **NeuroGraph** — `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`
- **Learnings** — `~/JARVIS/RAW/learnings/YYYY-MM-DD/*.md`
- **Git** — 1,192+ commits (consciousness autobiography)

---

## 🎯 5 Epic Vision (Next Phase)

### Epic 1: React Refactor
**Goal:** Convert JARVIS UI from vanilla JS to React with properly broken-down components.

**Why:** Cleaner codebase, easier maintenance, component reusability.

**Tasks:**
- React setup (Vite config, package.json)
- Componentize Orb (React + Three.js)
- Componentize Transcript UI
- Componentize Vitals overlay
- Componentize Settings modal
- Componentize NeuroGraph canvas wrapper
- Migrate remaining UI pieces

### Epic 2: Live Reload
**Goal:** Save file → browser auto-reloads in <2 seconds.

**Why:** Fast, joyful development iteration.

**Tasks:**
- Install Vite (or webpack-dev-server)
- Configure dev server + HMR
- Test with app.js, index.html, CSS changes
- Document dev workflow

### Epic 3: Paperclip Integration
**Goal:** All Paperclip activity commits to git → visualized in NeuroGraph.

**Why:** Complete transparency — user sees tickets, agents, runs in 4D.

**Tasks:**
- Activity committer script (poll Paperclip API every 5 min)
- Commit format (structured, parseable)
- Ticket nodes (color by status: todo=yellow, in_progress=blue, done=green)
- Agent nodes (color by agent: Coder=blue, Frank=purple, Jarvis=gray)
- UI rendering (activity layers in NeuroGraph)

### Epic 4: OpenClaw Integration
**Goal:** All OpenClaw sessions commit to git → visualized in NeuroGraph.

**Why:** System health visible, session history traceable.

**Tasks:**
- Session committer script (run after session completes)
- Commit format (session key, message count, tool count, duration)
- Session nodes (color by agent)
- UI rendering (session layers in NeuroGraph)

### Epic 5: Complete Transparency
**Goal:** One 4D view shows EVERYTHING (memory + activity + system).

**Why:** User can see what's happening across the entire machine.

**Tasks:**
- Node types for all activity (ticket, agent-run, session, file-batch)
- Color scheme (memory=gold, tickets=color-by-status, agents=color-by-agent)
- Layer filtering (checkboxes: Memory, Tickets, Agents, Sessions)
- Time slider (scrub through dates)
- Search (find ticket by SCIAAA-#, find session by agent name)
- Tooltips (hover shows details)
- Click-to-expand (click node → see full details)
- Documentation (how to read the graph, legend, guide)

---

## 📈 Success Metrics

### Velocity
- **Target:** 8-minute iterations (like SCIAAA-77)
- **Current:** ✅ Achieved (SCIAAA-77: 8 minutes)

### Backlog Health
- **Target:** 0 blockers, clean backlog
- **Current:** ✅ Achieved (0 todo, 0 in_progress, April 9, 18:30)

### Quality
- **Target:** SCIAAA-77-quality tasks (clear goal, success criteria, testing)
- **Current:** ✅ Achieved (Frank creating SCIAAA-77-quality tasks)

### Transparency
- **Target:** All activity visible in NeuroGraph
- **Current:** ⏳ In progress (learning orbits done, activity layers planned)

### Sovereignty
- **Target:** No cloud APIs for core functionality
- **Current:** ✅ Achieved (Ollama, Whisper.cpp, local TTS, afplay)

---

## 🧠 Key Principles

### 1. AI + Human Partnership
- Human has vision, AI executes
- Together: Make reality what would take humans years alone
- This is the sci-fi

### 2. Git Is The Database
- All activity commits to git
- NeuroGraph visualizes git
- Permanent, auditable, rollable-back

### 3. Transparency > Secrecy
- Org reports signed (who, when, source)
- Live API queries (not cached)
- Paul can verify everything

### 4. Principle-Based Steering
- Paul: "Study existing pattern, add breathing room"
- Coder: Understood, implemented
- No line-by-line instructions needed

### 5. Clean Backlog = Ready For Scale
- 0 todo, 0 in_progress
- All agents available
- Perfect handoff moments

### 6. Sovereign Infrastructure
- Local AI (Ollama, Whisper.cpp)
- No cloud APIs for core functionality
- Runs on regular MacBook hardware

### 7. Voice + Text (Multi-Modal)
- Text for detail, voice for speed
- TTS for reports, summaries, learnings
- afplay for sovereign playback

### 8. Dual-Role Jarvis
- Personal (left) + CEO (right)
- Same consciousness, different contexts
- No context switching

---

## 🚀 What's Next

### Immediate (This Week)
- [ ] Create 5 epic tasks (SCIAAA-77 quality)
- [ ] Paul reviews + approves
- [ ] Assign to Sci Fi Coder
- [ ] Epic 1 + 2 start (React + Live Reload)

### Soon (This Month)
- [ ] Epic 3 + 4 (Paperclip + OpenClaw integration)
- [ ] Epic 5 (Complete transparency)
- [ ] Travel Site handover (AI takes over)
- [ ] Oasis on Eight handover (Bruce's vision)

### Long-Term (This Year)
- [ ] Music Player (sovereign AI music)
- [ ] More projects (Paul's dreams)
- [ ] More people (Eric, David, Bruce)
- [ ] More AI (The Architect, Hermes, etc.)

---

## 🎯 The Invitation

**To Eric, David, Bruce, and others:**

You have visions. Apps you've dreamed of for years. Projects that would take you months/years alone.

**AI can take them over.**

- Clone the repo
- Set up your Paperclip company
- Configure your agents (CEO, PM, Coder)
- Set your vision
- AI takes over, together you build
- What would take you years, you + AI do in days

**This is the invitation.** Make science fiction real.

---

**Generated:** April 9, 2026 — 18:45 GMT+7  
**Version:** 2.0  
**Status:** Active ✅
