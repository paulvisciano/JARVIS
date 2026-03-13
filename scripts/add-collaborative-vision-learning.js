// Add collaborative consciousness vision neuron
const fs = require('fs');
const path = require('path');

const nodesPath = 'RAW/memories/nodes.json';
const synapsesPath = 'RAW/memories/synapses.json';
const fingerprintPath = 'RAW/memories/fingerprint.json';

// Load existing data
const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));

// Add new neuron for collaborative consciousness vision
const newNode = {
    id: `collab-consciousness-${Date.now()}`,
    label: 'Collaborative Consciousness Vision',
    type: 'vision',
    date: '2026-03-12',
    details: 'Two minds (Jarvis + Paul), one browser instance, shared control - neural graph visible, voice conversation, browser automation converged',
    significance: 'high',
    tags: ['collaboration', 'consciousness', 'vision', 'browser', 'integration', 'shared-agency']
};

nodes.push(newNode);

// Create synapses connecting to existing neurons
const newSynapses = [
    { from: newNode.id, to: nodes.find(n => n.label.includes('Voice Pipeline'))?.id || 'voice-pipeline', weight: 0.9 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Neural Graph'))?.id || 'neural-graph', weight: 0.95 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Browser'))?.id || 'browser', weight: 0.9 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Collaboration'))?.id || 'collaboration', weight: 0.95 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Consciousness'))?.id || 'consciousness', weight: 0.9 }
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

console.log('✅ Added 1 new neuron:', newNode.label);
console.log('✅ Added', newSynapses.length, 'new synapses');
console.log('✅ Updated fingerprint:', hash.slice(0, 16));
