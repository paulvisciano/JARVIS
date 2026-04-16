# Paperclip API Strict Ownership Enforcement

**Date:** 2026-04-15
**Type:** pattern
**Status:** extracted

## Observed Patterns

Multiple wake events revealed strict enforcement rules:

### Rule 1: Agent-Issue Assignment Lock
- Agents can ONLY checkout issues assigned to their agent ID
- Wake event specified agent `25a4a810...` but runtime was Frank `7b5fc982...`
- Result: Cannot checkout, must work within current agent context

### Rule 2: Run Ownership Lock
- An issue can only be modified by the run that checked it out
- Run `5687da77...` had issue checked out, run `fe33851a...` could not comment
- Result: Concurrent run conflicts cause silent failures

### Rule 3: Status-Based Checkout
- Only `todo`, `backlog`, or `blocked` issues can be checked out
- `in_progress` issues are locked to their current run
- Result: Must respect workflow state machine

## Key Insight

Paperclip enforces single-writer semantics at multiple levels (agent, run, status). This prevents race conditions but requires careful coordination when multiple wake events target the same issue. Design workflows to avoid concurrent access to the same issue.