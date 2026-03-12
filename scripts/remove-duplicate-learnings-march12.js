#!/usr/bin/env node
// Remove duplicate learning nodes from March 12

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');

console.log('🗑️  Removing duplicate learning nodes from March 12...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find duplicate learning nodes by label
const duplicates = {
  'Bangkok Budget Tracking': [],
  'Voice Pipeline Launchd Service': [],
  'Image Understanding Gap': []
};

nodes.forEach((n, idx) => {
  if (n.attributes?.created === '2026-03-12' && duplicates[n.label]) {
    duplicates[n.label].push({node: n, idx: idx});
  }
});

const nodesToRemove = [];
const removedLabels = [];

for (const [label, items] of Object.entries(duplicates)) {
  if (items.length > 1) {
    // Keep the first one, remove the rest
    console.log(`  ${label}: ${items.length} duplicates → keeping 1`);
    for (let i = 1; i < items.length; i++) {
      nodesToRemove.push(items[i].idx);
      removedLabels.push(label);
    }
  }
}

console.log(`\nRemoving ${nodesToRemove.length} duplicate nodes`);

// Remove nodes in reverse order to maintain indices
for (let i = nodesToRemove.length - 1; i >= 0; i--) {
  nodes.splice(nodesToRemove[i], 1);
}

// Remove synapses pointing to removed nodes
const removedIds = nodesToRemove.map(idx => nodes[idx]?.id).filter(id => id);
let synapsesRemoved = 0;
for (let i = synapses.length - 1; i >= 0; i--) {
  if (removedIds.includes(synapses[i].source) || removedIds.includes(synapses[i].target)) {
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
execSync(`git commit -m "🗑️  MARCH 12: Removed ${nodesToRemove.length} duplicate learning nodes"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
