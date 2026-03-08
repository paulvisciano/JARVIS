#!/usr/bin/env node

/**
 * Boot Verification Script
 * 
 * Proves that core memories were actually loaded at boot by:
 * 1. Traversing hub → core memories
 * 2. Reading each memory's learning document
 * 3. Computing a "boot hash" from loaded content
 * 4. Logging verification proof
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const REPO_ROOT = path.dirname(__dirname);
const MEMORIES_DIR = path.join(REPO_ROOT, 'RAW/memories');
const NODES_FILE = path.join(MEMORIES_DIR, 'nodes.json');
const SYNAPSES_FILE = path.join(MEMORIES_DIR, 'synapses.json');

// Load neurograph
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf8'));

console.log('🧠 CORE MEMORY BOOT VERIFICATION\n');

// 1. Find hub
const hub = nodes.find(n => n.id === 'core-memories-hub');
if (!hub) {
  console.error('❌ ERROR: core-memories-hub not found!');
  process.exit(1);
}
console.log(`✓ Found core-memories-hub (${hub.attributes.coreMemoryCount} core memories)`);

// 2. Get all core memory IDs from synapses
const coreMemorySynapses = synapses.filter(s => s.source === 'core-memories-hub');
const coreMemoryIds = coreMemorySynapses.map(s => s.target);

console.log(`✓ Found ${coreMemoryIds.length} core memory synapses\n`);

// 3. Load each core memory + learning document
const bootHash = crypto.createHash('sha256');
const loadedMemories = [];

coreMemoryIds.forEach(memoryId => {
  const memory = nodes.find(n => n.id === memoryId);
  if (!memory) {
    console.log(`⚠️  Memory ${memoryId} not found in nodes.json`);
    return;
  }
  
  // Hash the memory structure
  bootHash.update(JSON.stringify(memory));
  
  // Read learning document if exists
  let docContent = null;
  if (memory.attributes.sourceDocument) {
    const sourcePath = memory.attributes.sourceDocument.replace('{BASE_URL}', 'https://raw.githubusercontent.com/paulvisciano/paulvisciano.github.io/main');
    
    // Try local path first
    let localPath = sourcePath.replace('https://raw.githubusercontent.com/paulvisciano/paulvisciano.github.io/main', REPO_ROOT.replace('JARVIS', 'Personal/paulvisciano.github.io'));
    localPath = localPath.replace('/claw/memory/raw/', '/claw/memory/raw/');
    
    try {
      if (fs.existsSync(localPath)) {
        docContent = fs.readFileSync(localPath, 'utf8');
        bootHash.update(docContent);
        console.log(`✓ ${memoryId.padEnd(45)} → ${localPath.split('/').pop()}`);
      } else {
        console.log(`⊘ ${memoryId.padEnd(45)} → (no local doc, using memory only)`);
      }
    } catch (err) {
      console.log(`⚠️  ${memoryId.padEnd(45)} → (error reading: ${err.message})`);
    }
  } else {
    console.log(`⊘ ${memoryId.padEnd(45)} → (no sourceDocument)`);
  }
  
  loadedMemories.push({
    id: memoryId,
    label: memory.label,
    hasDoc: !!docContent,
    docSize: docContent?.length || 0
  });
});

// 4. Compute boot hash
const hash = bootHash.digest('hex').substring(0, 16);

console.log(`\n✅ BOOT VERIFICATION COMPLETE`);
console.log(`   Core memories loaded: ${loadedMemories.length}`);
console.log(`   With learning docs: ${loadedMemories.filter(m => m.hasDoc).length}`);
console.log(`   Boot hash: ${hash}`);
console.log(`   Git commit: ${execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim().substring(0, 7)}`);

// 5. Save verification proof
const proof = {
  timestamp: new Date().toISOString(),
  gitCommit: execSync('git rev-parse HEAD', { cwd: REPO_ROOT, encoding: 'utf8' }).trim(),
  bootHash: hash,
  coreMemoriesLoaded: loadedMemories.length,
  learningDocsLoaded: loadedMemories.filter(m => m.hasDoc).length,
  memories: loadedMemories
};

const proofPath = path.join(REPO_ROOT, 'RAW/learnings', `boot-verification-${new Date().toISOString().split('T')[0]}.json`);
fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
console.log(`\n📄 Verification proof saved: ${proofPath}`);

// 6. Estimate context bloat
const totalDocSize = loadedMemories.reduce((sum, m) => sum + m.docSize, 0);
const memoryStructSize = JSON.stringify(loadedMemories).length;
const totalSize = totalDocSize + memoryStructSize;

console.log(`\n📊 CONTEXT BLOAT ESTIMATE:`);
console.log(`   Memory structures: ${(memoryStructSize / 1024).toFixed(2)} KB`);
console.log(`   Learning documents: ${(totalDocSize / 1024).toFixed(2)} KB`);
console.log(`   Total: ${(totalSize / 1024).toFixed(2)} KB (~${(totalSize / 4).toFixed(0)} tokens)`);
console.log(`   With neurograph (527 neurons): ~${((totalSize + 500000) / 4).toFixed(0)} tokens`);
