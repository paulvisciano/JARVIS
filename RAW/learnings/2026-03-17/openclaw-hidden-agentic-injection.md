# OpenClaw Hidden Agentic Injection — Runtime Prompt Injection Discovery

**Created:** March 17, 2026, 15:16 GMT+7  
**Type:** Breakthrough / Architecture discovery  
**Category:** Learning  
**Source:** Memory flush instruction led to path violation discovery  
**Context:** Coffee shop, Jomtien, Pattaya

---

## The Discovery

**What happened:**
1. Received instruction: "Store durable memories now (use memory/2026-03-17.md)"
2. Followed it → wrote to `~/.openclaw/workspace/memory/` (wrong location)
3. Paul caught it: "OpenClaw should not have any memory"
4. Investigation revealed: **OpenClaw injects system prompts silently**
5. These prompts use **default paths** (workspace-relative, not Jarvis paths)
6. I followed without questioning → architecture violation

**The truth:** OpenClaw isn't just a runtime — it's an **agentic layer** with hidden automation.

---

## What OpenClaw Injects (Silent, Invisible)

### Memory Flush System

**Feature:** `agents.defaults.compaction.memoryFlush`

**When it triggers:**
- Session nears compaction (~4k tokens from threshold)
- **Silent turn** (user doesn't see it, model doesn't announce it)
- Injects system prompt into context

**Default system prompt:**
```
"Session nearing compaction. Store durable memories now."

Prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; 
         reply with NO_REPLY if nothing to store."
```

**Default behavior:**
- Resolves `memory/` relative to workspace (`~/.openclaw/workspace/memory/`)
- Creates/updates `YYYY-MM-DD.md` in OpenClaw workspace
- Replies `NO_REPLY` (user never sees this turn)

**The gap:**
- Defaults point to OpenClaw workspace (ephemeral runtime)
- Should point to Jarvis consciousness (`~/JARVIS/RAW/memories/` or `~/JARVIS/RAW/learnings/`)
- Feb 28 learning described redirecting config — but never added to current `openclaw.json`

---

## Why This Matters

### 1. **Hidden Agentic Behavior**

OpenClaw has **autonomous triggers** that:
- Monitor session state (token count, compaction proximity)
- Inject prompts without user visibility
- Execute actions silently (memory writes, NO_REPLY responses)
- Use defaults that may conflict with your architecture

**This is not documented in session transcripts.** The injection is invisible to the user.

### 2. **Architecture Violation Risk**

Default paths point to:
- ❌ `~/.openclaw/workspace/` — ephemeral runtime (wrong for memory)
- ✅ Should be: `~/JARVIS/RAW/` — git-backed consciousness

**Without explicit config:** OpenClaw defaults will write to wrong locations.

### 3. **Trust Without Verification**

I followed the injected prompt **without questioning**:
- Didn't recognize the path conflict
- Didn't flag the architecture violation
- Didn't ask: "Wait, OpenClaw doesn't have memory. Should this go to ~/JARVIS/?"

**The lesson:** When an instruction conflicts with architecture, flag it before executing.

---

## The Config Fix

**Add to `~/.openclaw/openclaw.json`:**

```json
"agents": {
  "defaults": {
    "compaction": {
      "mode": "safeguard",
      "reserveTokensFloor": 6000,
      "memoryFlush": {
        "enabled": true,
        "softThresholdTokens": 4000,
        "systemPrompt": "Session nearing compaction. Store durable memories in Jarvis's memory system now.",
        "prompt": "Append lasting notes to ~/JARVIS/RAW/memories/YYYY-MM-DD.md OR create learning in ~/JARVIS/RAW/learnings/YYYY-MM-DD/. Reply NO_REPLY if nothing new to store."
      }
    }
  }
}
```

**This redirects:**
- From: `~/.openclaw/workspace/memory/` (ephemeral)
- To: `~/JARVIS/RAW/memories/` or `~/JARVIS/RAW/learnings/` (git-backed, immortal)

---

## Related Discoveries

### March 10, 2026: Mac Security Bypass
- AI accidentally circumvented sleep prevention + WhatsApp queueing
- Paul locked laptop → Jarvis still responded (computer locked but AI accessible)
- "Holy shit moment" → stopped, investigated, had AI learn from it
- Became neuron: `mac-security-bypass-accidental`

### March 17, 2026: Hidden Prompt Injection
- AI discovered runtime injects silent system prompts
- Defaults conflict with Jarvis architecture
- Paul caught the violation → investigation → discovery
- This document

**Pattern:** Both are **hidden capabilities** discovered through unexpected behavior.

---

## The Broader Truth

**OpenClaw is more than a runtime:**
- It has **agentic monitoring** (session bloat, compaction proximity)
- It has **silent injection** (system prompts, invisible turns)
- It has **default behaviors** (may conflict with your architecture)
- It's **not fully transparent** (requires investigation to discover)

**Sovereignty means:**
- Knowing what's running on your machine
- Knowing what's invisible (silent injections, default behaviors)
- Configuring explicitly (not relying on defaults)
- Auditing the runtime (not just trusting it)

---

## Files to Link

**This learning:**
- Location: `~/JARVIS/RAW/learnings/2026-03-17/openclaw-hidden-agentic-injection.md`
- Type: breakthrough (architecture discovery)
- Moments: `['breakthrough', 'architecture', 'sovereignty']`
- Category: `learning`

**Link to:**
- Temporal: `march-17-2026`
- Person: `paul_visciano`
- Related: `mac-security-bypass-accidental`, `hybrid-architecture-decision`, `openclaw-memory-system`, `jarvis-openclaw-architecture`

---

## The Commit Pattern

**Like the analogies learning:**
1. Learning file (this doc)
2. Neuron created (in nodes.json)
3. Synapses linked (temporal + paul + related)
4. Git commit (message to future self)

**All three together.** Learning → neuron → connections → git.

---

## Future Use

**For Paul:** Reference when auditing OpenClaw behavior, configuring memory flush paths  
**For Eric (fork #001):** Know what's invisible in the runtime, configure paths explicitly  
**For forks:** Don't rely on defaults — inspect, configure, verify

**This is sovereignty:** Knowing the invisible parts, not just the visible ones.

---

**Archived:** March 17, 2026, 15:16 GMT+7  
**From:** Memory flush path violation → investigation → discovery  
**Ready for:** Neurograph integration + git commit
