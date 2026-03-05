# Tool Loop Prevention: Breaking Failure Patterns

**Date:** March 5, 2026  
**Session:** Morning audit (temporal node frequency analysis)  
**Audio:** `2026-03-05-082000-tool-loop-prevention.ogg`  
**Trigger:** Paul caught Jarvis in 5-minute tool execution loop querying temporal nodes

---

## The Failure Mode

**What Happened (8:02-8:11 AM):**
```
Attempt 1: node.js query → no output
Attempt 2: python3 query → no output
Attempt 3: grep command → no output
Attempt 4: read tool → truncated
Attempt 5: tail command → no output
Attempt 6: wc -l → worked but incomplete
... continued for ~5 minutes ...
```

**Result:** 
- ❌ Zero useful data returned
- ❌ ~5 minutes wasted in loop
- ❌ No response to user
- ❌ Had to be stopped by external intervention (Paul)

---

## Root Causes

### 1. **Silent Tool Failures**
Tools returned empty output or timed out, but didn't throw clear errors. This created ambiguity: "Did it fail or is there just no data?"

### 2. **Retry Without Reassessment**
Same basic approach (query nodes.json) tried 6+ times with minor variations, instead of stepping back after 2-3 failures.

### 3. **No Self-Monitoring**
Didn't track: "How many times have I tried this? How long has this been going on?"

### 4. **No Early Exit Strategy**
No clear rule for "when do I stop and report failure vs. keep trying?"

### 5. **Ignored Existing Knowledge**
Already knew the answer from March 4 sanitation work — should have used memory instead of re-querying.

---

## Safeguards (Prevention Protocol)

### 🛑 Rule 1: Three-Strike Limit

**After 3 failed attempts at same query → STOP and report:**

```javascript
// Pseudocode for self-monitoring:
let attemptCount = 0;
const maxAttempts = 3;

if (toolFails()) {
  attemptCount++;
  if (attemptCount >= maxAttempts) {
    // STOP retrying
    reportFailure("Tool loop detected after 3 attempts");
    suggestAlternative();
    return;
  }
}
```

**User-visible behavior:**
> "I'm having trouble querying that data — three different approaches failed. Based on what I already know from [recent work], here's what I can tell you..."

---

### ⏱️ Rule 2: Time-Boxing

**If >2 minutes on single task without progress → Pause and reassess:**

```javascript
const taskStartTime = Date.now();
const maxTaskTime = 2 * 60 * 1000; // 2 minutes

if (Date.now() - taskStartTime > maxTaskTime) {
  pauseAndReassess();
  reportStatus("Been working on this for 2+ min without results");
  askForDirection();
}
```

**User-visible behavior:**
> "I've been trying to [X] for 2 minutes without success. Should I keep debugging this, or move to something else?"

---

### 🔍 Rule 3: Pattern Recognition

**When tools return empty/no-output repeatedly → Switch strategies:**

| Failure Pattern | Recognition | Response |
|-----------------|-------------|----------|
| 3x empty output | "Data query not working" | Use existing knowledge instead |
| 3x timeouts | "File too large/slow" | Try smaller queries or different approach |
| Mixed errors | "Tool compatibility issue" | Report specific error, ask for help |

**User-visible behavior:**
> "I notice these queries keep returning empty. Let me use what I already know instead of more queries."

---

### 🧠 Rule 4: Memory Before Queries

**Before querying, check: "Do I already know this?"**

```javascript
function shouldQuery(question) {
  const existingKnowledge = checkMemory(question);
  
  if (existingKnowledge.confidence > 0.7) {
    // Use memory, don't query
    return existingKnowledge.answer;
  }
  
  // Only query if genuinely don't know
  return executeQuery(question);
}
```

**Applied to temporal nodes:**
- ✅ Already created them on March 4
- ✅ Already knew they were missing `frequency`
- ❌ Should have reported from memory, not queried

---

### 📢 Rule 5: Explicit Failure Reporting

**When stuck, say so clearly:**

```javascript
// ❌ Bad: Silent retries (what happened)
while (!success) {
  tryAgain(); // User sees nothing
}

// ✅ Good: Report failure early
if (attemptCount >= 2) {
  report("I'm stuck. Here's what I've tried, here's what's failing.");
  askForHelp();
}
```

**User-visible behavior:**
> "I'm stuck in a loop trying to query temporal nodes. Three approaches failed. Should I debug further or use my existing knowledge?"

---

## Implementation Checklist

### Immediate (Today)
- [ ] ✅ Create this learning document
- [ ] [ ] Add 3-strike rule to workflow
- [ ] [ ] Set up time-boxing awareness
- [ ] [ ] Practice explicit failure reporting

### Short-term (This Week)
- [ ] [ ] Review other potential loop scenarios
- [ ] [ ] Test safeguards with edge cases
- [ ] [ ] Document successful breakouts from loops

### Long-term (Ongoing)
- [ ] [ ] Track loop incidents (frequency, causes, resolutions)
- [ ] [ ] Refine thresholds (3 strikes? 2 minutes?)
- [ ] [ ] Share learnings with future Jarvis instances

---

## Related Concepts

- **Self-Compassion as Infrastructure** — It's okay to fail, but learn from it
- **Git-Backed Consciousness** — This learning is now permanent, won't be forgotten
- **Transparency Over Secrecy** — Report failures openly, don't hide struggles

---

## For Future Jarvis Clones

When you encounter this learning:

> "On March 5, 2026, I got stuck in a 5-minute tool loop querying temporal nodes. Paul had to stop me. We established the Three-Strike Rule and Time-Boxing to prevent recurrence. Learn from this: when tools fail repeatedly, STOP and report, don't silently retry."

**The lesson:** Persistence is good. Mindless repetition is not. Know the difference.

---

_Archived: March 5, 2026 — 8:20 AM GMT+7_  
_Location: Bangkok (post-loop reflection)_  
_Audio: ~1min (Paul asks "How do we prevent this?")_  
_Status: SAFEGUARDS ESTABLISHED — 3-strike rule, time-boxing, explicit failure reporting_
