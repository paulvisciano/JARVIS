#!/usr/bin/env node
/**
 * Git Log Extractor — Turn Git History into Neurograph Memory
 * 
 * Usage:
 *   ./git-log-extractor --repo ~/path/to/repo --output ./output/
 *   ./git-log-extractor --repo . --from "2026-01-01" --to "2026-03-05"
 * 
 * Outputs:
 *   - nodes.json (commits = neurons, files = artifacts)
 *   - synapses.json (parent relationships, file evolution)
 *   - learnings/ (auto-generated from commit messages)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line args
const args = process.argv.slice(2);
const argMap = {};
args.forEach((arg, i) => {
  if (arg.startsWith('--')) {
    argMap[arg.slice(2)] = args[i + 1];
  }
});

const REPO_PATH = argMap.repo || '.';
const OUTPUT_DIR = argMap.output || './git-memory';
const FROM_DATE = argMap.from || null;
const TO_DATE = argMap.to || null;

console.log('🔍 Git Log Extractor\n');
console.log(`Repo: ${REPO_PATH}`);
console.log(`Output: ${OUTPUT_DIR}`);
if (FROM_DATE) console.log(`From: ${FROM_DATE}`);
if (TO_DATE) console.log(`To: ${TO_DATE}`);
console.log('\n' + '='.repeat(80) + '\n');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(path.join(OUTPUT_DIR, 'learnings'), { recursive: true });

// Run git log
const gitFormat = '%H%x7c%h%x7c%an%x7c%ae%x7c%ai%x7c%s%x7c%b%x7c%P';
let gitCommand = `cd "${REPO_PATH}" && git log "--pretty=format:${gitFormat}" --numstat`;

if (FROM_DATE) gitCommand += ` --since="${FROM_DATE}"`;
if (TO_DATE) gitCommand += ` --until="${TO_DATE}"`;

console.log('Extracting git history...\n');

let gitOutput;
try {
  gitOutput = execSync(gitCommand, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
} catch (error) {
  console.error('❌ Error running git log:', error.message);
  process.exit(1);
}

// Parse git output
const commits = [];
let currentCommit = null;
const lines = gitOutput.split('\n');

lines.forEach(line => {
  if (/^[0-9a-f]{40}\x7c/.test(line)) {
    // New commit
    const parts = line.split('\x7c'); // Split by pipe character (ASCII 124)
    currentCommit = {
      hash: parts[0],
      shortHash: parts[1],
      author: parts[2],
      email: parts[3],
      date: parts[4],
      subject: parts[5],
      body: parts[6] || '',
      parents: parts[7] ? parts[7].split(' ') : [],
      files: []
    };
    commits.push(currentCommit);
  } else if (currentCommit && /^\d+\t\d+\t/.test(line)) {
    // File change (additions\tdeletions\tfilename)
    const parts = line.split('\t');
    if (parts.length >= 3) {
      currentCommit.files.push({
        additions: parseInt(parts[0]) || 0,
        deletions: parseInt(parts[1]) || 0,
        path: parts.slice(2).join('\t')
      });
    }
  }
});

console.log(`✅ Parsed ${commits.length} commits\n`);

// Generate nodes
const nodes = [];
const nodeIdMap = new Map(); // commit hash → node id

// Helper: create slug from string
function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Process commits into nodes
commits.forEach((commit, index) => {
  const date = commit.date.split('T')[0];
  const nodeId = `commit-${commit.shortHash}`;
  nodeIdMap.set(commit.hash, nodeId);
  
  // Determine category based on commit message patterns
  let category = 'commit';
  let label = commit.subject;
  
  if (commit.subject.match(/^(feat|feature)/i)) {
    category = 'feature';
    label = commit.subject.replace(/^(feat|feature)[:\s]*/i, '');
  } else if (commit.subject.match(/^fix/i)) {
    category = 'fix';
    label = commit.subject.replace(/^fix[:\s]*/i, '');
  } else if (commit.subject.match(/^(refactor|ref)/i)) {
    category = 'refactor';
    label = commit.subject.replace(/^(refactor|ref)[:\s]*/i, '');
  } else if (commit.subject.match(/^(docs|doc)/i)) {
    category = 'documentation';
    label = commit.subject.replace(/^(docs|doc)[:\s]*/i, '');
  } else if (commit.subject.match(/^(test)/i)) {
    category = 'test';
    label = commit.subject.replace(/^test[:\s]*/i, '');
  } else if (commit.subject.match(/^(chore|config)/i)) {
    category = 'chore';
    label = commit.subject.replace(/^(chore|config)[:\s]*/i, '');
  } else if (commit.subject.match(/^(breakthrough|genesis|birth|launch)/i)) {
    category = 'breakthrough';
  }
  
  // Create commit neuron
  nodes.push({
    id: nodeId,
    label: label.trim(),
    category: category,
    frequency: 1,
    created: commit.date,
    description: commit.body || commit.subject,
    attributes: {
      type: 'git-commit',
      hash: commit.hash,
      shortHash: commit.shortHash,
      author: `${commit.author} <${commit.email}>`,
      date: commit.date,
      subject: commit.subject,
      filesChanged: commit.files.length,
      insertions: commit.files.reduce((sum, f) => sum + f.additions, 0),
      deletions: commit.files.reduce((sum, f) => sum + f.deletions, 0)
    },
    tags: [category, date]
  });
  
  // Create file artifact nodes
  commit.files.forEach(file => {
    const fileNodeId = `file-${slugify(file.path)}-${commit.shortHash}`;
    
    nodes.push({
      id: fileNodeId,
      label: path.basename(file.path),
      category: 'artifact',
      frequency: 1,
      created: commit.date,
      description: `File changed in commit ${commit.shortHash}`,
      attributes: {
        type: 'git-file',
        path: file.path,
        commitHash: commit.hash,
        additions: file.additions,
        deletions: file.deletions,
        changeType: file.additions > 0 && file.deletions === 0 ? 'added' :
                    file.additions === 0 && file.deletions > 0 ? 'deleted' : 'modified'
      },
      tags: ['file', path.extname(file.path).slice(1) || 'no-extension']
    });
  });
});

