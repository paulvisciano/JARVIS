# Model Selection: Learning vs Coding Tasks

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

## The Decision

Different tasks require different models — **learning is not coding**.

## What We Learned

**For Learning Tasks** (knowledge extraction, synthesis, reasoning):
- Use: `qwen3.5:cloud`
- Why: Optimized for knowledge extraction, synthesis, learning, reasoning
- Output: Clean JSON, no "Thinking..." prefix

**For Coding Tasks** (code generation, syntax, refactoring):
- Use: `qwen2.5-coder:7b`
- Why: Optimized for code generation, syntax awareness, implementation
- Output: Code-focused, implementation-ready

## Why This Matters

Using the wrong model causes:
- JSON parsing failures (coder model adds "Thinking..." prefix)
- Infinite retry loops (looks frozen to user)
- Poor knowledge synthesis (coder model isn't trained for reasoning)

## Implementation

The web-learn skill was updated to use `qwen3.5:cloud` instead of `qwen2.5-coder:7b` because:
- We're extracting insights from web content
- Synthesizing knowledge
- Creating structured learnings
- Not writing code

**Rule:** Match the model to the task type, not the agent name.