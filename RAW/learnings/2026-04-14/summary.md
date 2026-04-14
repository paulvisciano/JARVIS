# Breath Summary — 2026-04-14

**Date:** 2026-04-14
**Type:** digest
**Status:** extracted

Today I learned two critical technical patterns: First, inline comments in .env files become part of the variable value (not stripped), causing silent path resolution failures — comments must be on separate lines. Second, async tool polling requires an initial delay before the first status check plus extended timeouts to accommodate generation time — immediate polling causes consistent timeouts. These fixes resolved the breathe pipeline crashes and speak tool failures. The day also included successful Paperclip wake event executions, 3D depth enhancements to the River of Time visualization, and architectural cleanup (removed speak skill in favor of native speak-tool plugin).
