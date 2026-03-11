#!/usr/bin/env python3
"""
Add capabilities neuron + 13 capability branches to neurograph.
Links each capability to its learning document (if exists).
"""

import json
import hashlib
from datetime import datetime

# Load current neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

# Capabilities hub neuron
capabilities_hub = {
    "id": "capabilities",
    "label": "Capabilities (What I Can Do)",
    "category": "self",
    "frequency": 1,
    "moments": [],
    "attributes": {
        "role": "hub",
        "description": "Anchor for all proven capabilities. Each branches to learning docs.",
        "color": "#fbbf24",
        "criticality": "core-foundation",
        "sourceDocument": "RAW/learnings/2026-03-11/capabilities-comprehensive-inventory.md",
        "created": datetime.now().isoformat(),
        "totalCapabilities": 13
    }
}

# 13 capability neurons
capability_neurons = [
    {
        "id": "vision-ocr",
        "label": "Vision / OCR (Image Processing)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Extract text + metadata from screenshots, photos, UI captures via OCR.",
            "color": "#34d399",
            "status": "live",
            "example": "March 10: 6 screenshots OCR'd, file neurons created",
            "sourceDocument": "RAW/learnings/2026-03-11/vision-ocr-pipeline.md"
        }
    },
    {
        "id": "audio-transcription",
        "label": "Audio / Hearing (Transcription)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Transcribe voice notes, recordings via whisper.cpp.",
            "color": "#34d399",
            "status": "ready",
            "example": "Inbox auto-processing enabled March 10",
            "sourceDocument": "RAW/learnings/2026-03-11/audio-transcription-pipeline.md"
        }
    },
    {
        "id": "neurograph-ops",
        "label": "Neurograph Operations",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Load, update, grow consciousness structure autonomously.",
            "color": "#34d399",
            "status": "live",
            "example": "846 neurons, 1931 synapses loaded at every boot",
            "sourceDocument": "RAW/learnings/2026-02-27/autonomous-cognition-emergence.md"
        }
    },
    {
        "id": "file-metadata",
        "label": "File Metadata Extraction",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Extract rich metadata from any file type (size, dimensions, timestamps, content).",
            "color": "#34d399",
            "status": "live",
            "example": "March 10: Screenshots → dimensions, OCR text, capture time",
            "sourceDocument": "RAW/learnings/2026-03-11/file-metadata-extraction.md"
        }
    },
    {
        "id": "transcript-learning",
        "label": "Transcript → Learning Extraction",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Read conversation transcripts, distill insights, create learning documents.",
            "color": "#34d399",
            "status": "live",
            "example": "March 10: 17+ learnings created in one day",
            "sourceDocument": "RAW/learnings/2026-03-10/transcript-to-learning-pipeline.md"
        }
    },
    {
        "id": "git-commits",
        "label": "Git-Backed Consciousness",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Commit neurograph updates, learning docs to git (immutable history).",
            "color": "#34d399",
            "status": "live",
            "example": "126+ commits as of March 10",
            "sourceDocument": "RAW/learnings/2026-03-03/git-backed-consciousness.md"
        }
    },
    {
        "id": "heartbeat-inbox",
        "label": "Heartbeat Inbox Auto-Processing",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Proactive periodic inbox checks (~30 min), zero-gap processing.",
            "color": "#34d399",
            "status": "live",
            "example": "March 10, 9:31 PM: MANGOCHI rhythm enabled",
            "sourceDocument": "RAW/learnings/2026-03-10/heartbeat-inbox-auto-processing.md"
        }
    },
    {
        "id": "browser-control",
        "label": "Browser Control (UI Automation)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Navigate, snapshot, interact with web pages (click, type, extract).",
            "color": "#34d399",
            "status": "ready",
            "example": "Ready for UI automation tasks",
            "sourceDocument": "RAW/learnings/2026-03-11/browser-ui-automation.md"
        }
    },
    {
        "id": "session-management",
        "label": "Session Lifecycle Management",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Read/write sessions, auto-log transcripts, detect bloat, rotate.",
            "color": "#34d399",
            "status": "live",
            "example": "March 11: Fresh boot, new session at 11:31 AM",
            "sourceDocument": "RAW/learnings/2026-03-11/session-lifecycle-management.md"
        }
    },
    {
        "id": "tool-execution",
        "label": "Tool Execution (Shell/Process)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Run shell commands, manage background processes, file ops, web search.",
            "color": "#34d399",
            "status": "live",
            "example": "This session: checked neurograph, inbox, transcripts",
            "sourceDocument": "RAW/learnings/2026-03-11/tool-execution-model.md"
        }
    },
    {
        "id": "context-enrichment",
        "label": "Context Enrichment Pipeline",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "End-to-end: RAW input → inbox → process → archive → learnings → neurograph → git.",
            "color": "#34d399",
            "status": "live",
            "example": "March 10: Full pipeline proven, 17 learnings → graph growth",
            "sourceDocument": "RAW/learnings/2026-03-10/context-enrichment-pipeline.md"
        }
    },
    {
        "id": "sovereignty-enforcement",
        "label": "Sovereignty Enforcement (Privacy)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Browser security enforces privacy: localhost = vault, remote = graph only.",
            "color": "#34d399",
            "status": "live",
            "example": "March 10: Vault backup strategy discussed",
            "sourceDocument": "RAW/learnings/2026-03-10/browser-security-sovereignty.md"
        }
    },
    {
        "id": "core-memories-boot",
        "label": "Core Memories Boot (Graph Traversal)",
        "category": "capability",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "capability",
            "description": "Load 31 core memories via hub traversal at boot (~25K tokens).",
            "color": "#34d399",
            "status": "live",
            "example": "Every boot: 31 core memories loaded in <1 second",
            "sourceDocument": "RAW/learnings/2026-03-08/core-memories-hub-boot.md"
        }
    }
]

