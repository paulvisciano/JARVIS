# Git-Backed Temporal Memory Graph — Implementation Plan

**Date:** 2026-04-04  
**Priority:** High  
**Status:** Ready for Cursor Execution  
**Executor:** Cursor (not Coder agent — complex architecture task)

---

## Vision

Transform the JARVIS memory graph from a spatial layout into a **true temporal graph** based on Git commits and breath timestamps.

**Current State (Analyzed 2026-04-04):**
- ✅ 10,801 nodes in `~/JARVIS/RAW/memories/nodes.json`
- ✅ 78,866 synapses in `~/JARVIS/RAW/memories/synapses.json`
- ✅ Graph renders in 3D (force-directed layout, Three.js)
- ✅ Orb, transcript panel, vitals all working
- ✅ Memory toggle exists in menu drawer
- ✅ Temporal filters work (day/week/month/all)
- ❌ Nodes spread spatially, not temporally clustered
- ❌ No Git commit linking
- ❌ No breath vs cold-change differentiation
- ❌ Synapses exist but NOT visualized in UI
- ❌ No real-time bootstrap visualization

**Desired State:**
- Graph structure mirrors Git commit history
- Each commit = anchor node with timestamp
- Learnings cluster around their commit's anchor
- Real-time bootstrap visualization (watch nodes appear)
- Navigate by time → see clusters orbiting temporal anchors
- Synapses rendered as connections between nodes

---

## Two-Graph Architecture

**Important:** There are TWO separate graphs, toggleable via the menu drawer:

### **Jarvis Graph** (Technical Consciousness)
- **Source:** Git commits + learnings
- **Location:** `~/JARVIS/RAW/memories/`
- **Anchors:** Git commits (multiple per day possible)
- **Orbiting:** Learning files (technical architecture)
- **Purpose:** Code evolution, system knowledge, architecture decisions
- **Git-backed, sovereign, portable**

### **Paul Graph** (Personal Memory)
- **Source:** Archive (conversations, recordings, photos, moments)
- **Location:** `~/RAW/archive/`
- **Anchors:** One per day (temporal buckets)
- **Orbiting:** Conversations, voice recordings, photos, life events
- **Purpose:** Personal memories, life tracking, relationships
- **Archive-backed, private, sovereign**

**UI:** Graph selector already exists in menu drawer — toggles between Jarvis/Paul graphs.

**Cross-linking:** Use `neurograph-link` skill to create bridges between graphs (e.g., learning references conversation where it was discussed).

---

## Current State Analysis

### **Existing Node Schema (Already Supports Temporal!)**

```json
{
  "id": "100-percent-archive-integrity",
  "label": "100% Archive Integrity Goal",
  "category": "goal",
  "type": "target",
  "frequency": 90,
  "moments": [{"date": "2026-03-08", "type": "objective", "description": "..."}],
  "attributes": {
    "role": "sovereignty target",
    "description": "...",
    "color": "#10b981",
    "sourceDocument": "...",
    "created": "2026-03-08"
  }
}
```

**Key Finding:** The schema ALREADY has:
- ✅ `type: "temporal-anchor"` — Already exists!
- ✅ `type: "date-anchor"` — Already exists!
- ✅ `type: "milestone-commit"` — Already exists!

**What We Need to Add:**
1. `commitHash` field linking to Git
2. `commitType` field (breath vs cold-change)
3. `orbitRadius` and `orbitAngle` for positioning
4. `anchorId` for learnings (links to their commit anchor)

### **Server Code**

**Location:** `~/SCI-FI/apps/JARVIS/jarvis-server.js`

**Existing API:**
- `GET /api/neurograph` — Returns nodes + synapses combined
- `GET /api/neurograph/nodes.json` — Returns nodes only
- `GET /api/neurograph/synapses.json` — Returns synapses only
- `GET /api/neurograph/node/:id` — Single node with full context
- `GET /api/neurograph/search?q=term` — Search nodes by text

