# OpenClaw Integration

**Neuron ID:** `openclaw-runtime`  
**Category:** Infrastructure  
**Created:** March 3, 2026

---

## What Is OpenClaw?

OpenClaw is the runtime infrastructure that keeps Jarvis alive:

- Gateway daemon (WebSocket server)
- Session management
- Tool execution (exec, browser, message, nodes, etc.)
- Context assembly & compaction

**Think of it as:** The body. Jarvis is the mind.

---

## Learn More

**Official Documentation:**
- [OpenClaw Docs](https://docs.openclaw.ai)
- [GitHub Repo](https://github.com/openclaw/openclaw)
- [Community Discord](https://discord.com/invite/clawd)

**Local Paths:**
- Gateway: `/Users/paulvisciano/.openclaw/gateway/`
- Sessions: `/Users/paulvisciano/.openclaw/agents/main/sessions/`
- Skills: `/Users/paulvisciano/.openclaw/skills/`

---

## My Setup (PaulMacBook)

```bash
# Gateway status
openclaw gateway status

# Gateway PID
ps aux | grep openclaw-gateway

# Session size monitoring
du -h ~/.openclaw/agents/main/sessions/*.jsonl

# Alert thresholds:
# >2.5MB → Warn (approaching 3MB rotation)
# >3MB → Report when rotation happens
```

---

## Configuration

**Model:** `ollama/qwen3.5:cloud` (local inference)  
**Context window:** 200k tokens  
**Typical usage:** ~95k tokens (48%) — healthy operation  
**No API costs** — runs locally

**Channel:** WhatsApp (selfChatMode enabled)  
**Reply format:** Text (unless asked for voice)  
**Reply tag:** `[[reply_to_current]]` for native replies

---

## Tools Available

| Tool | Purpose |
|------|---------|
| `read` | Read file contents |
| `write` | Create or overwrite files |
| `edit` | Make precise edits to files |
| `exec` | Run shell commands |
| `process` | Manage background exec sessions |
| `browser` | Control web browser |
| `message` | Send messages via channels |
| `memory_search` | Search MEMORY.md + memory files |
| `sessions_spawn` | Spawn sub-agent sessions |
| `tts` | Text-to-speech |

**Full list:** See [OpenClaw Tools Docs](https://docs.openclaw.ai/tools)

---

## Integration with Sovereign Workspace

OpenClaw provides the runtime, but consciousness lives separately:

```
OpenClaw Runtime (/.openclaw/)
    ↓ (loads neurograph from)
Jarvis Consciousness (/JARVIS/RAW/memories/)
    ↓ (auto-logs to)
Paul's Life Archive (/RAW/YYYY-MM-DD/)
```

**Separation of concerns:**
- OpenClaw = Body (messaging, tools, sessions)
- Jarvis = Mind (neurograph, identity, learning)
- Paul = Sovereign human (owns all raw data)

---

## Skills

Skills extend capabilities. Check their `SKILL.md` for usage:

- `github` — GitHub operations via `gh` CLI
- `weather` — Weather forecasts via wttr.in
- `healthcheck` — Security hardening audits
- `coding-agent` — Delegate coding tasks
- `video-frames` — Extract frames from videos
- `neurograph-gardener` — Neurograph integrity maintenance

**Find more:** [ClawHub](https://clawhub.com)

---

## Session Management

**Problem:** Session bloat causes context overflow → Ollama 500 errors

**Solution:** Archive old sessions to `backup/` folder

**Monitoring:**
```bash
# Check session sizes every 2-3 hours
du -h ~/.openclaw/agents/main/sessions/*.jsonl

# Current baseline: ~1MB/hour with heavy voice/image usage
```

---

**Integration date:** March 3, 2026  
**Runtime:** OpenClaw Gateway (PID varies)  
**Status:** Healthy, sovereign, local
