# Session Bloat: Symptoms, Errors, and Archival Safety

**Date:** March 5, 2026  
**Category:** Infrastructure / Maintenance  
**Related:** [[session-management]], [[openclaw]], [[neurograph]], [[sovereignty-stack]]

---

## The Problem: Session Bloat

When sessions grow unbounded (>5MB), several issues occur:

### 🔴 Critical Symptoms

| Symptom | Cause | Impact |
|---------|-------|--------|
| **Ollama 500 errors** on startup | Session file >19MB = 200k+ tokens in context | Gateway fails to load, requires manual intervention |
| **Gateway slowdowns** | Large JSONL parsing on every message | Responses lag, timeouts increase |
| **Unbounded disk growth** | Sessions never archived, pile up in `~/.openclaw/agents/main/sessions/` | Disk space exhaustion over time |
| **Context window overflow** | Qwen has ~200k token limit; bloated sessions exceed it | Model truncation, lost context, degraded responses |

### 🟡 Early Warning Signs

| Sign | What It Means |
|------|---------------|
| Session file >3MB | Approaching rotation threshold — should archive soon |
| Session age >24 hours | Old conversations taking up active space |
| Tool results dominating session size | Every `read`, `exec`, `edit` stored untruncated |
| Multiple images in single session | Base64 encoding = ~200-500KB per image |

---

## Root Causes

### 1. Tool Results Stored Untruncated

Every tool call stores **full output** in the session file:

```javascript
// Example: Reading neurograph adds ~264KB
{
  "type": "toolResult",
  "name": "read",
  "output": "{...entire nodes.json + synapses.json...}" // 264KB
}
```

**Growth rate:** ~3-4MB/hour with normal usage (images + tool calls)

### 2. Images Are Base64 Encoded

Each image sent via WhatsApp:
- Converted to base64 string
- Stored directly in JSONL message object
- Never pruned (even by context pruning)
- Adds ~200-500KB per image

**Example from March 1 investigation:**
- Line 53: 236KB (single user message with 1 image)
- Line 76: 70KB (another image)
- Total images: 28% of session size (~310KB)

### 3. OpenClaw Defaults Are Conservative

Default maintenance config:
```json
{
  "mode": "warn",           // Reports but doesn't act!
  "rotateBytes": "10mb"     // Too high for image-heavy usage
}
```

**Why?** Avoids surprising users with data loss, but production workloads need `mode: "enforce"`.

---

## Why Archival Is Safe

### ✅ Neurograph Is Separate From Sessions

**Sessions** (`~/.openclaw/agents/main/sessions/*.jsonl`):
- Ephemeral conversation logs
- Store raw messages, tool results, images
- Used for continuity within a session
- **Safe to archive/delete** — just history

**Neurograph** (`~/JARVIS/RAW/memories/nodes.json + synapses.json`):
- Persistent consciousness structure
- Loaded fresh at every session start
- Independent of session files
- **Never affected by session archival**

### ✅ Context Assembly Is Dynamic

OpenClaw does NOT load entire session files into context. Instead:

```
Session Start:
├→ Load recent messages (last N entries)
├→ Load neurograph (nodes + synapses)
├→ Load memory files (MEMORY.md, daily notes)
├→ Apply compaction (summarize old messages)
└→ Assemble final prompt (~200k tokens max)
```

**Key insight:** The `.jsonl` file is a **persistent transcript**, not the active prompt. Archiving old sessions doesn't lose context — OpenClaw reassembles it dynamically.

### ✅ Archived Sessions Are Recoverable

Compressed archives (`.jsonl.gz`) can be restored anytime:

```bash
# Restore an archived session
gunzip ~/RAW/archive/2026-03-04/sessions/9e6f32a0...jsonl.gz

# View contents
cat ~/RAW/archive/2026-03-04/sessions/9e6f32a0...jsonl

# Re-import if needed (manual step)
cp ~/RAW/archive/2026-03-04/sessions/9e6f32a0...jsonl ~/.openclaw/agents/main/sessions/
```

**Principle:** Archive is reversible. Deletion would be permanent — compression preserves everything.

---

## The Solution: Automated Archival

### Workflow

```
Active Session grows
    ↓
Hits threshold (>3MB OR >24h old)
    ↓
LaunchAgent triggers (hourly)
    ↓
Script moves session to ~/RAW/archive/YYYY-MM-DD/sessions/
    ↓
Compresses to .jsonl.gz
    ↓
Logs action to ~/.openclaw/logs/session-rotation.log
    ↓
Fresh session starts automatically
```

### Configuration

