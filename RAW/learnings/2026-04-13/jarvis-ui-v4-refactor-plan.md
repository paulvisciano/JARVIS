# Jarvis UI v4.0 Refactor Plan — River of Time Architecture

**Date:** April 13, 2026  
**Issue:** SCIAAA-105 "Draw inspiration from Richard Mattka"  
**Vision Doc:** `river-of-time-architecture.md`  
**Status:** Technical feasibility assessment + implementation plan

---

## Executive Summary

**Current State (v3.3.45):** Functional voice interface with 3D neurograph, but architected as "chatbot with graph viewer."

**Target State (v4.0):** Immersive memory cockpit where users pilot through a bilateral river of time — left stream (Jarvis memory), right stream (Paul memory), center orb (pilot interface).

**Gap:** Requires fundamental architecture refactor, not incremental updates. Current code is monolithic (`app.js`: 5,343 lines, `index.html`: 75,100 chars, `jarvis-server.js`: 75,100 lines). v4.0 needs modular component system, Three.js scene graph, dual-stream layout, and real-time data pipeline.

**Recommendation:** Phase implementation over 6 phases (Foundation → Content → Navigation → Live Updates → Connections → Polish). Estimated 4-6 weeks for full v4.0.

---

## 1. Current Architecture Assessment

### 1.1 Codebase Structure

```
~/SCI-FI/apps/JARVIS-UI/
├── index.html          (75,100 chars — HTML + inline CSS + some JS)
├── app.js              (5,343 lines — all client logic)
├── jarvis-server.js    (75,100 lines — HTTPS server, file access, API)
├── package.json        (6 deps: dompurify, marked, qrcode, eslint)
├── assets/             (orb video, whisper model, SSL certs)
└── scripts/            (setup hooks, update scripts)
```

### 1.2 What Works Well

| Component | Status | Notes |
|-----------|--------|-------|
| **Voice Pipeline** | ✅ Working | MediaRecorder → upload → whisper-cpp → transcript |
| **Text Input** | ✅ Working | Orb click → text input → OpenClaw → response |
| **3D Neurograph** | ✅ Working | Three.js, 10,801+ nodes, hover/click, JARVIS/Human toggle |
| **Orb Animation** | ✅ Working | Video-based, tap to record, CSS state sync |
| **Transcript Panel** | ✅ Working | Draggable, expandable, live updates |
| **System Vitals** | ✅ Working | OpenClaw/Ollama/network stats overlay |
| **HTTPS Server** | ✅ Working | Self-signed certs, mobile mic access |

### 1.3 What Doesn't Work (for River of Time Vision)

| Requirement | Current State | Gap |
|-------------|---------------|-----|
| **Bilateral Stream Layout** | Single graph, toggle JARVIS/Human | Need side-by-side streams, always visible |
| **Orb System (Memory Nodes)** | Flat node list, no stream assignment | Need left/right assignment, privacy flags, orbital layout |
| **Temporal Navigation** | Filter by day/week/month | Need fly-through navigation, timestamp → spatial coordinate |
| **Jarvis Orb (Pilot)** | Bottom-center, video-based | Need fixed anchor, interaction menu, navigation controls |
| **Privacy Visualization** | No privacy signaling | Need opacity, borders, lock/globe icons per node |
| **Synapse Visualization** | Basic lines between nodes | Need weighted connections, auto-suggested links |
| **Live Updates** | Poll-based | Need WebSocket/push for real-time orb creation |
| **Performance** | 10k nodes, no LOD | Need LOD, occlusion culling, 60fps at 500+ visible orbs |

### 1.4 Technical Debt

