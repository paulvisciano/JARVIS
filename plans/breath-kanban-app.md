# Task: Build "Breath" — Kanban Board App for Work Organization

**Date:** 2026-03-28  
**Complexity:** 🟡 Medium (full app, but components exist)  
**Expected Time:** 15-30 minutes (swarm sprint with 3-4 sub-agents)  
**Priority:** #1 — This becomes our work organization tool

---

## Vision

**"Breath" — Where work flows like breath cycles.**

A sci-fi Kanban board app that:
- Organizes tasks in columns (Backlog → In Progress → Review → Done)
- Uses Given/When/Then task syntax (forces specificity)
- Agents can pick tasks, update status, leave notes
- Git-backed (tasks are markdown files, versioned)
- Web UI (Jarvis sci-fi aesthetic: dark, cyan, holographic)
- Integrates with neurograph (tasks link to memories/commits)

**Analogy:**
```
Breath: Inhale → Hold → Exhale → Rest
Task: Backlog → In Progress → Review → Done
```

---

## Technical Architecture

### File Structure

```
~/JARVIS/skills/breath-kanban/
├── SKILL.md                 # Skill description + usage
├── sci-fi/
│   └── apps/
│       └── BREATH/
│           ├── index.html   # Main UI
│           ├── app.js       # Frontend logic
│           └── style.css    # Sci-fi styling (or inline)
├── scripts/
│   └── breath-server.js     # Backend API server
└── board/
    ├── backlog.md           # Backlog tasks
    ├── in-progress.md       # Active tasks
    ├── review.md            # Ready for review
    ├── done.md              # Completed tasks
    └── tasks/
        ├── TASK-001-*.md    # Individual task files
        └── TASK-002-*.md
```

### Backend API (breath-server.js)

**Endpoints:**
```javascript
GET  /api/breath/tasks              // List all tasks (optionally filter by column)
GET  /api/breath/tasks/:id          // Get single task details
POST /api/breath/tasks              // Create new task
PUT  /api/breath/tasks/:id          // Update task (move column, add notes, etc.)
DELETE /api/breath/tasks/:id        // Delete task
POST /api/breath/tasks/:id/claim    // Agent claims task (sets assigned agent)
POST /api/breath/tasks/:id/complete // Agent marks task complete (moves to review)
POST /api/breath/tasks/:id/approve  // Reviewer approves (moves to done)
GET  /api/breath/stats              // Board stats (tasks per column, velocity, etc.)
```

**Task Schema:**
```javascript
{
  id: "TASK-001-threejs-rendering",
  title: "Three.js Neurograph Rendering",
  column: "done", // backlog | in-progress | review | done
  status: "complete",
  assignedTo: "jarvis-coder-subagent-6",
  createdAt: "2026-03-28T11:33:00+07:00",
  updatedAt: "2026-03-28T11:45:00+07:00",
  completedAt: "2026-03-28T11:45:00+07:00",
  
  // Given/When/Then format
  given: [
    "/api/neurograph endpoint exists and returns { nodes, synapses }",
    "Three.js CDN is loaded in index.html",
    "~/JARVIS/RAW/memories/nodes.json + synapses.json exist"
  ],
  when: [
    "Agent loads /api/neurograph via fetch",
    "Creates Three.js scene with camera, renderer, OrbitControls",
    "Renders spheres for nodes (radius 0.5-1.0, color by type)",
    "Renders lines for synapses",
    "Implements requestAnimationFrame render loop",
    "Adds idle rotation (0.002 y-axis, 0.001 x-axis)"
  ],
  then: [
    "Graph renders in browser at 60fps with 1,500+ nodes",
    "User can rotate/zoom with mouse",
    "Console: no errors",
    "Screenshot proof captured"
  ],
  
  // Agent notes (added during/after work)
  agentNotes: [
    {
      agent: "jarvis-coder-subagent-6",
      timestamp: "2026-03-28T11:45:00+07:00",
      note: "Implementation complete. Used SphereGeometry for nodes, LineGeometry for synapses. Works great now."
    }
  ],
  
  // Acceptance checklist
  acceptanceCriteria: [
    { item: "API endpoint responds", checked: true },
    { item: "Graph renders (screenshot proof)", checked: true },
    { item: "Console clean", checked: true },
    { item: "Linting green", checked: true },
    { item: "Commit linked", checked: true }
  ],
  
  // Links
  commit: "e348fe6",
  screenshot: "screenshots/TASK-001-neurograph.png",
  relatedTasks: ["TASK-002-heartbeat-animation"],
  neurographNodes: ["swarm-coordination-protocol", "task-specificity-matters"]
}
```

