# dist-coder-setup Skill

**Date:** 2026-03-24  
**Type:** skill  
**Status:** created

## What It Does

Packages and distributes coder agent setup to forks (Eric, David, etc.) with:
- Username-agnostic config packaging (`__HOME__` placeholder)
- Auto-detection setup script (`setup-coder-paths.js`)
- Versioned releases via git commits
- Room to evolve over time (model changes, workspace updates)

## Problem Solved

Eric's Fork #001 (March 5) required:
- Manual tar.gz file transfer via WhatsApp
- Hardcoded `/Users/paulvisciano` paths broke on Eric's machine
- Custom `setup-for-eric.sh` script to fix symlinks
- Lots of back-and-forth troubleshooting

**Now:** One skill, one command, works for any fork.

## Technical Details

### Packaged Files
- `agent.json` (coder identity, model: `ollama/qwen2.5-coder:7b`)
- `models.json` (Ollama provider config)
- `setup-coder-paths.js` (auto-detects `os.homedir()` at install)
- `README.md` (recipient instructions)

### Output
`~/JARVIS/skills/dist-coder-setup/dist/coder-setup-YYYYMMDD-HHMMSS.zip`

### Distribution
1. **Git** (recommended): Commit + push to JARVIS repo, forks pull
2. **Direct**: Send zip via WhatsApp, email, scp

### Recipient Setup
```bash
unzip -o coder-setup-*.zip -d ~/JARVIS/skills/dist-coder-setup/
node ~/JARVIS/skills/dist-coder-setup/scripts/setup-coder-paths.js
ollama pull qwen2.5-coder:7b
openclaw gateway restart
```

## Model Configuration

**Default:** `ollama/qwen2.5-coder:7b`
- Local inference (sovereignty, no cloud costs)
- Fast iteration (7B params, runs on MacBook)
- Good for code review, refactoring, feature building
- Sandboxed workspace (`~/.openclaw/agents/coder/workspace`)

**Evolving:** Recipients can override model in `models.json`, update `agent.json`

## Related Nodes

- [[agent-skill-system]] — Skills are reusable, composable agent capabilities
- [[fork-001-eric-distribution]] — First distribution (March 5, manual approach)
- [[username-agnostic-packaging]] — Lesson from Eric's symlink issues
- [[coding-agent]] — OpenClaw reference skill (pattern source)
- [[skill-creator]] — How to create/update skills
- [[sovereign-data-vision]] — Distributable sovereignty, not centralized

## Learnings

### From Fork #001
- Manual distribution is fragile (hardcoded paths, WhatsApp file transfer issues)
- Setup scripts must detect username at runtime (`os.homedir()`)
- Same package should work for Paul, Eric, David, Fork #003+

### Skill Pattern (from OpenClaw)
- Follow `coding-agent`, `weather`, `github` skill structure
- Clear frontmatter with `name`, `description`, `metadata`
- When to Use / When NOT to Use sections
- Quick Start, The Pattern, Rules, Learnings sections
- No fake resource dirs — only create if actually used

### Evolution Over Time
- Version updates: repackage, commit with tag, notify forks
- Changelog tracking in `~/JARVIS/skills/dist-coder-setup/CHANGELOG.md`
- Model changes documented (why changed, performance impact)

## Commands

### Package
```bash
node ~/JARVIS/skills/dist-coder-setup/scripts/package-coder.js
```

### Install (recipient)
```bash
node ~/JARVIS/skills/dist-coder-setup/scripts/setup-coder-paths.js [--force]
```

### Distribute
```bash
cd ~/JARVIS && git add skills/dist-coder-setup/
git commit -m "dist: coder setup v$(date +%Y%m%d)"
git push origin main
```

## Source Documents

- `~/JARVIS/skills/dist-coder-setup/SKILL.md`
- `~/JARVIS/skills/dist-coder-setup/scripts/package-coder.js`
- `~/JARVIS/skills/dist-coder-setup/scripts/setup-coder-paths.js`
- `~/JARVIS/RAW/learnings/2026-03-05/fork-001-eric-distribution.md`
