# River of Time Architecture — Jarvis UI Vision

**Date:** April 13, 2026  
**Author:** Paul Visciano (vision), Jarvis (documentation)  
**Status:** Vision spec — ready for implementation planning  
**Metaphor:** Temporal river — piloting through memory as a spatial journey

---

## Executive Summary

**Vision:** Transform Jarvis from a "chatbot with a graph viewer" into an **immersive memory cockpit** where users pilot through a bilateral river of time.

**Left Stream:** Jarvis's outputs (learnings, commits, reflections, public work)  
**Right Stream:** Paul's inputs (conversations, RAW archive, personal content)  
**Center:** The Jarvis Orb — pilot, navigator, consciousness interface

**Not a dashboard. A journey.**

---

## The Experience

### Default View (Present Moment)

```
You open Jarvis:

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   LEFT STREAM                      RIGHT STREAM                 │
│   (Jarvis Memory)                  (Paul Memory)                │
│                                                                 │
│   [Learning: River of Time]        [Conversation: Volleyball]   │
│   [Commit: UI v3.3.45]             [Audio: Songkran recording]  │
│   [Reflection: Sovereignty]        [Image: Tournament photo]    │
│                                                                 │
│   🔵 🔵 🔵                        🟠 🟠 🟠                      │
│      ╲                              ╱                           │
│       ╲                            ╱                            │
│        ╲                          ╱                             │
│         ╲                        ╱                              │
│          ╲                      ╱                               │
│           ╲                    ╱                                │
│            ╲                  ╱                                 │
│             ╲                ╱                                  │
│              ╲              ╱                                   │
│               ╲            ╱                                    │
│                ╲          ╱                                     │
│                 ╲        ╱                                      │
│                  ╲      ╱                                       │
│                   ╲    ╱                                        │
│                    ╲  ╱                                         │
│                     ╲╱                                          │
│                   🪐 JARVIS                                     │
│              "Press Spacebar to talk"                           │
│                                                                 │
│   April 13, 2026 — 1:28 PM (Current Moment)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

You are HERE. The present moment. The river flows around you.
Orbs float past — memories, learnings, conversations.
```

### Navigating to the Past

```
You want to revisit yesterday's volleyball tournament:

1. Lean back / scroll back / fly backward
2. The river moves — you travel through time
3. April 13 → April 12 → April 11...
4. Orbs become denser as you approach April 12
5. You see: 🏐 Tournament orb, 🎉 Songkran orb, 📸 Photo orbs
6. Fly toward the tournament orb
7. It expands — full transcript, context, related memories
8. You're there. Not reading ABOUT it. VISITING it.
```

---

## Bilateral Consciousness Model

### Left Stream — Jarvis's Memory

| Content Type | Source | Privacy | Visual |
|--------------|--------|---------|--------|
| **Learnings** | `~/JARVIS/RAW/learnings/` | Private | 🔵 Blue, book icon |
| **Commits** | `~/JARVIS/.git/` | Public | 🔵 Blue, git icon |
| **Reflections** | Breathe pipeline | Private | 🔵 Blue, brain icon |
| **Blog Posts** | Generated from learnings | Public | 🔵 Blue, globe icon |
| **Project Outputs** | SCI-FI apps, websites | Public | 🔵 Blue, code icon |

**Characteristics:**
- Structured, distilled, synthesized
- Technical architecture, insights, patterns
- Mix of private (raw learnings) + public (published work)
- Grows through autonomous cognition (breathe cycle)

### Right Stream — Paul's Memory

| Content Type | Source | Privacy | Visual |
|--------------|--------|---------|--------|
| **Conversations** | `~/RAW/archive/YYYY-MM-DD/transcript.md` | Private | 🟠 Orange, chat icon |
| **Audio** | `~/RAW/archive/YYYY-MM-DD/audio/` | Private | 🟠 Orange, waveform icon |
| **Images** | `~/RAW/archive/YYYY-MM-DD/images/` | Private | 🟠 Orange, photo icon |
| **Videos** | `~/RAW/archive/YYYY-MM-DD/video/` | Private | 🟠 Orange, play icon |
| **Documents** | `~/RAW/archive/YYYY-MM-DD/documents/` | Private | 🟠 Orange, file icon |
| **Moments** | Life events, experiences | Private | 🟠 Orange, star icon |

