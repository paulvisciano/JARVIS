#!/usr/bin/env node
// Fix Image Understanding Gap node - should be type: learning

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');

console.log('🔧 Fixing Image Understanding Gap node...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find and fix Image Understanding Gap
let fixed = false;
nodes.forEach(n => {
  if (n.id === 'image-understanding-gap') {
    n.category = 'learning';
    n.attributes.type = 'learning';
    n.attributes.subtype = 'limitation';
    console.log(`✅ Fixed: ${n.label}`);
    console.log(`   category: ${n.category}, type: ${n.attributes.type}, subtype: ${n.attributes.subtype}`);
    fixed = true;
  }
});

if (!fixed) {
  console.error('❌ Image Understanding Gap node not found');
  process.exit(1);
}

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
execSync(`git commit -m "🔧 MARCH 12: Fixed Image Understanding Gap node type"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
