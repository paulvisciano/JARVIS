#!/usr/bin/env node

/**
 * Update Commit Node Labels to Hash-Only
 * 
 * Changes commit neuron labels from full message to just the hash.
 * Preserves node count, synapses, and all other properties.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.dirname(__dirname);
const MEMORIES_DIR = path.join(REPO_ROOT, 'RAW/memories');
const NODES_FILE = path.join(MEMORIES_DIR, 'nodes.json');

// Load nodes
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));

let updatedCount = 0;

nodes.forEach(node => {
  // Only update milestone-commit nodes
  if (node.category !== 'milestone-commit') return;
  
  // Store the old label in attributes for reference
  const oldLabel = node.label;
  const hash = node.attributes.hash || node.id.replace('commit-', '');
  
  // Update label to hash-only
  node.label = hash;
  
  // Ensure attributes has full message
  if (!node.attributes.shortTitle && oldLabel !== hash) {
    node.attributes.shortTitle = oldLabel;
  }
  
  updatedCount++;
  console.log(`✓ ${node.id}: "${oldLabel.substring(0, 50)}..." → "${hash}"`);
});

// Save updated nodes
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));

console.log(`\n✅ Commit node labels updated!`);
console.log(`   Updated: ${updatedCount} nodes`);
console.log(`   Total nodes: ${nodes.length} (unchanged)`);
console.log(`   Total synapses: unchanged`);
