---
name: scifi-app-discovery
description: Auto-discover Sci-Fi apps from ~/SCI-FI/apps/, sync to NeuroGraph as app nodes. Scan apps folder, compare with NeuroGraph app nodes, create missing nodes with path/purpose/plans_folder/status, verify plans folders exist, keep NeuroGraph registry current. Use when: (1) new apps created in Sci-Fi folder, (2) NeuroGraph needs app registry update, (3) checking app status + plans folders, (4) double-checking latest Sci-Fi apps.
metadata:
  openclaw:
    emoji: "🚀"
    requires:
      bins: ["python3", "mkdir"]
---

# Sci-Fi App Discovery (Folder → NeuroGraph Sync)

## When to Use

✅ **USE this skill when:**
- New apps created in `~/SCI-FI/apps/`
- NeuroGraph needs app registry update
- Checking app status + plans folders
- Double-checking latest Sci-Fi apps
- After creating new app folders

## When NOT to Use

❌ **DON'T use this skill when:**
- No Sci-Fi apps folder exists
- NeuroGraph already in sync (idempotent — safe but unnecessary)
- Only checking (use `scifi-app-status` instead)

## Workflow

### Step 1: Scan Sci-Fi Apps Folder

```bash
ls ~/SCI-FI/apps/
# Lists all app folders (JARVIS, neuro-graph, etc.)
```

### Step 2: Query NeuroGraph for App Nodes

```bash
python3 << 'PYEOF'
import json
import os

nodes_path = os.path.expanduser('~/JARVIS/RAW/memories/nodes.json')
nodes = json.load(open(nodes_path))

# Find app nodes
app_nodes = [n for n in nodes if 'app' in n.get('id', '').lower() or 'sci-fi' in n.get('label', '').lower()]
print(f"NeuroGraph app nodes: {len(app_nodes)}")
for n in app_nodes[:10]:
    print(f"  - {n['id']}: {n['label']}")
PYEOF
```

### Step 3: Compare Folder vs NeuroGraph

```bash
# Get folder apps
ls ~/SCI-FI/apps/

# Get NeuroGraph app nodes
python3 scripts/scan-neurograph-apps.py

# Identify missing
# Create nodes for apps not in NeuroGraph
```

### Step 4: Create Missing App Nodes

```bash
python3 << 'PYEOF'
import json
import os
from datetime import datetime

nodes_path = os.path.expanduser('~/JARVIS/RAW/memories/nodes.json')
synapses_path = os.path.expanduser('~/JARVIS/RAW/memories/synapses.json')
sci_fi_apps = os.path.expanduser('~/SCI-FI/apps')

# Load nodes
nodes = json.load(open(nodes_path))

# Scan apps folder
app_folders = [f for f in os.listdir(sci_fi_apps) if os.path.isdir(os.path.join(sci_fi_apps, f)) and not f.startswith('.')]

# Check existing app node IDs
existing_ids = {n['id'] for n in nodes}

# Create missing app nodes
new_nodes = []
for app in app_folders:
    node_id = f"{app}-app"
    if node_id not in existing_ids:
        node = {
            "id": node_id,
            "label": f"{app} App",
            "category": "application",
            "type": "app",
            "frequency": 1,
            "moments": [
                {
                    "date": datetime.now().strftime('%Y-%m-%d'),
                    "type": "discovery",
                    "description": f"Discovered {app} app in Sci-Fi apps folder"
                }
            ],
            "attributes": {
                "path": f"~/SCI-FI/apps/{app}",
                "purpose": f"{app} application",
                "plans_folder": f"~/SCI-FI/apps/{app}/plans",
                "status": "active",
                "discovered": datetime.now().strftime('%Y-%m-%d'),
                "source": "scifi-app-discovery skill"
            }
        }
        new_nodes.append(node)
        print(f"Created node: {node_id}")

# Add to nodes
nodes.extend(new_nodes)

# Save
with open(nodes_path, 'w') as f:
    json.dump(nodes, f, indent=2)

print(f"✅ Created {len(new_nodes)} new app nodes")
PYEOF
```

### Step 5: Verify Plans Folders

```bash
for app in ~/SCI-FI/apps/*/; do
  if [ ! -d "$app/plans" ]; then
    mkdir -p "$app/plans"
    echo "Created plans folder for $(basename $app)"
  fi
done
```

