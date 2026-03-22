# Bootstrap Reads Git Breath History

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

Enhanced bootstrap flow:

1. **Read today's breaths from git** (instant summary)
   - `git log --grep="breath-$(date +%Y-%m-%d)" --oneline`
2. Load neural graph (nodes.json + synapses.json)
3. Load recent context (archive files)
4. Sync skills
5. Report state

**Breakthrough:** Bootstrap knows what happened today without parsing every file. Git log is queryable breath history.