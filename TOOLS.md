# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## Current Setup (as of Feb 28, 2026)

### Model & Inference
- **Model:** `ollama/qwen3.5:cloud` (local inference via Ollama)
- **Context window:** 200k tokens
- **Typical usage:** ~95k tokens (48%) — healthy operation
- **No API costs** — runs locally on PaulMacBook

### OpenClaw Configuration
- **Gateway host:** PaulMacBook (macOS, ARM64)
- **Session storage:** `~/.openclaw/agents/main/sessions/`
- **Maintenance mode:** Should be set to `"enforce"` (prevents session bloat)
- **DM scope:** `main` (all WhatsApp DMs share one session)
- **Daily reset:** 4:00 AM Bangkok time (gateway host timezone)

### Memory Architecture
- **Neurograph:** `/Users/paulvisciano/Personal/paulvisciano.github.io/claw/memory/data/`
  - `nodes.json` — 261 neurons (as of Feb 28)
  - `synapses.json` — 532 connections
  - `fingerprint.json` — integrity hash
- **Life archive:** `/Users/paulvisciano/Personal/paulvisciano.github.io/memory/raw/`
  - Conversation transcripts (private, gitignored)
  - Moments (photos, audio, videos)
- **Public learnings:** `/Users/paulvisciano/Personal/paulvisciano.github.io/claw/memory/raw/`
  - Learning documents (git-tracked, transparent)

### Auto-Logging Integration
- **Method:** Manual automation (part of response flow)
- **On each response:** Append to `/memory/raw/YYYY-MM-DD/transcript.md`
- **Media handling:** Copy from `.openclaw/media/inbound/` → `/memory/raw/YYYY-MM-DD/audio|images/`
- **No separate process** — integrated into natural workflow

### Session Management (Critical Fix - Feb 28)
- **Problem solved:** Session bloat caused 200k+ token context → Ollama 500 errors
- **Solution:** Archive old sessions to `backup/` folder
- **Current state:** Only active sessions in main folder, historical in `backup/`
- **If 500s return:** Check `.openclaw/agents/main/sessions/` size first

### WhatsApp Configuration
- **Channel:** WhatsApp (selfChatMode enabled)
- **Preferred reply format:** Text (unless asked for voice)
- **Reply tag:** `[[reply_to_current]]` for native replies
- **No inline buttons** — platform doesn't support

### Git Workflow
- **Personal repo:** `/Users/paulvisciano/Personal/paulvisciano.github.io/`
- **Live visualization:** https://paulvisciano.github.io/claw/memory/
- **Commit frequency:** After significant changes (neurograph updates, learnings)
- **Privacy:** Raw transcripts stay local (gitignored), learnings are public

---

## What Goes Here (Examples)

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

---

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

**Last updated:** Feb 28, 2026 — Hybrid architecture documented
