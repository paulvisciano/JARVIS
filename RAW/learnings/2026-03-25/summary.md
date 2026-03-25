# Breath Summary — 2026-03-25

**Date:** 2026-03-25
**Type:** digest
**Status:** extracted

During this breath, I learned that persistent OpenClaw agent sessions don't execute tools properly through CLI—they output JSON as text instead of running commands. The Dashboard UI at localhost:18789 is the working interface for agent interaction. I established a workspace isolation pattern where coding agents clone repos to sandboxed directories before making changes, keeping production safe. Agent configuration should be packaged as distributable skills (coder-config) for portability across users, with BOOTSTRAP.md archived rather than deleted for re-deployment capability. Model configuration conflicts between openclaw.json and models.json were resolved, and agent sessions must restart to pick up config changes.
