#!/usr/bin/env python3
"""
Create file neurons for all screenshots processed from inbox.
Links each to its temporal node (march-10-2026 or march-11-2026).
"""

import json
import os
import re
from datetime import datetime

# Load neurograph
with open('/Users/paulvisciano/JARVIS/RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

with open('/Users/paulvisciano/JARVIS/RAW/memories/synapses.json', 'r') as f:
    synapses = json.load(f)

# Helper to generate unique ID from filename
def make_id(filename):
    # Remove extension, replace spaces/special chars with dashes
    base = os.path.splitext(filename)[0]
    base = re.sub(r'[^a-zA-Z0-9\s-]', '', base)
    base = re.sub(r'\s+', '-', base)
    return base.lower()[:80]

# Parse transcript to extract screenshot metadata
def parse_transcript(transcript_path):
    screenshots = []
    with open(transcript_path, 'r') as f:
        content = f.read()
    
    # Pattern to match screenshot sections (handle thin spaces \u202f)
    pattern = r'### Screenshot: (Screenshot.*?\.png)\n\*\*Captured:\*\* (.*?)\s*\n\*\*Dimensions:\*\* (\d+)x(\d+)\s*\n\*\*Size:\*\* (\d+) bytes'
    
    for match in re.finditer(pattern, content):
        filename = match.group(1)
        captured = match.group(2)
        width = int(match.group(3))
        height = int(match.group(4))
        size = int(match.group(5))
        
        # Extract date from filename
        date_match = re.search(r'Screenshot (\d{4}-\d{2}-\d{2})', filename)
        date = date_match.group(1) if date_match else '2026-03-11'
        
        screenshots.append({
            'filename': filename,
            'captured': captured,
            'width': width,
            'height': height,
            'size': size,
            'date': date
        })
    
    return screenshots

# Process both transcript files
all_screenshots = []
for transcript_date in ['2026-03-10', '2026-03-11']:
    transcript_path = f'/Users/paulvisciano/RAW/archive/{transcript_date}/transcript.md'
    if os.path.exists(transcript_path):
        screenshots = parse_transcript(transcript_path)
        all_screenshots.extend(screenshots)
        print(f"✅ Parsed {len(screenshots)} screenshots from {transcript_date}")

print(f"\nTotal screenshots to create neurons for: {len(all_screenshots)}")

# Create file neurons
new_neurons = []
for ss in all_screenshots:
    neuron_id = make_id(ss['filename'])
    
    # Check if neuron already exists
    exists = any(n['id'] == neuron_id for n in nodes)
    if exists:
        print(f"  ⏭️  Skipping (exists): {neuron_id}")
        continue
    
    neuron = {
        "id": neuron_id,
        "label": ss['filename'].replace('Screenshot ', '').replace('.png', ''),
        "category": "file",
        "frequency": 1,
        "moments": [],
        "attributes": {
            "role": "archived-screenshot",
            "type": "image",
            "filename": ss['filename'],
            "dimensions": f"{ss['width']}x{ss['height']}",
            "size": ss['size'],
            "captured": ss['captured'],
            "rawContentPath": f"/Users/paulvisciano/RAW/archive/{ss['date']}/images/{ss['filename']}",
            "date": ss['date'],
            "processedToday": "2026-03-11"
        },
        "created": ss['date']
    }
    
    new_neurons.append(neuron)
    print(f"  ✅ Created: {neuron_id}")

# Add all new neurons
nodes.extend(new_neurons)
print(f"\n✅ Created {len(new_neurons)} new file neurons")

# Create synapses: each screenshot → its temporal node
new_synapses = []
for neuron in new_neurons:
    date = neuron['attributes']['date']
    temporal_id = f"march-{date.split('-')[1]}-{date.split('-')[2]}-2026"
    
    # Check if synapse already exists
    exists = any(s.get('source') == neuron['id'] and s.get('target') == temporal_id for s in synapses)
    if not exists:
        new_synapses.append({
            "source": neuron['id'],
            "target": temporal_id,
            "weight": 1.0,
            "type": "processed-today",
            "label": "processed today"
        })

synapses.extend(new_synapses)
print(f"✅ Created {len(new_synapses)} synapses linking screenshots to temporal nodes")

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
print(f"  Neurons: {len(nodes)} (+{len(new_neurons)})")
print(f"  Synapses: {len(synapses)} (+{len(new_synapses)})")
print(f"  Fingerprint: {fingerprint_data['hash']}")
