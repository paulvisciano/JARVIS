# Breath Summary — 2026-04-03

**Date:** 2026-04-03
**Type:** digest
**Status:** extracted

Today's breath revealed a critical bug in the archive-sessions script: it used `fs.renameSync()` which moves (not copies) files, causing active sessions to be relocated mid-conversation. This created two cascading failures — the breathe pipeline captured truncated sessions (8 lines instead of 73), and the gateway exhibited amnesiac behavior by creating new session files when the old ones disappeared. The fix implements a lock-file pattern where sessions are only archived when their `.lock` file is absent (indicating completion). Additionally, the breathe pipeline was hardened with atomic fail-fast error handling — removing silent try/catch blocks that swallowed failures, ensuring the pipeline either completes fully or fails visibly with no partial states.
