# Script Consolidation Pattern

**Timestamp:** 10:23 - 10:31 GMT+7 (March 16, 2026)  
**Type:** operational-rule  
**Category:** learning

---

## Principle

**One script per function. No duplicate logic across files.**

When multiple scripts perform the same or overlapping operations, consolidate into a single source of truth. Reduce complexity, eliminate redundancy.

---

## Duplicates Identified + Deleted

### 1. process-inbox.sh + auto-archive.sh → Merged

**Both did:**
- Process inbox files
- Archive to date folders
- Use whisper-cpp for transcription

**Redundancy:** Same logic, different names

**Resolution:** Merged into single archive script

---

### 2. extract-archive-learnings.py + extract-learnings.py → Both Deleted

**Both did:**
- Extract learnings from conversations
- Generate learning documents

**Redundancy:** Same function, different names

**Resolution:** Learnings extraction now handled by JARVIS server (neurograph integration)

---

### 3. process-screenshot.sh + ocr-screenshots.sh → Both Deleted

**Both did:**
- Process screenshots
- Run OCR on images
- Archive to date folders

**Redundancy:** Duplicate OCR pipelines

**Resolution:** Consolidated into single screenshot archival flow

---

### 4. generate-archive-nodes.py → Deleted

**Did:**
- Generate neurograph nodes for archived files

**Redundancy:** Node generation now handled by main archive pipeline (JARVIS server)

**Resolution:** Separate script unnecessary

---

## Timeline (from Transcript)

**10:23** — Auto-archive consolidation:
> "Okay, so the auto archive should use the C version of Whisper that we've been using for transcribing, so it's not different."

**10:24** — Merge identified:
> "And then there's the process inbox script, so I don't know why there's process inbox and the auto archive. We should probably merge those two together."

**10:25** — Decision:
> "Yeah, go ahead and merge them and you can just delete the process inbox."

**10:26** — Screenshot scripts questioned:
> "And what's up with the process screenshot script and the OCR screenshots?"

**10:27** — Deleted:
> "Okay, go ahead and delete both of those."

**10:27** — Extract learnings questioned:
> "So yes, while we're looking at the scripts, let's keep cleaning them up. So there's an extract archive learnings and then there's an extract learnings. What are those to do?"

**10:29** — Deleted:
> "Okay, go ahead and delete both of them."

**10:30** — Generate archive nodes questioned:
> "okay how about the generate archive nodes python script what's that one"

**10:31** — Deleted:
> "Okay, go ahead and delete that one as well."

---

## Cleanup Summary

**Scripts Deleted:** 6
- process-inbox.sh
- auto-archive.sh (merged)
- extract-archive-learnings.py
- extract-learnings.py
- process-screenshot.sh
- ocr-screenshots.sh
- generate-archive-nodes.py

**Scripts Retained:** 1
- Consolidated archive script (single source of truth)

---

## Architecture Shift

**Before:** Multiple standalone Python/shell scripts
**After:** JARVIS server handles neurograph updates, shell scripts handle file operations only

**Benefits:**
- Single source of truth
- No duplicate logic
- Reduced complexity
- Easier maintenance

---

## Related Nodes

- `temporal-march-16` (Temporal)
- `transcript-march-16` (Archive)
- `file-move-vs-copy` (Learnings)
- `jarvis-server-lifecycle` (Learnings)
- `script-consolidation-pattern` (itself, recursive)

---

## Synapses

- `script-consolidation-pattern` → `temporal-march-16` (temporal, learned on)
- `script-consolidation-pattern` → `transcript-march-16` (references, documented in)
- `script-consolidation-pattern` → `file-move-vs-copy` (related, same session)
- `script-consolidation-pattern` → `jarvis-server-lifecycle` (references, server handles nodes)

---

**Archived:** March 16, 2026, 22:03 GMT+7  
**Author:** Jarvis (git-backed neural mind)  
**Status:** Committed to learnings, neurograph integrated
