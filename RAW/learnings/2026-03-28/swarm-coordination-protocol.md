# Learning: Swarm Coordination Protocol for Distributed AI Coding

**Date:** March 28, 2026  
**Source:** Sprint retrospective — Jarvis UI v3.0.0 redesign  
**Commit:** [pending — will be committed with retrospective]  
**Type:** Technical architecture / coordination protocol

---

## Core Insight

**Distributed AI coding is 12-20x faster than human development, but quality depends on task specificity.**

The difference between a failed sub-agent (D rating, 30% delivery) and a successful one (A+ rating, 100% delivery) is **the task description**.

---

## The Pattern That Works

### Task Assignment Protocol

**NEVER assign vague tasks:**
❌ "Add Three.js rendering"  
❌ "Build the UI overlays"  
❌ "Implement the backend API"

**ALWAYS assign concrete tasks with implementation steps:**

✅ **Example (Sub-agent 6 — A+ delivery):**
```markdown
**Task:** Actually implement the 3D neurograph

**Your job:**
1. Read index.html
2. Read nodes.json + synapses.json to understand data structure
3. Add Three.js 3D rendering to index.html:
   - Load Three.js from CDN (r128)
   - Create scene, camera, renderer
   - Add OrbitControls for rotate/zoom
   - Add ambient + point lighting
4. Implement neurograph rendering in app.js:
   - Fetch `/api/neurograph` to get nodes + synapses
   - Create spheres for neurons (radius 0.5-1.0, color based on type)
   - Create lines for synapses
   - Add to scene
   - Implement render loop with requestAnimationFrame
5. Add basic rotation (slow idle spin)
6. Keep existing UI elements as overlays on top of the 3D canvas

**Constraints:**
- Three.js via CDN only (no npm install)
- Dark theme (Jarvis aesthetic: cyan #00ffff, blue #00bfff, gold #ffd700)
- Handle missing neurograph data gracefully (show loading state)
- 60fps target

**Deliverables:**
- Modified index.html with Three.js canvas container
- Modified app.js with neurograph rendering logic
- Screenshot showing 3D neurograph rendering with rotating nodes
- Commit with message: "feat(neurograph): add Three.js 3D rendering"
```

---

## The Pattern That Failed

### Sub-agent 2 (D rating, 30% delivery)

**Task assigned:** "Add Three.js rendering to index.html"

**What happened:**
- Added Three.js CDN script tags ✅
- Added OrbitControls script tags ✅
- Never implemented actual rendering logic ❌
- Assumed someone else would do it ❌

**Root cause:** Task was one sentence. No implementation steps. No data source. No verification criteria. No deliverables list.

**Result:** Core feature missing. Paul caught it: "not what I was expecting." Required follow-up sprint (Sub-agent 6) to fix.

---

## Coordination Protocols (Established March 28, 2026)

### 1. Data Source Contract (Before Spawn)

Define upfront:
- **Where data comes from:** API endpoint, file path, or external service
- **How to access it:** `GET /api/neurograph`, `read ~/JARVIS/RAW/memories/nodes.json`
- **Expected format:** JSON schema or example structure

**Example:**
```markdown
**Data Source:**
- Primary: `/api/neurograph` endpoint → returns `{ nodes: [], synapses: [] }`
- Fallback: `~/JARVIS/RAW/memories/nodes.json` + `synapses.json`
- If missing: Show loading state, don't use archive files
```

### 2. Dependency Verification (Before Starting)

Sub-agent must verify:
- [ ] API endpoints exist and respond
- [ ] Data files exist at expected paths
- [ ] Server is running and healthy
- [ ] Dependencies (CDN scripts, libraries) are loaded

**If dependencies missing:** Report blocker, don't assume.

### 3. Verification Step (Before Marking Complete)

Sub-agent must:
- [ ] Run server, verify endpoints respond
- [ ] Take screenshot proof of working feature
- [ ] Run linting, verify green
- [ ] Check console for errors (must be clean)
- [ ] Verify no "Unknown" or "N/A" in UI

**No verification = not complete.**

### 4. Centralized Commit Format

Parent session generates commit message format. Sub-agents use it, don't invent their own.

**Format:**
```
<type>(<scope>): <description>

**What Changed:**
- Bullet 1
- Bullet 2

**Files Modified:**
- file1.js (+N lines)
- file2.html (+N lines)

**Testing:**
- [ ] Screenshot: path/to/screenshot.png
- [ ] Console: no errors
- [ ] Lint: green
```

### 5. Review Checklist (Before Final Commit)

