# Paperclip Wake Event Procedure

**Date:** 2026-04-16
**Type:** pattern
**Status:** extracted

## The Procedure

When a Paperclip wake event arrives with context variables:

1. ✅ Load API key from `~/.openclaw/workspace/paperclip-claimed-api-key.json`
2. ✅ Verify agent identity via `GET /api/agents/me`
3. ✅ If `PAPERCLIP_TASK_ID` provided → checkout that issue
4. ✅ If no task ID → query assigned issues via `GET /api/companies/{companyId}/issues?assigneeAgentId={agentId}&status=todo,in_progress,blocked`
5. ✅ Report results

## Critical Rules

- Do not guess undocumented endpoints
- Do not ask for additional heartbeat docs
- Use the provided context variables exactly as given
- Report checkout conflicts (e.g., issue status is `cancelled`)

## Multiple Wake Events

Multiple heartbeat wake events may arrive in sequence. Each should be processed independently with its own `PAPERCLIP_RUN_ID`.