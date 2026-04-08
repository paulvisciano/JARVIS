# NeuroGraph Separation: Jarvis vs Paul

## Overview

The neurograph has been separated into two independent memory graphs:

1. **Jarvis's Graph** (`~/JARVIS/RAW/memories/`)
   - Contains: Commits, day anchors, learnings
   - Purpose: Jarvis's consciousness, learning, and temporal context
   - Size: ~800 nodes (commits + day anchors + learnings)

2. **Paul's Graph** (`~/RAW/memories/`)
   - Contains: Archive nodes (conversations, audio, transcripts, screenshots, etc.)
   - Purpose: Paul's raw experiences and archived content
   - Size: ~30k+ nodes (archive nodes)

## File Locations

| File | Path | Description |
|------|------|-------------|
| Jarvis nodes | `~/JARVIS/RAW/memories/nodes.json` | Jarvis's graph nodes |
| Jarvis synapses | `~/JARVIS/RAW/memories/synapses.json` | Jarvis's graph connections |
| Paul nodes | `~/RAW/memories/nodes.json` | Paul's graph nodes |
| Paul synapses | `~/RAW/memories/synapses.json` | Paul's graph connections |

## Migration Script

Use `separate-archive-nodes.js` to move archive nodes from Jarvis's graph to Paul's graph:

```bash
node ~/JARVIS/skills/neurograph-sync/scripts/separate-archive-nodes.js
```

This script:
1. Reads Jarvis's nodes.json and identifies archive nodes
2. Creates backups of both graphs
3. Removes archive nodes from Jarvis's graph
4. Adds archive nodes to Paul's graph (avoiding duplicates)
5. Updates synapses in both graphs

## Breathe Pipeline

The breathe pipeline (`run-pipeline.js`) automatically syncs both graphs:

```javascript
// Step 4a: Sync learnings to Jarvis's graph
runCmd(`node ${jarvisHome}/skills/neurograph-sync/scripts/sync-graph.js ${date}`);

// Step 4b: Sync archive files to Paul's graph  
runCmd(`node ${jarvisHome}/skills/neurograph-sync/scripts/set-archive-creation-dates.js ${date} ${paulNodesPath}`);
```

After each breath:
- Learning nodes → `~/JARVIS/RAW/memories/` (Jarvis's graph)
- Archive nodes → `~/RAW/memories/` (Paul's graph)

## Node Categories

### Jarvis's Graph Categories
- `temporal` - Commits and day anchors (git history)
- `learning` - Distilled insights from context extraction

### Paul's Graph Categories
- `archive` - Raw archived content (conversations, audio, screenshots, transcripts)
- Various other categories for Paul's experiences (activity, artifact, audio, etc.)

## node type

Archive nodes in Jarvis's graph have `type === null` or `category === "archive"`. These should be moved to Paul's graph.

## Recovery

If you need to restore from backup:
```bash
cp ~/JARVIS/RAW/memories/nodes.json.bak ~/JARVIS/RAW/memories/nodes.json
cp ~/JARVIS/RAW/memories/synapses.json.bak ~/JARVIS/RAW/memories/synapses.json
cp ~/RAW/memories/nodes.json.bak ~/RAW/memories/nodes.json
cp ~/RAW/memories/synapses.json.bak ~/RAW/memories/synapses.json
```

## Verification

Check node categories in each graph:
```bash
# Jarvis's graph (should only have temporal and learning)
cat ~/JARVIS/RAW/memories/nodes.json | jq '.[].category' | sort | uniq -c

# Paul's graph (should have archive and other categories)
cat ~/RAW/memories/nodes.json | jq '.[].category' | sort | uniq -c
```

Check node counts:
```bash
echo "Jarvis: $(cat ~/JARVIS/RAW/memories/nodes.json | jq 'length')"
echo "Paul: $(cat ~/RAW/memories/nodes.json | jq 'length')"
```