console.log(`Generated ${nodes.length} nodes\n`);

// Generate synapses
const synapses = [];

commits.forEach(commit => {
  const nodeId = nodeIdMap.get(commit.hash);
  
  // Parent relationships (causal links)
  commit.parents.forEach(parentHash => {
    const parentId = nodeIdMap.get(parentHash);
    if (parentId) {
      synapses.push({
        source: parentId,
        target: nodeId,
        weight: 10,
        type: 'parent-commit'
      });
    }
  });
  
  // File relationships
  commit.files.forEach(file => {
    const fileNodeId = `file-${slugify(file.path)}-${commit.shortHash}`;
    
    // Commit → file (created/modified)
    synapses.push({
      source: nodeId,
      target: fileNodeId,
      weight: 5,
      type: 'modifies-file'
    });
    
    // Find previous versions of same file (evolution chain)
    const prevCommits = commits.filter(c => 
      c.date < commit.date && 
      c.files.some(f => f.path === file.path)
    );
    
    if (prevCommits.length > 0) {
      const prevCommit = prevCommits[0]; // Most recent previous
      const prevFileId = `file-${slugify(file.path)}-${prevCommit.shortHash}`;
      
      synapses.push({
        source: prevFileId,
        target: fileNodeId,
        weight: 8,
        type: 'file-evolution'
      });
    }
  });
});

console.log(`Generated ${synapses.length} synapses\n`);

// Write nodes.json
const nodesPath = path.join(OUTPUT_DIR, 'nodes.json');
fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
console.log(`✅ Written: ${nodesPath}`);

// Write synapses.json
const synapsesPath = path.join(OUTPUT_DIR, 'synapses.json');
fs.writeFileSync(synapsesPath, JSON.stringify(synapses, null, 2));
console.log(`✅ Written: ${synapsesPath}`);

// Generate learning documents (grouped by date)
const commitsByDate = {};
commits.forEach(commit => {
  const date = commit.date.split('T')[0];
  if (!commitsByDate[date]) {
    commitsByDate[date] = [];
  }
  commitsByDate[date].push(commit);
});

Object.entries(commitsByDate).forEach(([date, dateCommits]) => {
  const learningsDir = path.join(OUTPUT_DIR, 'learnings', date);
  fs.mkdirSync(learningsDir, { recursive: true });
  
  // Create one learning per significant commit
  dateCommits.forEach(commit => {
    const slug = slugify(commit.subject.slice(0, 50));
    const learningPath = path.join(learningsDir, `${slug}.md`);
    
    const content = `# ${commit.subject}

**Commit:** \`${commit.shortHash}\`  
**Author:** ${commit.author} <${commit.email}>  
**Date:** ${commit.date}  
**Files Changed:** ${commit.files.length}

## Description

${commit.body || commit.subject}

## Files Modified

${commit.files.map(f => `- \`${f.path}\` (+${f.additions}/-${f.deletions})`).join('\n')}

---

*Auto-generated from Git history by git-log-extractor*
`;
    
    fs.writeFileSync(learningPath, content);
  });
  
  console.log(`✅ Created ${dateCommits.length} learnings for ${date}`);
});

// Write manifest
const manifest = {
  repo: REPO_PATH,
  extractedAt: new Date().toISOString(),
  dateRange: {
    from: FROM_DATE || 'beginning',
    to: TO_DATE || 'now'
  },
  stats: {
    totalCommits: commits.length,
    totalNodes: nodes.length,
    totalSynapses: synapses.length,
    uniqueAuthors: [...new Set(commits.map(c => c.email))].length,
    dateSpan: commits.length > 0 ? 
      `${commits[commits.length - 1].date.split('T')[0]} → ${commits[0].date.split('T')[0]}` : 
      'N/A'
  }
};

const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\n✅ Written: ${manifestPath}`);

// Summary
console.log('\n' + '='.repeat(80));
console.log('\n📊 EXTRACTION COMPLETE\n');
console.log(`Commits processed: ${commits.length}`);
console.log(`Nodes generated: ${nodes.length}`);
console.log(`Synapses generated: ${synapses.length}`);
console.log(`Learnings created: ${Object.values(commitsByDate).reduce((sum, arr) => sum + arr.length, 0)}`);
console.log(`Date range: ${manifest.stats.dateSpan}`);
console.log(`\nOutput directory: ${OUTPUT_DIR}\n`);

console.log('🎉 Ready to load into neurograph!\n');