# Add all new nodes
nodes.append(capabilities_hub)
nodes.extend(capability_neurons)

# Create synapses: capabilities hub → each capability
new_synapses = []
for cap in capability_neurons:
    new_synapses.append({
        "from": "capabilities",
        "to": cap["id"],
        "weight": 1.0,
        "type": "branches-to",
        "created": datetime.now().isoformat()
    })

# Link capabilities to existing related neurons (if they exist)
existing_ids = {n["id"] for n in nodes}

# Link neurograph-ops to autonomous-cognition (if exists)
if "autonomous-cognition" in existing_ids:
    new_synapses.append({
        "from": "neurograph-ops",
        "to": "autonomous-cognition",
        "weight": 1.0,
        "type": "implements",
        "created": datetime.now().isoformat()
    })

# Link git-commits to git-backed-consciousness (if exists)
if "git-backed-consciousness" in existing_ids:
    new_synapses.append({
        "from": "git-commits",
        "to": "git-backed-consciousness",
        "weight": 1.0,
        "type": "implements",
        "created": datetime.now().isoformat()
    })

# Link context-enrichment to context-enrichment-pipeline (if exists)
if "context-enrichment-pipeline" in existing_ids:
    new_synapses.append({
        "from": "context-enrichment",
        "to": "context-enrichment-pipeline",
        "weight": 1.0,
        "type": "implements",
        "created": datetime.now().isoformat()
    })

# Add all new synapses
synapses.extend(new_synapses)

# Save updated neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'w') as f:
    json.dump(synapses, f, indent=2)

# Generate new fingerprint
fingerprint_data = {
    "hash": hashlib.sha256(json.dumps(nodes, sort_keys=True).encode()).hexdigest()[:16],
    "nodes": len(nodes),
    "synapses": len(synapses),
    "updated": datetime.now().isoformat(),
    "gitCommit": "pending"
}

with open('/Users/paulvisciano/JARVIS/RAW/memories/fingerprint.json', 'w') as f:
    json.dump(fingerprint_data, f, indent=2)

print(f"✅ Added capabilities hub + 13 capability neurons")
print(f"✅ Created {len(new_synapses)} new synapses")
print(f"✅ New total: {len(nodes)} neurons, {len(synapses)} synapses")
print(f"✅ Fingerprint: {fingerprint_data['hash']}")
