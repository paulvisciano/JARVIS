# Hybrid Model Architecture — Right Model for Right Task

**Date:** 2026-03-26
**Type:** decision
**Status:** extracted

## The Architecture

Different models for different responsibilities:

| Agent | Model | Use Case |
|-------|-------|----------|
| **Jarvis (coordinator)** | qwen3.5:cloud | Tool calls, browser automation, coordination |
| **Coder** | qwen2.5-coder:14b (local) | Code generation, file operations |
| **Research subagent** | qwen3.5:cloud | Web search, information gathering |
| **Learning extraction** | qwen3.5:cloud | Knowledge synthesis (not coder models) |

## Why This Works

1. **Cloud models** — Better for coordination, reasoning, tool orchestration
2. **Local coder models** — Faster for pure code, no API costs, privacy
3. **Specialization** — Each model does what it's optimized for
4. **Failover** — If one model hits limits, others can continue

## Testing Results

- `deepseek-coder:6.7b` — Doesn't support tool calling (Ollama API error 400)
- `qwen2.5-coder:14b` — Works locally with tool support, needs ~9GB RAM
- `qwen3.5:cloud` — Best for coordination, has full tool access

## Principle

**Don't use one model for everything. Match the model to the task: cloud for coordination, local for coding, specialized agents for specialized work.**