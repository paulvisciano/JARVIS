#!/usr/bin/env node
// Remove March 12 file nodes only (audio + image nodes created today)

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';

console.log('🗑️  Removing March 12 file nodes...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find March 12 archive nodes (audio-* and image-* created today)
const march12FileNodeIds = [];
const nodesToRemove = [];

nodes.forEach((n, idx) => {
  if (n.id.startsWith('audio-2026-03-12') || n.id.startsWith('image-2026-03-12')) {
    march12FileNodeIds.push(n.id);
    nodesToRemove.push(idx);
  }
});

console.log(`Found ${march12FileNodeIds.length} March 12 file nodes to remove`);

// Remove nodes in reverse order to maintain indices
for (let i = nodesToRemove.length - 1; i >= 0; i--) {
  nodes.splice(nodesToRemove[i], 1);
}

// Remove synapses pointing to removed nodes
let synapsesRemoved = 0;
for (let i = synapses.length - 1; i >= 0; i--) {
  if (march12FileNodeIds.includes(synapses[i].source) || march12FileNodeIds.includes(synapses[i].target)) {
    synapses.splice(i, 1);
    synapsesRemoved++;
  }
}

console.log(`Removed ${synapsesRemoved} synapses`);

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
execSync(`git commit -m "🗑️  MARCH 12: Removed ${march12FileNodeIds.length} file nodes"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
