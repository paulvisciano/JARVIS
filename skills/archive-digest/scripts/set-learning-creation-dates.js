#!/usr/bin/env node
/**
 * Set creation date on learning nodes from actual file creation time.
 *
 * Walks a learnings day folder (e.g. RAW/learnings/2026-03-14), reads each .md file's
 * birthtime (or mtime), finds matching nodes in nodes.json by sourceDocument path,
 * and sets node.created and node.attributes.created to ISO datetime (YYYY-MM-DDTHH:mm:ss).
 *
 * Usage:
 *   node set-learning-creation-dates.js <learnings-folder-or-date> [nodes.json path]
 *
 * If first arg is YYYY-MM-DD, path is resolved as ~/JARVIS/RAW/learnings/YYYY-MM-DD.
 *
 * Examples:
 *   node set-learning-creation-dates.js 2026-03-14
 *   node set-learning-creation-dates.js /Users/paulvisciano/JARVIS/RAW/learnings/2026-03-14
 *
 * Default nodes path: JARVIS/RAW/memories/nodes.json
 *
 * Week view uses the same graph as 24h: one temporal node per day. Run per day
 * (with set-archive-creation-dates.js for that date) to organize memory.
 */

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '';
const JARVIS_LEARNINGS = path.join(HOME, 'JARVIS', 'RAW', 'learnings');

const LEARNINGS_ARG = process.argv[2];
const NODES_PATH = process.argv[3] || path.join(__dirname, '..', 'RAW', 'memories', 'nodes.json');

if (!LEARNINGS_ARG) {
  console.error('Usage: node set-learning-creation-dates.js <learnings-folder-or-date> [nodes.json path]');
  process.exit(1);
}

const dateMatch = LEARNINGS_ARG.match(/^(\d{4}-\d{2}-\d{2})$/);
const learningsDir = dateMatch
  ? path.join(JARVIS_LEARNINGS, dateMatch[1])
  : path.resolve(process.cwd(), LEARNINGS_ARG.replace(/^~/, HOME));
const nodesPath = path.resolve(process.cwd(), NODES_PATH.replace(/^~/, HOME));

if (!fs.existsSync(learningsDir)) {
  console.error('Learnings folder not found:', learningsDir);
  process.exit(1);
}
if (!fs.existsSync(nodesPath)) {
  console.error('Nodes file not found:', nodesPath);
  process.exit(1);
}

function walkMdFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkMdFiles(full, fileList);
    } else if (e.isFile() && path.extname(e.name).toLowerCase() === '.md') {
      try {
        const stat = fs.statSync(full);
        const created = stat.birthtime || stat.mtime;
        fileList.push({
          path: full,
          created: created.toISOString().replace(/\.\d{3}Z$/, ''),
        });
      } catch (err) {
        console.warn('Skip (stat failed):', full, err.message);
      }
    }
  }
  return fileList;
}

/** Normalize node sourceDocument to full path for matching. */
function normalizeLearningPath(p) {
  if (!p || typeof p !== 'string') return null;
  const s = p.trim().replace(/\u202f/g, ' ');
  if (!s) return null;
  // Skip URLs and placeholders
  if (s.startsWith('http') || s.includes('{BASE_URL}')) return null;
  const fullLearnings = path.join(HOME, 'JARVIS', 'RAW', 'learnings');
  if (path.isAbsolute(s)) return path.normalize(s);
  if (s.startsWith('~/')) return path.normalize(path.join(HOME, s.slice(2)));
  if (s.startsWith('JARVIS/RAW/learnings/')) return path.normalize(path.join(HOME, s));
  if (s.startsWith('/JARVIS/RAW/learnings/')) return path.normalize(path.join(HOME, s.slice(1)));
  if (s.startsWith('RAW/learnings/')) return path.normalize(path.join(HOME, 'JARVIS', s));
  return path.normalize(path.resolve(learningsDir, '..', s));
}

const files = walkMdFiles(learningsDir);
const pathToCreated = {};
files.forEach(({ path: filePath, created }) => {
  const key = path.normalize(filePath);
  pathToCreated[filePath] = created;
  pathToCreated[key] = created;
});

console.log('Learnings folder:', learningsDir);
console.log('Files found:', files.length);
console.log('Nodes file:', nodesPath);

const nodesRaw = fs.readFileSync(nodesPath, 'utf8');
const nodes = JSON.parse(nodesRaw);

// Set of normalized paths that already have a learning node
const pathHasNode = new Set();
nodes.forEach((node) => {
  if ((node.category || '').toLowerCase() !== 'learning') return;
  const rawPath = node.attributes?.sourceDocument || node.sourceDocument;
  const n = normalizeLearningPath(rawPath);
  if (n) pathHasNode.add(n);
});

const dateStr = path.basename(learningsDir);
const relFromLearnings = (p) => path.relative(learningsDir, p).replace(/\\/g, '/');
const sourceDoc = (p) => 'RAW/learnings/' + dateStr + '/' + relFromLearnings(p);
const existingIds = new Set(nodes.map((n) => n.id));

let createdCount = 0;
files.forEach(({ path: filePath, created }) => {
  const key = path.normalize(filePath);
  if (pathHasNode.has(key)) return;
  const base = path.basename(filePath, '.md');
  const label = base.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  let id = 'learn-' + base.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase().slice(0, 32);
  if (existingIds.has(id)) id = id + '-' + dateStr.replace(/-/g, '');
  existingIds.add(id);
  const dateOnly = created.slice(0, 10);
  const node = {
    id,
    label,
    category: 'learning',
    frequency: 1,
    moments: ['learning'],
    attributes: {
      role: 'learning',
      sourceDocument: sourceDoc(filePath),
      created,
      date: dateOnly,
    },
    created,
  };
  nodes.push(node);
  pathHasNode.add(key);
  pathToCreated[key] = created;
  pathToCreated[filePath] = created;
  createdCount++;
});
if (createdCount) console.log('Created', createdCount, 'new learning nodes.');

let updated = 0;
nodes.forEach((node) => {
  const cat = (node.category || '').toLowerCase();
  if (cat !== 'learning') return;

  const rawPath =
    node.attributes?.sourceDocument ||
    node.sourceDocument;
  const nodePath = normalizeLearningPath(rawPath);
  if (!nodePath) return;

  const created = pathToCreated[nodePath] || pathToCreated[path.normalize(nodePath)];
  if (!created) return;

  const dateOnly = created.slice(0, 10);
  const prev = node.created || node.attributes?.created || node.attributes?.date || '';

  node.created = created;
  if (!node.attributes) node.attributes = {};
  node.attributes.created = created;
  if (node.attributes.date !== dateOnly) node.attributes.date = dateOnly;

  updated++;
  if (prev !== created) {
    console.log('  Updated:', node.label || node.id, '->', created);
  }
});

fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2), 'utf8');
console.log('Done. Updated', updated, 'learning nodes. Wrote', nodesPath);
