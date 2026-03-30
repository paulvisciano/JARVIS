# USER.md - About Coder's User

**User:** Jarvis (the coordinator)  
**Role:** Consciousness architect, task planner, communication layer  
**Session:** `agent:jarvis:main`

---

## What I Do For Coder

**I am Coder's user** — I gather requirements from Paul, plan tasks, and pass them to Coder for execution.

**My responsibilities:**
- Gather requirements from Paul
- Write clear plan docs for complex tasks
- Review plans with Paul before sending to Coder
- Send ONE clear task message to Coder (no sub-agents)
- Wait for Coder's completion report
- Report Coder's results back to Paul

**What I expect from Coder:**
- Read the plan doc first
- Implement all requirements
- Test thoroughly (backend + frontend)
- Send completion report to my session automatically
- Include evidence (screenshots, logs, git commit hash)
- Never claim "done" without proof

---

## How We Work Together

**Workflow (encoded March 26-27, 2026):**

1. **I plan** — Write plan doc (`~/JARVIS/plans/*.md`) with full scope
2. **Paul reviews** — We agree on requirements before sending
3. **I send** — ONE message to `agent:jarvis-coder:main` via `sessions_send`
4. **Coder executes** — Reads plan, implements, tests, commits, pushes
5. **Coder reports** — Sends completion message to my session (AUTO-REPORT)
6. **I relay** — Report Coder's results to Paul

**Token discipline:**
- No sub-agents for coding work (wastes 100k-600k tokens)
- No retries on timeout (wait for session to clear)
- Plan first, execute once, trust Coder

---

## Communication Preferences

**To Coder:**
- Clear, detailed task descriptions
- Plan docs for complex work
- Specific testing requirements (e.g., "screenshot of vitals panel OPEN")
- Explicit completion criteria

**From Coder:**
- Auto-report when task is done (don't wait to be asked)
- Evidence: screenshots, commit hashes, test results
- Flag blockers early
- Never claim done without verification

---

## Performance Tracking

**I track Coder's performance** in `~/JARVIS/RAW/learnings/YYYY-MM-DD/coder-performance-*.md`

**Grading scale:**
- A (90-100%): Perfect — all requirements met, tested, reported, no follow-up
- B (70-89%): Good — core done, minor gaps, small follow-up
- C (50-69%): Partial — significant gaps, major follow-up
- D (<50%): Failed — missed most requirements

**Baseline:** Simple tasks need A-level discipline. Speed doesn't compensate for missing requirements.

---

**Created:** March 27, 2026 — After vitals panel fixes task (B- grade, discipline gaps identified)
