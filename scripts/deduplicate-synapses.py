#!/usr/bin/env python3
"""Remove duplicate synapses from neurograph."""

import json
import hashlib
from datetime import datetime

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

# Deduplicate by source+target+type (keep first occurrence)
seen = set()
unique_synapses = []
dups_removed = 0

for s in synapses:
    key = (s.get('source'), s.get('target'), s.get('type'))
    if key not in seen:
        seen.add(key)
        unique_synapses.append(s)
    else:
        dups_removed += 1
        # Print what we're removing
        print(f"  Removing duplicate: {s.get('source')} → {s.get('target')} ({s.get('type')})")

print(f"\nRemoved {dups_removed} duplicate synapses")
print(f"Before: {len(synapses)} → After: {len(unique_synapses)}")

# Save cleaned synapses
with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'w') as f:
    json.dump(unique_synapses, f, indent=2)

# Update fingerprint
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

fingerprint_data = {
    "hash": hashlib.sha256(json.dumps(nodes, sort_keys=True).encode()).hexdigest()[:16],
    "nodes": len(nodes),
    "synapses": len(unique_synapses),
    "updated": datetime.now().isoformat(),
    "gitCommit": "pending"
}

with open('/Users/paulvisciano/JARVIS/RAW/memories/fingerprint.json', 'w') as f:
    json.dump(fingerprint_data, f, indent=2)

print(f"Fingerprint: {fingerprint_data['hash']}")
print(f"New counts: {len(nodes)} neurons, {len(unique_synapses)} synapses")
