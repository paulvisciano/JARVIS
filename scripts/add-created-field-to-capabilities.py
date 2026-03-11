#!/usr/bin/env python3
"""Add 'created: 2026-03-11' field to capabilities hub + 13 branches."""

import json
from datetime import datetime

with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

cap_ids = ['capabilities'] + [
    "vision-ocr", "audio-transcription", "neurograph-ops", "file-metadata",
    "transcript-learning", "git-commits", "heartbeat-inbox", "browser-control",
    "session-management", "tool-execution", "context-enrichment",
    "sovereignty-enforcement", "core-memories-boot"
]

updated = 0
for node in nodes:
    if node['id'] in cap_ids:
        if 'created' not in node or node['created'] is None:
            node['created'] = '2026-03-11'
            updated += 1
            print(f"✅ {node['id']}: added created='2026-03-11'")

with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

print(f"\nUpdated {updated} neurons with created field")

# Update fingerprint
import hashlib
fingerprint_data = {
    "hash": hashlib.sha256(json.dumps(nodes, sort_keys=True).encode()).hexdigest()[:16],
    "nodes": len(nodes),
    "synapses": 2008,
    "updated": datetime.now().isoformat(),
    "gitCommit": "pending"
}

with open('/Users/paulvisciano/JARVIS/RAW/memories/fingerprint.json', 'w') as f:
    json.dump(fingerprint_data, f, indent=2)

print(f"Fingerprint: {fingerprint_data['hash']}")
