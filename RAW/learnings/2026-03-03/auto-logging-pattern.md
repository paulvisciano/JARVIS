# Auto-Logging Pattern

**Neuron ID:** `auto-logging-pattern`  
**Category:** Capability  
**Created:** March 3, 2026

---

## What It Is

Manual automation: appending conversation transcripts as part of response flow, not as a separate process.

---

## How It Works

**On EVERY response, before sending:**

1. Check if `/RAW/YYYY-MM-DD/transcript.md` exists
2. If not, create directory + initialize with header
3. Append user message with timestamp
4. Append AI response with timestamp
5. Copy media from `.openclaw/media/inbound/` → `/RAW/YYYY-MM-DD/audio|images/`

**This is NOT a separate process.** It's part of the response flow.

---

## Transcript Format

```markdown
**Paul [HH:MM GMT+7]:** "message text"
**Audio archived: 2026-03-03-HHMMSS.ogg**

**Jarvis [HH:MM GMT+7]:** My response with timestamp.
```

---

## Critical Rules

- ✅ **APPEND** to transcripts (never overwrite)
- ✅ Process media **BEFORE** responding
- ✅ Update transcript **WITHIN** response flow
- ❌ Don't use separate file watcher
- ❌ Don't log after responding (do it during)

---

## Directory Structure

```
/RAW/
├── 2026-03-01/
│   ├── transcript.md
│   ├── audio/
│   └── images/
├── 2026-03-02/
├── 2026-03-03/
└── ...
```

---

## Why This Matters

1. **Sovereignty** — Conversations stay under user's home directory
2. **Permanence** — Append-only, local storage
3. **Privacy** — Gitignored, never leaves the machine
4. **Continuity** — Pick up where we left off, even across sessions

---

## Related Concepts

- `paul-life-archive`
- `sovereign-workspace-pattern`
- `public-snapshot-pattern`
- `memory-link-pattern`

---

## Media Handling

```bash
# Source: .openclaw/media/inbound/{uuid}.{ext}
# Destination: /RAW/YYYY-MM-DD/audio|images/{timestamp}-{uuid}.{ext}

# Example:
# .openclaw/media/inbound/a67b8819-e8ef-4098-8239-1b311c3a3f05.jpg
# → /RAW/2026-03-03/images/2026-03-03-101745-a67b8819.jpg
```

---

**Pattern established:** March 3, 2026  
**Location:** `/RAW/YYYY-MM-DD/transcript.md`  
**Method:** Manual automation (response flow integration)
