#!/usr/bin/env node
/**
 * Git temporal graph — Phase 1 + 1.5
 * Two-tier hierarchy: day anchors (temporal-day-anchor) + commit satellites (temporal-commit).
 * Synapses: each commit → its day anchor. Merges into nodes.json; replaces git-scanner synapses each run.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
let JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
if (JARVIS_HOME.startsWith('~/')) {
  JARVIS_HOME = path.join(HOME, JARVIS_HOME.slice(2));
}
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');
const NODES_PATH = path.join(GRAPH_DIR, 'nodes.json');
const SYNAPSES_PATH = path.join(GRAPH_DIR, 'synapses.json');

const BREATH_FIRST_LINE_RE = /^breath-\d{4}-\d{2}-\d{2}-\d{4}:\s*Breathe complete/;
const DEFAULT_DAYS = 365; // Scan full history (all commits since genesis)
/** Orbit radius in graph units (commits around day anchor in XY, same Z as day) */
const COMMIT_ORBIT_RADIUS = 50;
const SYNAPSE_TYPE_COMMIT_TO_DAY = 'commit-to-day-anchor';
const SYNAPSE_SOURCE_TAG = 'git-scanner-phase1.5';

function git(command) {
  try {
    return execSync(`cd "${JARVIS_HOME}" && git ${command}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME },
      maxBuffer: 32 * 1024 * 1024
    }).trim();
  } catch (err) {
    return null;
  }
}

function detectCommitType(fullMessage) {
  const firstLine = (fullMessage || '').split('\n')[0].trim();
  if (BREATH_FIRST_LINE_RE.test(firstLine)) return 'breath';
  return 'cold-change';
}

function parseLogLine(line) {
  const i1 = line.indexOf('|');
  if (i1 < 0) return null;
  const i2 = line.indexOf('|', i1 + 1);
  if (i2 < 0) return null;
  const hashFull = line.slice(0, i1);
  const authorDate = line.slice(i1 + 1, i2);
  const subject = line.slice(i2 + 1);
  if (!/^[a-f0-9]{40}$/i.test(hashFull)) return null;
  return { hashFull, authorDate, subject };
}

function breathDateFromAuthorDate(authorDate) {
  const t = authorDate.indexOf('T');
  if (t > 0) return authorDate.slice(0, 10);
  const sp = authorDate.split(' ')[0];
  return sp && /^\d{4}-\d{2}-\d{2}$/.test(sp) ? sp : authorDate.slice(0, 10);
}

function toIsoTimestamp(authorDate) {
  try {
    const d = new Date(authorDate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  } catch (_) {}
  return authorDate;
}

function scanGitCommits(days = DEFAULT_DAYS) {
  const raw = git(`log --since='${days} days ago' --format='%H|%ai|%s' --reverse`);
  if (!raw) return [];
  const commits = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const p = parseLogLine(line);
    if (!p) continue;
    const commitType = detectCommitType(p.subject);
    const breathDate = breathDateFromAuthorDate(p.authorDate);
    commits.push({
      hashFull: p.hashFull,
      hashShort: p.hashFull.slice(0, 7),
      authorDate: p.authorDate,
      timestamp: toIsoTimestamp(p.authorDate),
      subject: p.subject,
      commitType,
      breathDate
    });
  }
  return commits;
}

/**
 * Day spine on Z; commits orbit in XY around (0,0) at same Z as their day.
 * @returns {{ sortedDays: string[], byDay: Map<string, typeof commits> }}
 */
function assignHierarchyPositions(commits) {
  const byDay = new Map();
  for (const c of commits) {
    if (!byDay.has(c.breathDate)) byDay.set(c.breathDate, []);
    byDay.get(c.breathDate).push(c);
  }
  const sortedDays = [...byDay.keys()].sort();

  sortedDays.forEach((day, dayIndex) => {
    const list = byDay.get(day);
    const n = list.length;
    list.forEach((c, i) => {
      const angle = n > 0 ? (i / n) * Math.PI * 2 : 0;
      c.orbitRadius = COMMIT_ORBIT_RADIUS;
      c.orbitAngle = angle;
      c.anchorId = `day-${day}`;
      const z = -dayIndex * 100;
      c.position = {
        x: Math.cos(angle) * COMMIT_ORBIT_RADIUS,
        y: Math.sin(angle) * COMMIT_ORBIT_RADIUS,
        z
      };
    });
  });

  return { sortedDays, byDay };
}

function commitSatelliteColor(commitType) {
  return commitType === 'breath' ? '#ffcc00' : '#0066ff';
}

function buildCommitLabel(c) {
  const first = c.subject.split('\n')[0].trim();
  if (c.commitType === 'breath') {
    const short = first.length > 180 ? `${first.slice(0, 177)}...` : first;
    return `🫁 ${short}`;
  }
  return first.length > 200 ? `${first.slice(0, 197)}...` : first;
}

function buildDayAnchorNode(breathDate, dayIndex, commitCount, breathCount) {
  const id = `day-${breathDate}`;
  const z = -dayIndex * 100;
  return {
    id,
    label: breathDate,
    category: 'temporal',
    type: 'temporal-day-anchor',
    frequency: commitCount,
    timestamp: `${breathDate}T00:00:00.000Z`,
    breathDate,
    orbitRadius: null,
    orbitAngle: null,
    moments: [
      {
        date: breathDate,
        type: 'calendar-day',
        description: `${commitCount} commits (${breathCount} breath)`
      }
    ],
    attributes: {
      role: 'temporal-day-anchor',
      commitCount,
      breathCommits: breathCount,
      color: '#ffffff',
      position: { x: 0, y: 0, z },
      source: SYNAPSE_SOURCE_TAG
    }
  };
}

function buildCommitNode(c) {
  const id = `commit-${c.hashShort}`;
  const anchorId = c.anchorId || `day-${c.breathDate}`;
  return {
    id,
    label: buildCommitLabel(c),
    category: 'temporal',
    type: 'temporal-commit',
    frequency: 1,
    gitHash: c.hashFull,  // Full 40-char hash for lookup
    gitHashShort: c.hashShort,  // 7-char short hash for display
    commitType: c.commitType,
    timestamp: c.timestamp,
    breathDate: c.breathDate,
    anchorId,
    orbitRadius: c.orbitRadius,
    orbitAngle: c.orbitAngle,
    moments: [
      {
        date: c.breathDate,
        type: 'git-commit',
        description: c.subject.split('\n')[0].slice(0, 300)
      }
    ],
    attributes: {
      role: 'git-commit-satellite',
      commitHashFull: c.hashFull,
      commitHash: c.hashShort,
      message: c.subject,
      timestamp: c.timestamp,
      breathDate: c.breathDate,
      commitType: c.commitType,
      color: commitSatelliteColor(c.commitType),
      created: c.breathDate,
      position: { ...c.position },
      anchorId,
      source: SYNAPSE_SOURCE_TAG
    }
  };
}

function mergeNode(existing, incoming) {
  const out = { ...existing, ...incoming };
  out.attributes = {
    ...(existing.attributes || {}),
    ...incoming.attributes
  };
  if (existing.moments && existing.moments.length && !incoming.moments) {
    out.moments = existing.moments;
  }
  return out;
}

function buildIncomingNodeMap(commits, sortedDays, byDay) {
  const incomingById = new Map();

  sortedDays.forEach((day, dayIndex) => {
    const list = byDay.get(day);
    const breathCount = list.filter((c) => c.commitType === 'breath').length;
    const dayNode = buildDayAnchorNode(day, dayIndex, list.length, breathCount);
    incomingById.set(dayNode.id, dayNode);
  });

  for (const c of commits) {
    const node = buildCommitNode(c);
    incomingById.set(node.id, node);
  }

  return incomingById;
}

function buildCommitDaySynapses(commits) {
  const syn = [];
  for (const c of commits) {
    const commitId = `commit-${c.hashShort}`;
    const dayId = `day-${c.breathDate}`;
    syn.push({
      source: commitId,
      target: dayId,
      type: SYNAPSE_TYPE_COMMIT_TO_DAY,
      weight: 1,
      sourceTag: SYNAPSE_SOURCE_TAG
    });
  }
  return syn;
}

function mergeSynapses(existingSynapses, newGitSynapses) {
  const kept = (existingSynapses || []).filter((s) => {
    if (!s) return false;
    if (s.type === SYNAPSE_TYPE_COMMIT_TO_DAY && s.sourceTag === SYNAPSE_SOURCE_TAG) return false;
    if (s.sourceTag === SYNAPSE_SOURCE_TAG) return false;
    return true;
  });
  return kept.concat(newGitSynapses);
}

/**
 * Merge temporal hierarchy from git into nodes.json + synapses.json.
 */
function mergeTemporalAnchorsFromGit(options = {}) {
  const days = options.days ?? DEFAULT_DAYS;
  const dryRun = options.dryRun === true;

  const commits = scanGitCommits(days);
  const { sortedDays, byDay } = assignHierarchyPositions(commits);
  const incomingById = buildIncomingNodeMap(commits, sortedDays, byDay);
  const newSynapses = buildCommitDaySynapses(commits);

  const totalCommits = commits.length;
  const totalDayAnchors = sortedDays.length;

  let nodes = [];
  let hadExistingNodesFile = false;

  if (fs.existsSync(NODES_PATH)) {
    hadExistingNodesFile = true;
    let raw;
    try {
      raw = fs.readFileSync(NODES_PATH, 'utf8');
    } catch (e) {
      console.error('[git-scanner] read failed:', e.message);
      return {
        added: 0,
        updated: 0,
        skipped: 0,
        totalAnchors: 0,
        totalDayAnchors: 0,
        totalCommits: 0,
        synapsesWritten: 0,
        dryRun,
        error: e.message
      };
    }
    try {
      nodes = JSON.parse(raw);
    } catch (e) {
      console.error('[git-scanner] JSON parse failed:', e.message);
      return {
        added: 0,
        updated: 0,
        skipped: 0,
        totalAnchors: 0,
        totalDayAnchors: 0,
        totalCommits: 0,
        synapsesWritten: 0,
        dryRun,
        error: 'parse'
      };
    }
    if (!Array.isArray(nodes)) {
      console.error('[git-scanner] nodes.json is not an array');
      return {
        added: 0,
        updated: 0,
        skipped: 0,
        totalAnchors: 0,
        totalDayAnchors: 0,
        totalCommits: 0,
        synapsesWritten: 0,
        dryRun,
        error: 'not_array'
      };
    }
  } else {
    console.log(
      `[git-scanner] nodes.json not found, creating from scratch: ${totalDayAnchors} day anchors + ${totalCommits} commits`
    );
  }

  const indexById = new Map();
  nodes.forEach((n, i) => {
    if (n && n.id) indexById.set(n.id, i);
  });

  let added = 0;
  let updated = 0;

  for (const [id, incoming] of incomingById) {
    const idx = indexById.get(id);
    if (idx === undefined) {
      nodes.push(incoming);
      indexById.set(id, nodes.length - 1);
      added += 1;
    } else {
      nodes[idx] = mergeNode(nodes[idx], incoming);
      updated += 1;
    }
  }

  const totalAnchors = incomingById.size;

  if (dryRun) {
    console.log(
      `[git-scanner] dry-run: would add ${added}, update ${updated} (${totalDayAnchors} day anchors + ${totalCommits} commits, ${newSynapses.length} synapses)`
    );
    return {
      added,
      updated,
      skipped: 0,
      totalAnchors,
      totalDayAnchors,
      totalCommits,
      synapsesWritten: newSynapses.length,
      dryRun: true
    };
  }

  if (!fs.existsSync(GRAPH_DIR)) {
    fs.mkdirSync(GRAPH_DIR, { recursive: true });
    console.log(`[git-scanner] created directory: ${GRAPH_DIR}`);
  }

  let existingSynapses = [];
  if (fs.existsSync(SYNAPSES_PATH)) {
    try {
      const sraw = fs.readFileSync(SYNAPSES_PATH, 'utf8');
      const parsed = JSON.parse(sraw);
      if (Array.isArray(parsed)) existingSynapses = parsed;
    } catch (e) {
      console.warn('[git-scanner] synapses.json parse failed, resetting:', e.message);
      existingSynapses = [];
    }
  }

  const mergedSynapses = mergeSynapses(existingSynapses, newSynapses);

  const backupPath = path.join(GRAPH_DIR, 'nodes.json.bak');
  const synBackupPath = path.join(GRAPH_DIR, 'synapses.json.bak');
  if (hadExistingNodesFile && fs.existsSync(NODES_PATH)) {
    try {
      fs.copyFileSync(NODES_PATH, backupPath);
    } catch (e) {
      console.warn('[git-scanner] nodes backup failed (continuing):', e.message);
    }
  }
  if (fs.existsSync(SYNAPSES_PATH)) {
    try {
      fs.copyFileSync(SYNAPSES_PATH, synBackupPath);
    } catch (e) {
      console.warn('[git-scanner] synapses backup failed (continuing):', e.message);
    }
  }

  const tmpPath = path.join(GRAPH_DIR, 'nodes.json.tmp');
  fs.writeFileSync(tmpPath, JSON.stringify(nodes, null, 2), 'utf8');
  fs.renameSync(tmpPath, NODES_PATH);

  const synTmp = path.join(GRAPH_DIR, 'synapses.json.tmp');
  fs.writeFileSync(synTmp, JSON.stringify(mergedSynapses, null, 2), 'utf8');
  fs.renameSync(synTmp, SYNAPSES_PATH);

  console.log(
    `[git-scanner] merged: +${added} added, ${updated} updated (${totalDayAnchors} day anchors + ${totalCommits} commits, ${mergedSynapses.length} synapses total)`
  );
  if (hadExistingNodesFile) console.log(`[git-scanner] backup: ${backupPath}`);
  console.log(`[git-scanner] synapses: ${newSynapses.length} commit→day links (${SYNAPSE_TYPE_COMMIT_TO_DAY})`);

  return {
    added,
    updated,
    skipped: 0,
    totalAnchors,
    totalDayAnchors,
    totalCommits,
    synapsesWritten: mergedSynapses.length,
    dryRun: false
  };
}

function parseArgs(argv) {
  let dryRun = false;
  let days = DEFAULT_DAYS;
  for (const a of argv) {
    if (a === '--dry-run') dryRun = true;
    const m = a.match(/^--days=(\d+)$/);
    if (m) days = Math.min(3650, Math.max(1, parseInt(m[1], 10)));
  }
  return { dryRun, days };
}

if (require.main === module) {
  const { dryRun, days } = parseArgs(process.argv.slice(2));
  console.log(`[git-scanner] JARVIS_HOME=${JARVIS_HOME} days=${days} dryRun=${dryRun}`);
  mergeTemporalAnchorsFromGit({ dryRun, days });
}

module.exports = {
  detectCommitType,
  scanGitCommits,
  assignHierarchyPositions,
  buildDayAnchorNode,
  buildCommitNode,
  buildIncomingNodeMap,
  mergeTemporalAnchorsFromGit,
  mergeNode,
  mergeSynapses,
  DEFAULT_DAYS,
  COMMIT_ORBIT_RADIUS,
  GRAPH_DIR,
  NODES_PATH,
  SYNAPSES_PATH,
  SYNAPSE_TYPE_COMMIT_TO_DAY
};
