#!/usr/bin/env python3
"""Update March 11 temporal node label to be more descriptive."""

import json

with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

# Find and update the March 11 temporal node
for node in nodes:
    if node.get('id') == 'march-11-2026':
        old_label = node['label']
        node['label'] = 'March 11, 2026 — UI Testing + Offline Mode Discovery'
        node['attributes']['description'] = 'Two breakthroughs: Enhanced JARVIS voice recorder with living ORB (1:47 AM) + Offline mode works by default, no special implementation needed (11:53 PM)'
        print(f"Updated: '{old_label}' → '{node['label']}'")
        break

with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

print("✅ Temporal node updated")
