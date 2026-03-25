#!/usr/bin/env node

/**
 * Memory Separator — Extract Personal Nodes from Jarvis Core
 * 
 * Scans ~/JARVIS/RAW/memories/, identifies personal nodes,
 * moves them to ~/RAW/memories/, leaves core for git sync.
 * 
 * Usage: node extract-personal.js
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Use environment variables with fallbacks for portability
const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');

const jarvisMemoriesDir = path.join(JARVIS_HOME, 'RAW', 'memories');
const personalMemoriesDir = path.join(HOME, 'RAW', 'memories');

// Personal node categories (NOT shared - move to ~/RAW/memories/)
const PERSONAL_CATEGORIES = [
  'archive',          // Archive file references (personal ~/RAW/archive/)
  'conversation',     // Chat history (specific conversations)
  'transcript',       // Audio transcripts (specific recordings)
  'session',          // Session metadata (specific sessions)
  'inbox',            // Inbox items (temporary staging)
  'person',           // People YOU know (Bruce, Bozhi, etc.)
  'location',         // Locations you've been (personal geography)
  'moment',           // Personal moments
  'relationship',     // Your connections
  'event',            // Life events (tournaments, trips, meetings)
];

// Personal learning keywords (life events, not system architecture)
const PERSONAL_LEARNING_KEYWORDS = [
  'tournament', 'fuds', 'volleyball', 'massage', 'food', 'hotel',
  'eric', 'bruce', 'amsterdam cafe', 'bangkok budget', 'march 13',
  'evening', 'plan', 'whatsapp call', 'meeting', 'trip',
  'santiago', 'manila', 'miami', 'san diego', 'amsterdam',
  'equipment return', 'health insurance', 'google drive', 'stock option',
  'book learning', 'coach', 'crowd', 'win', 'ocean', 'smoke',
  'outsystems', 'email sent', 'left at', 'accomplishment', 'reflection',
  'ritual', 'pakistan', 'bulgaria', 'sovereign base', 'vacation',
];

// Core Jarvis categories (shared - stay in ~/JARVIS/RAW/memories/)
const CORE_CATEGORIES = [
  'jarvis',           // Identity, architecture
  'decision',         // Shared decisions
  'architecture',     // System design
  'skill',            // Skill definitions
  'learning',         // Shared insights (extracted FROM archive ✅)
  'bootstrap',        // Bootstrap state
  'breathe',          // Pipeline architecture
  'neurograph',       // Graph structure
  'temporal',         // Temporal anchors (date structure)
  'system',           // System nodes
  'principle',        // Principles (shared wisdom)
  'concept',          // Concepts
  'milestone-commit', // Milestones
  'infrastructure',   // Infrastructure
  'foundation',       // Foundation
  'file',             // File references (system, not personal)
  'vision',           // Vision
  'pattern',          // Patterns
  'project',          // Projects
  'capability',       // Capabilities
  'philosophy',       // Philosophy
  'emotion',          // Emotions (shared human experience)
  'operation',        // Operations
  'feature',          // Features
];

function isPersonalNode(node) {
  // Check category
  const category = (node.category || '').toLowerCase();
  
  // Explicitly personal (move to ~/RAW/memories/)
  if (PERSONAL_CATEGORIES.some(c => category === c || category.includes(c))) {
    return true;
  }
  
  // Explicitly core (stay in ~/JARVIS/RAW/memories/)
  if (CORE_CATEGORIES.some(c => category === c || category.includes(c))) {
    // Special handling for learning nodes - some are personal
    if (category === 'learning') {
      return isPersonalLearning(node);
    }
    return false;
  }
  
  // Check attributes for conversation/transcript markers
  const attrs = JSON.stringify(node.attributes || {});
  if (/conversation|transcript|session|inbox|chat.*with|call.*with|meeting.*with/i.test(attrs)) {
    return true;
  }
  
  // Default: if not explicitly personal, keep in core
  // (Jarvis core is the default, personal is exception)
  return false;
}

function isPersonalLearning(node) {
  // Learning nodes can be personal (life events) or core (system architecture)
  const label = (node.label || '').toLowerCase();
  const source = JSON.stringify(node.attributes || {}).toLowerCase();
  const combined = label + ' ' + source;
  
  // Check for personal keywords
  if (PERSONAL_LEARNING_KEYWORDS.some(kw => combined.includes(kw))) {
    return true;
  }
  
  // Check for core architecture patterns (keep in Jarvis)
  const corePatterns = [
    'breathe', 'bootstrap', 'pipeline', 'skill', 'neurograph',
    'context', 'archive', 'ocr', 'memory', 'graph', 'sync',
    'architecture', 'system', 'design', 'pattern', 'decision',
    'workflow', 'extraction', 'distill', 'weave', 'digest',
    'openclaw', 'jarvis', 'consciousness', 'runtime', 'gateway',
  ];
  
  if (corePatterns.some(kw => combined.includes(kw))) {
    return false; // Core learning, keep in Jarvis
  }
  
  // Default: learning nodes without clear patterns - check source path
  const sourceDoc = node.attributes?.sourceDocument || '';
  if (sourceDoc.includes('learnings/2026-03-13') || 
      sourceDoc.includes('learnings/2026-03-10') ||
      sourceDoc.includes('learnings/2026-03-11')) {
    // March 10-13 were heavy personal life days
    return true;
  }
  
  return false;
}

function extractPersonal() {
  console.log('🧠 Memory Separator — Extracting Personal Nodes\n');
  
  // Load Jarvis memories
  const jarvisNodesPath = path.join(jarvisMemoriesDir, 'nodes.json');
  const jarvisSynapsesPath = path.join(jarvisMemoriesDir, 'synapses.json');
  
  if (!fs.existsSync(jarvisNodesPath)) {
    console.log('⚠️  Jarvis memories not found:', jarvisNodesPath);
    process.exit(1);
  }
  
  console.log(`   Loading: ${jarvisNodesPath}`);
  const jarvisNodes = JSON.parse(fs.readFileSync(jarvisNodesPath, 'utf8'));
  const jarvisSynapses = fs.existsSync(jarvisSynapsesPath) 
    ? JSON.parse(fs.readFileSync(jarvisSynapsesPath, 'utf8')) 
    : [];
  
  console.log(`   Total nodes: ${jarvisNodes.length}`);
  console.log(`   Total synapses: ${jarvisSynapses.length}`);
  
  // Separate personal vs core
  const personalNodes = [];
  const coreNodes = [];
  
  jarvisNodes.forEach(node => {
    if (isPersonalNode(node)) {
      personalNodes.push(node);
    } else {
      coreNodes.push(node);
    }
  });
  
  console.log(`\n   Personal nodes: ${personalNodes.length}`);
  console.log(`   Core nodes: ${coreNodes.length}`);
  
  // Ensure personal memories directory exists
  fs.mkdirSync(personalMemoriesDir, { recursive: true });
  
  // Load existing personal memories (if any)
  const personalNodesPath = path.join(personalMemoriesDir, 'nodes.json');
  const personalSynapsesPath = path.join(personalMemoriesDir, 'synapses.json');
  
  let existingPersonalNodes = [];
  let existingPersonalSynapses = [];
  
  if (fs.existsSync(personalNodesPath)) {
    console.log(`   Merging with existing personal: ${personalNodesPath}`);
    existingPersonalNodes = JSON.parse(fs.readFileSync(personalNodesPath, 'utf8'));
  }
  if (fs.existsSync(personalSynapsesPath)) {
    existingPersonalSynapses = JSON.parse(fs.readFileSync(personalSynapsesPath, 'utf8'));
  }
  
  // Merge personal nodes (avoid duplicates by ID)
  const existingIds = new Set(existingPersonalNodes.map(n => n.id));
  const newPersonalNodes = personalNodes.filter(n => !existingIds.has(n.id));
  const mergedPersonalNodes = [...existingPersonalNodes, ...newPersonalNodes];
  
  console.log(`   New personal nodes: ${newPersonalNodes.length}`);
  console.log(`   Merged personal total: ${mergedPersonalNodes.length}`);
  
  // Write personal memories
  fs.writeFileSync(personalNodesPath, JSON.stringify(mergedPersonalNodes, null, 2));
  fs.writeFileSync(personalSynapsesPath, JSON.stringify(existingPersonalSynapses, null, 2));
  
  console.log(`   ✅ Written: ${personalNodesPath}`);
  
  // Write core memories (Jarvis)
  fs.writeFileSync(jarvisNodesPath, JSON.stringify(coreNodes, null, 2));
  // Keep synapses as-is for now (can filter later if needed)
  
  console.log(`   ✅ Written: ${jarvisNodesPath} (core only)`);
  
  // Report
  console.log('\n✅ Memory Separation Complete');
  console.log(`   Personal: ${mergedPersonalNodes.length} nodes (local: ~/RAW/memories/)`);
  console.log(`   Core: ${coreNodes.length} nodes (shared: ~/JARVIS/RAW/memories/)`);
  console.log(`   Ready for git sync: core memories only`);
  
  // Show core categories
  const coreCategories = {};
  coreNodes.forEach(n => {
    const cat = n.category || 'uncategorized';
    coreCategories[cat] = (coreCategories[cat] || 0) + 1;
  });
  
  console.log('\n   Core categories:');
  Object.entries(coreCategories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`      ${cat}: ${count}`);
    });
}

extractPersonal();