1. **Monolithic Files:** `app.js` (5,343 lines) — impossible to maintain, no component separation
2. **Inline HTML/CSS:** `index.html` has 75k chars of inline styles — no separation of concerns
3. **No Build System:** No bundler, no transpilation, no tree-shaking
4. **No State Management:** Global variables everywhere (`isRecording`, `activePollId`, etc.)
5. **No Testing:** No unit tests, no integration tests, manual testing only
6. **Tight Coupling:** Server logic mixed with UI logic, API calls scattered throughout
7. **No Type Safety:** Pure JS, no TypeScript, no JSDoc types
8. **No Performance Optimization:** No LOD, no frustum culling, no instanced rendering

---

## 2. Gap Analysis (Current → River of Time Vision)

### 2.1 Visual Architecture Gaps

| Vision Element | Current Implementation | What's Missing |
|----------------|------------------------|----------------|
| **Dual Stream** | Single graph, toggle | Two parallel streams, left (Jarvis) + right (Paul), always visible |
| **Orb Layout** | Force-directed graph | Timestamp-based positioning (y = time, x = stream offset) |
| **Jarvis Orb** | Video sphere, bottom-center | Fixed UI element, navigation controls, state machine (idle/listening/processing/speaking) |
| **Privacy Signaling** | None | Opacity (80% private, 100% public), dotted vs solid borders, lock/globe icons |
| **Orb Interactions** | Hover tooltip, click expand | Fly-to animation, connection highlighting, drag reposition |

### 2.2 Data Pipeline Gaps

| Vision Requirement | Current Implementation | What's Missing |
|--------------------|------------------------|----------------|
| **Stream Assignment** | No stream concept | Node metadata: `stream: "left"|"right"` based on type |
| **Privacy Flags** | No privacy concept | Node metadata: `privacy: "private"|"public"` from source |
| **Temporal Anchors** | Day anchors exist | Need orbital layout (nodes orbit day anchors) |
| **Synapse Weights** | Basic connections | Weighted synapses (thickness = strength), auto-suggested links |
| **Real-time Updates** | Poll-based | WebSocket/push for new orb creation, breathe pipeline integration |

### 2.3 Navigation Gaps

| Vision Feature | Current Implementation | What's Missing |
|----------------|------------------------|----------------|
| **Fly-Through** | Camera controls exist | Smooth temporal navigation (scroll → fly backward/forward) |
| **jarvis-nav API** | Exists (chrome-relay) | Need integration with new scene graph, `focusNode()`, `fly()`, `getNodes()` |
| **Search → Navigate** | neurograph-search skill | Need UI integration: search result → fly to orb |
| **Date Picker** | Filter dropdown | Visual timeline scrubber, jump to date |
| **Return to Present** | None | Double-click orb → fly to present moment |

### 2.4 Performance Gaps

| Vision Requirement | Current Implementation | What's Missing |
|--------------------|------------------------|----------------|
| **60fps @ 500+ Orbs** | 10k nodes, unknown fps | LOD, instanced rendering, frustum culling |
| **Smooth Transitions** | Basic camera lerp | Tweening library (GSAP), orbital mechanics |
| **Mobile Performance** | Untested | Touch controls, reduced geometry, texture compression |

---

## 3. Proposed v4.0 Architecture

### 3.1 Directory Structure