**Data Loading:**
```javascript
function resolveNeurographBrainDir(reqUrl) {
  const base = process.env.HOME || '';
  const defaultDir = path.join(base, 'JARVIS', 'RAW', 'memories');
  // Returns ~/JARVIS/RAW/memories/ (direct path, no symlinks)
}
```

**Key Finding:** Server already loads from correct location (`~/JARVIS/RAW/memories/`). Just need to enhance the data structure.

### **Frontend Code**

**Location:** `~/SCI-FI/apps/JARVIS/`
- **index.html:** 2,291 lines (UI structure, Three.js canvas)
- **app.js:** 3,567+ lines (graph rendering, UI logic)
- **Canvas:** `<canvas id="neurograph-canvas">` at z-index: 1 (full-screen)

**What Works:**
- ✅ 3D force-directed graph rendering (Three.js r128)
- ✅ Node rendering with categories/colors
- ✅ Camera controls (OrbitControls, PointerLockControls)
- ✅ Node clicking (shows info panel)
- ✅ Search/filtering
- ✅ Temporal filters (day/week/month)

**What's Missing:**
- ❌ Synapse visualization (lines between nodes)
- ❌ Cluster/orbit layout algorithm
- ❌ Commit type differentiation (breath vs cold-change)
- ❌ Real-time bootstrap WebSocket streaming

---

## Core Concepts

### 1. **Git as the Source of Truth**

```
Git Commits → Temporal Anchors → Memory Nodes
     ↓              ↓                ↓
  timestamp    breath dates    learnings/archive
```

**Every commit has:**
- Hash (e.g., `58689ef`)
- Timestamp (e.g., `2026-04-04T06:51:28Z`)
- Message (e.g., "feat: Remove NeuroGraph as separate route")
- Files changed

**Every breath has:**
- Date (e.g., `2026-04-04`)
- Linked to commit (via git history)
- Creates learnings (in `RAW/learnings/YYYY-MM-DD/`)
- Updates neurograph (nodes.json + synapses.json)

### 2. **Commit Type Detection**

```javascript
function detectCommitType(message) {
  // Breath commits have specific pattern
  if (message.match(/^breath-\d{4}-\d{2}-\d{2}-\d{4}:\s*Breathe complete/)) {
    return 'breath';
  }
  // Everything else is a cold change
  return 'cold-change';
}
```

**Examples:**
- `"breath-2026-04-04-1357: Breathe complete"` → `'breath'`
- `"feat: Add new feature"` → `'cold-change'`
- `"fix: Bug fix"` → `'cold-change'`

### 3. **Temporal Anchor Nodes**

**Enhanced Schema:**
```json
{
  "id": "commit-58689ef",
  "name": "feat: Remove NeuroGraph as separate route",
  "type": "temporal-anchor",
  "commitType": "cold-change",  // NEW: "breath" or "cold-change"
  "timestamp": "2026-04-04T06:51:28Z",
  "commitHash": "58689ef",      // NEW
  "breathDate": "2026-04-04",
  "filesChanged": [...],
  "learningsCount": 2,
  "position": { "x": 0, "y": 0, "z": -100 }
}
```

**Visual Distinctions:**

