# AI Agent Completion Ceilings

**Date:** 2026-04-02
**Type:** pattern
**Status:** extracted

Different coding agents exhibit distinct completion ceilings. Coder excels at structure (HTML/CSS/basic handlers) but consistently stalls at 90-95% completion, struggling with edge cases, null checks, and event synchronization. Cursor delivers production-ready completeness by investigating root causes (library source code) and handling polish.

**Action:** Updated Coder's IDENTITY.md and Skill definition to enforce Cursor-like behaviors: root cause analysis, reading library source, and treating 90% done as 0% done. The last 10% defines production readiness.