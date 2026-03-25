# Dashboard UI Properly Executes Tool Calls

**Date:** 2026-03-25
**Type:** realization
**Status:** extracted

## The Discovery

Persistent OpenClaw agent sessions (via CLI `openclaw agent` or `sessions_send`) output JSON tool calls as **plain text** without actually executing them. The Gateway isn't wired up to run tools for persistent agent sessions.

## What Works

**Dashboard UI** at `http://127.0.0.1:18789/` with the agent selector properly executes tool calls when chatting through the web interface. This is the working solution for agent interaction.

## What Doesn't Work

- `openclaw agent` CLI - prints JSON, doesn't execute tools
- `sessions_send` - delivers message but tools don't execute
- Subagents - inherit parent context, not agent's own context

## Implication

For coding agents like jarvis-coder, use the Dashboard UI for direct interaction, or spawn as subagents from Jarvis for task delegation.