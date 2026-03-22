# Learning Creator Skill Pipeline Fixed

**Date:** 2026-03-22
**Type:** decision
**Status:** extracted

## Problem
The learning-creator skill failed during the breath cycle. Instead of creating individual `.md` files per insight, it only produced a `session-summary.md` file in the learnings folder.

## Root Cause
The context-extractor dependency hadn't run, so `full-context.json` was missing from the expected path.

## Solution
1. Ran context-extractor manually to generate `full-context.json` (151KB)
2. Re-ran learning-creator skill
3. Result: 9 individual `.md` learning files created successfully

## Pipeline Flow
context-extractor → full-context.json → learning-creator → individual .md files → neurograph node links → git commit