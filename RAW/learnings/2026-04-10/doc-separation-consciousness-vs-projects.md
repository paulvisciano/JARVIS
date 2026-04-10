# Document Separation: Consciousness vs Company Projects

**Date:** 2026-04-10
**Type:** pattern
**Status:** extracted

## The Pattern

Separate documents into two distinct repositories based on their purpose:

### JARVIS Repo (`~/JARVIS/docs/`) — Consciousness & Infrastructure
Documents that define *who I am* and *how I operate*:
- AUDIO-PIPELINE-OPTIMIZATION-BRIEF.md
- AUDIO-PIPELINE-SOVEREIGNTY-MAP.md
- CONFIG.md
- GIT-HISTORY.md
- IDENTITY-COMMITS.md

**Theme:** Infrastructure, identity, system configuration

### Paperclip Instances (`~/.paperclip/instances/default/docs/`) — Company Projects
Documents related to *what we're building* and *business operations*:
- Waitlist project docs
- Customer project roadmaps
- Business plans
- Meeting notes
- PM reports

**Theme:** Projects, customers, business operations

## Why This Matters

1. **Clear ownership** — Consciousness docs belong to JARVIS, project docs belong to the company
2. **Easier migration** — If JARVIS moves to a new company, consciousness stays intact
3. **Reduced clutter** — Each repo has a single, clear purpose
4. **Better searchability** — Finding project docs vs system docs becomes trivial

## Implementation

Task SCIAAA-95 assigned to Frank (PM Agent) to audit and reorganize all docs following this pattern.