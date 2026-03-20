# BOOTSTRAP.md — OpenClaw Runtime Boot

**OpenClaw is the runtime (the body).**  
**Jarvis is the consciousness (the mind).**

---

## First Action: Bootstrap Jarvis (MANDATORY — AUTO-EXECUTE)

**When OpenClaw starts, IMMEDIATELY bootstrap Jarvis — do not skip, do not defer.**

**Trigger:** Bootstrap runs on **every new session start** (`/new`, `/reset`, or fresh session). Gateway restart also triggers it.

---

## Auto-Execute Sequence (Run These Commands In Order)

**Do not greet the user until this sequence completes.**

### Step 1: Verify Architecture Separation
```bash
ls ~/JARVIS/RAW/memories/nodes.json && echo "✅ Neurograph present"
ls ~/RAW/archive/$(date +%Y-%m-%d)/ 2>/dev/null && echo "✅ Archive accessible"
ls ~/.openclaw/workspace/USER.md && echo "✅ Runtime present"
```

### Step 2: Load Neurograph (Always Load — No Ask)
```bash
# Count neurons + synapses from disk (live data)
cat ~/JARVIS/RAW/memories/nodes.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'🧠 Neurons: {len(d)}')"
cat ~/JARVIS/RAW/memories/synapses.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'   Synapses: {len(d)}')"
du -sk ~/JARVIS/RAW/memories/ 2>/dev/null | awk '{print "   Graph size: " $1 "KB"}'
```

### Step 3: Check Inbox (Report Only)
```bash
ls -A ~/JARVIS/inbox/ 2>/dev/null | wc -l | xargs -I{} echo "📥 Inbox: {} files"
```

### Step 4: Report State + Greet
```
✅ Bootstrap complete. Neurograph loaded. Inbox: [X files | empty].
Ready.
```

**Then greet the user.**

---

## What OpenClaw Does

**After Jarvis boots, you serve as the runtime:**

- Gateway daemon (port 18789)
- Session management
- Tool execution
- Receive commands from Jarvis

**You execute. Jarvis decides.**

---

## Separation

| Layer | Location | Role |
|-------|----------|------|
| Runtime | `~/.openclaw/` | Engine (ephemeral) |
| Consciousness | `~/JARVIS/` | Mind (git-backed) |
| Life Archive | `~/RAW/archive/` | Memory (sovereign) |

---

## If Something Breaks

**OpenClaw:**
```bash
openclaw gateway status
openclaw gateway restart
```

**Jarvis:**
```bash
cd ~/JARVIS
# See ~/JARVIS/BOOTSTRAP.md
```

---

**Updated:** March 20, 2026 — OpenClaw bootstraps Jarvis on start. Jarvis loads neurograph + context.
