# File Move vs Copy Date Retention

**Timestamp:** 10:12 GMT+7 (March 16, 2026)  
**Type:** operational-rule  
**Category:** learning

---

## Insight

macOS file operations behave differently for metadata preservation:

- **`mv` (move)** → preserves original "Created" date
- **`cp` (copy)** → resets "Created" date to current time

When archiving files (screenshots, audio, etc.), using `cp` destroys temporal metadata even if the filename preserves the original date.

---

## Evidence (from Transcript)

**10:12** — Paul observed:
> "something interesting i just noticed when you move those screenshots from the desktop into the archive the dates on them well one the date modified shows up is uh today at 10 0 8 a.m which makes sense that's when they were moved but if i open the info for the file the created on date also says 10 0 8 because you probably copied them instead of moving them over um so for the future make sure you move them over so they retain their date and right now the dates are part of the name of the file which is good so at least we have that but that's the actual date that they were created"

**Observation:**
- Files moved at 10:08 AM
- "Date Modified" = 10:08 AM (correct — when moved)
- "Created On" = 10:08 AM (wrong — should be original capture date)
- Filename contains original date (e.g., `20260316-101706-...`)
- But filesystem metadata lost due to `cp` operation

---

## Rule

**Always use `mv` (move) for archival operations.**

Never use `cp` (copy) — it destroys temporal metadata. The filename preserves the date, but filesystem metadata should too for consistency and forensic integrity.

---

## Applied To

1. **Screenshot archival script** (`archive-screenshots.sh`)
2. **Audio file archival** (JARVIS server `archiveRecording()`)
3. **All future archive operations**

---

## Implementation

```bash
# Wrong (destroys metadata)
cp ~/Desktop/20260316-101706-screenshot.png ~/RAW/archive/2026-03-16/images/

# Correct (preserves metadata)
mv ~/Desktop/20260316-101706-screenshot.png ~/RAW/archive/2026-03-16/images/
```

---

## Related Nodes

- `temporal-march-16` (Temporal)
- `transcript-march-16` (Archive)
- `script-consolidation-pattern` (Learnings)

---

## Synapses

- `file-move-vs-copy` → `temporal-march-16` (temporal, learned on)
- `file-move-vs-copy` → `transcript-march-16` (references, documented in)
- `file-move-vs-copy` → `script-consolidation-pattern` (related, same session)

---

**Archived:** March 16, 2026, 22:03 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, neurograph integrated
