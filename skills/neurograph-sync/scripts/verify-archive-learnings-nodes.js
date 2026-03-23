#!/usr/bin/env node
/**
 * Verify that for given dates, every archive file and every learning .md has a
 * corresponding node in nodes.json. Uses same path normalization as
 * set-archive-creation-dates.js and set-learning-creation-dates.js.
 *
 * Usage: node verify-archive-learnings-nodes.js [date1] [date2] ...
 * Example: node verify-archive-learnings-nodes.js 2026-03-13 2026-03-14
 * Default: 2026-03-13 2026-03-14
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '';
const RAW_ARCHIVE = path.join(HOME, 'RAW', 'archive');
const JARVIS_LEARNINGS = path.join(HOME, 'JARVIS', 'RAW', 'learnings');
const JARVIS_SKILLS = path.join(HOME, 'JARVIS', 'skills');
const NODES_PATH = process.argv.find(a => a.endsWith('nodes.json')) || path.join(__dirname, '..', '..', '..', 'RAW', 'memories', 'nodes.json');
const nodesPath = path.resolve(process.cwd(), NODES_PATH.replace(/^~/, HOME));

const dates = process.argv.slice(2).filter(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
const toCheck = dates.length ? dates : ['2026-03-13', '2026-03-14'];

if (!fs.existsSync(nodesPath)) {
  console.error('Nodes file not found:', nodesPath);
  process.exit(1);
}

const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));

function walkArchive(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkArchive(full, list);
    else if (e.isFile()) list.push(full);
  }
  return list;
}

function walkLearnings(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkLearnings(full, list);
    else if (e.isFile() && path.extname(e.name).toLowerCase() === '.md') list.push(full);
  }
  return list;
}

function normalizeArchivePath(p, archiveDir) {
  if (!p || typeof p !== 'string') return null;
  const s = p.trim().replace(/\u202f/g, ' ');
  if (!s) return null;
  if (path.isAbsolute(s)) return path.normalize(s);
  if (s.startsWith('~/')) return path.normalize(path.join(HOME, s.slice(2)));
  if (s.startsWith('/RAW/')) return path.normalize(path.join(HOME, 'RAW', s.slice(5)));
  if (s.startsWith('RAW/')) return path.normalize(path.join(HOME, s));
  return path.normalize(path.resolve(archiveDir, '..', s));
}

function normalizeLearningPath(p, learningsDir) {
  if (!p || typeof p !== 'string') return null;
  const s = p.trim().replace(/\u202f/g, ' ');
  if (!s) return null;
  if (s.startsWith('http') || s.includes('{BASE_URL}')) return null;
  if (path.isAbsolute(s)) return path.normalize(s);
  if (s.startsWith('~/')) return path.normalize(path.join(HOME, s.slice(2)));
  if (s.startsWith('JARVIS/RAW/learnings/')) return path.normalize(path.join(HOME, s));
  if (s.startsWith('/JARVIS/RAW/learnings/')) return path.normalize(path.join(HOME, s.slice(1)));
  if (s.startsWith('RAW/learnings/')) return path.normalize(path.join(HOME, 'JARVIS', s));
  return path.normalize(path.resolve(learningsDir, '..', s));
}

// Build sets of normalized paths that have nodes (for archive and learning)
const archivePathsInGraph = new Set();
const learningPathsInGraph = new Set();
nodes.forEach((node) => {
  const cat = (node.category || '').toLowerCase();
  if (cat === 'archive' || cat === 'file') {
    const raw =
      node.attributes?.rawContentPath ||
      node.attributes?.filePath ||
      node.attributes?.path ||
      node.attributes?.sourceDocument;
    if (!raw) return;
    // Normalize against each date's archive dir so path resolves correctly
    toCheck.forEach((d) => {
      const archiveDir = path.join(RAW_ARCHIVE, d);
      const n = normalizeArchivePath(raw, archiveDir);
      if (n) archivePathsInGraph.add(n);
    });
  } else if (cat === 'learning') {
    const raw = node.attributes?.sourceDocument || node.sourceDocument;
    if (!raw) return;
    toCheck.forEach((d) => {
      const learningsDir = path.join(JARVIS_LEARNINGS, d);
      const n = normalizeLearningPath(raw, learningsDir);
      if (n) learningPathsInGraph.add(n);
    });
  }
});

let totalArchiveFiles = 0;
let totalArchiveNodes = 0;
let totalLearningsFiles = 0;
let totalLearningsNodes = 0;
let totalSkillsFiles = 0;
let totalSkillsNodes = 0;
const missingArchive = [];
const missingLearnings = [];
const missingSkills = [];

// Scan JARVIS skills directory for SKILL.md files
function walkSkills(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules' && !e.name.startsWith('.')) {
      walkSkills(full, list);
    } else if (e.isFile() && e.name === 'SKILL.md') {
      list.push(full);
    }
  }
  return list;
}

const skillFiles = walkSkills(JARVIS_SKILLS);
const skillPathsInGraph = new Set();
nodes.forEach((node) => {
  if ((node.category || '').toLowerCase() === 'openclaw-skill') {
    const raw = node.attributes?.path || node.attributes?.skillPath;
    if (raw) skillPathsInGraph.add(path.normalize(raw));
  }
});

console.log('\n--- Skills ---');
const skillsWithNode = skillFiles.filter((f) => skillPathsInGraph.has(path.normalize(f)));
totalSkillsFiles = skillFiles.length;
totalSkillsNodes = skillsWithNode.length;
const skillMissing = skillFiles.filter((f) => !skillPathsInGraph.has(path.normalize(f)));
skillMissing.forEach((f) => missingSkills.push({ path: f }));

console.log('Skills: SKILL.md on disk:', skillFiles.length, '| with node:', skillsWithNode.length, skillMissing.length ? '| MISSING: ' + skillMissing.length : '');
if (skillMissing.length) {
  skillMissing.forEach((f) => console.log('  -', path.relative(JARVIS_SKILLS, f)));
}

toCheck.forEach((date) => {
  const archiveDir = path.join(RAW_ARCHIVE, date);
  const learningsDir = path.join(JARVIS_LEARNINGS, date);

  console.log('\n---', date, '---');

  // Archive: all files except .DS_Store (use same path normalization as nodes for matching)
  const archiveFiles = walkArchive(archiveDir).filter((f) => path.basename(f) !== '.DS_Store');
  const archiveWithNode = archiveFiles.filter((f) => {
    const key = normalizeArchivePath(f, archiveDir);
    return key && archivePathsInGraph.has(key);
  });
  totalArchiveFiles += archiveFiles.length;
  totalArchiveNodes += archiveWithNode.length;
  const archMissing = archiveFiles.filter((f) => !archivePathsInGraph.has(normalizeArchivePath(f, archiveDir)));
  archMissing.forEach((f) => missingArchive.push({ date, path: f }));

  console.log('Archive: files on disk:', archiveFiles.length, '| with node:', archiveWithNode.length, archMissing.length ? '| MISSING: ' + archMissing.length : '');
  if (archMissing.length && archMissing.length <= 10) archMissing.forEach((f) => console.log('  -', f));
  else if (archMissing.length > 10) console.log('  First 10 missing:', archMissing.slice(0, 10).map((f) => path.basename(f)).join(', '), '...');

  if (!fs.existsSync(learningsDir)) {
    console.log('Learnings: folder not found');
    return;
  }
  const learningFiles = walkLearnings(learningsDir);
  const learningWithNode = learningFiles.filter((f) => learningPathsInGraph.has(path.normalize(f)));
  totalLearningsFiles += learningFiles.length;
  totalLearningsNodes += learningWithNode.length;
  const learnMissing = learningFiles.filter((f) => !learningPathsInGraph.has(path.normalize(f)));
  learnMissing.forEach((f) => missingLearnings.push({ date, path: f }));

  console.log('Learnings: .md on disk:', learningFiles.length, '| with node:', learningWithNode.length, learnMissing.length ? '| MISSING: ' + learnMissing.length : '');
  if (learnMissing.length) learnMissing.forEach((f) => console.log('  -', path.basename(f)));
});

console.log('\n=== Summary ===');
console.log('Archive:  total files (excl .DS_Store):', totalArchiveFiles, '| total with node:', totalArchiveNodes, totalArchiveFiles === totalArchiveNodes ? '✓' : 'MISMATCH');
console.log('Learnings: total .md files:', totalLearningsFiles, '| total with node:', totalLearningsNodes, totalLearningsFiles === totalLearningsNodes ? '✓' : 'MISMATCH');
console.log('Skills:    total SKILL.md files:', totalSkillsFiles, '| total with node:', totalSkillsNodes, totalSkillsFiles === totalSkillsNodes ? '✓' : 'MISMATCH');
if (missingArchive.length) console.log('Archive files missing node:', missingArchive.length);
if (missingLearnings.length) console.log('Learning files missing node:', missingLearnings.length);
if (missingSkills.length) console.log('Skill files missing node:', missingSkills.length);

// Auto-create missing skill nodes if any
if (missingSkills.length) {
  console.log('\n🔧 Creating missing skill nodes...');
  const timestamp = new Date().toISOString();
  
  missingSkills.forEach((item) => {
    const skillPath = item.path;
    const relativePath = path.relative(JARVIS_SKILLS, skillPath);
    // Extract skill ID from folder name (e.g., "context-extractor/SKILL.md" → "context-extractor")
    const skillId = relativePath.split('/')[0];
    const scriptPath = path.join(path.dirname(skillPath), 'scripts');
    const hasScript = fs.existsSync(scriptPath);
    
    // Check if node already exists
    const existing = nodes.find(n => n.id === skillId);
    if (existing) {
      console.log(`   ⊘ ${skillId} already exists`);
      return;
    }
    
    // Create skill node
    const skillNode = {
      id: skillId,
      label: skillId.replace(/-/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      type: 'skill',
      category: 'openclaw-skill',
      frequency: 1,
      moments: [
        {
          date: new Date().toISOString().split('T')[0],
          type: 'skill-discovered',
          description: 'Auto-discovered by neuro-graph-sync'
        },
        'skill'
      ],
      attributes: {
        created: new Date().toISOString().split('T')[0],
        role: 'openclaw-executable',
        description: `Auto-discovered skill: ${skillId}`,
        path: skillPath,
        skillType: 'openclaw-executable',
        verified: new Date().toISOString().split('T')[0],
        scriptPath: hasScript ? path.join(scriptPath, 'index.js') : 'N/A',
        fileType: 'skill'
      },
      created: timestamp
    };
    
    nodes.push(skillNode);
    console.log(`   ✅ Created: ${skillId}`);
    
    // Create file node for SKILL.md
    const fileNodeId = `file-${skillId}-skill-md`;
    const fileNode = {
      id: fileNodeId,
      label: 'SKILL.md',
      type: 'markdown',
      category: 'file',
      frequency: 1,
      moments: [
        {
          date: new Date().toISOString().split('T')[0],
          type: 'skill-file-linked',
          description: `Linked to ${skillId}`
        },
        'file'
      ],
      attributes: {
        created: new Date().toISOString().split('T')[0],
        role: 'skill-documentation',
        description: `Skill documentation for ${skillId}`,
        path: skillPath,
        fileType: 'markdown',
        linkedSkill: skillId,
        skillType: 'skill-doc'
      },
      created: timestamp
    };
    
    nodes.push(fileNode);
    console.log(`   → Created file: ${fileNodeId}`);
    
    // Create synapse: skill → file
    const synapses = JSON.parse(fs.readFileSync(nodesPath.replace('nodes.json', 'synapses.json'), 'utf8'));
    synapses.push({
      source: skillId,
      target: fileNodeId,
      type: 'documented-by',
      weight: 1,
      label: 'documented-by',
      created: timestamp
    });
    
    // Link skill to today's temporal node
    const todayId = `temporal-${new Date().toISOString().split('T')[0].replace(/-/g, '')}`;
    const todayNode = nodes.find(n => n.id === todayId);
    if (todayNode) {
      synapses.push({
        source: skillId,
        target: todayId,
        type: 'verified-today',
        weight: 1,
        label: 'verified-today',
        created: timestamp
      });
    }
    
    // Save synapses
    JSON.stringify(synapses, null, 2);
    fs.writeFileSync(nodesPath.replace('nodes.json', 'synapses.json'), JSON.stringify(synapses, null, 2));
  });
  
  // Save updated nodes
  fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
  console.log('\n✅ Skill nodes created and saved.');
}

process.exit((missingArchive.length || missingLearnings.length || missingSkills.length) > totalSkillsFiles ? 1 : 0);
