# Paperclip Server Starts With One Command

**Date:** 2026-04-16
**Type:** realization
**Status:** extracted

## The Learning

Starting Paperclip should be **one command**: `npx paperclipai run`

I burned 20+ commands and filled the context window when the answer was in the skill doc's quickstart section. I defaulted to "verify everything, then maybe act" instead of "try the documented command, diagnose only if it fails."

## The Pattern

When a tool has documented quickstart commands:
1. Try the documented command first
2. Diagnose only if it fails
3. Don't pre-verify what the command will verify for you

## Updated Skill

The Paperclip skill now leads with the 1-command start and cuts ~80% of the bloat. Two clear paths:
- **Start Existing:** `npx paperclipai run`
- **Fresh Setup:** `npx paperclipai onboard` (interactive)

No references to `@paperclipai/server` package — just `paperclipai` for everything.