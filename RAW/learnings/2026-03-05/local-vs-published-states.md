# Local vs. Published States (Hybrid Architecture Validation)

**Date:** March 5, 2026  
**Type:** Architecture Validation  
**Tags:** hybrid-architecture, privacy, publishing-workflow, ui-validation

---

## The Moment

Clicking on a neuron in the visualization:
- **Neuron visible:** "Explore Your Memory in Space-Time (Slogan)"
- **Learning doc:** Not yet published to public repo
- **System response:** Shows file path + how to open locally

**Prompt displayed:**
```
File on disk (relative to project root):
RAW/learnings/2026-03-05/slogan-explore-memory-space-time.md

In Cursor: Cmd+P (or Ctrl+P) and paste this path to open.
```

---

## Why This Validates The Architecture

### Two-Tier Publishing Model

| Tier | Location | Visibility | Sync Status |
|------|----------|------------|-------------|
| **Local Working** | `~/JARVIS/RAW/learnings/` | Private (gitignored) | Always current |
| **Public Published** | `paulvisciano.github.io/claw/memory/` | Public (GitHub Pages) | Manually synced |

### What This Enables

**Working privately:**
- Draft ideas without pressure to publish
- Iterate on concepts before sharing
- Keep sensitive insights private
- Full control over what becomes public

**Publishing selectively:**
- Choose which learnings to share
- Edit/polish before publishing
- Maintain separate private/public personas
- Revoke publication anytime (just don't sync)

---

## The Prompt IS The Feature

Instead of:
- ❌ 404 error ("Content not found")
- ❌ Broken link frustration
- ❌ Confusion about missing data

The system says:
- ✅ "This exists locally"
- ✅ "Here's exactly where"
- ✅ "Here's how to open it"
- ✅ "You control when/if to publish"

**This is sovereignty in action.** Not a bug. A feature.

---

## Workflow

### Creating New Learning
```
1. Voice note → Transcript → Learning doc created (local)
2. Neurograph updated (local)
3. Visualization shows neuron + file path
4. User continues working (no publish pressure)
```

### Deciding To Publish
```
1. Review learning doc (is this worth sharing?)
2. Run sync script: `./scripts/sync-to-public.sh`
3. Public repo updated
4. Visualization now shows full content
5. GitHub Pages deploys (~1-2 min)
```

### Staying Private
```
1. Never run sync for this doc
2. Learning remains in vault
3. Neurograph shows existence + connections
4. Full content only accessible locally
```

---

## Quote from Discovery

> "And since the learning is not published yet you don't see it... but you get this nice prompt"
> 
> — Paul Visciano, March 5, 2026 (volleyball, reviewing visualization)

---

## Related Learnings

- [[github-privacy-disclaimer]] — Transparency about what's public vs. private
- [[vault-architecture]] — Private storage layer
- [[hybrid-architecture-decision]] — OpenClaw runtime + Jarvis consciousness
- [[physical-sovereignty-model]] — Local control over data

---

**Source:** Screenshot + voice note, March 5, 2026 — volleyball session
