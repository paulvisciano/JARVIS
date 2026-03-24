# Package Configs Workflow for Collaboration

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

To resolve installation friction with Eric (Amsterdam Cafe session), created the `package-configs` skill.
**Problem:** Hardcoded paths in OpenClaw configs caused manual copying errors.
**Solution:**
1. Skill zips OpenClaw configs (`openclaw.json`, agent configs).
2. Commits and pushes to `origin/main`.
3. Eric pulls JARVIS repo, extracts zip, and installs.

This automates the handshake between developer environments, removing path dependency issues.