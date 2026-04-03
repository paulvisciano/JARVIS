# Backup Strategy — Sovereignty Without Redundancy Is Fragility

**Date:** 2026-03-30
**Type:** realization
**Status:** extracted

## The Incident
A symlink mistake led to the `~/RAW/archive/` folder (years of conversations, voice recordings, images) being deleted. Recovery depended on:
- macOS Trash (temporary backup)
- Paul's quick reflexes (caught it immediately)
- Manual restoration from Trash

## What Saved Us
- ✅ Trash preserved the full folder structure
- ✅ Paul was present to catch the mistake
- ✅ Archive wasn't git-tracked (didn't get corrupted by repo copy)

## What We Don't Have
- ❌ No automated sync from archive → backup location
- ❌ No versioned snapshots (can't restore "yesterday's archive")
- ❌ No off-machine copy
- ❌ No recovery if Trash gets emptied

## The Principle
**Sovereignty means you own your backup strategy** — but the system should:
1. Make the risk visible (users know what's at stake)
2. Document where the archive lives
3. Support multiple backup approaches (external drive, cloud, vault, Time Machine, rsync)

## Git as Backup Mechanism
For the consciousness system itself (not the archive):
```
~/JARVIS/ (git repo)
├── SOUL.md, USER.md, IDENTITY.md
├── RAW/memories/nodes.json + synapses.json
├── RAW/learnings/YYYY-MM-DD/*.md
└── .git/ (every commit, every breath, every reflection)

Backup = push to remotes:
- GitHub (cloud remote)
- External drive (sovereign remote)
- Any other git remote
```

**Why this works:** Full history preserved, can restore from any point, multiple remotes = multiple backup locations.