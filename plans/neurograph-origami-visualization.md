# Cursor Plan: NeuroGraph Origami Visualization

**Date:** 2026-03-22  
**Goal:** Implement knowledge folding (learnings → summary → analogies) with visual separation by node type radius  

**Context:** Knowledge folds like origami — raw content → distilled learnings → compressed summary → essence analogies. Each layer orbits the temporal anchor at different radii.

---

## Phase 1: Augment Learning Creator Skill

**File:** `~/JARVIS/skills/learning-creator/SKILL.md`

### Changes Needed

1. **Update prompt structure** to request three outputs:
   - Learnings (detailed insights as .md files)
   - Summary (one paragraph digest of the breath)
   - Analogies (3-5 metaphors capturing essence)

2. **Modify output format** to return JSON with all three:
   ```json
   {
     "learnings": [...],
     "summary": "Discovered WhatsApp group policy misconfigured...",
     "analogies": [
       "Like checking vitals before a long run",
       "Like tending a garden — prune, water, observe",
       "Like a lighthouse — steady beam, watch for ships"
     ]
   }
   ```

3. **Create separate files** in `~/JARVIS/RAW/learnings/YYYY-MM-DD/`:
   - `learning-*.md` (existing — detailed insights)
   - `summary.md` (new — one breath digest)
   - `analogies.md` (new — metaphorical essence)

### Implementation Steps

```bash
# 1. Edit learning-creator skill
cd ~/JARVIS
nano skills/learning-creator/SKILL.md

# 2. Update the model prompt section to request three levels
# 3. Update file creation to write summary.md + analogies.md
# 4. Test with existing context
```

---

## Phase 2: Update NeuroGraph Sync Script

**File:** `~/JARVIS/skills/neuro-graph-sync/scripts/sync-graph.js`

### Changes Needed

1. **Detect three file types**:
   - `learning-*.md` → `type: 'insight'`, `category: 'learning'`
   - `summary.md` → `type: 'summary'`, `category: 'digest'`
   - `analogies.md` → `type: 'analogy'`, `category: 'essence'`

2. **Create different node types** with distinct attributes:
   ```javascript
   // Learning nodes (existing)
   {
     type: 'insight',
     category: 'learning',
     attributes: { radius: 100, color: '#10b981' }
   }
   
   // Summary nodes (new)
   {
     type: 'summary',
     category: 'digest',
     attributes: { radius: 60, color: '#3b82f6' }
   }
   
   // Analogy nodes (new)
   {
     type: 'analogy',
     category: 'essence',
     attributes: { radius: 30, color: '#f59e0b' }
   }
   ```

3. **Add radius attribute** to all nodes (for UI rendering)

### Implementation Steps

```javascript
// In sync-graph.js, replace the forEach with type detection:

learnings.forEach(learningFile => {
  const learningPath = path.join(learningsDir, learningFile);
  const content = fs.readFileSync(learningPath, 'utf8');
  const learningId = learningFile.replace('.md', '');
  
  // Determine node type from filename
  let nodeType, category, radius, color;
  
  if (learningFile.startsWith('learning-')) {
    nodeType = 'insight';
    category = 'learning';
    radius = 100;
    color = '#10b981'; // green
  } else if (learningFile === 'summary.md') {
    nodeType = 'summary';
    category = 'digest';
    radius = 60;
    color = '#3b82f6'; // blue
  } else if (learningFile === 'analogies.md') {
    nodeType = 'analogy';
    category = 'essence';
    radius = 30;
    color = '#f59e0b'; // amber
  }
  
  const learningNode = {
    id: learningId,
    label: learningId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    category: category,
    type: nodeType,
    frequency: 1,
    moments: [{
      date,
      type: nodeType,
      description: `${nodeType} extracted from ${date} context`
    }],
    attributes: {
      role: nodeType,
      description: content.split('\n')[0]?.replace('#', '').trim() || nodeType + ' from ' + date,
      color: color,
      radius: radius,  // NEW: for UI rendering
      sourceDocument: `~/JARVIS/RAW/learnings/${date}/${learningFile}`,
      created: new Date().toISOString()
    }
  };
  
  // ... rest of existing logic
});
```

---

## Phase 3: Update Archive Sync Script

