# Bootstrap First Reply Behavior

**Date:** 2026-03-24
**Type:** decision
**Status:** extracted

Corrected bootstrap behavior from returning `NO_REPLY` to reporting context.
**New Behavior:**
- First reply reports last topic, time, sessions, audio, neurograph stats, git breath.
- Provides continuity — not amnesiac, not bloated, just ready.
- Example output includes neurograph search test results.

This ensures the user knows the system remembers previous interactions immediately upon startup.