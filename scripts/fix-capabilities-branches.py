#!/usr/bin/env python3
"""Fix: Add missing synapses from capabilities hub → 13 branches."""

import json
from datetime import datetime

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

cap_ids = [
    "vision-ocr", "audio-transcription", "neurograph-ops", "file-metadata",
    "transcript-learning", "git-commits", "heartbeat-inbox", "browser-control",
    "session-management", "tool-execution", "context-enrichment",
    "sovereignty-enforcement", "core-memories-boot"
]

new_synapses = []
for cap_id in cap_ids:
    # Check if already exists (using correct key names)
    exists = any(s.get('source') == 'capabilities' and s.get('target') == cap_id for s in synapses)
    if not exists:
        new_synapses.append({
            "source": "capabilities",
            "target": cap_id,
            "weight": 1.0,
            "type": "branches-to",
            "label": "branches to"
        })

synapses.extend(new_synapses)
print(f"✅ Created {len(new_synapses)} 'branches-to' synapses")

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'w') as f:
    json.dump(synapses, f, indent=2)

print(f"Total synapses: {len(synapses)}")