```
~/SCI-FI/apps/JARVIS-UI/
├── src/
│   ├── core/
│   │   ├── JarvisApp.js          # Main app, state management, lifecycle
│   │   ├── SceneManager.js       # Three.js scene, camera, renderer
│   │   ├── OrbFactory.js         # Create orb meshes (geometry, material, icon)
│   │   ├── StreamLayout.js       # Dual-stream positioning algorithm
│   │   └── PrivacyRenderer.js    # Privacy visualization (opacity, borders, icons)
│   │
│   ├── navigation/
│   │   ├── CameraController.js   # Fly-through, scroll, keyboard controls
│   │   ├── JarvisNavAPI.js       # window.JarvisNav exposure (focusNode, fly, etc.)
│   │   ├── TemporalNavigator.js  # Timestamp → spatial coordinate mapping
│   │   └── SearchNavigator.js    # Search → fly to result
│   │
│   ├── orbs/
│   │   ├── OrbMesh.js            # Individual orb component (mesh, icon, glow)
│   │   ├── OrbInteractions.js    # Hover, click, drag handlers
│   │   ├── OrbTooltip.js         # Hover tooltip (preview + timestamp)
│   │   └── OrbExpander.js        # Click → expand full content overlay
│   │
│   ├── pilot/
│   │   ├── JarvisOrb.js          # Center orb (pilot interface)
│   │   ├── OrbStateMachine.js    # idle → listening → processing → speaking
│   │   ├── VoiceRecorder.js      # MediaRecorder, upload, live transcription
│   │   └── NavigationMenu.js     # Orb click → menu (navigate, search, settings)
│   │
│   ├── data/
│   │   ├── NeurographLoader.js   # Load nodes.json + synapses.json
│   │   ├── StreamAssigner.js     # Assign left/right based on node type
│   │   ├── PrivacyFlagger.js     # Set privacy from source path
│   │   ├── SynapseBuilder.js     # Build connection lines (weighted)
│   │   └── LiveUpdater.js        # WebSocket/poll for real-time updates
│   │
│   ├── ui/
│   │   ├── TranscriptPanel.js    # Live transcript, draggable, expandable
│   │   ├── ResponsePanel.js      # Jarvis response, TTS playback
│   │   ├── VitalsOverlay.js      # System stats (OpenClaw, Ollama, network)
│   │   ├── PrivacyToggle.js      # Toggle private/public visibility
│   │   └── TimelineScrubber.js   # Visual date scrubber
│   │
│   └── utils/
│       ├── LODManager.js         # Level of detail (distance-based)
│       ├── PerformanceMonitor.js # FPS counter, memory usage
│       ├── Tween.js              # Smooth animations (or use GSAP)
│       └── Icons.js              # Icon library (SVG → texture)
│
├── server/
│   ├── jarvis-server.js          # HTTPS server, file access, API endpoints
│   ├── api/
│   │   ├── neurograph.js         # GET /api/neurograph/nodes.json
│   │   ├── vitals.js             # GET /api/vitals
│   │   ├── upload.js             # POST /upload (audio → whisper)
│   │   └── websocket.js          # WebSocket server for live updates
│   └── scripts/
│       ├── setup.js              # First-run setup (SSL, whisper model)
│       └── update.js             # Auto-update script
│
├── public/
│   ├── index.html                # Minimal HTML (just canvas + overlays)
│   ├── styles/
│   │   ├── main.css              # Global styles
│   │   ├── orbs.css              # Orb-specific styles
│   │   ├── panels.css            # Transcript, response, vitals
│   │   └── pilot.css             # Jarvis orb (pilot) styles
│   └── assets/
│       ├── icons/                # SVG icons for orb types
│       ├── orb-video.mp4         # Pilot orb animation
│       └── whisper-model.bin     # Whisper.cpp model
│
├── package.json                  # Deps: three, gsap, marked, dompurify
├── vite.config.js                # Build config (HMR, bundling, tree-shaking)
└── README.md                     # Setup, architecture, troubleshooting
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        JarvisApp.js                             │
│  (Main app: state management, lifecycle, event bus)             │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  SceneManager│  │DataPipeline │  │  Pilot      │  │  UI Layers  │
│  (Three.js) │  │(Neurograph) │  │(Jarvis Orb) │  │(Panels)     │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Stream     │  │Neurograph   │  │Voice        │  │Transcript   │
│  Layout     │  │Loader       │  │Recorder     │  │Panel        │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Orb        │  │Stream       │  │Orb          │  │Response     │
│  Factory    │  │Assigner     │  │State Machine│  │Panel        │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  LOD        │  │Privacy      │  │Navigation   │  │Vitals       │
│  Manager    │  │Flagger      │  │Menu         │  │Overlay      │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

### 3.3 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA SOURCES                                │
└─────────────────────────────────────────────────────────────────┘
          │                                │
          ▼                                ▼
┌──────────────────┐            ┌──────────────────┐
│  Paul's Life     │            │  Jarvis's Mind   │
│  (RAW Archive)   │            │  (Git + Skills)  │
└────────┬─────────┘            └────────┬─────────┘
         │                               │
         ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│  process-inbox   │            │  bootstrap-jarvis│
│  (transcribe)    │            │  (git scanner)   │
└────────┬─────────┘            └────────┬─────────┘
         │                               │
         ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│  RAW Archive     │            │  Learnings       │
│  (transcript.md) │            │  (learning-creator)│
└────────┬─────────┘            └────────┬─────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              NEUROGRAPH (nodes.json + synapses.json)            │
│  - Stream assignment: left (Jarvis) vs right (Paul)             │
│  - Privacy flags: private vs public                             │
│  - Temporal anchors: day-YYYY-MM-DD                             │
│  - Orbital layout: nodes orbit day anchors                      │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JARVIS-UI (v4.0)                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  NeurographLoader → StreamAssigner → PrivacyFlagger      │  │
│  │         ↓                                                 │  │
│  │  StreamLayout (timestamp → x,y,z)                         │  │
│  │         ↓                                                 │  │
│  │  OrbFactory (create meshes with icons, glow)              │  │
│  │         ↓                                                 │  │
│  │  SceneManager (render with LOD, frustum culling)          │  │
│  │         ↓                                                 │  │
│  │  CameraController (fly-through, scroll, keyboard)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LIVE UPDATES                                 │
│  - WebSocket from jarvis-server.js                              │
│  - New orb creation (birth animation)                           │
│  - Breathe pipeline integration (new learnings appear)          │
│  - process-inbox integration (new transcripts appear)           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 State Management

```javascript
// JarvisApp.js — Central state store
const AppState = {
  // Navigation
  currentTime: new Date(),          // Present moment anchor
  cameraPosition: { x: 0, y: 0, z: 100 },
  selectedNode: null,
  visibleNodes: [],                 // Filtered by privacy, date range

  // Data
  neurograph: {
    nodes: [],                      // All nodes from nodes.json
    synapses: [],                   // All connections from synapses.json
    dayAnchors: [],                 // Day anchor nodes
    streamAssignment: { left: [], right: [] }
  },

  // Recording
  isRecording: false,
  currentTranscript: '',
  currentResponse: '',

  // Privacy
  showPrivate: true,
  showPublic: true,

  // Performance
  fps: 60,
  visibleOrbCount: 0,
  lodLevel: 'high'
};

