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
const NODES_PATH = process.argv.find(a => a.endsWith('nodes.json')) || path.join(__dirname, '..', 'RAW', 'memories', 'nodes.json');
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
const missingArchive = [];
const missingLearnings = [];

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
if (missingArchive.length) console.log('Archive files missing node:', missingArchive.length);
if (missingLearnings.length) console.log('Learning files missing node:', missingLearnings.length);
process.exit(missingArchive.length || missingLearnings.length ? 1 : 0);
