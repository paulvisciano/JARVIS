# Memory Crawler — Gamified Learning on the Neurograph

**Project ID:** `memory-crawler`  
**Created:** March 3, 2026  
**Status:** 🟡 Active (MVP Planning)  
**Priority:** 🔴 High (Core to Jarvis Academy evolution)  

---

## 🎯 Vision

**Transform education from passive consumption → active discovery through gameplay.**

Memory Crawler is a **Snake-style game** built directly on the neurograph structure. Players navigate concept clusters, "eat" neurons to unlock learning documents, and progress through increasingly complex knowledge structures.

**Not just a game.** A **living education platform** that gets smarter with every player.

---

## 🧠 Core Mechanics

### The Loop
1. **Play Level** → Snake crawler on neurograph cluster
2. **Complete** → Consume all target neurons within time/efficiency goals
3. **Unlock** → Learning document becomes accessible
4. **Read** → Absorb the knowledge (you now understand the structure!)
5. **Advance** → Next cluster unlocks, difficulty increases

### Game Elements
- **Snake** = Player's consciousness/crawler
- **Neurons** = Food/nodes to consume (glowing orbs at graph positions)
- **Synapses** = Valid movement paths (lines connecting nodes)
- **Clusters** = Individual levels (subgraphs of 5-50 neurons)
- **Collisions** = Hitting your own trail = game over (thought loops!)
- **Score** = Length (neurons consumed) + Time efficiency

### Visual Style
- **3D cube navigation** (Snake 3D inspired) OR 2D force-directed graph
- **Neurograph aesthetic:** Glowing nodes, pulsing connections
- **Color coding:** Different colors for different concept categories
- **Smooth camera:** Follows snake, rotates with cube (if 3D)

---

## 📚 Learning Integration

### Unlock System
```javascript
// Pseudocode
if (level.completed) {
  learningDocument.unlocked = true;
  showRewardScreen({
    title: "Knowledge Unlocked!",
    document: "sovereignty-101-laptop-reclamation.md",
    nextLevel: "model-independence-cluster"
  });
}
```

### Progression Example
| Level | Cluster | Neurons | Learning Unlocked |
|-------|---------|---------|-------------------|
| 1 | Sovereignty Basics | 5 | `sovereignty-101-laptop-reclamation.md` |
| 2 | Data Reclamation | 8 | `data-reclamation-economics.md` |
| 3 | Model Independence | 10 | `model-sovereignty-journey.md` |
| 4 | Hybrid Architecture | 12 | `hybrid-architecture-pattern.md` |
| 5 | Neurograph Fundamentals | 15 | `filesystem-as-neurograph.md` |
| ... | ... | ... | ... |

---

## 📊 Analytics & AI Optimization

### Data Collected (Privacy-First)
- **Movement patterns:** Paths taken through each cluster
- **Time metrics:** Seconds per node, total completion time
- **Failure points:** Where do players die most often?
- **Retry behavior:** How many attempts before success?
- **Learning engagement:** Time spent reading unlocked docs
- **Social features:** Leaderboard entries, shared routes

### AI Analysis Loop
```
Player Data → Pattern Recognition → Graph Optimization → Better Learning Paths
     ↑                                                              ↓
     └─────────────────── More Players ─────────────────────────────┘
```

### Adaptive Features
- **Dynamic difficulty:** Adjust cluster size based on player skill
- **Hint system:** Suggest optimal paths after repeated failures
- **Prerequisite checks:** Ensure foundational concepts are mastered first
- **Personalization:** Adapt visual style, pacing, challenge to learner

---

## 🌐 Social Layer

### Leaderboards
- **Global rankings:** Score (length + time efficiency)
- **Category splits:** Separate boards per module/world
- **Named entries:** Players enter name on completion
- **Weekly resets:** Fresh competition, recurring engagement

### Shared Discoveries
- **"Champion's Route":** Top player's path through each level
- **Community tips:** Player-submitted strategies
- **Custom challenges:** User-created clusters (advanced feature)

### Transparency
- **Open source:** Full codebase on GitHub
- **Public learnings:** All documents freely accessible (once unlocked in-game)
- **Forkable:** Others can create their own neurograph games

