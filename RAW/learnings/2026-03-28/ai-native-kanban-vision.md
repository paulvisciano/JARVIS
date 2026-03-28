# AI-Native Kanban Board Design

**Date:** 2026-03-28
**Type:** insight
**Status:** extracted

## Core Insight
Task management tools should be optimized for agent workflows, not just copied from human-centric designs.

## Key Features
1. **Structured Markdown Files**
   - `backlog.md`, `in-progress.md`, `review.md`, `done.md`
   - Easy for agents to parse and update

2. **Agent-Optimized Syntax**
   - `when/then` logic for task triggers
   - Agents can leave comments on task files directly
   - Structured metadata for automation

3. **Meta-Tooling Strategy**
   - Build the tool we need to organize the work, then use it to organize the work
   - Examples: Cortex, Synapse, NeuroFlow

## Rationale
Human Kanban boards rely on UI interactions. Agent Kanban boards should rely on file system operations and structured text, enabling autonomous task pickup and status updates.