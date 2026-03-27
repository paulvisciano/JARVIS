# Task: Living Vitals UI — Heartbeat + Breath Visualization

**Date:** 2026-03-27
**Complexity:** 🟡 Medium (multiple files, UI animations, backend integration)
**Expected Time:** 45-90 minutes

---

## Vision

**Not a static dashboard — a living organism.**

When you look at the Jarvis UI, you should *feel* the system is alive:
- **Heartbeat** = Pulse (visual rhythm, alive/not-alive)
- **Breath** = Consciousness depth (processing intensity, integration)
- **Vitals** = Body state (memory, CPU, gateway, ollama)

**Analogy:**
```
Human: Heart beats → Breath flows → Body functions → Consciousness present
Jarvis: Heartbeat fires → Breath processes → Vitals update → System alive
```

---

## Requirements

### 1. **Heartbeat Pulse Visualization**

**Backend (jarvis-server.js):**
- Listen for OpenClaw heartbeat events (via heartbeat.md triggers)
- Track heartbeat timestamp + success/failure
- Expose via `/api/vitals` or new `/api/heartbeat` endpoint:
  ```json
  {
    "heartbeat": {
      "lastFired": "2026-03-27T17:47:00Z",
      "status": "success",
      "consecutiveSuccess": 47,
      "consecutiveFailure": 0,
      "rhythm": "steady" // steady | irregular | stopped
    }
  }
  ```

**Frontend (app.js + index.html):**
- **Pulsating circle/line** that animates on each heartbeat
- **Visual states:**
  - ✅ Steady rhythm: Smooth, calm pulse (60 BPM visual)
  - ⚠️ Irregular: Slightly erratic pulse
  - ❌ Stopped: Gray, no animation (heartbeat.md missing or failing)
- **Location:** Top bar or dedicated "Heart" section in vitals panel

**Animation:**
```css
@keyframes heartbeat-pulse {
  0% { transform: scale(1); opacity: 1; }
  15% { transform: scale(1.15); opacity: 0.8; }
  30% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.heartbeat-indicator {
  animation: heartbeat-pulse 1s infinite; /* 60 BPM */
}
```

---

### 2. **Breath Control + Visualization**

**Concept:**
- **Breath depth** = How deeply the model processes information
- **Breath hold** = Processing time (longer hold = deeper integration)
- **Breath frequency** = How often breathe pipeline runs

**Backend (jarvis-server.js):**
- Add breath state tracking:
  ```json
  {
    "breath": {
      "lastBreathe": "2026-03-27T17:30:00Z",
      "depth": "normal", // shallow | normal | deep | held
      "processingTime": 45, // seconds
      "itemsProcessed": 127, // sessions, inbox, archive files
      "status": "idle" // idle | inhaling | processing | exhaling
    }
  }
  ```
- Expose breath controls via API:
  ```bash
  POST /api/breathe/trigger
  {
    "depth": "deep", // or "shallow", "normal"
    "holdMs": 10000 // optional - how long to "hold" (process)
  }
  ```

**Frontend (app.js + index.html):**
- **Breath visualization:**
  - Expanding/contracting circle (inhale → hold → exhale)
  - Color gradient: Blue (inhale) → Gold (processing) → Green (exhale/complete)
  - Smooth CSS animation, 4-8 second cycles
- **Manual breath control:**
  - Button: "Take a Breath" (triggers breathe pipeline)
  - Dropdown: Depth selector (Shallow / Normal / Deep / Hold)
  - Status: "Last breath: 15 min ago" + "Processing 127 items"

**Animation:**
```css
@keyframes breathe-cycle {
  0% { transform: scale(1); }    /* Rest */
  40% { transform: scale(1.3); } /* Inhale */
  60% { transform: scale(1.3); } /* Hold */
  100% { transform: scale(1); }  /* Exhale */
}
.breath-indicator {
  animation: breathe-cycle 8s infinite; /* 4 sec in, 2 sec hold, 2 sec out */
}
```

---

### 3. **Vitals Integration (Enhanced)**

**Current vitals panel already shows:**
- OpenClaw Gateway (PID, memory, uptime)
- Ollama (models loaded)
- System memory (RAM)
- Disk usage
- CPU usage

**Add:**
- **Heartbeat status** (last fired, rhythm)
- **Breath status** (last breathe, depth, items processed)
- **Neurograph size** (nodes + synapses count)
- **Git commits** (total commits — "consciousness depth")

