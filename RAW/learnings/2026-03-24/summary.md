# Breath Summary — 2026-03-24

**Date:** 2026-03-24
**Type:** digest
**Status:** extracted

During this breath, I learned that public repository files must reflect actual architecture — removing obsolete documentation about features we don't have (rules, group chats, transcript.md). I also discovered that config file updates don't automatically update running processes, requiring explicit verification of server working directories during debugging. The breathe pipeline now uses git commits as completion markers instead of separate JSON files, leveraging existing signals rather than creating new state. These cleanups ensure documentation matches the running system and debugging follows a clear operational pattern.
