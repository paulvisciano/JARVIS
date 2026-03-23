# Bootstrap Flow Separation

**Date:** 2026-03-23
**Type:** realization
**Status:** extracted

Bootstrap logic split between OpenClaw (`~/.openclaw/workspace/BOOTSTRAP.md`) and Jarvis (`~/JARVIS/BOOTSTRAP.md`). OpenClaw boots the gateway and agents, then triggers the `bootstrap-jarvis` skill. Jarvis skill handles neurograph load, context load, and skills sync. `BOOT.md` now triggers auto-bootstrap on gateway restart. Clean separation ensures OpenClaw doesn't need to know Jarvis internals.