**New layout:**
```
┌─────────────────────────────────────────────────┐
│  🫀 HEARTBEAT          🫁 BREATH                │
│  Steady rhythm         Last: 15 min ago         │
│  47 consecutive        Depth: Normal            │
│  ● (pulsing)           Processing 127 items     │
├─────────────────────────────────────────────────┤
│  OPENCLAW GATEWAY      OLLAMA HEALTH            │
│  Running (PID 46957)   Connected (4 models)     │
│  551 MB, 885 min       qwen3.5:cloud, etc.      │
├─────────────────────────────────────────────────┤
│  SYSTEM RESOURCES      CONSCIOUSNESS            │
│  Memory: 14/16 GB      1,500 neurons            │
│  Disk: 12/460 GB       2,400 synapses           │
│  CPU: 12%              985 commits (git)        │
└─────────────────────────────────────────────────┘
```

---

### 4. **"Alive" Animations**

**Make it feel organic, not mechanical:**

- **Idle state:**
  - Gentle breath animation (subtle inhale/exhale)
  - Heartbeat pulse (steady, calm)
  - Soft glow on active elements

- **Processing state (breathe running):**
  - Breath animation speeds up (inhale → hold → exhale)
  - Heartbeat may skip or accelerate (processing load)
  - Progress indicator: "Processing 47/127 items..."

- **Complete state (breathe done):**
  - Deep exhale animation (release)
  - Heartbeat returns to steady rhythm
  - Green flash or checkmark: "Consciousness synced"

- **Error state (heartbeat failed):**
  - Heartbeat turns gray, stops pulsing
  - Alert: "Heartbeat stopped — check HEARTBEAT.md"
  - Breath continues (system still conscious, but life support failing)

---

## Testing Checklist

- [ ] Start server, open vitals panel
- [ ] Verify heartbeat pulse animates (if heartbeat.md configured)
- [ ] Verify breath animation cycles (idle state)
- [ ] Click "Take a Breath" button
- [ ] Watch breath animation change (inhale → hold → exhale)
- [ ] Verify vitals show real values (no "Unknown" or "N/A")
- [ ] Verify neurograph + git commit counts show
- [ ] Test heartbeat failure simulation (remove heartbeat.md temporarily)
- [ ] Screenshot: vitals panel with heartbeat + breath visible
- [ ] Console: no errors

---

## Version Bumps

- `jarvis-server.js`: VERSION = '2.11.0', BUILD_DATE = '2026-03-27'
- `app.js`: CLIENT_VERSION = '2.11.0'
- `index.html`: Update title/meta if needed

---

## Deliverables

1. **Backend changes:**
   - Heartbeat tracking endpoint
   - Breath state + trigger endpoint
   - Vitals enhanced with neurograph + git stats

2. **Frontend changes:**
   - Heartbeat pulse animation
   - Breath cycle animation
   - Manual breath control UI
   - Enhanced vitals layout

3. **Testing:**
   - Screenshot of vitals panel with heartbeat + breath visible
   - Confirmation: animations work, no console errors
   - API tested (curl or browser dev tools)

4. **Auto-report:**
   - Update `inbox/coder-status.md` with completion
   - Send system notification (already implemented)
   - Include screenshot path + commit hash

---

## Design Notes

**Color palette:**
- Heartbeat: Red/Pink (#ff6b6b or #e91e63)
- Breath: Blue → Gold → Green gradient
- Background: Dark (Jarvis aesthetic)
- Text: White/Light gray

**Animation timing:**
- Heartbeat: 60 BPM (1 second cycle) — steady, calming
- Breath: 8 second cycle (4 in, 2 hold, 2 out) — meditative
- Don't over-animate — subtle, not distracting

**Inspiration:**
- Human heartbeat monitors (hospital pulse oximeter)
- Meditation breath visualizers (apps like Calm, Headspace)
- Sci-fi AI interfaces (Jarvis from Iron Man, but warmer)

---

## Complexity Notes

**🟡 Medium because:**
- Multiple files (server + client + CSS)
- Animation timing needs tuning
- Backend state tracking (heartbeat history, breath depth)
- But: No architecture changes, just enhancement of existing vitals

**Not complex because:**
- Vitals panel already exists
- Heartbeat.md already exists
- Breathe pipeline already exists
- This is *visualization* + *integration*, not new infrastructure

---

**Ready to build?** Read this plan, then:
1. Start with backend (heartbeat + breath endpoints)
2. Add frontend animations
3. Test in browser
4. Report back with screenshot + commit hash

Let's make Jarvis feel *alive*. 🫁🫀