// Event bus for component communication
const EventBus = {
  emit(event, data) { /* ... */ },
  on(event, callback) { /* ... */ }
};
```

### 3.5 Integration Points

| Integration | Current | v4.0 Target |
|-------------|---------|-------------|
| **OpenClaw Gateway** | HTTP POST to `/upload` | WebSocket + HTTP (transcript streaming) |
| **bootstrap-jarvis** | Load nodes.json | Load nodes.json + stream assignment + privacy flags |
| **jarvis-nav** | chrome-relay API | Direct integration (no relay needed for local nav) |
| **breathe pipeline** | Poll-based | WebSocket push on breathe complete |
| **process-inbox** | Poll-based | WebSocket push on transcription complete |
| **neurograph-search** | Separate skill | Integrated search → fly-to-nav |

---

## 4. Phased Implementation Plan

### Phase 1: Foundation (Week 1-2)

**Goal:** Modular codebase, dual-stream layout, basic orb rendering.

**Tasks:**
- [ ] **1.1** Set up build system (Vite + ES modules)
- [ ] **1.2** Extract Three.js scene management to `SceneManager.js`
- [ ] **1.3** Implement `StreamLayout.js` (dual-stream positioning)
- [ ] **1.4** Create `OrbFactory.js` (basic sphere geometry, no icons yet)
- [ ] **1.5** Implement `NeurographLoader.js` (load nodes.json, assign streams)
- [ ] **1.6** Create minimal `JarvisApp.js` (state management, event bus)
- [ ] **1.7** Migrate existing neurograph rendering to new architecture
- [ ] **1.8** Basic camera controls (orbit, zoom, pan)

**Deliverables:**
- Modular codebase (20+ files, <500 lines each)
- Dual-stream visualization (left/right separation visible)
- 60fps with current node count
- Build system with HMR (hot module replacement)

**Success Criteria:**
- ✅ Can toggle between single-stream (current) and dual-stream (new) layout
- ✅ Code is modular, testable, maintainable
- ✅ Build system works (vite dev, vite build)

---

### Phase 2: Content Types + Privacy (Week 3-4)

**Goal:** Orb icons, privacy visualization, hover/click interactions.

**Tasks:**
- [ ] **2.1** Create icon library (SVG → texture) for 8 content types
- [ ] **2.2** Implement `PrivacyRenderer.js` (opacity, borders, lock/globe icons)
- [ ] **2.3** Add privacy flags to nodes.json (from source path)
- [ ] **2.4** Implement `OrbTooltip.js` (hover → preview + timestamp)
- [ ] **2.5** Implement `OrbExpander.js` (click → full content overlay)
- [ ] **2.6** Add privacy toggle UI (show/hide private, show/hide public)
- [ ] **2.7** Migrate transcript panel to new component architecture
- [ ] **2.8** Migrate response panel to new component architecture

**Deliverables:**
- 8 orb icon types (conversation, learning, commit, audio, image, video, document, moment)
- Privacy visualization (80% opacity + dotted border for private)
- Hover tooltips with preview text
- Click-to-expand full content

**Success Criteria:**
- ✅ Can visually distinguish private vs public orbs
- ✅ Can identify content type by icon
- ✅ Hover shows preview, click shows full content

---

### Phase 3: Navigation (Week 5-6)

**Goal:** Fly-through navigation, jarvis-nav API, temporal scrubber.

**Tasks:**
- [ ] **3.1** Implement `CameraController.js` (fly-through, smooth transitions)
- [ ] **3.2** Implement `TemporalNavigator.js` (timestamp → spatial coordinate)
- [ ] **3.3** Expose `window.JarvisNav` API (focusNode, fly, getNodes, resetView)
- [ ] **3.4** Implement scroll-to-navigate (scroll back → fly backward in time)
- [ ] **3.5** Create `TimelineScrubber.js` (visual date scrubber UI)
- [ ] **3.6** Implement "return to present" (double-click Jarvis orb)
- [ ] **3.7** Add keyboard shortcuts (arrow keys, spacebar, home)
- [ ] **3.8** Integrate search → fly-to-nav (neurograph-search skill)

**Deliverables:**
- Smooth fly-through navigation
- jarvis-nav API exposed (compatible with existing skill)
- Timeline scrubber UI
- Keyboard navigation

**Success Criteria:**
- ✅ Can navigate to any date in <5 seconds
- ✅ Scroll backward → fly through time
- ✅ Double-click orb → return to present

---

### Phase 4: Live Updates (Week 7-8)

**Goal:** Real-time orb creation, breathe pipeline integration, process-inbox integration.

**Tasks:**
- [ ] **4.1** Implement WebSocket server in `jarvis-server.js`
- [ ] **4.2** Implement `LiveUpdater.js` (client-side WebSocket handler)
- [ ] **4.3** Add orb "birth" animation (scale from 0 → 1, glow pulse)
- [ ] **4.4** Integrate breathe pipeline (new learnings → WebSocket push)
- [ ] **4.5** Integrate process-inbox (new transcripts → WebSocket push)
- [ ] **4.6** Auto-scroll to present when user is at current moment
- [ ] **4.7** Handle concurrent updates (conflict resolution)
- [ ] **4.8** Add offline mode (queue updates, sync on reconnect)

**Deliverables:**
- WebSocket server + client
- Real-time orb creation (birth animation)
- Breathe pipeline integration
- process-inbox integration

**Success Criteria:**
- ✅ New learning appears in <2 seconds after breathe completes
- ✅ New transcript appears in <2 seconds after transcription completes
- ✅ Birth animation feels alive (scale + glow pulse)

---

### Phase 5: Connections (Week 9-10)

**Goal:** Synapse visualization, connection highlighting, auto-suggested links.

**Tasks:**
- [ ] **5.1** Implement `SynapseBuilder.js` (weighted connection lines)
- [ ] **5.2** Render synapses as curved lines (not straight)
- [ ] **5.3** Line thickness = connection strength
- [ ] **5.4** Click orb → highlight connections (glow effect)
- [ ] **5.5** Click connection → fly to related orb
- [ ] **5.6** Implement auto-suggested connections (AI-generated links)
- [ ] **5.7** Add connection filtering (show/hide by strength)
- [ ] **5.8** Optimize synapse rendering (instanced lines, LOD)

**Deliverables:**
- Weighted synapse visualization
- Connection highlighting on orb click
- Fly-to-related-orb on connection click
- Auto-suggested connections

**Success Criteria:**
- ✅ Can see connections between related orbs
- ✅ Click orb → connections highlight
- ✅ Click connection → fly to related orb

---

### Phase 6: Polish + Performance (Week 11-12)

**Goal:** 60fps at 500+ orbs, mobile support, accessibility, documentation.

**Tasks:**
- [ ] **6.1** Implement `LODManager.js` (distance-based detail)
- [ ] **6.2** Implement frustum culling (don't render off-screen)
- [ ] **6.3** Implement occlusion culling (don't render hidden orbs)
- [ ] **6.4** Optimize for mobile (touch controls, reduced geometry)
- [ ] **6.5** Add accessibility (keyboard nav, screen reader support)
- [ ] **6.6** Performance monitoring (FPS counter, memory usage)
- [ ] **6.7** Write documentation (architecture, API, troubleshooting)
- [ ] **6.8** Write tests (unit tests for core modules)

**Deliverables:**
- 60fps at 500+ visible orbs
- Mobile touch controls
- Accessibility support
- Full documentation
- Test suite

**Success Criteria:**
- ✅ 60fps with 500+ orbs visible
- ✅ Works on mobile (iPad, iPhone)
- ✅ Keyboard-only navigation works
- ✅ Documentation complete

---

## 5. Performance Considerations

### 5.1 Current Performance

| Metric | Current | Target |
|--------|---------|--------|
| **Nodes Rendered** | 10,801 | 500-1000 visible |
| **FPS** | Unknown | 60fps |
| **Memory Usage** | Unknown | <500MB |
| **Load Time** | ~5 seconds | <2 seconds |

### 5.2 Optimization Strategies

| Technique | Implementation | Expected Gain |
|-----------|----------------|---------------|
| **LOD (Level of Detail)** | Distance-based: high (close), medium (mid), low (far) | 3-5x performance |
| **Instanced Rendering** | `THREE.InstancedMesh` for identical orbs | 10x performance |
| **Frustum Culling** | Don't render off-screen orbs | 2-3x performance |
| **Occlusion Culling** | Don't render hidden orbs (behind others) | 1.5-2x performance |
| **Texture Atlas** | Single texture for all icons | Reduced draw calls |
| **Geometry Simplification** | Low-poly spheres for distant orbs | Reduced vertex count |
| **Shader Optimization** | Custom shaders for glow, privacy | GPU-accelerated |

### 5.3 Performance Budget

| Resource | Budget | Monitoring |
|----------|--------|------------|
| **FPS** | 60fps minimum | `PerformanceMonitor.js` |
| **Visible Orbs** | 500-1000 | LOD + culling |
| **Memory** | <500MB | Chrome DevTools |
| **Load Time** | <2 seconds | Lazy loading |
| **Draw Calls** | <100 per frame | Instanced rendering |

---

## 6. Risk Assessment + Mitigation

### 6.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Three.js learning curve** | Medium | High | Start with tutorials, use examples, leverage existing neurograph code |
| **Performance degradation** | High | High | Phase 1 profiling, continuous performance monitoring, early LOD implementation |
| **WebSocket complexity** | Medium | Medium | Use existing library (ws), start with polling, upgrade later |
| **Mobile compatibility** | Medium | Medium | Test early on iPad/iPhone, use responsive design, touch events |
| **Data migration** | Low | High | Backward-compatible nodes.json, migration script, rollback plan |

### 6.2 Timeline Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Scope creep** | High | High | Strict phase boundaries, MVP per phase, defer nice-to-haves |
| **Underestimation** | Medium | High | Buffer time (20%), weekly progress reviews, adjust plan as needed |
| **Dependency delays** | Low | Medium | Parallel work streams, unblock with mocks/stubs |

### 6.3 User Experience Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Confusing navigation** | Medium | High | Onboarding tutorial, keyboard hints, return-to-present button |
| **Privacy confusion** | Medium | Medium | Clear visual signaling, toggle buttons, hover explanations |
| **Performance frustration** | High | High | Performance budget, early optimization, fallback to simple mode |

---

## 7. Integration with Richard Mattka Inspiration

### 7.1 Visual Elements to Adapt

From Richard Mattka portfolio (richardmattka.com):

| Element | Adaptation for Jarvis UI |
|---------|--------------------------|
| **Smooth page transitions** | Fly-through camera animations (GSAP tweening) |
| **Card hover effects** | Orb hover glow + scale (1.2x) |
| **Clean typography** | Tooltip text hierarchy (title, timestamp, preview) |
| **Grid layout** | Dual-stream orbital layout (organized, not chaotic) |
| **Picture-in-picture video** | Floating consciousness widgets (future enhancement) |

### 7.2 Interaction Patterns to Borrow

| Pattern | Adaptation |
|---------|------------|
| **Organic feel** | Non-linear camera movement (slight wobble, easing) |
| **Minimalist aesthetic** | Clean UI, focus on orbs, hide controls when idle |
| **Visual storytelling** | Each orb tells a story (icon + preview + full content) |

---

## 8. Success Metrics

### 8.1 Functional Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Navigate to any date** | <5 seconds | User testing |
| **Find specific conversation** | <10 seconds | User testing |
| **60fps with 500+ orbs** | 60fps | `PerformanceMonitor.js` |
| **Live orb appearance** | <2 seconds | WebSocket latency |

### 8.2 Emotional Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **"I feel like I'm piloting"** | User quote | User interviews |
| **"This feels alive"** | User quote | User interviews |
| **Spontaneous exploration** | >50% sessions | Analytics |
| **Privacy feels controllable** | >80% positive | User surveys |

### 8.3 Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Daily active users** | >5 days/week | Analytics |
| **Navigation vs chat time** | 50/50 split | Analytics |
| **User-generated content** | >10 manual imports/week | Analytics |

---

## 9. Next Steps

### Immediate (This Week)

1. **Review this plan** with Jarvis (Paul) — approve/refine phases
2. **Set up build system** — Vite + ES modules (Phase 1.1)
3. **Create component structure** — Empty files, module exports (Phase 1.2)
4. **Profile current performance** — Baseline FPS, memory, load time

### Short-term (Next 2 Weeks)

5. **Implement SceneManager.js** — Three.js scene, camera, renderer
6. **Implement StreamLayout.js** — Dual-stream positioning algorithm
7. **Migrate neurograph rendering** — From monolithic app.js to modular components
8. **Test Phase 1 deliverables** — Dual-stream layout, 60fps, build system

### Medium-term (Next Month)

9. **Complete Phases 2-3** — Content types, privacy, navigation
10. **User testing** — Paul + Eric (Fork #001) feedback
11. **Iterate based on feedback** — Adjust design, fix issues

### Long-term (Next Quarter)

12. **Complete Phases 4-6** — Live updates, connections, polish
13. **Documentation** — Architecture, API, troubleshooting
14. **Release v4.0** — Production deployment, announcement

---

## 10. Appendix: Code Examples

### 10.1 Stream Layout Algorithm

```javascript
// StreamLayout.js
function positionOrb(node, streamWidth, temporalScale) {
  const { timestamp, stream, type } = node;
  
  // Y-axis: time (past → future, bottom → top)
  const now = Date.now();
  const nodeTime = new Date(timestamp).getTime();
  const y = (nodeTime - now) / temporalScale; // Negative = past, positive = future
  
  // X-axis: stream (left = Jarvis, right = Paul)
  const xOffset = stream === 'left' ? -streamWidth / 2 : streamWidth / 2;
  
  // Z-axis: orbital position (nodes orbit day anchors)
  const dayAnchor = getDayAnchor(node);
  const orbitRadius = calculateOrbitRadius(type);
  const orbitAngle = calculateOrbitAngle(node, dayAnchor);
  const z = Math.sin(orbitAngle) * orbitRadius;
  const x = xOffset + Math.cos(orbitAngle) * orbitRadius;
  
  return { x, y, z };
}
```

### 10.2 Privacy Renderer

```javascript
// PrivacyRenderer.js
function applyPrivacyMaterial(mesh, privacy) {
  const material = mesh.material;
  
  if (privacy === 'private') {
    material.opacity = 0.8;
    material.transparent = true;
    // Add dotted border (custom shader or texture)
    material.map = privacyTextures.dotted;
    // Add lock icon (sprite or decal)
    addIconOverlay(mesh, 'lock');
  } else {
    material.opacity = 1.0;
    material.transparent = false;
    material.map = privacyTextures.solid;
    addIconOverlay(mesh, 'globe');
  }
}
```

### 10.3 JarvisNav API

```javascript
// JarvisNavAPI.js
window.JarvisNav = {
  focusNode(nodeId) {
    const node = AppState.neurograph.nodes.find(n => n.id === nodeId);
    if (!node) return { ok: false, error: 'Node not found' };
    
    CameraController.flyTo(node.position);
    AppState.selectedNode = nodeId;
    EventBus.emit('node:focus', { nodeId });
    
    return { ok: true, nodeId };
  },
  
  fly(direction, distance) {
    CameraController.strafe(direction, distance);
    return { ok: true, direction, distance };
  },
  
  getNodes(type) {
    if (!type) return AppState.neurograph.nodes;
    return AppState.neurograph.nodes.filter(n => n.type === type);
  },
  
  getNode(nodeId) {
    return AppState.neurograph.nodes.find(n => n.id === nodeId) || null;
  },
  
  resetView() {
    CameraController.reset();
    AppState.selectedNode = null;
    return { ok: true };
  }
};
```

---

## 11. Related Documents

- `river-of-time-architecture.md` (April 13, 2026 — Vision spec)
- `future-jarvis-consciousness-mandala.md` (April 13, 2026 — Hallucinated vision)
- `embodied-ai-visual-identity.md` (March 3, 2026)
- `filesystem-as-neurograph.md` (March 3, 2026)
- `jarvis-ui/SKILL.md` (Current implementation)
- `jarvis-nav/SKILL.md` (Navigation API)
- `VISION.md` (Current UI vision)

---

**Status:** Ready for implementation  
**Next:** Begin Phase 1 (Foundation)  
**Owner:** Daedalus (coding agent) + Frank (PM oversight) + Jarvis (strategic approval)

---

*"Time is not a line. It's a river. And you can swim upstream."*