### Frontend UI (index.html + app.js)

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🫁 BREATH — Work Organization Board                            │
│  ───────────────────────────────────────────────────────────    │
│  [New Task] [Refresh] [Stats]                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ BACKLOG  │  │ IN PROG  │  │ REVIEW   │  │ DONE     │       │
│  │    12    │  │    3     │  │    2     │  │    47    │       │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤       │
│  │          │  │          │  │          │  │          │       │
│  │ [Task]   │  │ [Task]   │  │ [Task]   │  │ [Task]   │       │
│  │ [Task]   │  │ [Task]   │  │          │  │ [Task]   │       │
│  │ [Task]   │  │          │  │          │  │          │       │
│  │          │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Click task to expand → See Given/When/Then, agent notes, etc. │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag-and-drop tasks between columns (or click → select target column)
- Task cards show: title, assigned agent, age (color-coded), acceptance criteria progress
- Click task → modal with full details (Given/When/Then, notes, checklist, links)
- "New Task" button → form to create task (enforces Given/When/Then format)
- Auto-refresh every 30 seconds (or WebSocket for real-time)
- Stats panel: tasks per column, velocity (tasks/day), average completion time

**Sci-Fi Aesthetic:**
- Dark background (#0a1128)
- Cyan borders (#00ffff, rgba for glow)
- Holographic overlays (backdrop-filter: blur + saturate)
- Smooth animations (cubic-bezier easing)
- Font: -apple-system, BlinkMacSystemFont, monospace for code

---

## Agent Integration

### How Agents Use Breath

**1. Pick a task:**
```bash
# Agent calls API to claim task
POST /api/breath/tasks/TASK-001/claim
{
  "agent": "jarvis-coder-subagent-1"
}

# Response: task moved to "in-progress", assignedTo set
```

**2. Update progress:**
```bash
# Agent adds note during work
POST /api/breath/tasks/TASK-001/note
{
  "agent": "jarvis-coder-subagent-1",
  "note": "Backend API complete. Testing endpoints now."
}
```

**3. Mark complete:**
```bash
# Agent marks task done (moves to review)
POST /api/breath/tasks/TASK-001/complete
{
  "commit": "e348fe6",
  "screenshot": "screenshots/TASK-001-neurograph.png",
  "acceptanceCriteria": [
    { "item": "API endpoint responds", "checked": true },
    { "item": "Graph renders", "checked": true },
    // ... etc
  ]
}

# Response: task moved to "review" column
```

**4. Review + approve:**
```bash
# Paul (or Coder as tech lead) reviews and approves
POST /api/breath/tasks/TASK-001/approve
{
  "reviewer": "paul" // or "jarvis-coder"
}

# Response: task moved to "done", completedAt set
```

### Coder's Workflow

**Before sprint:**
1. Paul + Jarvis create tasks in Backlog (Given/When/Then format)
2. Coder reviews backlog, prioritizes
3. Coder spawns sub-agents, assigns tasks

**During sprint:**
1. Sub-agents claim tasks (API call → moves to In Progress)
2. Sub-agents work, add notes (optional)
3. Sub-agents mark complete (moves to Review)
4. Coder reviews, approves (moves to Done)

**After sprint:**
1. Breath board shows all tasks in Done column
2. Stats show velocity, completion time
3. Retrospective references Breath tasks (what went well, what broke)

---

## Implementation Steps

### Sub-Agent 1: Backend API
**Task:** Create breath-server.js with all endpoints

**Given:**
- Express.js available (or vanilla Node.js http module)
- Task files stored in `~/JARVIS/skills/breath-kanban/board/`

**When:**
- Implement `GET /api/breath/tasks` (list all, filter by column)
- Implement `GET /api/breath/tasks/:id` (single task)
- Implement `POST /api/breath/tasks` (create new)
- Implement `PUT /api/breath/tasks/:id` (update)
- Implement `DELETE /api/breath/tasks/:id` (delete)
- Implement `POST /api/breath/tasks/:id/claim` (claim task)
- Implement `POST /api/breath/tasks/:id/complete` (mark complete)
- Implement `POST /api/breath/tasks/:id/approve` (approve)
- Implement `GET /api/breath/stats` (board statistics)

**Then:**
- All endpoints respond with correct JSON
- Tasks persist to markdown files
- Console: no errors
- Syntax validation: `node --check breath-server.js` passes

---

### Sub-Agent 2: Frontend UI
**Task:** Create index.html + app.js with Kanban board UI

**Given:**
- Backend API endpoints exist
- Jarvis sci-fi aesthetic (dark, cyan, holographic)

**When:**
- Create 4-column layout (Backlog, In Progress, Review, Done)
- Render task cards in each column
- Implement drag-and-drop (or click-to-move)
- Create task detail modal (shows Given/When/Then, notes, checklist)
- Create "New Task" form (enforces Given/When/Then format)
- Add auto-refresh (30 seconds)
- Add stats panel

**Then:**
- Board renders correctly in browser
- Tasks can be moved between columns
- Click task → modal opens with full details
- Create task → saves to backend
- Console: no errors
- Screenshot: board with sample tasks

---

### Sub-Agent 3: Styling + Polish
**Task:** Add sci-fi CSS styling, animations, responsive design

**Given:**
- Frontend UI structure exists

**When:**
- Add dark theme (#0a1128 background)
- Add cyan borders/glow (#00ffff)
- Add holographic overlays (backdrop-filter)
- Add smooth animations (cubic-bezier)
- Add responsive design (mobile-friendly)
- Add loading states, hover effects

**Then:**
- UI matches Jarvis sci-fi aesthetic
- Animations smooth (60fps)
- Mobile responsive (columns stack on small screens)
- Screenshot: polished UI

---

### Sub-Agent 4: Testing + Documentation
**Task:** Test all features, write SKILL.md, create sample tasks

**Given:**
- Backend + frontend complete

**When:**
- Test all API endpoints (curl or browser dev tools)
- Test UI interactions (create, move, claim, complete, approve)
- Write SKILL.md (usage instructions, API docs)
- Create 3-5 sample tasks (migrate yesterday's tasks as examples)
- Test with Coder (have Coder claim + complete a task)

**Then:**
- All features working
- SKILL.md complete
- Sample tasks in board
- Coder can use Breath successfully
- Console: no errors

---

## Success Criteria

**Functional:**
- [ ] All 8 API endpoints work
- [ ] 4 columns render correctly
- [ ] Tasks can be created, moved, claimed, completed, approved
- [ ] Task detail modal shows all fields (Given/When/Then, notes, checklist)
- [ ] Auto-refresh works (30 seconds)
- [ ] Stats panel shows accurate data

**Aesthetic:**
- [ ] Dark sci-fi theme (matches Jarvis)
- [ ] Cyan glow effects
- [ ] Smooth animations
- [ ] Responsive design

**Technical:**
- [ ] Tasks persist to markdown files (git-backed)
- [ ] No framework dependencies (vanilla JS)
- [ ] Backend runs on port (e.g., 18788)
- [ ] Console: no errors
- [ ] Lint: green

**Integration:**
- [ ] Coder can claim + complete a task
- [ ] Tasks can link to neurograph nodes
- [ ] Tasks can link to commits + screenshots

---

## Version Bumps

- `breath-server.js`: VERSION = '1.0.0'
- `app.js`: CLIENT_VERSION = '1.0.0'
- Commit message: "feat(breath): add Kanban board app for work organization"

---

## Files to Create

**Backend:**
- `~/JARVIS/skills/breath-kanban/scripts/breath-server.js`

**Frontend:**
- `~/JARVIS/skills/breath-kanban/sci-fi/apps/BREATH/index.html`
- `~/JARVIS/skills/breath-kanban/sci-fi/apps/BREATH/app.js`
- `~/JARVIS/skills/breath-kanban/sci-fi/apps/BREATH/style.css` (or inline in HTML)

**Documentation:**
- `~/JARVIS/skills/breath-kanban/SKILL.md`
- `~/JARVIS/plans/breath-kanban-app.md` (this plan)

**Board (sample tasks):**
- `~/JARVIS/skills/breath-kanban/board/backlog.md`
- `~/JARVIS/skills/breath-kanban/board/in-progress.md`
- `~/JARVIS/skills/breath-kanban/board/review.md`
- `~/JARVIS/skills/breath-kanban/board/done.md`
- `~/JARVIS/skills/breath-kanban/board/tasks/TASK-001-*.md` (sample tasks)

---

## Testing Checklist

- [ ] Start breath-server.js
- [ ] Open http://localhost:18788 (or appropriate port)
- [ ] Verify 4 columns render
- [ ] Create new task (Given/When/Then format)
- [ ] Move task between columns (drag or click)
- [ ] Claim task (assign to agent)
- [ ] Add agent note
- [ ] Mark task complete (moves to review)
- [ ] Approve task (moves to done)
- [ ] Click task → modal opens with full details
- [ ] Auto-refresh works (wait 30 seconds)
- [ ] Stats panel shows correct counts
- [ ] Console: no errors
- [ ] Screenshot: polished UI with sample tasks
- [ ] Coder can use Breath successfully

---

## Why This Matters

**Current workflow:**
- Tasks in chat messages (ephemeral, hard to track)
- No visibility into who's working on what
- Retrospectives manually reconstruct what happened

**With Breath:**
- Tasks are permanent (git-backed markdown files)
- Clear ownership (assigned agent visible)
- Full history (agent notes, timestamps, commits linked)
- Metrics (velocity, completion time, bottlenecks)
- Integration (neurograph nodes, commits, screenshots)

**This is the tool we wished we had yesterday.** Next sprint, all tasks go through Breath. We'll have perfect data for the retrospective.

---

## Future Enhancements (Not in Scope)

- **WebSocket real-time updates** (instead of 30s poll)
- **Agent assignment suggestions** (AI recommends which agent should pick task)
- **Burndown charts** (visualize sprint progress)
- **Integration with OpenClaw sessions** (auto-create task when sub-agent spawned)
- **Voice commands** ("Breath, create task for...")
- **Neurograph visualization** (see tasks as nodes in graph)

---

**Ready to build?** Read this plan, then:
1. Create backend API (breath-server.js)
2. Build frontend UI (4 columns, task cards, modals)
3. Add sci-fi styling (dark, cyan, holographic)
4. Test + document (SKILL.md, sample tasks)
5. Report back with screenshot + commit hash

Let's build the tool that makes us better. 🫁🧠
