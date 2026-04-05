#!/usr/bin/env node
/**
 * Jarvis Nav — Natural language → window.JarvisNav via OpenClaw chrome-relay + evaluate.
 */

const { spawnSync } = require('child_process');

const JARVIS_UI_ORIGIN = 'https://localhost:18787';

function parseOpenclawJson(stdout) {
  const trimmed = stdout.trim();
  const m = trimmed.match(/\{[\s\S]*\}/);
  if (!m) {
    throw new Error(`No JSON in CLI output: ${trimmed.slice(0, 240)}`);
  }
  return JSON.parse(m[0]);
}

function browserCmd(args) {
  const full = ['openclaw', 'browser', '--browser-profile', 'chrome-relay', '--json', ...args];
  const r = spawnSync(full[0], full.slice(1), {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  if (r.error) {
    console.error(`❌ Browser command failed: ${full.join(' ')}`);
    console.error(r.error.message);
    process.exit(1);
  }
  if (r.status !== 0) {
    console.error(`❌ Browser command failed: ${full.join(' ')}`);
    console.error(r.stderr || r.stdout || `exit ${r.status}`);
    process.exit(1);
  }
  try {
    return parseOpenclawJson(r.stdout);
  } catch (e) {
    console.error(`❌ Could not parse JSON from openclaw browser output`);
    console.error(e.message);
    process.exit(1);
  }
}

function getTabList(raw) {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && Array.isArray(raw.tabs)) {
    return raw.tabs;
  }
  if (raw && Array.isArray(raw.items)) {
    return raw.items;
  }
  return [];
}

function localDateYyyyMmDd(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const MONTH_NAMES = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12'
};

function extractDayNodeIdFromInput(lower) {
  if (lower.includes('today') || lower.includes('this day')) {
    return `day-${localDateYyyyMmDd()}`;
  }
  if (lower.includes('yesterday')) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `day-${localDateYyyyMmDd(yesterday)}`;
  }
  const isoDateMatch = lower.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoDateMatch) {
    return `day-${isoDateMatch[1]}`;
  }
  const monthDayMatch = lower.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?/
  );
  if (monthDayMatch) {
    const month = MONTH_NAMES[monthDayMatch[1]];
    const day = String(monthDayMatch[2]).padStart(2, '0');
    const y = new Date().getFullYear();
    return `day-${y}-${month}-${day}`;
  }
  return null;
}

function parseNavigation(input) {
  const lower = input.toLowerCase();

  if ((lower.includes('share') && lower.includes('link')) || lower.includes('copy link')) {
    const nodeId = extractDayNodeIdFromInput(lower);
    if (nodeId) {
      return { type: 'share', nodeId };
    }
    return null;
  }

  const commitsForMatch = lower.match(
    /commits (?:for )?(?:on )?(\d{4}-\d{2}-\d{2}|(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}))/
  );
  if (commitsForMatch) {
    if (commitsForMatch[1].includes('-')) {
      return { type: 'query', query: 'commits-for-date', date: commitsForMatch[1] };
    }
    const month = MONTH_NAMES[commitsForMatch[2]];
    const day = String(commitsForMatch[3]).padStart(2, '0');
    const y = new Date().getFullYear();
    return { type: 'query', query: 'commits-for-date', date: `${y}-${month}-${day}` };
  }

  const dayFocus = extractDayNodeIdFromInput(lower);
  if (dayFocus) {
    return { type: 'focus', nodeId: dayFocus };
  }

  if (lower.includes('fly forward') || lower.includes('go forward') || lower.includes('move forward')) {
    const distance = lower.match(/(\d+)/)?.[1] || '1000';
    return { type: 'fly', direction: 'forward', distance: parseInt(distance, 10) };
  }

  if (lower.includes('fly backward') || lower.includes('fly back') || lower.includes('go back')) {
    const distance = lower.match(/(\d+)/)?.[1] || '1000';
    return { type: 'fly', direction: 'backward', distance: parseInt(distance, 10) };
  }

  if (lower.includes('left') && !lower.includes('right')) {
    const distance = lower.match(/(\d+)/)?.[1] || '500';
    return { type: 'fly', direction: 'left', distance: parseInt(distance, 10) };
  }

  if (lower.includes('right')) {
    const distance = lower.match(/(\d+)/)?.[1] || '500';
    return { type: 'fly', direction: 'right', distance: parseInt(distance, 10) };
  }

  if (lower.includes('zoom in')) {
    const level = lower.match(/(\d+)/)?.[1] || '2';
    return { type: 'zoom', level: parseInt(level, 10) };
  }

  if (lower.includes('zoom out')) {
    const level = lower.match(/(\d+\.?\d*)/)?.[1] || '0.5';
    return { type: 'zoom', level: parseFloat(level) };
  }

  if (lower.includes('reset') || lower.includes('show all') || lower.includes('full view')) {
    return { type: 'reset' };
  }

  if (lower.includes('how many days') || lower.includes('count days')) {
    return { type: 'query', query: 'count-days' };
  }

  if (lower.includes('how many commits') || lower.includes('count commits')) {
    return { type: 'query', query: 'count-commits' };
  }

  if (lower.includes('selected node') || lower.includes('what node') || lower.includes('what am i') || lower.includes('tell me about') || lower.includes('what is this') || lower.includes('about this')) {
    return { type: 'query', query: 'selected-node' };
  }

  return null;
}

