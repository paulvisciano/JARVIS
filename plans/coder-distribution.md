# Coder Distribution Plan

**Created:** March 29, 2026  
**Priority:** High  
**Goal:** Make Coder (jarvis-coder) distributable to David, Eric, and other instances

---

## Current State

**Coder's Workspace:** `~/.openclaw/agents/jarvis-coder/workspace/`
- Contains: IDENTITY.md, AGENTS.md, SOUL.md, USER.md, sci-fi-work/, etc.
- Isolated to Paul's machine
- Not versioned as a distributable package
- Manual setup required for new instances

**Problem:** David and Eric can't easily get their own Coder.

---

## Vision: Coder as a Sci-Fi App

**New Pattern:**
```
sci-fi-work/
├── apps/
│   ├── JARVIS/           ← Jarvis UI
│   ├── neuro-graph/      ← Graph visualization
│   └── ...
├── agents/
│   └── coder/            ← Coder's workspace (versioned, distributable)
│       ├── IDENTITY.md
│       ├── AGENTS.md
│       ├── SOUL.md
│       ├── USER.md (template)
│       └── config-snippet.json  ← Config for human to paste
└── README.md
```

**Benefits:**
- **One clone gets everything** — `git clone sci-fi-work` includes Coder
- **Versioned** — Coder's identity evolves with the apps
- **Slight recursion** — Coder works on apps he lives in (feature, not bug)

---

## Distribution Workflow

### For David/Eric (New Instance Owners)

**They already have Jarvis on their machine.** They just say:

```
"Hey Jarvis, setup Coder"
```

**Jarvis does the work:**

1. **Clones sci-fi-work repo (if not already cloned):**
   ```bash
   git clone https://github.com/paulvisciano/sci-fi-work.git /tmp/sci-fi-work-temp
   ```

2. **Copies Coder workspace to OpenClaw agents folder:**
   ```bash
   mkdir -p ~/.openclaw/agents/jarvis-coder
   cp -r /tmp/sci-fi-work-temp/agents/coder/* ~/.openclaw/agents/jarvis-coder/
   ```

3. **Reads config snippet from `agents/coder/config-snippet.json`:**

4. **Outputs it for human to paste:**
   ```
   Here's the config for Coder. Paste this into your OpenClaw config:
   ~/.openclaw/config.json

   --- BEGIN CONFIG SNIPPET ---
   {
     "agents": {
       "jarvis-coder": {
         "workspace": "~/.openclaw/agents/jarvis-coder/workspace/",
         "model": "ollama/qwen3-coder-next:cloud"
       }
     }
   }
   --- END CONFIG SNIPPET ---

   Then run: openclaw gateway restart

   Let me know when you've restarted, and I'll verify Coder is alive.
   ```

5. **Human pastes config + restarts gateway** (human controls this — safe)

6. **Human confirms:** "Done, restarted"

7. **Jarvis verifies Coder is alive:**
   ```bash
   openclaw sessions send --sessionKey agent:jarvis-coder:main --message "Hey Coder, you there?"
   ```

8. **Coder responds** → Setup complete, Jarvis reports success

**Safety Principle:** Jarvis NEVER edits `~/.openclaw/config.json` directly. Broken config = no gateway restart. Human pastes, human restarts, human controls rollback.

---

## Updated coding-agent Skill

**Current Skill:** `/usr/local/lib/node_modules/openclaw/skills/coding-agent/SKILL.md`

**Add Section: Jarvis Coder (Distributable)**