### Step 6: Link to sci-fi-apps Parent Node

```bash
python3 << 'PYEOF'
import json
import os

synapses_path = os.path.expanduser('~/JARVIS/RAW/memories/synapses.json')
synapses = json.load(open(synapses_path))

# Find sci-fi-apps parent node
nodes_path = os.path.expanduser('~/JARVIS/RAW/memories/nodes.json')
nodes = json.load(open(nodes_path))
parent = [n for n in nodes if n['id'] == 'sci-fi-apps']

if parent:
    parent_id = parent[0]['id']
    
    # Link new app nodes to parent
    app_nodes = [n for n in nodes if n.get('category') == 'application']
    new_synapses = []
    for app in app_nodes:
        synapse = {
            "source": app['id'],
            "target": parent_id,
            "weight": 100,
            "type": "belongs-to",
            "label": "Sci-Fi app"
        }
        new_synapses.append(synapse)
    
    synapses.extend(new_synapses)
    
    # Save
    with open(synapses_path, 'w') as f:
        json.dump(synapses, f, indent=2)
    
    print(f"✅ Created {len(new_synapses)} synapses to sci-fi-apps")
PYEOF
```

### Step 7: Report

```
✅ Sci-Fi App Discovery Complete
   Apps folder: N folders
   NeuroGraph nodes: M total
   New nodes created: K
   Plans folders verified: P
   Status: synced
```

## Commands

### Full Discovery (One-Liner)
```bash
cd ~/JARVIS && node skills/scifi-app-discovery/scripts/discover-apps.js
```

### Check Status
```bash
echo "Apps folder: $(ls ~/SCI-FI/apps/ | wc -l)"
python3 -c "import json; nodes=json.load(open('~/JARVIS/RAW/memories/nodes.json')); apps=[n for n in nodes if n.get('category')=='application']; print(f'NeuroGraph app nodes: {len(apps)}')"
```

### Verify Plans
```bash
for app in ~/SCI-FI/apps/*/; do ls -d "$app/plans" 2>/dev/null || echo "$(basename $app): NO PLANS"; done
```

## Error Handling

**If NeuroGraph load fails:**
- Check file exists: `test -f ~/JARVIS/RAW/memories/nodes.json`
- Check JSON valid: `python3 -c "import json; json.load(open('~/JARVIS/RAW/memories/nodes.json'))"`

**If plans folder creation fails:**
- Check permissions: `test -w ~/SCI-FI/apps/`
- Create parent: `mkdir -p`

**If synapses fail:**
- Check synapses.json exists
- Verify parent node exists (`sci-fi-apps`)

## Notes

- **Idempotent:** Safe to run multiple times
- **Auto-discovers:** No manual app list needed
- **Creates nodes:** Only for apps missing from NeuroGraph
- **Verifies plans:** Creates if missing
- **Links to parent:** All apps connect to `sci-fi-apps` node
- **Portable:** Uses `~` for home directory

## Example Output

```
✅ Sci-Fi App Discovery Complete
   Apps folder: 2 folders (JARVIS, neuro-graph)
   NeuroGraph nodes: 6693 total
   New nodes created: 2
     - jarvis-app: JARVIS App
     - neuro-graph-app: NeuroGraph App
   Plans folders verified: 2
     - JARVIS: ~/SCI-FI/apps/JARVIS/plans ✅
     - neuro-graph: ~/SCI-FI/apps/neuro-graph/plans ✅
   Synapses created: 2 (linked to sci-fi-apps)
   Status: synced
```

## NeuroGraph App Node Structure

```json
{
  "id": "jarvis-app",
  "label": "JARVIS App",
  "category": "application",
  "type": "app",
  "frequency": 1,
  "moments": [{
    "date": "2026-03-21",
    "type": "discovery",
    "description": "Discovered JARVIS app in Sci-Fi apps folder"
  }],
  "attributes": {
    "path": "~/SCI-FI/apps/JARVIS",
    "purpose": "JARVIS UI application",
    "plans_folder": "~/SCI-FI/apps/JARVIS/plans",
    "status": "active",
    "discovered": "2026-03-21",
    "source": "scifi-app-discovery skill"
  }
}
```

---

**Created:** March 21, 2026  
**Location:** `~/JARVIS/skills/scifi-app-discovery/`  
**Auto-symlink:** Runs skill-discovery after creation  
**Idempotent:** Safe to run anytime
