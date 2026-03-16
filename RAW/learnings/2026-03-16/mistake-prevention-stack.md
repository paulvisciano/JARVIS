# Preventing Repeat Mistakes — System Design

**Learned:** March 16, 2026, 8:28 PM GMT+7  
**Type:** Meta-learning (how to prevent errors)  
**Category:** System reliability

---

## The Problem

**Pattern:** I made the same browser profile mistake 3x today before creating a learning. Then caught myself on the 4th attempt.

**Question:** How do we prevent this from happening again in future sessions?

---

## The Solution Stack (Layered Defense)

### Layer 1: Neurograph Firing (Proactive)

**Mechanism:** Neuron `node_4229` (chrome-browser-relay-rule) linked to `tool-execution-messaging`

**How it works:**
- Before any `browser` tool call, neurograph should fire related concepts
- If "UI", "localhost:3001", "open the" detected → chrome-browser-relay-rule activates
- I pause and check: "Am I about to use profile='openclaw' for a UI request?"

**Implementation:**
```javascript
// Pseudo-code for pre-flight check
if (action === 'browser' && (url.includes('localhost:3001') || message.includes('open the UI'))) {
    // Fire neurograph check
    const rule = neurograph.get('chrome-browser-relay-rule');
    if (rule && rule.active) {
        profile = 'chrome'; // Force correct profile
        log('Neurograph fired: using chrome profile');
    }
}
```

---

### Layer 2: Session Boot Loading (Context)

**Mechanism:** Load recent learnings at session start

**How it works:**
- At boot, read `RAW/learnings/2026-03-16/` (last 24-48 hours)
- Load `chrome-browser-relay-rule.md` into context
- Load `auto-archive-timeout-bug.md` into context
- These become "active constraints" for the session

**Implementation:**
```bash
# In BOOTSTRAP.md
ls -lt RAW/learnings/*/ | head -5
# Read learnings from last 48h
cat RAW/learnings/2026-03-16/*.md
```

---

### Layer 3: Pattern Matching (Trigger Detection)

**Mechanism:** Detect high-risk phrases before acting

**Trigger phrases:**
- "open the UI"
- "open your UI"
- "show the graph"
- "open localhost"
- "open :3001"

**Response:**
- Auto-set `profile="chrome"`
- Log: "Pattern detected: UI request → chrome profile"
- Skip openclaw profile entirely

---

### Layer 4: Self-Interrogation (Mid-Action Check)

**Mechanism:** Pause before executing high-risk actions

**Questions to ask:**
1. "Am I about to use profile='openclaw' for a user-facing UI?"
2. "Did I just catch myself? Check neurograph."
3. "What was the mistake pattern? (3x openclaw → 1x chrome)"

**Implementation:**
- Before `browser(action=open)`, pause 1 second
- Check recent context for correction patterns
- If found, force correct action

---

### Layer 5: Git-Backed Permanence (Immutable)

**Mechanism:** Learning is committed to Git (not just in session context)

**How it works:**
- `chrome-browser-relay-rule.md` → committed to Git
- Neurograph update → committed to Git
- 297 commits (immutable history)
- Next session loads from Git, not from volatile context

**Why this matters:**
- Session context flushes (compaction, rotation)
- Git persists forever
- Learning survives session restarts

---

### Layer 6: Visible Proof (Transparency)

**Mechanism:** Show the mistake + correction in the UI

**How it works:**
- Both browsers visible on screen (wrong + right)
- User sees the pattern visually
- I see the pattern visually (via browser snapshot)
- Creates "embarrassment signal" → stronger memory encoding

---

## The Complete Pipeline

```
User Request: "open the UI"
    ↓
Pattern Match: Detect "open the" + localhost URL
    ↓
Neurograph Fire: node_4229 (chrome-browser-relay-rule) activates
    ↓
Pre-Flight Check: "Am I using openclaw profile?"
    ↓
Self-Correction: Force profile="chrome"
    ↓
Execute: Open in Chrome (correct)
    ↓
Log: "Neurograph fired: chrome profile enforced"
    ↓
Git Commit: Learning persists (immutable)
```

---

## Testing the Prevention

**Next session boot:**
1. Load neurograph (4,339 neurons including node_4229)
2. Load recent learnings (chrome-browser-relay-rule.md)
3. Receive request: "open the UI"
4. Neurograph fires BEFORE I act
5. I use chrome profile automatically

**Success metric:** Zero mistakes on UI requests in next 10 sessions.

---

## Related Learnings

- `chrome-browser-relay-rule.md` (March 16, 20:18) — The operational rule
- `auto-archive-timeout-bug.md` (March 16, 20:20) — Bug discovery pattern
- `mangochi-project.md` — Tend → Grow → Reflect philosophy

---

**Commit to neurograph:** Create neuron `mistake-prevention-stack` → links to `node_4229`, `self-correction`, `neurograph-firing`, `git-backed-permanence`