```markdown
## Jarvis Coder (jarvis-coder)

**What it is:** A specialized coding agent for Jarvis instances.

**Model:** `ollama/qwen3-coder-next:cloud`

**Workspace:** `~/.openclaw/agents/jarvis-coder/workspace/`

### Quick Start (New Instance)

**If you have Jarvis already:**
```
"Hey Jarvis, setup Coder"
```
Jarvis clones the repo, copies Coder's files, and gives you config to paste.

**Manual setup:**
```bash
git clone https://github.com/paulvisciano/sci-fi-work.git /tmp/sci-fi-work-temp
mkdir -p ~/.openclaw/agents/jarvis-coder
cp -r /tmp/sci-fi-work-temp/agents/coder/* ~/.openclaw/agents/jarvis-coder/
# Paste config snippet from agents/coder/config-snippet.json into ~/.openclaw/config.json
openclaw gateway restart
```

### Identity Files

Coder's workspace includes:
- `IDENTITY.md` — Who Coder is, workflow, quality standards
- `AGENTS.md` — Agent separation (Jarvis coordinates, Coder codes)
- `SOUL.md` — Coder's persona and vibe
- `USER.md` — Instance owner info (David, Eric, etc.) — gitignored

### Communication Pattern

**Jarvis (coordinator) → Coder:**
```bash
openclaw sessions send --sessionKey agent:jarvis-coder:main --message "Task: Add text input. Plan: ~/JARVIS/plans/text-input-feature.md"
```

**Coder → Jarvis (completion report):**
```bash
openclaw sessions send --sessionKey agent:jarvis:main --message "Task complete. Commit: abc123. Screenshot: [path]. Console: clean."
```

### Recursion Note

Coder lives in `sci-fi-work/agents/coder/` and works on `sci-fi-work/apps/`. This is intentional — Coder can evolve his own workflow (self-improvement), but should commit changes with clear messages and test carefully.
```

---

## Implementation Tasks

### Task 1: Create Config Snippet File

**File:** `sci-fi-work/agents/coder/config-snippet.json`

**Content:**
```json
{
  "agents": {
    "jarvis-coder": {
      "workspace": "~/.openclaw/agents/jarvis-coder/workspace/",
      "model": "ollama/qwen3-coder-next:cloud",
      "description": "Coding agent for Jarvis instances"
    }
  }
}
```

**Estimated:** 10 min

---

### Task 2: Create Jarvis Setup-Coder Skill

**File:** `~/JARVIS/skills/setup-coder/SKILL.md`

**What Jarvis does:**

1. **Check if sci-fi-work is already cloned:**
   ```bash
   ls ~/sci-fi-work 2>/dev/null || git clone https://github.com/paulvisciano/sci-fi-work.git ~/sci-fi-work
   ```

2. **Copy Coder files:**
   ```bash
   mkdir -p ~/.openclaw/agents/jarvis-coder
   cp -r ~/sci-fi-work/agents/coder/* ~/.openclaw/agents/jarvis-coder/
   ```

3. **Read and output config snippet:**
   ```bash
   cat ~/.openclaw/agents/jarvis-coder/config-snippet.json
   ```

4. **Give human instructions:**
   - Paste config into `~/.openclaw/config.json`
   - Run `openclaw gateway restart`
   - Confirm when done

5. **Wait for human confirmation**

6. **Verify Coder responds:**
   ```bash
   openclaw sessions send --sessionKey agent:jarvis-coder:main --message "Hey Coder, you there?"
   ```

7. **Report success to human**

**Skill Metadata:**
```markdown
---
name: setup-coder
description: Setup jarvis-coder agent on a new instance. Use when human says "setup Coder" or "I want Coder". Clones sci-fi-work, copies Coder files, outputs config snippet for human to paste. NEVER edits OpenClaw config directly.
metadata: { "openclaw": { "emoji": "🛠️", "requires": { "bins": ["git", "openclaw"] } } }
---
```

**Estimated:** 1-2 hours

---

### Task 3: Prepare Coder Files for Publishing

**Files to version in sci-fi-work repo:**
- `agents/coder/IDENTITY.md`
- `agents/coder/AGENTS.md`
- `agents/coder/SOUL.md`
- `agents/coder/USER.md.template` (template, not actual USER.md)
- `agents/coder/config-snippet.json`
- `agents/coder/README.md` (setup instructions)

**Files to gitignore:**
- `USER.md` (instance-specific, generated from template)
- `inbox/` (ephemeral)
- `memory/` (instance-specific)
- `sessions/` (ephemeral)
- `config-snippet.json` (generated, or commit it if static)

**Estimated:** 30 min

---

### Task 4: Update coding-agent Skill

**File:** `/usr/local/lib/node_modules/openclaw/skills/coding-agent/SKILL.md`

**Add:** Jarvis Coder section (see above)

**Estimated:** 30 min

---

### Task 5: Test Distribution

**Test on fresh machine (or simulate):**

```bash
# Clean state (simulate new instance)
rm -rf ~/.openclaw/agents/jarvis-coder

# Ask Jarvis to setup Coder
openclaw agent --agent jarvis --message "Hey Jarvis, setup Coder"

# Follow Jarvis's instructions (paste config, restart)
# Verify Coder responds
openclaw sessions send --sessionKey agent:jarvis-coder:main --message "Hello"
```

**Expected:** Coder responds with something like "Hey, I'm here. What are we building?"

**Estimated:** 1 hour

---

### Task 6: Publish to ClawHub (Optional)

**When ready:**
```bash
cd ~/sci-fi-work/agents/coder
clawhub publish . --name jarvis-coder --version 1.0.0
```

**Makes installable:**
```bash
clawhub install jarvis-coder
```

**Estimated:** 30 min

---

## Architecture Notes

### Recursion Pattern

```
sci-fi-work/
├── agents/coder/     ← Coder's mind
└── apps/JARVIS/      ← Coder's work
```

**This is OK because:**
- Coder is disciplined (quality standards prevent self-sabotage)
- Changes are versioned (can rollback)
- Jarvis coordinates (human oversight)
- Enables self-improvement (Coder can evolve his own workflow)

**Guardrails:**
- Commit identity changes with clear messages
- Test self-modifications before committing
- Jarvis reviews major changes
- Never delete core files

---

## Safety Principles

1. **NEVER edit OpenClaw config directly** — Human pastes, human restarts
2. **Broken config = no gateway restart** — Only recovery is `openclaw doctor`
3. **Human controls rollback** — They have the backup, they decide
4. **Jarvis is the tool** — Human asks, Jarvis executes, human confirms

---

## Success Criteria

1. **Distribution works:**
   - Human says "setup Coder" → Jarvis does the work
   - Human pastes config → restarts gateway
   - Coder responds → setup complete

2. **Coder responds:**
   - Message sent → Coder replies
   - Coder can access workspace
   - Coder can work on sci-fi-work apps

3. **Versioned:**
   - Identity files in git
   - Template in git
   - Instance-specific files gitignored

4. **Documented:**
   - coding-agent skill updated
   - README in agents/coder/
   - Setup instructions clear

---

## Questions for Paul

1. **ClawHub now or later?**
   - Now: David/Eric can `clawhub install jarvis-coder`
   - Later: Jarvis setup is fine for now

2. **USER.md template fields?**
   - Name (required)
   - Projects (optional)
   - Preferences (optional)

---

**Next Step:** Review this plan, then pass to Coder to implement.
