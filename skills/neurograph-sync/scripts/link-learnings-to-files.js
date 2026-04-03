#!/usr/bin/env node

/**
 * Link learnings to archive files
 * Adds file references to learning nodes so you can trace from graph → source files
 */

const fs = require('fs');
const path = require('path');
const pathUtils = require('../lib/path-utils');

const NODES_FILE = path.join(pathUtils.getMemoriesDir(), 'nodes.json');
const SYNAPSES_FILE = path.join(pathUtils.getMemoriesDir(), 'synapses.json');
const ARCHIVE_DIR = path.join(pathUtils.getRawArchive(), '2026-03-24');

// Load graph
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));
const synapses = JSON.parse(fs.readFileSync(SYNAPSES_FILE, 'utf8'));

// Get learnings from today
const learningsDir = path.join(process.env.HOME, 'JARVIS', 'RAW', 'learnings', '2026-03-24');
const learningFiles = fs.readdirSync(learningsDir).filter(f => f.endsWith('.md'));

// Get archive files
const archiveFiles = {
  transcripts: fs.readdirSync(path.join(ARCHIVE_DIR, 'audio')).filter(f => f.includes('convo-jarvis') && f.endsWith('.wav.txt')),
  screenshots: fs.readdirSync(path.join(ARCHIVE_DIR, 'images')).filter(f => f.endsWith('.png') || f.endsWith('.jpg')),
  sessions: fs.readdirSync(path.join(ARCHIVE_DIR, 'sessions')).filter(f => f.endsWith('.jsonl'))
};

// Find learning nodes and add file references
let updated = 0;
let newSynapses = 0;

// Match learning files to nodes by ID or label
for (const node of nodes) {
  // Match today's production learnings (failure, solution categories)
  if (node.attributes && node.attributes.created === '2026-03-24') {
    const learningFile = learningFiles.find(f => 
      node.id === f.replace('.md', '') || 
      node.label.toLowerCase().includes(f.replace('.md', '').replace(/-/g, ' '))
    );
    
    if (!learningFile) continue;
    
    // Add file reference to attributes
    node.attributes.sourceFile = `RAW/learnings/2026-03-24/${learningFile}`;
    node.attributes.archiveLinks = {
      transcripts: archiveFiles.transcripts.slice(0, 5), // Link first 5 transcripts
      screenshots: archiveFiles.screenshots.slice(0, 5),
      sessions: archiveFiles.sessions.slice(0, 3)
    };
    
    updated++;
    
    // Create synapses to archive files (as archive-file nodes, will be created if missing)
    for (const transcript of archiveFiles.transcripts.slice(0, 3)) {
      const archiveNodeId = `archive-${transcript.replace(/\.[^.]+$/, '')}`;
      const existingNode = nodes.find(n => n.id === archiveNodeId);
      
      if (!existingNode) {
        nodes.push({
          id: archiveNodeId,
          label: transcript.replace('.wav.txt', ''),
          category: 'archive',
          type: 'transcript',
          frequency: 1,
          moments: [{ date: '2026-03-24', type: 'transcript' }],
          attributes: {
            role: 'source file',
            path: `RAW/archive/2026-03-24/${transcript}`,
            created: '2026-03-24'
          }
        });
      }
      
      // Link learning → archive file
      const existingSynapse = synapses.find(s => s.source === node.id && s.target === archiveNodeId);
      if (!existingSynapse) {
        synapses.push({
          source: node.id,
          target: archiveNodeId,
          type: 'references',
          weight: 1.0,
          created: '2026-03-24'
        });
        newSynapses++;
      }
    }
  }
}

// Write
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(SYNAPSES_FILE, JSON.stringify(synapses, null, 2));

console.log('✅ NeuroGraph linked learnings to files:');
console.log(`   - Updated ${updated} learning nodes with sourceFile + archiveLinks`);
console.log(`   - Added ${nodes.filter(n => n.category === 'archive').length} archive nodes`);
console.log(`   - Created ${newSynapses} synapses (learnings → archive files)`);
console.log(`   - Total: ${nodes.length} nodes, ${synapses.length} synapses`);
console.log('');
console.log('Now you can:');
console.log('   1. Click a learning node in the graph');
console.log('   2. See sourceFile attribute (path to learning .md)');
console.log('   3. See archiveLinks (transcripts, screenshots, sessions)');
console.log('   4. Follow synapses to actual archive files');
console.log('');
console.log('Traceability: Graph ← Learnings ← Archive Files ← Your Life');
