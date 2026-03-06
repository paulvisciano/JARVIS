#!/usr/bin/env node
/**
 * Normalize all sourceDocument paths to use {BASE_URL} placeholder.
 * 
 * Converts:
 * - file:///Users/paulvisciano/JARVIS/... → {BASE_URL}/...
 * - https://raw.githubusercontent.com/paulvisciano/JARVIS/main/... → {BASE_URL}/...
 * - https://raw.githubusercontent.com/paulvisciano/paulvisciano.github.io/main/claw/memory/... → {BASE_URL}/...
 */

const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../RAW/memories/nodes.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));

// Patterns to normalize
const patterns = [
  {
    name: 'local-jarvis',
    regex: /^file:\/\/\/Users\/paulvisciano\/JARVIS/,
    replacement: '{BASE_URL}'
  },
  {
    name: 'github-jarvis',
    regex: /^https:\/\/raw\.githubusercontent\.com\/paulvisciano\/JARVIS\/main/,
    replacement: '{BASE_URL}'
  },
  {
    name: 'github-public',
    regex: /^https:\/\/raw\.githubusercontent\.com\/paulvisciano\/paulvisciano\.github\.io\/main\/claw\/memory/,
    replacement: '{BASE_URL}'
  }
];

let updated = 0;
const stats = { local: 0, githubJarvis: 0, githubPublic: 0, unchanged: 0 };

nodes.forEach(node => {
  const attrs = node.attributes || {};
  const sd = attrs.sourceDocument;
  
  if (!sd) {
    stats.unchanged++;
    return;
  }
  
  if (Array.isArray(sd)) {
    // Handle array of source documents
    const newSd = sd.map(item => {
      if (typeof item !== 'string') return item;
      for (const p of patterns) {
        if (p.regex.test(item)) {
          stats[p.name] = (stats[p.name] || 0) + 1;
          updated++;
          return item.replace(p.regex, p.replacement);
        }
      }
      return item;
    });
    node.attributes.sourceDocument = newSd;
  } else if (typeof sd === 'string') {
    for (const p of patterns) {
      if (p.regex.test(sd)) {
        stats[p.name] = (stats[p.name] || 0) + 1;
        updated++;
        node.attributes.sourceDocument = sd.replace(p.regex, p.replacement);
        console.log(`✅ ${node.id}: ${p.name}`);
        break;
      }
    }
  } else {
    stats.unchanged++;
  }
});

console.log('\n--- Summary ---');
console.log(`Updated: ${updated} nodes`);
console.log(`  - Local file:// paths: ${stats.local || 0}`);
console.log(`  - GitHub JARVIS URLs: ${stats.githubJarvis || 0}`);
console.log(`  - GitHub public URLs: ${stats.githubPublic || 0}`);
console.log(`  - Unchanged (no sourceDocument): ${stats.unchanged}`);

fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
console.log('\n✅ Saved to RAW/memories/nodes.json');