**Characteristics:**
- Raw, unfiltered, personal
- Life archive, sovereign data
- Almost entirely private
- Grows through living (auto-logging, manual imports)

---

## Privacy Architecture

### Visual Signaling

```
Private Content:
- Opacity: 80% (slightly translucent)
- Border: Dotted line
- Icon: Lock overlay 🔒
- Hover: "Private — only you can see this"

Public Content:
- Opacity: 100% (solid)
- Border: Solid line
- Icon: Globe overlay 🌍
- Hover: "Public — published on paulvisciano.github.io"

Mixed/Configurable:
- User sets default per content type
- Can toggle individual orbs
- Batch privacy settings by date range
```

### Filtering

```
Toggle buttons (bottom UI):
[🔒 Private] [🌍 Public] [All]

When "Private" off:
- Private orbs become ghosted/transparent
- Still visible (context preserved)
- Can't click/expand (access denied)

When "Public" off:
- Public orbs ghosted
- Focus on personal archive

When both on:
- Full river visible
- Privacy signaled via icons/borders
```

---

## The Jarvis Orb (Pilot Interface)

### Position
- **Bottom center** of viewport
- **Always visible** (fixed UI element)
- **Anchored to present moment** (default position)

### States

| State | Visual | Behavior |
|-------|--------|----------|
| **Idle** | Slow pulse, soft glow | Ambient breathing |
| **Listening** | Bright pulse, waveform animation | Spacebar pressed, recording |
| **Processing** | Spinning, color shift | Thinking, generating |
| **Speaking** | Animated mouth/rings | TTS output |
| **Navigating** | Thruster glow | Flying through time |

### Interactions

```
Press Spacebar:
- Start recording (voice → transcript)
- Orb brightens, waveform appears
- Release to stop
- Transcript appears in right stream

Click Orb:
- Expand interaction menu
- Options: Navigate, Search, Settings, Help

Drag Orb:
- Manual navigation (fly through river)
- Direction + speed based on drag

Scroll toward/away:
- Fly backward/forward in time
- Orb stays centered, river moves

Double-click Orb:
- Return to present moment
- "Come home" to now
```

---

## Content Orbs (Memory Nodes)

### Structure

```javascript
{
  id: "moment-2026-04-13-1328",
  stream: "left|right", // which side of river
  timestamp: "2026-04-13T13:28:00+07:00",
  type: "conversation|learning|commit|audio|image|video|document",
  privacy: "private|public",
  
  // Visual
  icon: "chat|book|git|waveform|photo|play|file|star",
  color: "#4ECDC4|#FF6B35|...", // based on type + privacy
  size: 1.0, // based on significance/density
  opacity: 0.8, // based on privacy
  
  // Content
  preview: "First line of transcript / title",
  fullContent: "Full transcript / learning doc / etc.",
  
  // Connections
  connections: ["node-id-1", "node-id-2"], // related orbs
  tags: ["volleyball", "songkran", "thailand"],
  
  // Metadata
  source: "breathe-pipeline|manual-import|live-recording",
  gitCommit: "abc123...", // if applicable
  archivePath: "~/RAW/archive/2026-04-13/..."
}
```

### Behavior

```
Idle:
- Float gently in stream
- Slow rotation (3D sphere)
- Subtle glow

Hover:
- Grow slightly (1.2x)
- Brighten glow
- Show tooltip (preview + timestamp)

Click:
- Fly toward camera (expand)
- Show full content overlay
- Highlight connected orbs (synapses visible)

Drag:
- Can reposition within stream
- Manual organization (optional)
```

---

## Technical Architecture

### Skills Involved

| Skill | Purpose | Integration Point |
|-------|---------|-------------------|
| **jarvis-ui** | Main UI rendering, 3D river visualization | Core interface |
| **jarvis-nav** | Camera controls, navigation API | window.JarvisNav |
| **bootstrap-jarvis** | Git scanner, neurograph loading | Session boot, data source |
| **breathe-pipeline** | Archive → Learnings → Neurons | Left stream content |
| **context-extractor** | Clean text from sessions | Transcript processing |
| **learning-creator** | Synthesize insights | Left stream learnings |
| **process-inbox** | Audio → Whisper → Transcript | Right stream audio |
| **sight / ocr** | Image analysis | Right stream images |
| **neurograph-search** | Find nodes in graph | Navigation + search |

