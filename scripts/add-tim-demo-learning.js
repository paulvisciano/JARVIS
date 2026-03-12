#!/usr/bin/env node
// Add "Tim Live Demo" learning node - spectator validation moment

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';

console.log('🧠 Adding Tim Live Demo learning node...');

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
const timDemoNode = {
  id: 'tim-live-demo-march-12',
  label: 'Tim Live Demo - Spectator Validation',
  category: 'learning',
  frequency: 1,
  moments: ['live-demo', 'spectator', 'validation', 'sovereign-ai'],
  attributes: {
    type: 'learning',
    subtype: 'milestone',
    description: 'Paul demoed Jarvis + Neurograph to Tim (random spectator). First external validation of sovereign AI infrastructure. Voice recording + neural graph stack impressed visitor. Real-world proof of concept.',
    color: '#f59e0b',
    created: TODAY,
    sourceDocument: `RAW/archive/${TODAY}/transcript.md`,
    participants: ['Paul', 'Tim'],
    time: '15:49 GMT+7'
  }
};

nodes.push(timDemoNode);
console.log('✅ Created Tim Live Demo learning node');

// Create synapses
// Link to transcript (extracted-from)
synapses.push({
  source: timDemoNode.id,
  target: transcriptNode.id,
  weight: 1,
  type: 'extracted-from'
});

// Link to temporal (learned-today)
synapses.push({
  source: timDemoNode.id,
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
execSync(`git commit -m "🧠 MARCH 12: Added Tim Live Demo - Spectator Validation"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
