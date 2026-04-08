# Version Deployment Confusion — Local vs Remote Divergence

**Date:** 2026-04-06
**Type:** pattern
**Status:** extracted

## The Pattern

Multiple times during Eric's setup, there was confusion about what version was "published":

| Location | Version | Status |
|----------|---------|--------|
| Paul's local SCI-FI | v3.3.15 | ✅ Latest (flight gestures) |
| GitHub origin/main | v3.3.7 | ❌ Stale (3 commits behind) |
| PR #6 | v3.3.13-15 | ⏳ Open, ready to merge |

## The Problem

**Local work was not pushed.** Paul was running v3.3.13 locally, but GitHub had v3.3.7. When setting up Eric, there was uncertainty about what he'd actually get when cloning.

## Root Cause

1. Work done on feature branches locally
2. PRs created but not merged
3. Main branch not updated with local commits
4. Assumption that "local = published"

## The Fix

**Before onboarding anyone:**
1. Check `git status` on SCI-FI repo
2. Verify `git log --oneline origin/main..main` (local ahead of remote)
3. Push or merge PRs before sharing clone URL
4. Confirm version tag matches what's on GitHub

## Lesson

**"Published" means on GitHub, not on your machine.** Always verify remote state before onboarding collaborators. The divergence between local and remote created unnecessary confusion during a live demo.