function assertSafeNodeId(nodeId) {
  if (typeof nodeId !== 'string' || !/^[a-zA-Z0-9._-]+$/.test(nodeId)) {
    throw new Error(`Invalid node id: ${nodeId}`);
  }
  return nodeId;
}

function evaluateOnTab(tab, jsExpressionBody) {
  assertSafeNodeId(tab.targetId);
  const fn = `() => ${jsExpressionBody}`;
  return browserCmd(['evaluate', '--target-id', tab.targetId, '--fn', fn]);
}

function unwrapEvaluatePayload(parsed) {
  if (parsed && typeof parsed === 'object' && 'result' in parsed) {
    let v = parsed.result;
    if (typeof v === 'string') {
      try {
        if ((v.startsWith('{') && v.endsWith('}')) || (v.startsWith('[') && v.endsWith(']'))) {
          v = JSON.parse(v);
        }
      } catch (_) {
        /* keep string */
      }
    }
    return v;
  }
  return parsed;
}

function getActiveTab() {
  const raw = browserCmd(['tabs']);
  const tabs = getTabList(raw);
  const tab = tabs.find((t) => t && t.url && String(t.url).includes('localhost:18787'));

  if (!tab) {
    console.error('❌ JARVIS UI not open in chrome-relay profile.');
    console.error('Please open https://localhost:18787/ in Chrome with the OpenClaw Browser Relay extension active.');
    process.exit(1);
  }

  return tab;
}

function executeQuery(nav, tab) {
  let parsed;

  switch (nav.query) {
    case 'count-days':
      parsed = evaluateOnTab(
        tab,
        'window.JarvisNav.getNodes("day-anchor").length'
      );
      console.log(`📊 ${unwrapEvaluatePayload(parsed)} day anchors in graph`);
      break;

    case 'count-commits':
      parsed = evaluateOnTab(tab, 'window.JarvisNav.getNodes("commit").length');
      console.log(`📊 ${unwrapEvaluatePayload(parsed)} commit satellites in graph`);
      break;

    case 'commits-for-date': {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(nav.date)) {
        console.error(`❌ Invalid date for commits query: ${nav.date}`);
        process.exit(1);
      }
      const dayId = `day-${nav.date}`;
      parsed = evaluateOnTab(
        tab,
        `window.JarvisNav.getNodes("commit").filter(function (n) { return n.orbitAnchorId === ${JSON.stringify(
          dayId
        )}; }).length`
      );
      console.log(`📊 ${unwrapEvaluatePayload(parsed)} commits on ${nav.date}`);
      break;
    }

    case 'selected-node': {
      // Get selected node from URL param
      parsed = evaluateOnTab(
        tab,
        '(() => { const url = new URL(window.location); return url.searchParams.get("node") || "none"; })()'
      );
      const nodeId = unwrapEvaluatePayload(parsed);
      
      if (!nodeId || nodeId === 'none') {
        console.log('📍 No node currently selected. Click on a node in the graph first.');
        break;
      }
      
      console.log(`📍 Selected node: ${nodeId}`);
      console.log('');
      
      // Parse node type and show appropriate info
      if (nodeId.startsWith('commit-')) {
        const commitHash = nodeId.replace('commit-', '');
        console.log(`🫁 This is a commit satellite.`);
        console.log('');
        console.log('Run this command for full details:');
        console.log(`   git show ${commitHash} --stat`);
        console.log('');
      } else if (nodeId.startsWith('day-')) {
        console.log(`🪐 This is a day anchor planet.`);
        console.log('');
        console.log('Run this command for the day summary:');
        console.log(`   cat ~/JARVIS/RAW/learnings/${nodeId.replace('day-', '')}/summary.md`);
        console.log('');
      } else if (nodeId.startsWith('learning-')) {
        const learningName = nodeId.replace('learning-', '');
        console.log(`📚 This is a learning node.`);
        console.log('');
        console.log('Run this command to read it:');
        console.log(`   cat ~/JARVIS/RAW/learnings/*/${learningName}.md`);
        console.log('');
      } else {
        console.log(`🔹 Node type: ${nodeId.split('-')[0]}`);
        console.log('');
      }
      
      break;
    }

    default:
      console.error(`❌ Unknown query: ${nav.query}`);
      process.exit(1);
  }

  return parsed;
}

