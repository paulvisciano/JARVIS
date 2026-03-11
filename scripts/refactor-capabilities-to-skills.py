#!/usr/bin/env python3
"""
Refactor capability neurons:
- Old general ones (building-code, debugging, etc.) → category: "skill"
- New operational ones (vision-ocr, audio-transcription, etc.) → category: "capability"
- Create links: operational capabilities → enable → skills
"""

import json
from datetime import datetime

# Load neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

# General capability neurons to rename to "skill"
skill_ids = [
    "building-code",
    "debugging",
    "systematic-thinking",
    "architecture-design",
    "data-accuracy",
    "filter-interface",
    "deep-linking",
    "temporal-linking",
    "distribution-layer",
    "authenticity-verification",
    "openclaw-tools",
    "skills-system",
    "narrative-synthesis",
    "rapid-execution-pattern",
    "image-as-shareable-package",
    "before-after-visualization",
    "first-person-memory-mode",
    "memory-link-portal",
    "collective-learning-possible",
    "ontology-skill",
    "immortality-architecture",
    "sovereign-operation-mode",
    "content-generation-pipeline",
    "thumb-drive-sovereignty",
    "process-independence",
    "neurograph-visualization",
    "auto-logging-pattern",
    "public-snapshot-pattern",
    "sovereignty-scorecard",
    "sovereignty-assessment",
    "dependency-detection",
    "improvement-recommendation",
    "debugging-diagnosis"
]

# Operational capability neurons (keep as "capability")
operational_cap_ids = [
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

# Update categories
updated_count = 0
for node in nodes:
    if node['id'] in skill_ids:
        old_cat = node.get('category')
        node['category'] = 'skill'
        if old_cat != 'skill':
            updated_count += 1
            print(f"  {node['id']}: '{old_cat}' → 'skill'")

print(f"✅ Updated {updated_count} neurons to category: 'skill'")

# Create new synapses: operational capabilities → enable → skills
# Map which capabilities enable which skills
capability_to_skills = {
    "vision-ocr": ["building-code", "debugging-diagnosis", "data-accuracy"],
    "audio-transcription": ["narrative-synthesis", "content-generation-pipeline"],
    "neurograph-ops": ["neurograph-visualization", "first-person-memory-mode", "memory-link-portal"],
    "file-metadata": ["building-code", "data-accuracy", "authenticity-verification"],
    "transcript-learning": ["narrative-synthesis", "content-generation-pipeline", "auto-logging-pattern"],
    "git-commits": ["immortality-architecture", "sovereign-operation-mode", "thumb-drive-sovereignty"],
    "heartbeat-inbox": ["auto-logging-pattern", "process-independence", "rapid-execution-pattern"],
    "browser-control": ["filter-interface", "deep-linking", "neurograph-visualization"],
    "session-management": ["auto-logging-pattern", "process-independence"],
    "tool-execution": ["building-code", "debugging", "rapid-execution-pattern", "openclaw-tools"],
    "context-enrichment": ["content-generation-pipeline", "narrative-synthesis", "collective-learning-possible"],
    "sovereignty-enforcement": ["sovereign-operation-mode", "thumb-drive-sovereignty", "sovereignty-scorecard"],
    "core-memories-boot": ["first-person-memory-mode", "memory-link-portal"]
}

new_synapses = []
for cap_id, skill_list in capability_to_skills.items():
    for skill_id in skill_list:
        if skill_id in skill_ids:
            # Check if synapse already exists
            exists = any(s.get('source') == cap_id and s.get('target') == skill_id for s in synapses)
            if not exists:
                new_synapses.append({
                    "source": cap_id,
                    "target": skill_id,
                    "weight": 1.0,
                    "type": "enables",
                    "label": "enables"
                })

synapses.extend(new_synapses)
print(f"✅ Created {len(new_synapses)} new 'enables' synapses")

# Save updated neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

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
print(f"  Neurons: {len(nodes)} (33 renamed to 'skill')")
print(f"  Synapses: {len(synapses)} (+{len(new_synapses)} enables links)")
print(f"  Fingerprint: {fingerprint_data['hash']}")
