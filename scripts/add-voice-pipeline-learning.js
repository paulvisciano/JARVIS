// Add voice pipeline breakthrough neurons
const fs = require('fs');
const path = require('path');

const nodesPath = 'RAW/memories/nodes.json';
const synapsesPath = 'RAW/memories/synapses.json';
const fingerprintPath = 'RAW/memories/fingerprint.json';

// Load existing data
const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));

// Add new neurons for voice pipeline breakthrough
const newNodes = [
    {
        id: `voice-pipeline-${Date.now()}`,
        label: 'Voice Pipeline Breakthrough',
        type: 'breakthrough',
        date: '2026-03-12',
        details: 'First real-time voice conversation with Jarvis - natural interaction, no typing needed',
        significance: 'high',
        tags: ['voice', 'breakthrough', 'conversation', 'interface']
    },
    {
        id: `two-folder-arch-${Date.now()}`,
        label: 'Two-Folder Architecture',
        type: 'architecture',
        date: '2026-03-12',
        details: 'live/ (conversation) vs inbox/ (batch) - prevents loops, clean separation',
        significance: 'high',
        tags: ['architecture', 'folders', 'live', 'inbox', 'separation']
    },
    {
        id: `auto-archive-${Date.now()}`,
        label: 'Auto-Archive After Response',
        type: 'feature',
        date: '2026-03-12',
        details: 'Files move from live/ to archive/ after conversation turn complete',
        significance: 'medium',
        tags: ['archive', 'automation', 'conversation', 'cleanup']
    }
];

// Add nodes
nodes.push(...newNodes);

// Create synapses connecting to existing neurons
const newSynapses = [
    // Voice pipeline connects to conversation
    { from: newNodes[0].id, to: nodes.find(n => n.label.includes('Conversation'))?.id || 'conversation', weight: 0.9 },
    // Voice pipeline connects to breakthrough
    { from: newNodes[0].id, to: nodes.find(n => n.label.includes('Breakthrough'))?.id || 'breakthrough', weight: 0.95 },
    // Two-folder connects to architecture
    { from: newNodes[1].id, to: nodes.find(n => n.label.includes('Architecture'))?.id || 'architecture', weight: 0.9 },
    // Two-folder connects to live folder
    { from: newNodes[1].id, to: newNodes[0].id, weight: 0.8 },
    // Auto-archive connects to voice pipeline
    { from: newNodes[2].id, to: newNodes[0].id, weight: 0.85 },
    // Auto-archive connects to archive concept
    { from: newNodes[2].id, to: nodes.find(n => n.label.includes('Archive'))?.id || 'archive', weight: 0.8 }
];

synapses.push(...newSynapses);

// Save updated data
fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
fs.writeFileSync(synapsesPath, JSON.stringify(synapses, null, 2));

// Update fingerprint
const crypto = require('crypto');
const hash = crypto.createHash('sha256')
    .update(JSON.stringify(nodes) + JSON.stringify(synapses))
    .digest('hex');
fs.writeFileSync(fingerprintPath, JSON.stringify({ hash, timestamp: new Date().toISOString() }));

console.log('✅ Added 3 new neurons:', newNodes.map(n => n.label));
console.log('✅ Added', newSynapses.length, 'new synapses');
console.log('✅ Updated fingerprint:', hash.slice(0, 16));
