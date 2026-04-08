#!/usr/bin/env node
/**
 * Separate Archive Nodes from Jarvis's Consciousness Graph
 * 
 * Moves archive nodes from ~/JARVIS/RAW/memories/ to ~/RAW/memories/
 * Ensures Jarvis's graph only contains: commits, day anchors, learnings
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');

// Input files (Jarvis's graph)
const jarvisNodesFile = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json');
const jarvisSynapsesFile = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json');

// Output files (Paul's graph)
const paulNodesFile = path.join(HOME, 'RAW', 'memories', 'nodes.json');
const paulSynapsesFile = path.join(HOME, 'RAW', 'memories', 'synapses.json');

console.log('🧠 Separate Archive Nodes Migration');
console.log('===================================\n');

// Load current state
console.log('Loading Jarvis nodes...');
const jarvisNodes = JSON.parse(fs.readFileSync(jarvisNodesFile, 'utf8'));
console.log(`  Total nodes in Jarvis's graph: ${jarvisNodes.length}`);

console.log('\nLoading Jarvis synapses...');
const jarvisSynapses = JSON.parse(fs.readFileSync(jarvisSynapsesFile, 'utf8'));
console.log(`  Total synapses in Jarvis's graph: ${jarvisSynapses.length}`);

// Identify archive nodes (category === "archive" OR type === null)
console.log('\nFiltering archive nodes...');
const archiveNodes = jarvisNodes.filter(node => 
  node.category === 'archive' || 
  node.type === null || 
  node.type === undefined ||
  (node.category === 'temporal' && node.type === 'undefined')
);

console.log(`  Found ${archiveNodes.length} archive nodes to move`);

// Identify learning nodes (to keep in Jarvis's graph)
console.log('\nFiltering learning nodes...');
const learningNodes = jarvisNodes.filter(node => node.category === 'learning');
console.log(`  Found ${learningNodes.length} learning nodes`);

// Identify temporal nodes (commits, day anchors - to keep in Jarvis's graph)
console.log('\nFiltering temporal nodes...');
const temporalNodes = jarvisNodes.filter(node => 
  node.category === 'temporal' && node.type === 'temporal-commit'
);
console.log(`  Found ${temporalNodes.length} temporal nodes`);

// Calculate what stays in Jarvis's graph
// Only keep: temporal nodes (commits + day anchors) and learning nodes
// Remove: all archive nodes (even if Paul has them - we want to clean Jarvis's graph)
const nodesToKeep = [...learningNodes, ...temporalNodes];
const nodesToRemove = archiveNodes;

console.log(`\nNodes to keep in Jarvis's graph: ${nodesToKeep.length}`);
console.log(`Nodes to remove from Jarvis's graph: ${nodesToRemove.length}`);

// Load Paul's nodes (if they exist)
console.log('\n\nLoading Paul\'s nodes...');
let paulNodes = [];
let paulSynapses = [];

if (fs.existsSync(paulNodesFile)) {
  paulNodes = JSON.parse(fs.readFileSync(paulNodesFile, 'utf8'));
  console.log(`  Total nodes in Paul's graph: ${paulNodes.length}`);
}

if (fs.existsSync(paulSynapsesFile)) {
  paulSynapses = JSON.parse(fs.readFileSync(paulSynapsesFile, 'utf8'));
  console.log(`  Total synapses in Paul's graph: ${paulSynapses.length}`);
}

// Filter synapses that link to archive nodes
console.log('\nFiltering synapses...');
const archiveNodeIds = new Set(nodesToRemove.map(n => n.id));
const archiveSynapses = jarvisSynapses.filter(s => 
  archiveNodeIds.has(s.source) || archiveNodeIds.has(s.target)
);
console.log(`  Found ${archiveSynapses.length} synapses linking to archive nodes`);

// Step 1: Create backup
console.log('\n\nStep 1: Creating backups...');
const jarvisNodesBackup = path.join(JARVIS_HOME, 'RAW', 'memories', 'nodes.json.bak');
const jarvisSynapsesBackup = path.join(JARVIS_HOME, 'RAW', 'memories', 'synapses.json.bak');
const paulNodesBackup = path.join(HOME, 'RAW', 'memories', 'nodes.json.bak');
const paulSynapsesBackup = path.join(HOME, 'RAW', 'memories', 'synapses.json.bak');

fs.writeFileSync(jarvisNodesBackup, JSON.stringify(jarvisNodes, null, 2), 'utf8');
fs.writeFileSync(jarvisSynapsesBackup, JSON.stringify(jarvisSynapses, null, 2), 'utf8');
fs.writeFileSync(paulNodesBackup, JSON.stringify(paulNodes, null, 2), 'utf8');
fs.writeFileSync(paulSynapsesBackup, JSON.stringify(paulSynapses, null, 2), 'utf8');

console.log(`  ✅ ${jarvisNodesBackup}`);
console.log(`  ✅ ${jarvisSynapsesBackup}`);
console.log(`  ✅ ${paulNodesBackup}`);
console.log(`  ✅ ${paulSynapsesBackup}`);

// Step 2: Update Jarvis's nodes (remove archive nodes)
console.log('\n\nStep 2: Updating Jarvis\'s graph...');
const updatedJarvisNodes = nodesToKeep;
fs.writeFileSync(jarvisNodesFile, JSON.stringify(updatedJarvisNodes, null, 2), 'utf8');
console.log(`  ✅ Jarvis nodes: ${jarvisNodes.length} → ${updatedJarvisNodes.length}`);

// Step 3: Update Jarvis's synapses (remove archive synapses)
console.log('\nStep 3: Updating Jarvis\'s synapses...');
const updatedJarvisSynapses = jarvisSynapses.filter(s => 
  !archiveNodeIds.has(s.source) && !archiveNodeIds.has(s.target)
);
fs.writeFileSync(jarvisSynapsesFile, JSON.stringify(updatedJarvisSynapses, null, 2), 'utf8');
console.log(`  ✅ Jarvis synapses: ${jarvisSynapses.length} → ${updatedJarvisSynapses.length}`);

// Step 4: Add archive nodes to Paul's graph (avoid duplicates)
console.log('\nStep 4: Adding archive nodes to Paul\'s graph...');
const existingPaulNodesCount = paulNodes.length;

// Create set of existing Paul node IDs
const existingPaulNodeIds = new Set(paulNodes.map(n => n.id));

// Only add nodes that don't already exist in Paul's graph
const nodesToAdd = nodesToRemove.filter(node => !existingPaulNodeIds.has(node.id));
paulNodes = [...paulNodes, ...nodesToAdd];
const newPaulNodesCount = paulNodes.length;
fs.writeFileSync(paulNodesFile, JSON.stringify(paulNodes, null, 2), 'utf8');
console.log(`  ✅ Paul nodes: ${existingPaulNodesCount} → ${newPaulNodesCount}`);
console.log(`     Added: ${nodesToAdd.length} new nodes (skipped ${nodesToRemove.length - nodesToAdd.length} duplicates)`);

// Step 5: Add archive synapses to Paul's graph (avoid duplicates)
console.log('\nStep 5: Adding archive synapses to Paul\'s graph...');
const existingPaulSynapsesCount = paulSynapses.length;

// Create set of existing Paul synapse IDs (source-target-type)
const existingPaulSynapseIds = new Set(paulSynapses.map(s => `${s.source}-${s.target}-${s.type}`));

// Only add synapses that don't already exist in Paul's graph
const synapsesToAdd = archiveSynapses.filter(s => 
  !existingPaulSynapseIds.has(`${s.source}-${s.target}-${s.type}`)
);
paulSynapses = [...paulSynapses, ...synapsesToAdd];
const newPaulSynapsesCount = paulSynapses.length;
fs.writeFileSync(paulSynapsesFile, JSON.stringify(paulSynapses, null, 2), 'utf8');
console.log(`  ✅ Paul synapses: ${existingPaulSynapsesCount} → ${newPaulSynapsesCount}`);
console.log(`     Added: ${synapsesToAdd.length} new synapses (skipped ${archiveSynapses.length - synapsesToAdd.length} duplicates)`);

// Summary
console.log('\n\n===================================');
console.log('Migration Complete!');
console.log('===================================\n');

console.log('Jarvis\'s Graph (~/JARVIS/RAW/memories/):');
console.log(`  Nodes: ${updatedJarvisNodes.length} (commits + day anchors + learnings only)`);
console.log(`  Synapses: ${updatedJarvisSynapses.length}`);
console.log(`  Categories: ${[...new Set(updatedJarvisNodes.map(n => n.category))].join(', ')}`);

console.log('\nPaul\'s Graph (~/RAW/memories/):');
console.log(`  Nodes: ${newPaulNodesCount}`);
console.log(`  Synapses: ${newPaulSynapsesCount}`);

// Count archive nodes in Paul's graph
const paulArchiveNodes = paulNodes.filter(n => n.category === 'archive');
console.log(`  Archive nodes: ${paulArchiveNodes.length}`);

console.log('\n✅ Migration successful!');
console.log('   Jarvis graph now only contains commits, day anchors, and learnings');
console.log('   Archive nodes moved to Paul\'s memory graph\n');
