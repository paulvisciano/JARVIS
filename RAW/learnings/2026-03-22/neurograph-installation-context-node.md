# NeuroGraph Installation Context Node Proposed

**Date:** 2026-03-22
**Type:** commitment
**Status:** extracted

**Proposed Node Structure:**

### Node: "Installation Context"
```json
{
  "id": "installation-context",
  "category": "config",
  "description": "Points to USER.md - contains human identity for this installation",
  "properties": {
    "userFile": "~/JARVIS/USER.md",
    "resolved": true
  }
}
```

**Purpose:**
- Creates a pointer node in the NeuroGraph that references `USER.md`
- Not the data itself, just the *location* of the context file
- Keeps Jarvis portable while anchoring to the local human
- On Eric's machine it points to his USER.md, on Paul's machine points to Paul's

**Next Steps:**
1. Create the NeuroGraph node pointing to ~/JARVIS/USER.md
2. Add synapses to "jarvis-identity" and "bootstrap-sequence"
3. Resolve fields from actual USER.md (name, timezone, projects, etc.)