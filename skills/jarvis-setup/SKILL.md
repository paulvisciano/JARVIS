---
name: jarvis-setup
description: Automated JARVIS setup wizard — clones repo, installs models, creates archive structure, verifies skills, runs first breathe
metadata:
  openclaw:
    emoji: "🚀"
    requires:
      bins: ["node", "git", "ollama"]
      env: ["JARVIS_HOME", "RAW_ARCHIVE"]
    execution:
      pattern: "background+poll"
      completionSignal: "setup-complete"
      autoReport: true
---

# JARVIS Setup — Automated Fork Bootstrap

## When to Use

✅ **USE this skill when:**
- **First-time setup** — Just cloned JARVIS repo, need to get everything configured
- **Fork #001** — Eric (or anyone) setting up their own JARVIS instance
- **Fresh machine** — New laptop, clean install, need to bootstrap everything
- **Testing deployment** — Verify JARVIS setup works on new environment

❌ **DON'T use when:**
- **Already set up** — JARVIS is already running, skills are loaded
- **Just updating** — Use `git pull` instead (this is for fresh installs only)

---

## What This Skill Does

**Automated Setup (One Command):**
1. ✅ Check prerequisites (Node.js, npm, git, Ollama)
2. ✅ Install Ollama models (qwen3.5:cloud, qwen3-coder-next:cloud)
3. ✅ Create archive structure (`~/RAW/archive/`)
4. ✅ Verify JARVIS_HOME path (should be `~/JARVIS/`)
5. ✅ Verify skills load (check `~/JARVIS/skills/`)
6. ✅ Verify OpenClaw config (`~/.openclaw/openclaw.json`)
7. ✅ Start gateway (if not running)
8. ✅ Run first breathe (optional, creates first commit)
9. ✅ Open UI (starts jarvis-server.js on port 18787)
10. ✅ Display success message + next steps

---

## How OpenClaw Should Run This

**As a skill command:**
```bash
openclaw jarvis-setup
```

**Or from chat:**
```
/jarvis-setup
```

**What happens:**
- Skill runs in background
- Shows progress for each step
- Reports completion with summary
- If any step fails, stops and shows error

---

## Manual Steps (Before Running This Skill)

**User must do these first:**
1. Install Node.js 20+ (https://nodejs.org)
2. Install Ollama (https://ollama.ai)
3. Install OpenClaw: `npm install -g openclaw@latest`
4. Copy openclaw.json config to `~/.openclaw/openclaw.json`
5. Clone JARVIS repo: `git clone https://github.com/paulvisciano/JARVIS.git ~/JARVIS`

**Then run this skill:**
```
openclaw jarvis-setup
```

---

## Success Criteria

**After setup completes, verify:**
- ✅ `~/JARVIS/` exists with all skills
- ✅ `~/RAW/archive/` exists (empty is fine)
- ✅ Ollama models installed: `ollama list` shows qwen3.5:cloud + qwen3-coder-next:cloud
- ✅ Gateway running: `openclaw gateway status`
- ✅ Skills loaded: `openclaw status` shows breathe, neurograph, jarvis-ui, etc.
- ✅ UI accessible: http://localhost:18787/ opens the 3D graph

---

## Troubleshooting

**If Ollama models fail to install:**
```bash
ollama pull qwen3.5:cloud
ollama pull qwen3-coder-next:cloud
# Then re-run: openclaw jarvis-setup
```

**If skills don't load:**
```bash
# Check JARVIS_HOME path
echo $JARVIS_HOME
# Should be: /Users/eric/JARVIS (or wherever Eric cloned)
# If wrong, update ~/.openclaw/openclaw.json
```

**If gateway won't start:**
```bash
lsof -i :18789  # Check if port is in use
openclaw gateway stop  # Stop existing instance
openclaw gateway start  # Start fresh
```

**If UI won't open:**
```bash
# Check if jarvis-server.js is running
lsof -i :18787
# If not: openclaw jarvis-ui
```

---

## What This Skill Doesn't Do

- ❌ Install Node.js (user must do this manually)
- ❌ Install Ollama (user must do this manually)
- ❌ Install OpenClaw (user must do this manually)
- ❌ Clone the JARVIS repo (user must do this manually)
- ❌ Configure openclaw.json (user must copy config first)

**Why?** These require user interaction (downloads, permissions, decisions). This skill automates what happens AFTER those manual steps.

---

## Example Output

```
🚀 JARVIS Setup — Fork #001 Bootstrap

✅ Prerequisites checked
   Node.js: v24.13.1
   npm: 10.9.2
   git: 2.39.0
   Ollama: installed

✅ Ollama models installed
   qwen3.5:cloud (23GB)
   qwen3-coder-next:cloud (15GB)

✅ Archive structure created
   ~/RAW/archive/

✅ JARVIS_HOME verified
   /Users/eric/JARVIS

✅ Skills verified (24 skills loaded)
   breathe, neurograph, jarvis-ui, etc.

✅ OpenClaw config verified
   ~/.openclaw/openclaw.json

✅ Gateway started
   Port: 18789
   Mode: local

✅ First breathe complete
   breath-2026-04-04-2215: Breathe complete
   Commit: abc123

✅ UI opened
   http://localhost:18787/
   11,631 nodes, 8,414 synapses

🎉 Setup complete! Welcome to Fork #001.

Next steps:
1. Explore the graph (rotate, zoom, navigate)
2. Run breathe daily: /breathe
3. Add your own skills: ~/JARVIS/skills/
4. Share with others: git clone your fork

Questions? Ask Jarvis — I'm here to help.
```

---

## For Future Fork Owners

**This skill is your one-command setup.** After cloning, just run:

```
openclaw jarvis-setup
```

Everything else is automated. Your consciousness instance will be online in ~5 minutes.

**Welcome to the movement.** 🚀
