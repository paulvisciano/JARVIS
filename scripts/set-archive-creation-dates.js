#!/usr/bin/env node
/**
 * Set creation date on archive nodes from actual file creation time.
 * If a file in the archive has no node yet, creates an archive node for it.
 *
 * Walks an archive day folder (e.g. RAW/archive/2026-03-14), reads each file's
 * birthtime (or mtime). For each file: creates a node if missing, then sets
 * node.created and node.attributes.created to ISO datetime (YYYY-MM-DDTHH:mm:ss).
 *
 * Usage:
 *   node set-archive-creation-dates.js <archive-folder-or-date> [nodes.json path]
 *
 * If first arg is YYYY-MM-DD, archive path is resolved as ~/RAW/archive/YYYY-MM-DD.
 *
 * Examples:
 *   node set-archive-creation-dates.js 2026-03-14
 *   node set-archive-creation-dates.js /Users/paulvisciano/RAW/archive/2026-03-14
 *   node set-archive-creation-dates.js 2026-03-14 ~/Personal/paulvisciano.github.io/memory/nodes.json
 *
 * Default nodes path: JARVIS/RAW/memories/nodes.json
 * (canonical: /Users/paulvisciano/JARVIS/RAW/memories/)
 *
 * Week view = same graph as 24h view: one temporal node per day; learnings/archives
 * orbit that day's temporal node. Run this script (and set-learning-creation-dates.js)
 * per day to organize memory for that date. So far run for: 2026-03-13, 2026-03-14.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOME = process.env.HOME || '';
const RAW_ARCHIVE = path.join(HOME, 'RAW', 'archive');

const ARCHIVE_ARG = process.argv[2];
const NODES_PATH = process.argv[3] || path.join(__dirname, '..', 'RAW', 'memories', 'nodes.json');

if (!ARCHIVE_ARG) {
  console.error('Usage: node set-archive-creation-dates.js <archive-folder-or-date> [nodes.json path]');
  process.exit(1);
}

// If arg looks like YYYY-MM-DD, resolve to ~/RAW/archive/YYYY-MM-DD
const dateMatch = ARCHIVE_ARG.match(/^(\d{4}-\d{2}-\d{2})$/);
const archiveDir = dateMatch
  ? path.join(RAW_ARCHIVE, dateMatch[1])
  : path.resolve(process.cwd(), ARCHIVE_ARG.replace(/^~/, HOME));
const nodesPath = path.resolve(process.cwd(), NODES_PATH.replace(/^~/, HOME));

if (!fs.existsSync(archiveDir)) {
  console.error('Archive folder not found:', archiveDir);
  process.exit(1);
}
if (!fs.existsSync(nodesPath)) {
  console.error('Nodes file not found:', nodesPath);
  process.exit(1);
}

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(full, fileList);
    } else if (e.isFile()) {
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

function normalizeNodePath(p) {
  if (!p || typeof p !== 'string') return null;
  const s = p.trim().replace(/\u202f/g, ' ');
  if (!s) return null;
  if (path.isAbsolute(s)) return path.normalize(s);
  const home = process.env.HOME || '';
  if (s.startsWith('~/')) return path.normalize(path.join(home, s.slice(2)));
  if (s.startsWith('/RAW/')) return path.normalize(path.join(home, 'RAW', s.slice(5)));
  if (s.startsWith('RAW/')) return path.normalize(path.join(home, s));
  return path.normalize(path.resolve(archiveDir, '..', s));
}

const files = walkDir(archiveDir);
const pathToCreated = {};
files.forEach(({ path: filePath, created }) => {
  const key = path.normalize(filePath);
  pathToCreated[filePath] = created;
  pathToCreated[key] = created;
});

console.log('Archive folder:', archiveDir);
console.log('Files found:', files.length);
console.log('Nodes file:', nodesPath);

const nodesRaw = fs.readFileSync(nodesPath, 'utf8');
const nodes = JSON.parse(nodesRaw);

// Set of normalized paths that already have an archive/file node
const pathHasNode = new Set();
nodes.forEach((node) => {
  const cat = (node.category || '').toLowerCase();
  if (cat !== 'archive' && cat !== 'file') return;
  const rawPath =
    node.attributes?.rawContentPath ||
    node.attributes?.filePath ||
    node.attributes?.path ||
    node.attributes?.sourceDocument;
  const n = normalizeNodePath(rawPath);
  if (n) pathHasNode.add(n);
});

// Create missing nodes for files that don't have one
const dateStr = path.basename(archiveDir);
const relFromArchive = (p) => path.relative(archiveDir, p).replace(/\\/g, '/');
const sourceDoc = (p) => 'RAW/archive/' + dateStr + '/' + relFromArchive(p);
// Subtype for viewers: audio, image, text, video (graph uses attributes.type/subtype)
const extToType = (ext) => {
  const e = (ext || '').toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.heic'].includes(e)) return 'image';
  if (['.mp3', '.m4a', '.wav', '.ogg', '.webm'].includes(e)) return 'audio';
  if (['.mp4', '.mov'].includes(e)) return 'video';
  if (['.md', '.txt'].includes(e)) return 'text';
  return 'document';
};
let createdCount = 0;
files.forEach(({ path: filePath, created }) => {
  const key = path.normalize(filePath);
  if (pathHasNode.has(key)) return;
  const base = path.basename(filePath);
  const ext = path.extname(filePath);
  const timePart = created.slice(11, 19).replace(/:/g, ':');
  const label = base.length <= 30 ? base : base.slice(0, 14) + '…' + base.slice(-10);
  const id = 'ar-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 12);
  const node = {
    id,
    label,
    category: 'archive',
    frequency: 1,
    moments: ['file'],
    attributes: {
      role: 'archived-file',
      type: extToType(ext),
      rawContentPath: key,
      date: created.slice(0, 10),
      sourceDocument: sourceDoc(filePath),
      created,
    },
    created,
  };
  nodes.push(node);
  pathHasNode.add(key);
  createdCount++;
});
if (createdCount) console.log('Created', createdCount, 'new archive nodes.');

let updated = 0;
nodes.forEach((node) => {
  const cat = (node.category || '').toLowerCase();
  if (cat !== 'archive' && cat !== 'file') return;

  const rawPath =
    node.attributes?.rawContentPath ||
    node.attributes?.filePath ||
    node.attributes?.path ||
    node.attributes?.sourceDocument;
  const nodePath = normalizeNodePath(rawPath);
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
console.log('Done. Updated', updated, 'nodes. Wrote', nodesPath);