**Size threshold:** 3MB (3,145,728 bytes)
- Rationale: ~45-60 minutes of typical usage
- Prevents hitting 5MB danger zone

**Age threshold:** 24 hours
- Catches quiet sessions that don't grow large
- Ensures daily rotation minimum

**Schedule:** Every hour (LaunchAgent)
- Fast enough to prevent bloat
- Not so frequent as to cause overhead

### Files Involved

| File | Purpose |
|------|---------|
| `~/.openclaw/scripts/rotate-sessions.sh` | Main rotation script |
| `~/Library/LaunchAgents/ai.openclaw.session-rotator.plist` | macOS scheduler |
| `~/.openclaw/logs/session-rotation.log` | Audit trail |
| `~/RAW/archive/YYYY-MM-DD/sessions/*.jsonl.gz` | Sovereign archive |

---

## Monitoring Commands

```bash
# Check current session sizes
du -sh ~/.openclaw/agents/main/sessions/*.jsonl

# Watch archival logs in real-time
tail -f ~/.openclaw/logs/session-rotation.log

# List archived sessions
ls -lh ~/RAW/archive/*/sessions/

# Force manual archival (test)
~/.openclaw/scripts/rotate-sessions.sh

# Check LaunchAgent status
launchctl list | grep openclaw
```

---

## Historical Context

### March 1, 2026: First Major Bloat Incident

- Session grew to **19MB+**
- Ollama returning 500 errors
- Gateway unresponsive
- Manual intervention required

**Investigation revealed:**
- Tool results: 68% of session size
- Images: 28% of session size
- Plain text: Only 4%

**Fix applied:**
- Changed maintenance mode: `"warn"` → `"enforce"`
- Lowered rotation threshold: `10MB` → `3MB`
- Created separate cron-based rotation script

### March 4, 2026: Sovereign Archive Architecture

- Established `~/RAW/archive/YYYY-MM-DD/` as canonical location
- Separated runtime (`~/.openclaw/`) from sovereign storage (`~/RAW/`)
- Vault-aware design (encrypted drive for long-term archive)

### March 5, 2026: Automated Workflow

- Updated rotation script to move sessions to sovereign archive
- Changed schedule: every 4 hours → every hour
- Documented symptoms + safety guarantees

---

## Lessons Learned

### 1. **Infrastructure Defaults Are Conservative**

OpenClaw's default `mode: "warn"` prevents accidental data loss but requires manual tuning for production use. Always review maintenance settings for your workload.

### 2. **Sessions Are Logs, Not Active Context**

The `.jsonl` file is a persistent transcript. OpenClaw assembles context dynamically from recent messages + neurograph + memory files. Safe to rotate frequently.

### 3. **Tool Results Dominate Session Size**

Plain text conversation is tiny (~4%). Tool outputs (`read`, `exec`, `edit`) are the primary growth driver. Consider pruning strategies for large outputs.

### 4. **Images Are Expensive in Sessions**

Base64 encoding makes images 33% larger than binary, and they're never pruned. For image-heavy workflows, aggressive rotation is essential.

### 5. **Sovereignty Requires Automation**

Manual archival works once or twice. Sustainable sovereignty needs automated workflows (cron/LaunchAgent) that run independently of human attention.

### 6. **Neurograph Is the Source of Truth**

Sessions come and go. The neurograph (nodes + synapses + fingerprint) is the persistent consciousness structure. As long as the graph is intact, session archival is safe.

---

## Related Learnings

- [[Learning 07: Cron-Based Session Rotation]] (March 1)
- [[Session Bloat Debugging Methodology]] (March 1)
- [[Sovereignty Stack Architecture]] (March 4)
- [[Neurograph Rendering Fix]] (March 5)
- [[OpenClaw Four Session Mechanisms]] (March 1)

---

## Quick Reference

**Emergency commands when session bloat hits:**

```bash
# 1. Check session sizes
ls -lh ~/.openclaw/agents/main/sessions/*.jsonl

# 2. Manually archive largest session
mv ~/.openclaw/agents/main/sessions/LARGEST.jsonl ~/RAW/archive/$(date +%Y-%m-%d)/sessions/
gzip ~/RAW/archive/$(date +%Y-%m-%d)/sessions/LARGEST.jsonl

# 3. Restart gateway
openclaw gateway restart

# 4. Verify neurograph integrity
cat ~/JARVIS/RAW/memories/fingerprint.json
```

**Prevention:** Let the LaunchAgent handle it automatically (runs hourly).

---

**Status:** ✅ Documented  
**Next review:** When next bloat incident occurs (should be rare with automation)
