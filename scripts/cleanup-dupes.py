import json

with open('RAW/memories/nodes.json', 'r') as f:
    nodes = json.load(f)

# Find duplicate inbox-processing-bug-fixed nodes
dups = [i for i, n in enumerate(nodes) if n.get('id') == 'inbox-processing-bug-fixed']
print(f'Found {len(dups)} duplicates of inbox-processing-bug-fixed')

# Keep only the first one, remove rest
if len(dups) > 1:
    # Remove in reverse order to maintain indices
    for i in reversed(dups[1:]):
        nodes.pop(i)
    print(f'Removed {len(dups)-1} duplicates')

with open('RAW/memories/nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

print(f'Remaining nodes: {len(nodes)}')
