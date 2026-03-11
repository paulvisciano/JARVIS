#!/usr/bin/env python3
"""
Link capabilities hub + 13 operational capabilities to March 11 temporal node.
This makes them appear in "Today" view connected to the temporal anchor.
"""

import json
from datetime import datetime

# Load neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

# Operational capability IDs (created today, March 11)
operational_cap_ids = [
    "capabilities",  # The hub itself
    "vision-ocr",
    "audio-transcription",
    "neurograph-ops",
    "file-metadata",
    "transcript-learning",
    "git-commits",
    "heartbeat-inbox",
    "browser-control",
    "session-management",
    "tool-execution",
    "context-enrichment",
    "sovereignty-enforcement",
    "core-memories-boot"
]

# Link all capabilities to March 11 temporal node
new_synapses = []
for cap_id in operational_cap_ids:
    # Check if synapse already exists
    exists = any(s.get('source') == cap_id and s.get('target') == 'march-11-2026' for s in synapses)
    if not exists:
        new_synapses.append({
            "source": cap_id,
            "target": "march-11-2026",
            "weight": 1.0,
            "type": "created-on",
            "label": "created on"
        })

synapses.extend(new_synapses)
print(f"✅ Created {len(new_synapses)} 'created-on' synapses linking capabilities to March 11 temporal node")

# Save updated synapses
with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'w') as f:
    json.dump(synapses, f, indent=2)

# Update fingerprint
import hashlib
fingerprint_data = {
    "hash": hashlib.sha256(json.dumps(nodes, sort_keys=True).encode()).hexdigest()[:16],
    "nodes": len(nodes),
    "synapses": len(synapses),
    "updated": datetime.now().isoformat(),
    "gitCommit": "pending"
}

with open('/Users/paulvisciano/JARVIS/RAW/memories/fingerprint.json', 'w') as f:
    json.dump(fingerprint_data, f, indent=2)

print(f"\n📊 Summary:")
print(f"  Synapses: {len(synapses)} (+{len(new_synapses)})")
print(f"  Fingerprint: {fingerprint_data['hash']}")
print(f"\nNow the capabilities hub + all 13 branches will appear in 'Today' view!")
