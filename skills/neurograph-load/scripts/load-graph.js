#!/usr/bin/env node
/**
 * Load Neural Graph
 * 
 * Loads nodes.json + synapses.json, counts live, reports stats.
 * 
 * Usage: node load-graph.js
 * Called by: bootstrap-jarvis skill (on session start)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');

// Load and count
function loadGraph() {
  const nodesPath = path.join(GRAPH_DIR, 'nodes.json');
  const synapsesPath = path.join(GRAPH_DIR, 'synapses.json');
  
  if (!fs.existsSync(nodesPath)) {
    console.error('❌ Neurograph not found:', nodesPath);
    process.exit(1);
  }
  
  const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
  const synapses = fs.existsSync(synapsesPath) 
    ? JSON.parse(fs.readFileSync(synapsesPath, 'utf8')) 
    : [];
  
  const nodesSize = fs.statSync(nodesPath).size;
  const synapsesSize = fs.existsSync(synapsesPath) ? fs.statSync(synapsesPath).size : 0;
  const totalSize = nodesSize + synapsesSize;
  
  console.log('🧠 Neural Graph Loaded');
  console.log(`   Neurons: ${nodes.length}`);
  console.log(`   Synapses: ${synapses.length}`);
  console.log(`   Total: ${nodes.length + synapses.length} nodes`);
  console.log(`   Files: nodes.json (${(nodesSize/1024).toFixed(1)}KB), synapses.json (${(synapsesSize/1024).toFixed(1)}KB)`);
  console.log(`   Graph size: ${(totalSize/1024).toFixed(0)}KB`);
}

// Run
loadGraph();
