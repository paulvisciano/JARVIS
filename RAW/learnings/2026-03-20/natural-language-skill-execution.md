# Natural Language Skill Execution

**Pattern:** User speaks naturally → I execute the full pipeline

## Example
User: "Archive today"
→ `archive-collector` (organize files)
→ `context-extractor` (extract text)
→ `learning-creator` (synthesize insights)
→ `neuro-graph-sync` (sync disk → graph)

## Why This Matters
- **Accessible:** No need to remember skill names or commands
- **Intuitive:** Speak naturally, skills execute
- **Reliable:** Skills ensure consistency across machines

## Skills Involved
1. `archive-collector` — Organizes files by birthtime, verifies integrity
2. `context-extractor` — Extracts clean text from sessions/audio
3. `learning-creator` — Model synthesizes insights from context
4. `neuro-graph-sync` — Creates nodes for all files on disk

## Architecture
Natural language → Skill orchestration → Deterministic execution

---
**Created:** 2026-03-20
**Type:** Architecture pattern
**Category:** skill-orchestration
