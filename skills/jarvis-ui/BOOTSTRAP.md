# Jarvis UI Skill — First-Run Setup

This folder will be symlinked to the actual skill location on first run.

**After SCI-FI repo is cloned:**
```bash
ln -s ~/JARVIS/skills/jarvis-ui/sci-fi/apps/jarvis-ui-skill ~/JARVIS/skills/jarvis-ui-active
```

**Or the skill handles this automatically** — see `setup.js` for the symlink creation logic.