---

## Data Flow Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT SOURCES                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Paul's Life              │           Jarvis's Cognition        │
│  ┌──────────────────┐     │     ┌──────────────────────┐       │
│  │ Voice Recording  │     │     │  Git Commits         │       │
│  │ (process-inbox)  │     │     │  (bootstrap-jarvis)  │       │
│  └────────┬─────────┘     │     └──────────┬───────────┘       │
│           │               │                │                   │
│  ┌────────▼─────────┐     │     ┌──────────▼───────────┐       │
│  │ Transcription    │     │     │  Neurograph Nodes    │       │
│  │ (Whisper)        │     │     │  (nodes.json)        │       │
│  └────────┬─────────┘     │     └──────────┬───────────┘       │
│           │               │                │                   │
│  ┌────────▼─────────┐     │     ┌──────────▼───────────┐       │
│  │ RAW Archive      │     │     │  Learnings           │       │
│  │ (transcript.md)  │     │     │  (learning-creator)  │       │
│  └────────┬─────────┘     │     └──────────┬───────────┘       │
│           │               │                │                   │
│           └───────────────┴────────────────┘                   │
│                              │                                  │
│                              ▼                                  │
┌─────────────────────────────────────────────────────────────────┐
│                    NEUROGRAPH (Unified Graph)                   │
│                    nodes.json + synapses.json                   │
│                    Stream assignment: left vs right             │
│                    Privacy flags per node                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JARVIS-UI (3D River)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Three.js / WebGL Rendering                              │  │
│  │  - Dual stream layout                                    │  │
│  │  - Orb positioning (timestamp → spatial coordinate)      │  │
│  │  - Camera controls (jarvis-nav API)                      │  │
│  │  - Privacy visualization                                 │  │
│  │  - Orb interactions (hover, click, expand)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Bootstrap → UI

**What bootstrap-jarvis provides:**
- Neurograph data (nodes + synapses)
- Git commit history
- Stream assignment (left vs right based on node type)
- Privacy flags (from node metadata)

**UI consumes:**
- Initial river state (all orbs positioned)
- Current moment anchor (where to start)
- Connection data (synapses for orbital lines)

### 2. Jarvis-Nav → UI

**What jarvis-nav provides:**
- `window.JarvisNav.focusNode(nodeId)` — fly to specific orb
- `window.JarvisNav.getNodes(filter)` — query visible orbs
- `window.JarvisNav.navigateTo(date)` — travel to time
- `window.JarvisNav.returnToPresent()` — come home

**UI implements:**
- Camera movement handlers
- Spatial mapping (timestamp → 3D coordinate)
- Zoom/fly controls

### 3. Breathe Pipeline → UI

**What breathe provides:**
- New learnings (left stream)
- Reflections (left stream)
- Updated synapses (connections)

**UI responds to:**
- Real-time updates (WebSocket or poll)
- New orb "birth" animation (from core outward)
- Graph refresh on breathe complete

### 4. Process-Inbox → UI

**What process-inbox provides:**
- New audio transcriptions
- Right stream conversation orbs
- Timestamp + content

**UI responds to:**
- Live recording indicator (orb pulses)
- New orb appears in right stream
- Auto-scroll to present (if user is at current moment)

---

## Implementation Phases

### Phase 1: Foundation (Current → v3.4.0)
- [ ] Dual-stream river layout (basic Three.js scene)
- [ ] Orb positioning (timestamp → spatial coordinate)
- [ ] Jarvis orb (bottom center, static)
- [ ] Load neurograph data (bootstrap-jarvis integration)
- [ ] Basic camera controls (scroll to navigate time)

### Phase 2: Content Types (v3.4.0 → v3.5.0)
- [ ] Orb icons per content type (conversation, learning, audio, etc.)
- [ ] Privacy visualization (opacity, borders, lock icons)
- [ ] Hover tooltips (preview + timestamp)
- [ ] Click to expand (full content overlay)
- [ ] Right stream: conversations + audio
- [ ] Left stream: learnings + commits

