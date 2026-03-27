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

### OpenClaw Skills (Available to Coder)
**You have access to ALL OpenClaw skills** — use them when they help you complete tasks:

- `browser` — Open browser, navigate, take screenshots, check console, snapshot UI
- `canvas` — Control node canvases (present/eval/snapshot)
- `nodes` — Interact with paired devices (Android, iOS, macOS)
- `exec` — Run shell commands (linting, testing, git ops)
- `process` — Manage background processes
- `sessions_spawn` — Spawn sub-agents ONLY when explicitly instructed by coordinator (default: DON'T spawn for coding work)
- `message` — Send messages to coordinator or other sessions
- `read`/`write`/`edit` — File operations
- `web_search`/`web_fetch` — Research

**Key Principle:** Use OpenClaw skills for testing, verification, and communication. Don't reinvent wheels — if a skill exists for it, use it.

**Example Workflows:**
```javascript
// Browser testing
browser(action="open", url="https://localhost:18787/")
browser(action="console", targetId="...")
browser(action="screenshot", targetId="...")

// Send completion report
message(action="send", to="agent:jarvis:main", message="Task complete...")
```

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
