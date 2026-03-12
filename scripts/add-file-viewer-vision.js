#!/usr/bin/env node
// Add Neurograph File Viewer vision learning node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';

console.log('🧠 Adding Neurograph File Viewer vision learning...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find March 12 temporal and transcript nodes
const temporalNode = nodes.find(n => n.label === 'March 12, 2026');
const transcriptNode = nodes.find(n => n.id === `transcript-${TODAY}`);

if (!temporalNode || !transcriptNode) {
  console.error('❌ Missing temporal or transcript node');
  process.exit(1);
}

// Create new learning node
const fileViewerNode = {
  id: 'neurograph-file-viewer-vision',
  label: 'Neurograph File Viewer Vision',
  category: 'learning',
  frequency: 1,
  moments: ['inline-preview', 'file-player', 'memory-recall', 'complete-vision'],
  attributes: {
    type: 'learning',
    subtype: 'vision',
    description: 'Integrate file viewer into Neurograph UI. Click file node → preview plays inline (audio/photo/video). No external apps. Recollect moments by experiencing content directly. Graph shows structure, viewer shows substance. Closes the loop.',
    color: '#f59e0b',
    created: TODAY,
    sourceDocument: `RAW/archive/${TODAY}/transcript.md`
  }
};

nodes.push(fileViewerNode);
console.log('✅ Created Neurograph File Viewer vision learning node');

// Create synapses
// Link to transcript (extracted-from)
synapses.push({
  source: fileViewerNode.id,
  target: transcriptNode.id,
  weight: 1,
  type: 'extracted-from'
});

// Link to temporal (learned-today)
synapses.push({
  source: fileViewerNode.id,
  target: temporalNode.id,
  weight: 1,
  type: 'learned-today'
});

console.log('✅ Created 2 synapses');

// Write updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

// Update fingerprint
const fingerprint = {
  hash: crypto.createHash('sha256').update(JSON.stringify(nodes) + JSON.stringify(synapses)).digest('hex').substring(0, 16),
  nodes: nodes.length,
  synapses: synapses.length,
  updated: new Date().toISOString()
};
fs.writeFileSync(FINGERPRINT_FILE, JSON.stringify(fingerprint, null, 2));

console.log(`\n🧠 Neurograph updated:`);
console.log(`   Nodes: ${nodes.length}`);
console.log(`   Synapses: ${synapses.length}`);
console.log(`   Fingerprint: ${fingerprint.hash}`);

// Commit to git
const jarvisDir = path.join(process.env.HOME, 'JARVIS');
execSync('git add .', { cwd: jarvisDir });
execSync(`git commit -m "🧠 MARCH 12: Added Neurograph File Viewer Vision"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