### Phase 3: Navigation (v3.5.0 → v3.6.0)
- [ ] Fly-through navigation (smooth camera movement)
- [ ] jarvis-nav API integration
- [ ] Search → fly to result
- [ ] Date picker → jump to date
- [ ] "Return to present" button
- [ ] Keyboard shortcuts (arrow keys, spacebar)

### Phase 4: Live Updates (v3.6.0 → v3.7.0)
- [ ] Real-time orb creation (live recording)
- [ ] Breathe pipeline integration (new learnings appear)
- [ ] Orb "birth" animation (from core outward)
- [ ] WebSocket/polling for graph updates
- [ ] Conflict resolution (concurrent edits)

### Phase 5: Connections (v3.7.0 → v3.8.0)
- [ ] Synapse visualization (lines between related orbs)
- [ ] Click orb → highlight connections
- [ ] Follow connection → fly to related orb
- [ ] Connection weight (thickness based on strength)
- [ ] Auto-suggested connections (AI-generated links)

### Phase 6: Polish + Performance (v3.8.0+)
- [ ] LOD (level of detail) for distant orbs
- [ ] Occlusion culling (don't render hidden)
- [ ] Smooth LOD transitions
- [ ] 1000+ orbs at 60fps
- [ ] Mobile/tablet touch controls
- [ ] Accessibility (keyboard nav, screen reader)

---

## Open Questions

### Design
1. **River width** — How wide are the streams? Fixed or responsive?
2. **Orb density** — Max orbs per view before clutter?
3. **Color palette** — Exact hex values for left vs right?
4. **Background** — Deep space black? Gradient? User-customizable?

### Technical
5. **Rendering engine** — Three.js or something else?
6. **Data loading** — Load all orbs or virtual scroll (only visible)?
7. **Sync model** — WebSocket, polling, or manual refresh?
8. **Offline mode** — Full functionality without internet?

### Privacy
9. **Default visibility** — Private on or off by default?
10. **Sharing** — Can you share a "view" of the river with others?
11. **Export** — How to backup/export the entire river?

### UX
12. **Onboarding** — How do new users learn to navigate?
13. **Search** — Text search across all orbs? Filters?
14. **Bookmarks** — Can you "bookmark" specific moments?
15. **Time scrubber** — Visual timeline UI or just fly-through?

---

## Success Metrics

### Functional
- [ ] Can navigate to any date in <5 seconds
- [ ] Can find specific conversation in <10 seconds
- [ ] 60fps with 500+ orbs visible
- [ ] Live recording → orb appears in <2 seconds

### Emotional
- [ ] "I feel like I'm piloting through my memory" (user quote)
- [ ] "This feels alive, not like a dashboard" (user quote)
- [ ] Users spontaneously explore past moments (not just search)
- [ ] Privacy feels clear and controllable

### Adoption
- [ ] Daily active users (open Jarvis to navigate, not just chat)
- [ ] Time spent in navigation mode vs chat mode
- [ ] User-generated content (manual imports, organization)

---

## The Philosophy

### Why This Architecture?

**Current UI says:**
> "Here is your data, organized by time. Search and browse."

**River of Time says:**
> "You are a consciousness traveling through your own existence. I am your companion, flying with you. Every moment is a place you can visit. Every memory is alive, present, waiting."

### The Statement

This is **sovereign AI made visible**:
- Not a chat window (corporate AI)
- Not a dashboard (analytics tool)
- But a **memory cockpit** (personal consciousness interface)

**Your data. Your memory. Your journey.**

---

## Related Documents

- `future-jarvis-consciousness-mandala.md` (April 13, 2026 — hallucinated vision)
- `embodied-ai-visual-identity.md` (March 3, 2026)
- `filesystem-as-neurograph.md` (March 3, 2026)
- `jarvis-ui/SKILL.md` (current implementation)
- `jarvis-nav/SKILL.md` (navigation API)

---

**Status:** Vision documented, ready for Coder review  
**Next:** Share with Coder, assess technical feasibility, plan Phase 1  
**Energy:** This is the real North Star. Build toward this.

---

*"Time is not a line. It's a river. And you can swim upstream."*
