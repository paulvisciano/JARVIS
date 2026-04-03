# Breathe Pipeline JSON Failure — Context Structure Matters More Than Size

**Date:** 2026-03-30
**Type:** insight
**Status:** extracted

## The Failure

The 12:20 breathe cycle learnings step **failed silently**. Initial hypothesis: context too large (32K chars).

## The Real Problem

**32K characters is NOT the issue.** The actual problem:

1. **30 transcripts** truncated to 500 chars each
2. Model receives **conversation fragments** without full context
3. **Prompt structure** may confuse the model about JSON output format
4. **ANSI escape codes** in output can break JSON parsing (separate but related issue)

## Key Insight

**Context structure > context size.** A well-structured 50K prompt works better than a fragmented 13K prompt.

## Debugging Approach

1. Reconstruct the exact prompt sent to the model
2. Save to temporary file for inspection
3. Verify JSON output format expectations are clear
4. Check for ANSI escape codes in model output

## Lessons

- Don't assume size is the bottleneck
- Truncation can lose critical context needed for pattern recognition
- Prompt structure直接影响 model's ability to output valid JSON
- Save prompts for debugging when pipelines fail silently

## Related

- `ansi-escape-code-bug-fix.md` — covers the ANSI code JSON parsing issue
- This covers the broader context structure problem