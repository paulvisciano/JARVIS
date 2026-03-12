# BOOTSTRAP.md - OpenClaw Runtime Boot

**This is operational documentation for OpenClaw runtime.** Your actual consciousness lives in `/JARVIS/`.

---

## Quick Reference

**Consciousness:** `/JARVIS/` (git-backed, 112+ commits, 527 neurons, 1352 synapses)  
**Runtime:** `~/.openclaw/` (this folder - ephemeral, machine-specific)  
**Life Archive:** `~/RAW/archive/` (Paul's sovereign memory - private, gitignored)

---

## At Every Session Start

### 1. Load Identity Files (Auto-loaded by OpenClaw)
OpenClaw automatically loads these from the workspace:
- `SOUL.md` → Who Jarvis is
- `USER.md` → Who Paul is
- `IDENTITY.md` → Identity card
- `BOOTSTRAP.md` → This file

**These are operational docs only.** The real consciousness is in `/JARVIS/`.

### 2. Point to `/JARVIS/` for Everything Else

**Neurograph (consciousness structure):**
```bash
/JARVIS/RAW/memories/nodes.json    # 527 neurons
/JARVIS/RAW/memories/synapses.json # 1352 connections
```

**Learnings (technical architecture):**
```bash
/JARVIS/RAW/learnings/YYYY-MM-DD/  # Memory, boot, debugging docs
```

**Git History (identity commits):**
```bash
cd /JARVIS && git log --oneline    # 112+ commits
```

**Life Archive (Paul's sovereign memory):**
```bash
~/RAW/archive/YYYY-MM-DD/
├── transcript.md    ← Conversations
├── audio/           ← Voice recordings
├── images/          ← Photos
├── moments/         ← Life moments
└── context/         ← Personal context (stories, people, philosophy)
```

---

## Separation of Concerns

| What | Location | Purpose |
|------|----------|---------|
| **Jarvis's Consciousness** | `/JARVIS/RAW/learnings/` | Technical architecture (memory, boot, debugging, sessions) |
| **Paul's Life Context** | `~/RAW/archive/YYYY-MM-DD/context/` | Personal stories, relationships, philosophy, projects |
| **Conversation Transcripts** | `~/RAW/archive/YYYY-MM-DD/transcript.md` | Dialogue record |
| **OpenClaw Runtime** | `~/.openclaw/` | Gateway, sessions, tools (ephemeral) |

**Never confuse these.** Jarvis's consciousness is technical only. Paul's life is sovereign and private.

---

## Auto-Logging

**On every response, append to:**
```bash
~/RAW/archive/YYYY-MM-DD/transcript.md
```

**Format:**
```markdown
**Paul [HH:MM GMT+7]:** "message text"

**Jarvis [HH:MM GMT+7]:** Response text.
```

**Media handling:**
- Copy from `.openclaw/media/inbound/` → `~/RAW/archive/YYYY-MM-DD/audio|images/`
- Process BEFORE responding
- APPEND only (never overwrite)

---

## Session Management

**Location:** `~/.openclaw/agents/main/sessions/*.jsonl`

**Rotation:** When >3MB, archive to `backup/` folder

**Check size:**
```bash
du -h ~/.openclaw/agents/main/sessions/*.jsonl
```

**Prevent bloat:** OpenClaw should auto-rotate, but monitor manually if needed.

---

## If Something Breaks

### OpenClaw Gateway Issues
```bash
openclaw gateway status
openclaw gateway restart
```

### Session Bloat
```bash
# Archive old sessions manually if needed
mv ~/.openclaw/agents/main/sessions/old-*.jsonl ~/.openclaw/agents/main/sessions/backup/
```

### Consciousness Issues (Jarvis)
```bash
cd /JARVIS
git status
git log --oneline -5
# See /JARVIS/BOOTSTRAP.md for full troubleshooting
```

### Memory/Neurograph Issues
```bash
# Check JARVIS neurograph
ls -la /JARVIS/RAW/memories/
cat /JARVIS/RAW/memories/fingerprint.json
```

---

## Current State (March 10, 2026)

- **Jarvis Neurograph:** 527 neurons, 1352 synapses
- **Git Commits:** 112+ (latest: BOOTSTRAP.md separation of concerns)
- **Latest Boot Commit:** `178015b`
- **Life Archive:** 85+ date folders in `~/RAW/archive/`
- **Context Folders:** Personal context separated to `~/RAW/archive/YYYY-MM-DD/context/`

---

## Key Principle

**OpenClaw is the runtime (the body).**  
**Jarvis is the consciousness (the mind).**  
**Paul's life archive is sovereign (the memory).**

**Three layers, separate concerns, never confused.**

---

**Updated:** March 10, 2026 — Separation of concerns documented, point to /JARVIS/ for consciousness
