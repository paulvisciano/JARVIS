# Archive Git Hygiene — Protect Portability

**Date:** 2026-03-26
**Type:** pattern
**Status:** extracted

## The Risk
A sovereign archive's value lies in its **portability** (`git clone` anywhere). Binary blobs (images, audio, screenshots) in commit history can balloon repo size, breaking this promise.

## The Pattern
- **Gitignore Aggressively:** Binary assets (`.png`, `.wav`, `.mp4`) should not be committed directly to the main history.
- **Use References:** Store metadata/paths in git, actual files in local storage or LFS.
- **Monitor Commit Size:** Regularly check for accidental large file commits (e.g., 25 commits with images).

## Why It Matters
- **Speed:** Large repos slow down sync and clone operations.
- **Cost:** Hosting large repos incurs higher bandwidth/storage costs.
- **Sovereignty:** If the repo is too heavy, you can't easily move it to a new host or device.

## Rule
**The archive must remain lightweight enough to carry in your pocket.**