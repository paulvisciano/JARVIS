#!/usr/bin/env python3
"""Fix March 6 neurons to use local file:// paths instead of GitHub URLs."""

import json
import sys

# Mapping of March 6 neurons to their learning docs
m6_mapping = {
    'gateway-client-constants': 'voice-pipeline-gateway-auth.md',
    'device-id-computation': 'voice-pipeline-gateway-auth.md',
    'v3-signature-payload': 'voice-pipeline-gateway-auth.md',
    'url-safe-base64-signatures': 'voice-pipeline-gateway-auth.md',
    'spki-prefix-extraction': 'voice-pipeline-gateway-auth.md',
    'gateway-origin-checking': 'voice-pipeline-gateway-auth.md',
    'voice-pipeline-architecture': 'jarvis-voice-interface-architecture.md',
    'desktop-app-limitations': 'jarvis-voice-implementation-plan.md',
    'fresh-install-recovery-pattern': 'fresh-install-recovery.md',
    'persistence-pays-off': 'daily-integration-2026-03-06.md',
}

base_path = "file:///Users/paulvisciano/JARVIS/RAW/learnings/2026-03-06/"

with open('RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

updated = 0
for node in nodes:
    if node['id'] in m6_mapping:
        doc = m6_mapping[node['id']]
        old_path = node.get('attributes', {}).get('sourceDocument', '')
        new_path = base_path + doc
        node['attributes']['sourceDocument'] = new_path
        print(f"✅ {node['id']}: {old_path[:60]}... → {new_path}")
        updated += 1

print(f"\nUpdated {updated} nodes")

with open('RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

print("Saved to RAW/memories/nodes.json")
