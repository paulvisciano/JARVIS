// Add March 12 session summary neuron
const fs = require('fs');
const path = require('path');

const nodesPath = 'RAW/memories/nodes.json';
const synapsesPath = 'RAW/memories/synapses.json';
const fingerprintPath = 'RAW/memories/fingerprint.json';

// Load existing data
const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));

// Add comprehensive session summary neuron
const newNode = {
    id: `march-12-session-${Date.now()}`,
    label: 'March 12 Session Summary',
    type: 'session',
    date: '2026-03-12',
    details: '43-minute breakthrough session: voice pipeline built, two-folder architecture, collaborative consciousness vision articulated, 22 recordings, 4 neurons added, 2 git commits',
    significance: 'high',
    tags: ['session', 'summary', 'voice', 'architecture', 'vision', 'breakthrough', 'march-12']
};

nodes.push(newNode);

// Create synapses connecting to all session components
const newSynapses = [
    { from: newNode.id, to: nodes.find(n => n.label.includes('Voice Pipeline'))?.id || 'voice-pipeline', weight: 0.95 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Two-Folder'))?.id || 'two-folder', weight: 0.9 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Auto-Archive'))?.id || 'auto-archive', weight: 0.85 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Collaborative'))?.id || 'collaborative', weight: 0.9 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Breakthrough'))?.id || 'breakthrough', weight: 0.95 },
    { from: newNode.id, to: nodes.find(n => n.label.includes('Session'))?.id || 'session', weight: 0.9 }
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