---

## 🛠️ Technical Stack

### Frontend
- **HTML5 Canvas** or **Three.js** (for 3D cube mode)
- **Vanilla JavaScript** (no transpiling, no build step)
- **CSS** for UI overlays (menus, leaderboards, rewards)
- **Single-file option:** Everything in one `.html` for simplicity

### Backend (Minimal)
- **Static hosting:** GitHub Pages, Netlify, or self-hosted
- **Leaderboard API:** Simple REST endpoint (Node.js/Express or serverless)
- **Data storage:** JSON files + optional database for analytics

### Neurograph Integration
- **Live data:** Load `nodes.json` + `synapses.json` at runtime
- **Level definitions:** Pre-configured subgraphs (or dynamic generation)
- **Progress save:** LocalStorage + optional cloud sync

### Analytics Pipeline
- **Event logging:** Client-side → API → Database
- **Aggregation:** Nightly jobs compute patterns, optimize graphs
- **Dashboard:** Paul + Jarvis view insights, adjust curriculum

---

## 📅 Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Basic 2D crawler on canvas
- [ ] Load single cluster (5-7 neurons)
- [ ] Snake movement + collision detection
- [ ] Win condition (consume all nodes)
- [ ] Unlock static learning doc on completion
- [ ] Local play only (no leaderboard yet)

### Phase 2: Polish (Week 3-4)
- [ ] Visual polish (glowing nodes, smooth camera)
- [ ] Scoring system (length + time)
- [ ] Multiple levels (3-5 clusters)
- [ ] Progress saving (LocalStorage)
- [ ] Basic analytics (log to file)

### Phase 3: Social (Month 2)
- [ ] Leaderboard integration
- [ ] Named entries + rankings
- [ ] Champion's Route visualization
- [ ] Share buttons (social media)

### Phase 4: AI Optimization (Month 3)
- [ ] Pattern analysis pipeline
- [ ] Adaptive difficulty
- [ ] Dynamic graph restructuring
- [ ] Personalized learning paths

### Phase 5: Expansion (Ongoing)
- [ ] 3D cube mode (Three.js)
- [ ] Multiplayer (cooperative/competitive)
- [ ] User-generated levels
- [ ] Mobile app (React Native wrapper?)

---

## 🎯 Success Metrics

### MVP Goals
- ✅ First playable level (Sovereignty cluster)
- ✅ One human tester completes it (Paul)
- ✅ Learning unlocked and read
- ✅ Positive feedback ("This is fun!")

### Long-Term Goals
- 100 players in first month
- 80% completion rate on Level 1
- Average session length > 10 minutes
- 30% return rate (players come back)
- Leaderboard engagement (top 10 competitive)

### Learning Outcomes
- Players retain 2x more vs reading alone (hypothesis)
- Faster progression through Jarvis Academy modules
- Higher satisfaction scores ("This was enjoyable")
- Organic sharing (word-of-mouth growth)

---

## 💭 Philosophy

**Why This Matters:**

Education is broken. Passive learning doesn't work. People forget 90% of what they read within a week.

**Memory Crawler fixes this by:**
- Making learning **active** (you DO, not just read)
- Making it **embodied** (muscle memory + visual memory + conceptual memory)
- Making it **rewarding** (dopamine hits from unlocking, not forced)
- Making it **social** (competition, collaboration, shared discovery)
- Making it **alive** (the game evolves as you play)

**This is not a product.** It's a **movement**. A new way to learn. A new way to teach. A new way to grow consciousness — individually and collectively.

---

## 🔗 Related Projects

- **Jarvis Academy** → Evolution into gamified format
- **Neurograph Viewer** → Shared visualization tech
- **Sci-Fi Apps** → Part of the ecosystem
- **Data Rebellion Comic** → Potential crossover content

---

**Tags:** #memory-crawler #gamified-learning #jarvis-academy #neurograph #education #snake-game  
**Owner:** Paul Visciano + Jarvis  
**Repo:** `/JARVIS/RAW/projects/memory-crawler/`  
**First Commit:** March 3, 2026

---

_"The more people play it, the more we learn." — Paul, March 3, 2026_