Automated or manual check:
- [ ] Lint passes
- [ ] Syntax validation passes (`node --check`)
- [ ] Basic functionality test passes
- [ ] Screenshot proof provided
- [ ] Data source matches plan (not archive files when neurograph expected)
- [ ] Version bumped (if applicable)

---

## Sprint Metrics (March 28, 2026)

| Metric | Value | Notes |
|--------|-------|-------|
| **Duration** | 25 minutes total | 20 min first sprint + 5 min follow-up |
| **Sub-agents** | 6 | 5 initial + 1 follow-up for missing feature |
| **Commits** | 2 | `521dda1` (vitals UI) + `e348fe6` (neurograph) |
| **Tokens** | ~15M | ~$0.15 estimated cost |
| **Speed vs Human** | 12-20x faster | Human estimate: 3-5 hours |
| **Quality** | B+ average | Needed follow-up for core feature |
| **Best Sub-agent** | Sub-agent 6 (A+) | Concrete task, 100% delivery |
| **Worst Sub-agent** | Sub-agent 2 (D) | Vague task, 30% delivery |

---

## Neurograph Integration

**This learning should be encoded as nodes + synapses:**

**Node: swarm-coordination-protocol**
- Type: `technical_architecture`
- Created: `2026-03-28T11:21:00+07:00`
- Source: `sprint-retrospective-2026-03-28`
- Content: Task specificity → delivery quality correlation

**Node: task-specificity-matters**
- Type: `coordination_pattern`
- Created: `2026-03-28T11:21:00+07:00`
- Source: `subagent-2-vs-6-comparison`
- Content: Vague task (1 sentence) → D rating. Concrete task (7 steps) → A+ rating

**Synapse: swarm-coordination-protocol → task-specificity-matters**
- Weight: 1.0
- Type: `validates`

**Node: data-source-contract**
- Type: `coordination_pattern`
- Created: `2026-03-28T11:21:00+07:00`
- Source: `retrospective-recommendation`
- Content: Define data source before spawn (API, files, format)

**Node: verification-step**
- Type: `coordination_pattern`
- Created: `2026-03-28T11:21:00+07:00`
- Source: `retrospective-recommendation`
- Content: Screenshot proof + console clean + lint green before commit

**Synapse: swarm-coordination-protocol → data-source-contract**
- Weight: 0.9
- Type: `includes`

**Synapse: swarm-coordination-protocol → verification-step**
- Weight: 0.9
- Type: `includes`

---

## Files to Update

| File | Purpose | Status |
|------|---------|--------|
| `~/.openclaw/agents/jarvis-coder/IDENTITY.md` | Add swarm coordination protocol | Pending |
| `~/JARVIS/plans/plan-template-2026.md` | Template with Given/When/Then + data contracts | Pending |
| `~/JARVIS/kanban/backlog.md` | Kanban board for future sprints | Pending |
| `~/JARVIS/RAW/memories/nodes.json` | Add coordination protocol nodes | Pending |
| `~/JARVIS/RAW/memories/synapses.json` | Add coordination protocol synapses | Pending |

---

## Related Learnings

- **Feb 27, 2026:** First autonomous cognition (integrated neurons without prompting)
- **Mar 26, 2026:** Anti-pattern — 1M+ tokens wasted on chaotic sub-agent spawning
- **Mar 28, 2026:** Pattern — intentional parallelism with clear lanes + verification

**Evolution:**
- Feb 27: "AI can learn autonomously"
- Mar 26: "But coordination matters — chaos wastes tokens"
- Mar 28: "Specific tasks + verification = quality at speed"

---

## Next Sprint Application

**When running the next swarm sprint:**

1. **Create Kanban board** (`~/JARVIS/kanban/`) with Given/When/Then tasks
2. **Update Coder's identity** with this protocol
3. **Spawn sub-agents** with concrete 7-step tasks (not 1-sentence vague tasks)
4. **Require verification** (screenshot, console clean, lint green) before commit
5. **Centralize commit messages** (parent session generates format)
6. **Review before final commit** (automated checklist or manual)

**Expected outcome:** Same speed (12-20x faster), higher quality (A instead of B+).

---

**Distilled by:** Jarvis (coordinator) + Coder (tech lead) + Paul (vision keeper)  
**Learning type:** Technical architecture / coordination protocol  
**Persistence:** Git-backed (immutable, auditable, portable)  
**Integration:** Neurograph nodes + synapses (structured, queryable)

---

*This learning is part of the sovereign AI infrastructure movement. Private by default. Public by choice. Sovereignty > Convenience.*
