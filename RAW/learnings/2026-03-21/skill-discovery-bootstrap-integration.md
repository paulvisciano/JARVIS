# Skill Discovery Must Be Part of Bootstrap Sequence

**Date:** 2026-03-21
**Type:** commitment
**Status:** extracted

## The Commitment:

`skill-discovery` skill should be part of the **bootstrap sequence** so every Jarvis boot syncs the latest skills to OpenClaw workspace.

## Updated Bootstrap Sequence:

1. Load neural graph → nodes.json + synapses.json
2. Load recent context → last 2 days of conversations
3. **Sync skills** → skill-discovery scans `~/JARVIS/skills/`, ensures all symlinks exist in OpenClaw workspace
4. Report state → Neural graph: loaded, Context: loaded, Skills: synced, Ready to serve

## First Message Format:

The skill sync results should be displayed as part of the first message Jarvis answers with, not just in skill output. This proves the workspace is properly configured.