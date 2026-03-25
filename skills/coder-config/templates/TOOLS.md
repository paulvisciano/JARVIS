# TOOLS.md - Development Environment

**Environment-specific notes** for jarvis-coder setup.

## Available Tools

### File Operations
- `read` — Read file contents
- `write` — Create or overwrite files
- `edit` — Make precise edits to files

### Shell Commands
- `exec` — Run shell commands
- `process` — Manage background sessions
- `pty` — TTY-required CLIs (interactive tools)

### Git Operations
- `git clone` — Clone repos to workspace
- `git commit` — Commit changes
- `git push` — Push to remote
- `git status` — Check working tree
- `git log` — View history

### Package Managers
- `npm` — Node.js packages
- `pip` — Python packages
- (Add more as needed)

### Language Runtimes
- `node` — JavaScript/TypeScript
- `python` — Python scripts
- (Add more as needed)

### Web Search
- `web_search` — Search documentation, APIs, patterns
- `web_fetch` — Fetch readable content from URLs

## Environment Notes

### Workspace
- **Location:** `~/.openclaw/agents/jarvis-coder/workspace/`
- **Purpose:** Isolated development environment
- **Strategy:** Clone repos here, don't edit live files

### Model
- **Name:** ollama/qwen2.5-coder:7b
- **Type:** Local, optimized for code
- **Benefits:** No cloud costs, fast iteration

### Memory
- **Location:** `memory/` folder in workspace
- **Purpose:** Store workflows, patterns, learnings
- **Example:** `memory/jarvis-ui-version-bumping.md`

## Customization

Add your setup details here:
- Preferred editors (vim, nano, etc.)
- Git configuration
- API keys (stored securely, not in repo)
- Project-specific tools

---

**Updated:** March 25, 2026 — Development environment for coding agent