function executeNavigation(nav, tab) {
  let result;

  switch (nav.type) {
    case 'focus': {
      const id = assertSafeNodeId(nav.nodeId);
      result = evaluateOnTab(tab, `JSON.stringify(window.JarvisNav.focusNode(${JSON.stringify(id)}))`);
      const payload = unwrapEvaluatePayload(result);
      const ok = payload && payload.ok === true;
      if (ok) {
        console.log(`✅ Navigated to ${id}`);
      } else {
        console.error(`❌ Navigation failed: ${(payload && payload.error) || JSON.stringify(payload) || 'Unknown error'}`);
        process.exit(1);
      }
      break;
    }

    case 'fly': {
      result = evaluateOnTab(
        tab,
        `JSON.stringify(window.JarvisNav.fly(${JSON.stringify(nav.direction)}, ${Number(nav.distance)}))`
      );
      console.log(`✅ Flew ${nav.direction} ${nav.distance} units`);
      unwrapEvaluatePayload(result);
      break;
    }

    case 'zoom': {
      result = evaluateOnTab(tab, `JSON.stringify(window.JarvisNav.zoom(${Number(nav.level)}))`);
      console.log(`✅ Zoomed to level ${nav.level}`);
      unwrapEvaluatePayload(result);
      break;
    }

    case 'reset': {
      result = evaluateOnTab(tab, 'JSON.stringify(window.JarvisNav.resetView())');
      console.log('✅ View reset');
      unwrapEvaluatePayload(result);
      break;
    }

    case 'query':
      result = executeQuery(nav, tab);
      break;

    default:
      console.error(`❌ Unknown navigation type: ${nav.type}`);
      process.exit(1);
  }

  return result;
}

function printUsage() {
  console.log('🧭 JARVIS Navigation');
  console.log('');
  console.log('Usage: jarvis-nav <navigation command>');
  console.log('       jarvis-nav --help');
  console.log('');
  console.log('Examples:');
  console.log('  Time:');
  console.log('    "show me today"');
  console.log('    "yesterday"');
  console.log('    "March 6th"');
  console.log('    "2026-04-04"');
  console.log('');
  console.log('  Movement:');
  console.log('    "fly forward"');
  console.log('    "fly backward 2000"');
  console.log('    "strafe left"');
  console.log('');
  console.log('  Zoom:');
  console.log('    "zoom in"');
  console.log('    "zoom out 2x"');
  console.log('    "reset view"');
  console.log('');
  console.log('  Queries:');
  console.log('    "how many days"');
  console.log('    "how many commits"');
  console.log('    "commits for April 4th"');
  console.log('');
  console.log('  Share link:');
  console.log('    "share link for March 6th"');
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === '--help' || argv[0] === '-h') {
    printUsage();
    process.exit(0);
  }

  const input = argv.join(' ');
  const nav = parseNavigation(input);

  if (!nav) {
    console.error(`❌ Could not parse: "${input}"`);
    console.error('Try: node jarvis-nav.js --help');
    process.exit(1);
  }

  if (nav.type === 'share') {
    const u = new URL(JARVIS_UI_ORIGIN);
    u.searchParams.set('node', nav.nodeId);
    console.log(`🔗 ${u.href}`);
    process.exit(0);
  }

  const tab = getActiveTab();
  executeNavigation(nav, tab);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseNavigation,
  browserCmd,
  getActiveTab,
  executeNavigation,
  main
};
