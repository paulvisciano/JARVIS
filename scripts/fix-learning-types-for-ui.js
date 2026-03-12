#!/usr/bin/env node
// Fix learning nodes: category should be 'learning', type should be 'learning'
// Then UI can filter by type: learning and show all of them

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const NODES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/nodes.json');
const SYNAPSES_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/synapses.json');
const FINGERPRINT_FILE = path.join(process.env.HOME, 'JARVIS/RAW/memories/fingerprint.json');
const TODAY = '2026-03-12';

console.log('🔧 Fixing learning node types for UI filter...');

// Load nodes and synapses
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf-8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf-8'));

// Find all nodes that should be learnings (created today, have learning-like attributes)
const learningNodes = nodes.filter(n => 
  n.attributes?.created === TODAY &&
  (n.attributes?.role === 'fix' || 
   n.attributes?.role === 'finance' || 
   n.attributes?.role === 'infrastructure' ||
   n.attributes?.role === 'automation' ||
   n.attributes?.role === 'maintenance' ||
   n.attributes?.role === 'vision')
);

console.log(`Found ${learningNodes.length} learning nodes to fix`);

learningNodes.forEach(n => {
  n.category = 'learning';
  n.attributes.type = 'learning'; // UI filters by type
  n.attributes.subtype = n.attributes.role; // Preserve the technical/personal distinction
  delete n.attributes.role;
  console.log(`  ✅ Fixed: ${n.label} (category: learning, type: learning, subtype: ${n.attributes.subtype})`);
});

// Write updated files
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

// Update fingerprint (but don't commit - git is canonical)
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

console.log('\n⚠️  Note: fingerprint.json is cached for UI, git is canonical timeline');

// Commit to git
const jarvisDir = path.join(process.env.HOME, 'JARVIS');
execSync('git add .', { cwd: jarvisDir });
execSync(`git commit -m "🔧 MARCH 12: Fixed learning node types for UI filter"`, { cwd: jarvisDir });

console.log('✅ Committed to git');