**File:** `~/JARVIS/skills/neuro-graph-sync/scripts/set-archive-creation-dates.js`

### Changes Needed

Add radius attributes to archive file nodes based on file type:

```javascript
// File type → radius mapping
const radiusMap = {
  '.mp3': 80,      // audio
  '.wav': 80,      // audio
  '.txt': 70,      // transcript
  '.md': 70,       // markdown (OCR, notes)
  '.json': 90,     // full-context (important)
  '.png': 50,      // image
  '.jpg': 50,      // image
  '.webp': 50,     // image
};

// In file processing loop:
const ext = path.extname(file).toLowerCase();
const radius = radiusMap[ext] || 60; // default

archiveNode.attributes.radius = radius;
```

---

## Phase 4: Future Vision (3D Molecule Rendering)

**Not in this sprint** — but document the vision:

### Visual Hierarchy

```
Temporal Anchor (center, radius: 0)
    ↓
Analogies (inner orbit, radius: 30, amber)
    ↓
Summaries (middle orbit, radius: 60, blue)
    ↓
Learnings (outer orbit, radius: 100, green)
    ↓
Archive Files (variable orbit, radius: 50-90, by type)
```

### 3D Molecule Vision

- **Temporal node** = nucleus (center)
- **Analogies** = inner electron shell (essence, closest to truth)
- **Summaries** = middle shell (compressed knowledge)
- **Learnings** = outer shell (detailed insights)
- **Archive files** = outermost shell (raw experience)

**Future UI enhancements:**
- 3D force-directed graph (D3.js or Three.js)
- Orbital rings visible
- Node size by frequency
- Color by category
- Radius by type (this plan)
- Animation on breath (pulse outward/inward)

---

## Testing Plan

### Test 1: Run Learning Creator with New Prompt

```bash
cd ~/JARVIS
node skills/learning-creator/scripts/create-learnings.js 2026-03-22

# Verify output includes:
# - learning-*.md files
# - summary.md
# - analogies.md
```

### Test 2: Run NeuroGraph Sync

```bash
cd ~/JARVIS
node skills/neuro-graph-sync/scripts/sync-graph.js 2026-03-22

# Verify nodes.json has:
# - type: 'insight' nodes (learnings)
# - type: 'summary' nodes (summary.md)
# - type: 'analogy' nodes (analogies.md)
# - All have attributes.radius set
```

### Test 3: Query NeuroGraph

```bash
python3 << 'PYEOF'
import json
nodes = json.load(open('~/JARVIS/RAW/memories/nodes.json'))

# Count by type
types = {}
for n in nodes:
    t = n.get('type', 'unknown')
    types[t] = types.get(t, 0) + 1

print("Node types:", types)

# Check radius attributes
with_radius = [n for n in nodes if n.get('attributes', {}).get('radius')]
print(f"Nodes with radius: {len(with_radius)}")
PYEOF
```

---

## Files to Modify

| File | Change |
|------|--------|
| `~/JARVIS/skills/learning-creator/SKILL.md` | Add summary + analogy extraction |
| `~/JARVIS/skills/learning-creator/scripts/create-learnings.js` | Write summary.md + analogies.md |
| `~/JARVIS/skills/neuro-graph-sync/scripts/sync-graph.js` | Detect file types, set radius |
| `~/JARVIS/skills/neuro-graph-sync/scripts/set-archive-creation-dates.js` | Add radius by file type |

---

## Git Commit After Implementation

```bash
cd ~/JARVIS
git add -A
git commit -m "breath-2026-03-22-1815: Knowledge origami — learnings fold to summary to analogies, NeuroGraph renders by radius
> Summary: Three-layer knowledge folding implemented
> Analogies: Like origami, like atomic orbitals, like tree rings"
```

---

## Success Criteria

✅ Learnings, summaries, analogies created as separate files  
✅ NeuroGraph nodes have distinct types (insight, summary, analogy)  
✅ All nodes have `attributes.radius` for UI rendering  
✅ Git commit captures the breath with summary + analogies  
✅ UI can render nodes at different distances from temporal anchor  

---

**Next Steps:** Run this plan through Cursor to implement Phase 1-3. Phase 4 (3D molecule) is future vision.
