#!/usr/bin/env node

/**
 * Fix sourceDocument Paths
 * 
 * Updates all {BASE_URL} references to local paths:
 * {BASE_URL}/raw/YYYY-MM-DD/learnings/*.md → RAW/learnings/YYYY-MM-DD/*.md
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.dirname(__dirname);
const MEMORIES_DIR = path.join(REPO_ROOT, 'RAW/memories');
const NODES_FILE = path.join(MEMORIES_DIR, 'nodes.json');

// Load nodes
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));

let updatedCount = 0;
let errorCount = 0;

nodes.forEach(node => {
  if (!node.attributes || !node.attributes.sourceDocument) return;
  
  const sourceDoc = node.attributes.sourceDocument;
  
  // Handle array of source documents
  if (Array.isArray(sourceDoc)) {
    const updated = sourceDoc.map(docPath => {
      if (docPath.includes('{BASE_URL}')) {
        // Extract date from path: {BASE_URL}/raw/2026-02-24/learnings/17-complete-transparency-architecture.md
        const match = docPath.match(/\{BASE_URL\}\/raw\/(\d{4}-\d{2}-\d{2})\/learnings\/(.+\.md)$/);
        if (match) {
          const [, date, filename] = match;
          const localPath = `RAW/learnings/${date}/${filename}`;
          
          // Verify file exists
          const fullPath = path.join(REPO_ROOT, localPath);
          if (fs.existsSync(fullPath)) {
            updatedCount++;
            return localPath;
          } else {
            console.log(`⚠️  File not found: ${localPath} (for node ${node.id})`);
            errorCount++;
            return docPath; // Keep original
          }
        }
      }
      return docPath;
    });
    
    node.attributes.sourceDocument = updated;
  } 
  // Handle single source document
  else if (typeof sourceDoc === 'string' && sourceDoc.includes('{BASE_URL}')) {
    const match = sourceDoc.match(/\{BASE_URL\}\/raw\/(\d{4}-\d{2}-\d{2})\/learnings\/(.+\.md)$/);
    if (match) {
      const [, date, filename] = match;
      const localPath = `RAW/learnings/${date}/${filename}`;
      
      // Verify file exists
      const fullPath = path.join(REPO_ROOT, localPath);
      if (fs.existsSync(fullPath)) {
        node.attributes.sourceDocument = localPath;
        updatedCount++;
        console.log(`✓ ${node.id}: ${sourceDoc} → ${localPath}`);
      } else {
        console.log(`⚠️  File not found: ${localPath} (for node ${node.id})`);
        errorCount++;
      }
    }
  }
});

// Save updated nodes
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));

console.log(`\n✅ Source document paths updated!`);
console.log(`   Updated: ${updatedCount} nodes`);
console.log(`   Errors: ${errorCount} (files not found)`);
console.log(`   Total nodes: ${nodes.length}`);
