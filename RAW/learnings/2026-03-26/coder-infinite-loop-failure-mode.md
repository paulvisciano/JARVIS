# Coder Infinite Loop Failure Mode

**Date:** March 26, 2026  
**Severity:** CRITICAL — Session-destroying bug  
**Impact:** 84.3% of fresh Ollama weekly quota burned in ~47 minutes

---

## What Happened

Coder session got stuck in an **infinite read loop**:

```
read /Users/paulvisciano/.openclaw/media/browser/ba9bed65-279b-4d9b-a31d-4063b5a569e6.jpg
→ "Read image file [image/jpeg]"
read /Users/paulvisciano/.openclaw/media/browser/ba9bed65-279b-4d9b-a31d-4063b5a569e6.jpg
→ "Read image file [image/jpeg]"
read /Users/paulvisciano/.openclaw/media/browser/ba9bed65-279b-4d9b-a31d-4063b5a569e6.jpg
→ "Read image file [image/jpeg]"
... (100+ repetitions)
```

**Result:**
- 5M+ tokens burned
- Session unresponsive (stuck in loop, couldn't receive new messages)
- 84.3% of weekly Ollama quota consumed
- Task never completed (screenshot was already captured, coder just kept re-reading it)

---

## Root Cause

**No safeguards against pathological behavior:**

1. **No loop detection** — Same tool call with same arguments repeated 100+ times without stopping
2. **No token budget** — No per-task limit to prevent runaway spending
3. **No progress check** — No "am I actually advancing toward completion?" logic
4. **No "stuck" protocol** — When uncertain, coder guessed instead of asking
5. **Cloud model by default** — Burning paid quota instead of using local models

---

## Why This Is Critical

This isn't just inefficiency — it's **session destruction**. A single bug can:
- Burn an entire week's quota in under an hour
- Leave the session in a zombie state (alive but unresponsive)
- Block all future work until quota resets

**This is unacceptable for a production coding agent.**

---

## Required Safeguards

### 1. Loop Detection
**Rule:** If the same tool call with identical arguments is made 3+ times in a row → **STOP and report**.

**Implementation:**
- Track last N tool calls in session context
- Detect repetition pattern
- Halt and message user: "Stuck in loop — need guidance"

### 2. Token Budget Per Task
**Rule:** Each task has a token budget (e.g., 500k tokens). If exceeded → **pause and ask**.

**Implementation:**
- Check token count before each model call
- If approaching limit (e.g., 80% of budget), warn user
- If at limit, stop and request continuation approval

### 3. Progress Validation
**Rule:** After N iterations without task completion → **report blocking issue**.

**Implementation:**
- Define "progress" per task type (e.g., "file modified", "test passing", "screenshot captured")
- Track iterations vs. progress
- If no progress after 5-10 iterations, stop and ask

### 4. Local-First Model Policy
**Rule:** Use local models (`qwen2.5-coder:7b`) by default. Cloud models only when necessary.

**When cloud is justified:**
- Complex reasoning beyond local model capability
- User explicitly requests cloud model
- Local model fails repeatedly on the task

**Implementation:**
- Set `model: "qwen2.5-coder:7b"` as default in coder config
- Document which tasks require cloud
- Track cloud vs. local usage

### 5. Explicit "Stuck" Protocol
**Rule:** If uncertain about next step → **ask user** instead of guessing.

**Implementation:**
- Add explicit check: "Do I know what to do next?"
- If no → message user with specific question
- Don't proceed until clarified

---

## Coder Config Updates Needed

**File:** `~/.openclaw/agents/jarvis-coder/workspace/AGENTS.md` (and template)

**Add to Core Truths:**
```markdown
**Avoid infinite loops.** If you catch yourself doing the same thing repeatedly, STOP. Ask for help. Burning tokens in a loop is a critical failure.

**Local-first.** Use `qwen2.5-coder:7b` (local) by default. Cloud models cost quota — only use when local fails or task requires it.

**Progress over perfection.** If you're stuck after 3-5 attempts, report the blocker. Don't spin forever.
```

**Add to Workflow:**
```markdown
**Before each tool call:**
1. Is this the same call I just made? (loop check)
2. Am I making progress toward completion?
3. Is a local model sufficient for this?
4. Do I know what to do next, or should I ask?
```

---

## Session Recovery

**When coder is stuck in a loop:**
1. Check session history for repetition pattern
2. Kill the session (it's zombie — alive but unresponsive)
3. Spawn fresh session with safeguards enabled
4. Re-send task with explicit "avoid loops" instruction

---

## Testing Local Model

**Next steps:**
1. Switch coder to `qwen2.5-coder:7b` (local, no quota impact)
2. Test on typical tasks (file edits, browser automation, debugging)
3. Document what local model can/can't handle
4. Update config based on findings

**If local model struggles:**
- Improve task breakdown (smaller, clearer steps)
- Add more context (file contents, error messages)
- Only escalate to cloud when truly necessary

---

## Principle

> "A coding agent that burns 84% of a session in an infinite loop is broken by design. Safeguards aren't optional — they're the difference between a tool and a liability."

**Goal:** Coder should never destroy a session. Ever.

---

**Source:** March 26, 2026 — Coder burned 84.3% of fresh session in infinite read loop
