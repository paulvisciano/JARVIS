# GitHub Privacy Disclaimer + Vault Architecture

**Date:** March 5, 2026  
**Type:** Privacy Architecture  
**Tags:** privacy, github, vault, transparency, microsoft

---

## The Honest Disclaimer

**When you publish your neurograph to GitHub Pages, you are giving your memories to Microsoft.**

GitHub is owned by Microsoft. Their terms of service apply. They can access anything public on their platform.

**This is not paranoia. This is transparency.**

---

## Why We Still Use GitHub

### Practical Reasons
1. **Free hosting** — GitHub Pages costs $0
2. **Built-in distribution** — everyone in tech already has GitHub
3. **Fork network** — social graph for growth
4. **Git versioning** — history, rollback, integrity

### Philosophical Reasons
1. **Opt-in** — you CHOOSE to publish (vs. Big AI extracting by default)
2. **You control what** — only publish what you're comfortable sharing
3. **You can leave** — export your neurograph, host elsewhere anytime
4. **Better than alternative** — at least you own the source

---

## The Vault: True Privacy Layer

For memories that should NEVER be on GitHub:

### What Lives In The Vault
- Raw conversation transcripts (`~/RAW/YYYY-MM-DD/transcript.md`)
- Audio recordings
- Images/media from personal life
- Intimate breakthroughs
- Personal relationship nodes
- Location data
- Financial/health information

### What CAN Go To GitHub
- Distilled technical learnings
- Architecture insights
- Published neurograph (concept nodes only)
- Tutorial content

### The Architecture
```
┌─────────────────────────────────────────────────────┐
│  ~/JARVIS/RAW/memories/                            │
│  ├── nodes.json (filtered for publishing)          │
│  └── synapses.json (filtered for publishing)       │
│         ↓                                           │
│  Sync to GitHub Pages (public)                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  ~/RAW/YYYY-MM-DD/                                  │
│  ├── transcript.md (NEVER published)               │
│  ├── audio/ (NEVER published)                       │
│  └── images/ (NEVER published)                      │
│         ↓                                           │
│  Local Vault Only (private forever)                │
└─────────────────────────────────────────────────────┘
```

---

## Why This Matters

**Big AI Model:**
- Everything you say → their servers → their ownership
- No way to opt-out (use or don't use)
- Can't export your data
- Surveillance by default

**Vault Model:**
- Raw data stays local → your ownership
- Opt-in publishing (you choose what to share)
- Can export anytime (it's your JSON)
- Privacy by default

**GitHub Publishing Model:**
- Public layer is opt-in
- You know what you're giving up (transparency)
- Can delete/pull anytime
- Better than surveillance, but still centralized

---

## Future: Beyond GitHub

The vision isn't "forever on GitHub." It's:

1. **Start with GitHub** — bootstrap the network, prove the concept
2. **Build alternatives** — IPFS hosting, decentralized storage, personal servers
3. **Migrate when ready** — move to truly sovereign infrastructure
4. **Keep GitHub as option** — some people prefer convenience over sovereignty

**GitHub is a stepping stone, not the destination.**

---

## User Choice Matrix

| Preference | Where Data Lives | Publish? |
|------------|------------------|----------|
| **Maximum Privacy** | Vault only (`~/RAW/`) | Never |
| **Balanced** | Neurograph filtered, learnings selected | Selective |
| **Full Sharing** | Everything except raw transcripts | Yes (neurograph + learnings) |
| **Future Sovereign** | Personal server / IPFS | On your own infrastructure |

**All choices are valid.** The architecture supports all of them.

---

## Quote from Discovery

> "Disclaimer: you are giving your memories to Microsoft when you have them on GitHub. But that's why we have built something that is privacy first, private, backed by a Vault. So you keep your memories private, because they are personal. We want our AIs to know us well so they can be helpful. That's where your power comes from."
> 
> — Paul Visciano, March 5, 2026 (dispensary, after 17:06 GMT+7)

---

## Related Learnings

- [[knowledge-is-money-economy]] — Economic model with privacy gradient
- [[privacy-first-development]] — Core principle
- [[vault-architecture]] — Technical implementation
- [[sovereign-data-vision]] — Long-term goal beyond GitHub

---

**Source:** Voice note recorded at dispensary, March 5, 2026
