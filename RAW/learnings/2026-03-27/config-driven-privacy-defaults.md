# Config-Driven Privacy Defaults for Jarvis Features

**Date:** 2026-03-27
**Type:** decision
**Status:** extracted

## The Decision

Features that access personal data (like desktop screenshot archiving in the breathe pipeline) should be **DISABLED by default** with opt-in configuration.

## Implementation

**Config file:** `~/.jarvis-config.json` (gitignored)

```json
{
  "breathe": {
    "desktopArchiving": false
  }
}
```

**UI Exposure:** Settings modal in Jarvis UI with toggle switches.

## Rationale

| User | Default Experience | Opt-In Required |
|------|-------------------|----------------|
| **Paul** | Can enable desktop archiving (wants full context) | Yes — explicit choice |
| **Eric** | Desktop NOT archived (privacy-first) | Yes — must enable |
| **David** | Desktop NOT archived (privacy-first) | Yes — must enable |

## Why This Matters

1. **Privacy-first by default** — Users don't have to discover and disable invasive features
2. **Informed consent** — Enabling requires conscious decision
3. **Portable config** — `.jarvis-config.json` can be backed up separately from git
4. **Trust building** — Demonstrates respect for user sovereignty over their data

## Pattern for Future Features

Any feature that:
- Accesses personal files
- Captures screen content
- Monitors system activity
- Collects behavioral data

→ Should follow this **opt-in, config-driven** pattern.

## Quote from Paul

> "I didn't want to run the breathe pipeline desktop archiving for David — that's invasive. For me it's fine, but others should choose."