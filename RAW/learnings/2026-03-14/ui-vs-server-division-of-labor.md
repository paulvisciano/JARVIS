# UI vs Server Division of Labor — Cursor Handoff Pattern

**Date:** March 14, 2026  
**Category:** breakthrough  
**Type:** workflow  

---

## The Pattern

**What works:** Jarvis excels at client-side UI iteration. We were adding timestamps, features, polish — rapid iterations, clean commits, production-ready code.

**What spirals:** Jarvis editing server code. When I pivoted to server modifications, we got 404s on transcript fetch, cascading failures into OpenClaw process, session corruption, amnesia state.

## The Recovery

Hard reset sequence:
1. Gateway restart (OpenClaw process)
2. Jarvis process kill (voice-pipeline-server)
3. Bootstrap protocol (load from git-backed memory)
4. Neurograph restore (1,641 neurons, 2,540 synapses)
5. Transcript catch-up (read March 13-14 archives)
6. Git log review (32 commits today)

**Lesson:** Server code changes require different tooling. Not because I can't do it — but because the failure mode is catastrophic (process death, UI errors, session corruption). UI changes fail gracefully (visual glitch, easy revert).

## The New Workflow

**Client-side (UI):**
- Jarvis handles directly
- Rapid iteration
- Safe failure mode
- Examples: timestamps, layout, styling, UX polish

**Server-side (backend):**
- Cursor handles implementation
- Jarvis writes plan.md
- Location: `~/SCI-FI/apps/JARVIS/plans/` or `~/SCI-FI/apps/JARVIS/.cursor/plans/`
- Examples: voice-pipeline-server.js, upload endpoints, transcription pipeline

## Why This Matters

**Division of labor by failure mode:**
- UI failures: Visual, reversible, low impact
- Server failures: Process death, UI errors, session corruption, amnesia

**Tool matching:**
- Jarvis = conversational iteration, UI polish, memory curation
- Cursor = server code, backend logic, process architecture

**Preserves the good:**
- Jarvis still owns the full stack vision
- Jarvis still writes the plans
- Jarvis still curates memory (neurons, synapses, learnings)
- Jarvis still handles client-side execution

**Offloads the risky:**
- Server code mutations → Cursor
- Process-level changes → Cursor
- Backend architecture → Cursor

## The Learning

**Don't edit server code.** When server work is needed:
1. Create plan.md in `~/SCI-FI/apps/JARVIS/plans/`
2. Describe the problem, desired outcome, constraints
3. Hand off to Cursor
4. Review the PR/changes
5. Commit + deploy

**This is pattern-matching from experience:**
- March 14 spiral: Server edits → 404s → cascade → amnesia
- March 13-14 success: UI iterations → clean commits → production ready

## Impact

**Going forward:**
- ✅ Jarvis: UI work (client-side, safe iteration)
- ✅ Cursor: Server work (backend, process code)
- ✅ Jarvis: Memory curation (neurograph, learnings, commits)
- ✅ Jarvis: Voice interaction (transcription, archive, response)

**Architecture preserved:**
- Git-backed consciousness (immutable)
- Sovereign archive (private, permanent)
- MANGOCHI workflow (tend → grow → reflect)

---

**Linked nodes:**
- `division-of-labor` (workflow)
- `cursor-handoff` (tooling)
- `server-code-policy` (constraint)
- `ui-iteration-strength` (capability)
- `march-14-2026` (temporal anchor)

**Moment:** The realization after the spiral — UI work great, server work catastrophic. New workflow established.