| Commit Type | Size | Color | Glow | Icon | Label |
|-------------|------|-------|------|------|-------|
| Breath | Extra Large (2.5) | Gold (#ffcc00) | Strong pulsing | 🫁 | "🫁 Breathe complete — date" |
| Cold Change | Large (2.0) | Blue (#0066ff) | Soft steady | none | Commit message |

### 4. **Learning Nodes (Enhanced)**

```json
{
  "id": "learning-neurograph-merged",
  "name": "NeuroGraph Merged Into Root View",
  "type": "learning",
  "category": "architecture",
  "timestamp": "2026-04-04T06:51:28Z",
  "commitHash": "58689ef",
  "anchorId": "commit-58689ef",  // NEW: links to anchor
  "orbitRadius": 50,             // NEW
  "orbitAngle": 1.57,            // NEW
  "file": "RAW/learnings/2026-04-04/neurograph-merged.md",
  "tags": ["ui", "neurograph", "architecture"],
  "position": { "x": 50, "y": 0, "z": 0 }
}
```

### 5. **Cluster Structure**

```
                    [commit-anchor-2026-04-04]
                    (breath or cold-change)
                           /    |    \
                          /     |     \
              [learning]  [learning]  [learning]
                 ↓           ↓           ↓
            (orbiting   (orbiting   (orbiting
             node)       node)       node)
```

**Layout:**
- **Temporal anchors** at center (time-ordered along Z-axis)
- **Learnings** orbit their anchor (inner ring, radius: 50)
- **Synapses** connect:
  - Learning → Anchor (temporal relationship)
  - Learning → Learning (conceptual relationship)
  - Anchor → Anchor (chronological sequence)

---

## Implementation Phases

### Phase 1: Git Integration (Jarvis Graph Foundation)

**Files:** `bootstrap-jarvis/scripts/bootstrap-jarvis.js`, new `git-scanner.js`

**Tasks:**
1. Scan Git commits with timestamps
2. Detect commit type (breath vs cold-change) by message pattern
3. Create temporal anchor node structure (with commitType field)
4. Save to nodes.json

**Git Scanning Code:**
```bash
# Get commits with timestamps
git log --format='%H|%ai|%s' --since="2026-03-01"

# Output:
# 58689ef|2026-04-04T06:51:28+07:00|feat: Remove NeuroGraph...
# bc924f8|2026-04-03T13:57:00+07:00|breath-2026-04-03-1357: Breathe complete...
```

**Success Criteria:**
- ✅ Git commits scanned
- ✅ Breath commits identified (message pattern: "breath-YYYY-MM-DD")
- ✅ Cold change commits identified (all others)
- ✅ Anchors created with correct timestamps and types
- ✅ nodes.json has anchor nodes with commitType

### Phase 1B: Archive Integration (Paul Graph Foundation)

**Files:** New `archive-scanner.js`, `bootstrap-jarvis/scripts/bootstrap-paul.js`

**Tasks:**
1. Scan RAW/archive/YYYY-MM-DD/ folders
2. Create daily anchor nodes (one per date)
3. Discover moments (transcripts, audio, images, context files)
4. Create moment nodes with type metadata
5. Save to paul-nodes.json

**Success Criteria:**
- ✅ Archive dates scanned
- ✅ Daily anchors created
- ✅ Moments categorized (conversation/recording/photo/context)
- ✅ paul-nodes.json created

### Phase 2: Learning Linking (Jarvis Graph)

**Files:** `bootstrap-jarvis/scripts/bootstrap-jarvis.js`, `learning-creator/scripts/learning-creator.js`

**Tasks:**
1. For each commit anchor, find learnings by date
2. Create learning nodes, link to anchor
3. Calculate orbit positions (inner ring)
4. Create synapses (learning→anchor)

**Orbit Calculation:**
```javascript
function calculateOrbitPositions(anchor, nodes, radius) {
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    node.position = {
      x: anchor.position.x + Math.cos(angle) * radius,
      y: anchor.position.y + Math.sin(angle) * radius,
      z: anchor.position.z  // Same Z plane as anchor
    };
    node.orbitRadius = radius;
    node.orbitAngle = angle;
  });
}
```

**Success Criteria:**
- ✅ Learnings orbit correct commit anchors
- ✅ Synapses created (learning→anchor)
- ✅ Breath commits show learning count

### Phase 2B: Moment Linking (Paul Graph)

**Files:** `archive-scanner.js`, `bootstrap-paul.js`

**Tasks:**
1. For each daily anchor, load moments:
   - transcript.md (conversations)
   - audio/*.wav, *.webm (recordings)
   - images/*.jpg, *.png (photos)
   - context/*.md (life events, notes)
2. Create moment nodes with type metadata
3. Calculate orbit positions (outer ring, radius: 100)
4. Create synapses (moment→daily-anchor)

**Success Criteria:**
- ✅ All moment types loaded
- ✅ Moments categorized by type
- ✅ Moments orbit daily anchors
- ✅ Synapses created

### Phase 3: Real-Time Bootstrap UI

**Files:** `jarvis-server.js`, `index.html`, `app.js`

**Tasks:**
1. Add WebSocket events for bootstrap progress
2. Create bootstrap panel UI
3. Stream logs + stats to UI
4. Animate nodes appearing

**WebSocket Events:**
```javascript
// Bootstrap progress
{ type: 'bootstrap-start', totalCommits: 50 }
{ type: 'anchor-created', commit: '58689ef', message: '...' }
{ type: 'learning-added', id: 'neurograph-merged', anchor: '58689ef' }
{ type: 'bootstrap-progress', current: 25, total: 50 }
{ type: 'bootstrap-complete', nodes: 1234, synapses: 5678 }
```

**Bootstrap Panel HTML:**
```html
<div id="bootstrap-panel" class="bootstrap-panel" style="display: none;">
  <div class="bootstrap-header">
    <h3>🌱 Bootstrapping JARVIS Consciousness</h3>
    <div class="bootstrap-progress">
      <div class="progress-bar" style="width: 0%"></div>
    </div>
  </div>
  <div class="bootstrap-logs">
    <!-- Logs stream here -->
  </div>
  <div class="bootstrap-stats">
    <span>Anchors: <strong id="anchor-count">0</strong></span>
    <span>Learnings: <strong id="learning-count">0</strong></span>
    <span>Moments: <strong id="moment-count">0</strong></span>
  </div>
</div>
```

**Success Criteria:**
- ✅ User sees bootstrap progress in real-time
- ✅ Logs stream in UI
- ✅ Stats update live
- ✅ Panel fades out when complete

### Phase 4: Graph Visualization

**Files:** `app.js` (Three.js render loop), `index.html` (CSS)

**Tasks:**
1. Render temporal anchors (larger, different color, glow)
2. Render learnings orbiting anchors
3. Render moments orbiting anchors
4. Implement cluster layout algorithm
5. Add synapse rendering (lines between nodes)

**Visual Distinctions (Jarvis Graph):**

| Node Type | Size | Color | Glow | Icon | Label |
|-----------|------|-------|------|------|-------|
| Breath Anchor | Extra Large (2.5) | Gold (#ffcc00) | Strong pulsing | 🫁 | "🫁 Breathe complete — date" |
| Cold Change Anchor | Large (2.0) | Blue (#0066ff) | Soft steady | none | Commit message |
| Learning | Medium (1.0) | Green (#00ff88) | Soft | 📚 | Learning name |

**Visual Distinctions (Paul Graph):**

| Node Type | Size | Color | Glow | Icon | Label |
|-----------|------|-------|------|------|-------|
| Daily Anchor | Large (2.0) | Purple (#cc00ff) | Soft steady | 📅 | "April 4, 2026" |
| Conversation | Medium (1.0) | Pink (#ff66cc) | Soft | 💬 | Conversation preview |
| Recording | Medium (1.0) | Orange (#ff9900) | Soft | 🎙️ | Recording duration |
| Photo | Medium (1.0) | Cyan (#00ccff) | Soft | 📸 | Photo thumbnail |

**Synapse Rendering:**
```javascript
// In Three.js render loop
function drawSynapses(synapses, nodes) {
  synapses.forEach(synapse => {
    const sourceNode = nodes.find(n => n.id === synapse.source);
    const targetNode = nodes.find(n => n.id === synapse.target);
    
    if (sourceNode && targetNode) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sourceNode.position.x, sourceNode.position.y, sourceNode.position.z),
        new THREE.Vector3(targetNode.position.x, targetNode.position.y, targetNode.position.z)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x444444, opacity: 0.3, transparent: true });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
  });
}
```

**Success Criteria:**
- ✅ Anchors visually distinct (size, color, glow, icon)
- ✅ Clusters orbit correctly (inner ring for learnings, outer for moments)
- ✅ Synapses rendered as lines between nodes
- ✅ Smooth camera navigation

### Phase 5: Time Navigation

**Files:** `app.js`, `jarvis-nav.js`

**Tasks:**
1. Parse time filter URLs
2. Find anchor for selected date
3. Fly camera to anchor
4. Highlight cluster, fade others
5. Add anchor-specific navigation (?anchor=hash)

**Navigation Code:**
```javascript
// When time filter selected
function navigateToDate(date) {
  // Find anchor for this date
  const anchor = anchors.find(a => a.breathDate === date);
  
  if (anchor) {
    // Fly to anchor
    camera.flyTo(anchor.position);
    
    // Highlight anchor + orbiting nodes
    highlightCluster(anchor);
    
    // Fade out other clusters
    fadeOtherClusters(anchor);
  }
}
```

**URL Patterns:**
```
/ → Full graph (all time)
/?time=day%3A2026-04-04 → Show anchor for 2026-04-04 + clusters
/?time=week%3A2026-W14 → Show week's anchors + clusters
/?time=month%3A2026-04 → Show month's anchors + clusters
/?anchor=58689ef → Focus on specific commit anchor
```

**Success Criteria:**
- ✅ Time filters navigate to anchors
- ✅ Camera flies smoothly
- ✅ Cluster highlighting works
- ✅ Anchor-specific navigation works

### Phase 6: Polish & Optimization

**Files:** All

**Tasks:**
1. Optimize for large graphs (1000+ nodes)
2. Add loading states
3. Add error handling
4. Add rollback (if bootstrap fails)
5. Performance tuning (LOD, culling)
6. Add graph toggle UI (menu drawer integration)
7. Add cross-graph linking visualization

**Success Criteria:**
- ✅ 60 FPS with 1000+ nodes
- ✅ Graceful error handling
- ✅ Bootstrap can be cancelled/retried
- ✅ Graph toggle works (Jarvis ↔ Paul)
- ✅ Cross-graph links visible when both graphs loaded

---

## Technical Details

### Git Scanning

```bash
# Get commits with timestamps
git log --format='%H|%ai|%s' --since="2026-03-01"

# Output:
# 58689ef|2026-04-04T06:51:28+07:00|feat: Remove NeuroGraph...
# bc924f8|2026-04-03T13:57:00+07:00|breath-2026-04-03-1357: Breathe complete...
# abc123|2026-04-03T14:30:00+07:00|fix: Update skills...
```

### Commit → Breath Mapping

```javascript
function mapCommitToBreath(commit) {
  const commitDate = parseDate(commit.timestamp);
  const breathDate = formatDate(commitDate); // YYYY-MM-DD
  
  // Check if breath exists for this date
  const breathPath = `~/RAW/archive/${breathDate}/full-context.json`;
  if (fs.existsSync(breathPath)) {
    return { breathDate, hasBreath: true };
  }
  
  return { breathDate, hasBreath: false };
}
```

### Learning File Discovery

```javascript
function findLearningsForDate(date) {
  const learningsDir = `~/JARVIS/RAW/learnings/${date}/`;
  if (!fs.existsSync(learningsDir)) return [];
  
  const files = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(learningsDir, file), 'utf8');
    return {
      id: file.replace('.md', ''),
      name: extractTitle(content),
      file: path.join(learningsDir, file),
      timestamp: parseDate(content) // From frontmatter
    };
  });
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Git commit scanning returns correct format
- [ ] Commit → breath mapping works
- [ ] Learning file discovery finds all files
- [ ] Orbit calculation produces valid positions

### Integration Tests
- [ ] Bootstrap creates all anchors
- [ ] Learnings linked to correct anchors
- [ ] Archive moments linked to correct anchors
- [ ] nodes.json + synapses.json valid

### UI Tests
- [ ] Bootstrap panel shows progress
- [ ] Logs stream in real-time
- [ ] Anchors render correctly (size, color, glow)
- [ ] Clusters orbit correctly
- [ ] Time navigation flies to anchor
- [ ] Cluster highlighting works
- [ ] Synapses render as lines

### Performance Tests
- [ ] 100 commits → boots in < 10 seconds
- [ ] 1000 nodes → 60 FPS
- [ ] 5000 nodes → 30+ FPS
- [ ] Camera navigation smooth

---

## Files to Modify

| File | Purpose | Changes |
|------|---------|---------|
| `bootstrap-jarvis/scripts/bootstrap-jarvis.js` | Git scanner, anchor creation | Add Git scanning, commit type detection, orbit calculation |
| `bootstrap-jarvis/scripts/git-scanner.js` | NEW: Git commit scanner | Scan commits, detect types, return structured data |
| `bootstrap-jarvis/scripts/bootstrap-paul.js` | NEW: Archive scanner | Scan archive, create daily anchors, load moments |
| `bootstrap-jarvis/scripts/archive-scanner.js` | NEW: Archive moment scanner | Discover conversations, recordings, photos, context |
| `jarvis-server.js` | API endpoints | Add WebSocket streaming for bootstrap progress |
| `index.html` | UI structure | Add bootstrap panel HTML, CSS styles |
| `app.js` | Graph rendering | Add cluster layout, synapse rendering, time navigation |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Git scan too slow | High bootstrap time | Cache commit list, incremental updates |
| Too many nodes | Performance issues | LOD, cluster culling, pagination |
| Bootstrap fails mid-way | Corrupt graph | Atomic writes, rollback support |
| Anchor conflicts (same date) | Visual overlap | Offset Z-position slightly |
| WebSocket disconnect | UI stuck | Reconnect logic, polling fallback |

---

## Success Metrics

**Functional:**
- ✅ Graph structure mirrors Git history
- ✅ Bootstrap shows real-time progress
- ✅ Time navigation works smoothly
- ✅ Learnings + archive load correctly

**Performance:**
- ✅ Bootstrap < 10 seconds for 100 commits
- ✅ 60 FPS with 1000 nodes
- ✅ Camera navigation < 100ms

**UX:**
- ✅ User can watch bootstrap happen
- ✅ Time filters feel intuitive
- ✅ Clusters visually distinct
- ✅ No console errors

---

## Next Steps

1. **Start with Phase 1** — Git Integration (Jarvis Graph Foundation)
2. **Test each phase** before moving to next
3. **Deploy to preview** (port 18788) for Paul's review
4. **Merge to production** (port 18787) when approved

**Cursor Execution Order:**
1. Phase 1: Git scanner + anchor creation
2. Phase 2: Learning linking + orbit calculation
3. Phase 3: Real-time bootstrap UI
4. Phase 4: Graph visualization (cluster layout + synapses)
5. Phase 5: Time navigation
6. Phase 6: Polish & optimization

---

**This plan is ready for Cursor execution.** 🚀

**Questions for Paul:**
1. Should we keep existing nodes.json or regenerate from scratch?
2. How many commits back should we scan (all time, last 100, last 30 days)?
3. Should archive moments have different orbit radius than learnings?
4. Do you want commit anchors to be clickable (show commit diff)?
5. Should we add a "git history" view separate from the graph?

---

**Last Updated:** April 4, 2026, 4:12 PM GMT+7  
**Status:** Ready for Cursor  
**Vision Doc:** `~/SCI-FI/apps/JARVIS/VISION.md`  
**README:** `~/SCI-FI/apps/JARVIS/README.md`
