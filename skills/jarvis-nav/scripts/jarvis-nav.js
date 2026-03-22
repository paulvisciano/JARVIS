#!/usr/bin/env node
/**
 * Jarvis Nav — Natural Language Navigation
 * 
 * Parses natural language commands and navigates the NeuroGraph UI:
 * - "show me yesterday" → day:2026-03-21
 * - "show me learnings from this week" → week filter + Learnings category
 * - "search for async migration" → search box + click matching node
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const JARVIS_HOME = process.env.JARVIS_HOME || path.join(process.env.HOME, 'JARVIS');
const NEUROGRAPH_URL = 'https://localhost:18787/neuro-graph';

/**
 * Parse natural language time expressions
 * Returns: { timeParam, label }
 */
function parseTimeExpression(input) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  
  // Get week number
  const d = new Date(Date.UTC(yyyy, today.getMonth(), today.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const weekLabel = `${yyyy}-W${String(weekNum).padStart(2, '0')}`;
  
  const inputLower = input.toLowerCase();
  
  // "yesterday"
  if (inputLower.includes('yesterday')) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYY = yesterday.getFullYear();
    const yMM = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDD = String(yesterday.getDate()).padStart(2, '0');
    return { timeParam: `day%3A${yYY}-${yMM}-${yDD}`, label: `Yesterday (${yYY}-${yMM}-${yDD})` };
  }
  
  // "today"
  if (inputLower.includes('today')) {
    return { timeParam: `day%3A${yyyy}-${mm}-${dd}`, label: `Today (${yyyy}-${mm}-${dd})` };
  }
  
  // "this week"
  if (inputLower.includes('this week') || inputLower.includes('current week')) {
    return { timeParam: `week%3A${weekLabel}`, label: `This Week (${weekLabel})` };
  }
  
  // "last week"
  if (inputLower.includes('last week')) {
    const lastWeekNum = weekNum - 1;
    const lastWeekLabel = `${yyyy}-W${String(lastWeekNum).padStart(2, '0')}`;
    return { timeParam: `week%3A${lastWeekLabel}`, label: `Last Week (${lastWeekLabel})` };
  }
  
  // "this month"
  if (inputLower.includes('this month') || inputLower.includes('current month')) {
    return { timeParam: `month%3A${yyyy}-${mm}`, label: `This Month (${yyyy}-${mm})` };
  }
  
  // "last month"
  if (inputLower.includes('last month')) {
    const lastMonth = today.getMonth(); // 0-indexed
    const lastMonthYY = lastMonth === 0 ? yyyy - 1 : yyyy;
    const lastMonthMM = lastMonth === 0 ? '12' : String(lastMonth).padStart(2, '0');
    return { timeParam: `month%3A${lastMonthYY}-${lastMonthMM}`, label: `Last Month (${lastMonthYY}-${lastMonthMM})` };
  }
  
  // "all" or "everything"
  if (inputLower.includes('all') || inputLower.includes('everything')) {
    return { timeParam: '', label: 'All Time' };
  }
  
  // Specific date: "March 20" or "2026-03-20"
  const dateMatch = inputLower.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return { timeParam: `day%3A${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`, label: `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` };
  }
  
  // Month name with day: "March 20" or "March 20th" or "March 2026"
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const monthDayMatch = inputLower.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{1,2})(?:st|nd|rd|th)?/);
  if (monthDayMatch) {
    const monthIdx = monthNames.indexOf(monthDayMatch[1]) + 1;
    const monthMM = String(monthIdx).padStart(2, '0');
    const dayDD = String(monthDayMatch[2]).padStart(2, '0');
    const monthName = monthDayMatch[1].charAt(0).toUpperCase() + monthDayMatch[1].slice(1);
    return { timeParam: `day%3A${yyyy}-${monthMM}-${dayDD}`, label: `${monthName} ${dayDD}` };
  }
  
  // Month + year: "March 2026"
  const monthYearMatch = inputLower.match(/(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{4})/);
  if (monthYearMatch) {
    const monthIdx = monthNames.indexOf(monthYearMatch[1]) + 1;
    const monthMM = String(monthIdx).padStart(2, '0');
    const monthYY = monthYearMatch[2];
    const monthName = monthYearMatch[1].charAt(0).toUpperCase() + monthYearMatch[1].slice(1);
    return { timeParam: `month%3A${monthYY}-${monthMM}`, label: `${monthName} ${monthYY}` };
  }
  
  // Default: all time
  return { timeParam: '', label: 'All Time' };
}

/**
 * Parse category filter from input
 * Returns: category (Temporal, Learnings, Archive, File, All)
 */
function parseCategory(input) {
  const inputLower = input.toLowerCase();
  
  if (inputLower.includes('learning') || inputLower.includes('learnings')) return 'Learnings';
  if (inputLower.includes('temporal') || inputLower.includes('date') || inputLower.includes('anchor')) return 'Temporal';
  if (inputLower.includes('archive') || inputLower.includes('conversation') || inputLower.includes('audio')) return 'Archive';
  if (inputLower.includes('file') || inputLower.includes('skill')) return 'File';
  
  return 'All';
}

/**
 * Parse node search query from input
 * Returns: search term or null
 */
function parseNodeSearch(input) {
  const inputLower = input.toLowerCase();
  
  // "search for X" or "find X" or "show me X"
  const searchPatterns = [
    /search\s+for\s+(.+)/,
    /find\s+(.+)/,
    /show\s+me\s+(.+)/,
    /open\s+(.+)/,
    /navigate\s+to\s+(.+)/,
  ];
  
  for (const pattern of searchPatterns) {
    const match = inputLower.match(pattern);
    if (match) {
      const term = match[1].trim();
      // Exclude time/category words
      const excludeWords = ['yesterday', 'today', 'week', 'month', 'year', 'learning', 'temporal', 'archive', 'file', 'filter', 'category'];
      if (!excludeWords.some(w => term.includes(w))) {
        return term;
      }
    }
  }
  
  return null;
}

/**
 * Main navigation function
 * @param {string} input - Natural language command
 */
async function navigate(input) {
  console.log(`🧭 Parsing: "${input}"`);
  
  const timeExpr = parseTimeExpression(input);
  const category = parseCategory(input);
  const searchTerm = parseNodeSearch(input);
  
  console.log(`   Time: ${timeExpr.label}`);
  console.log(`   Category: ${category}`);
  console.log(`   Search: ${searchTerm || '(none)'}`);
  
  // Build URL
  let url = NEUROGRAPH_URL;
  if (timeExpr.timeParam) {
    url += `?time=${timeExpr.timeParam}`;
  }
  
  console.log(`\n🔗 Navigating to: ${url}`);
  
  // Step 1: Check existing tabs
  console.log('\n📑 Checking tabs...');
  const tabsResult = await runBrowserCommand('tabs', { profile: 'openclaw', json: true });
  const tabs = JSON.parse(tabsResult);
  
  let targetId = null;
  if (tabs.tabs && tabs.tabs.length > 0) {
    targetId = tabs.tabs[0].targetId;
    console.log(`   Reusing existing tab: ${targetId}`);
  } else {
    // Open new tab
    console.log('   Opening new tab...');
    const openResult = await runBrowserCommand('open', { profile: 'openclaw', url: url });
    console.log(`   Tab opened: ${openResult}`);
    await sleep(2000); // Wait for page load
    
    // Get new tab ID
    const newTabsResult = await runBrowserCommand('tabs', { profile: 'openclaw', json: true });
    const newTabs = JSON.parse(newTabsResult);
    if (newTabs.tabs && newTabs.tabs.length > 0) {
      targetId = newTabs.tabs[0].targetId;
    }
  }
  
  if (!targetId) {
    console.error('❌ No tab available');
    return;
  }
  
  // Step 2: Navigate to URL
  console.log('\n🧭 Navigating...');
  const navResult = await runBrowserCommand('navigate', { profile: 'openclaw', targetId: targetId, url: url });
  console.log(`   Navigate result: ${navResult}`);
  
  await sleep(2000); // Wait for page load
  
  // Step 3: Navigate (URL drives canvas state - no DOM clicking needed)
  console.log('\n🧭 Navigation complete - canvas renders from URL state');
  console.log(`   Time filter: ${timeExpr.label}`);
  console.log(`   Category: ${category} (use UI filters manually if needed)`);
  if (searchTerm) {
    console.log(`   Search term: "${searchTerm}" (use UI searchbox manually)`);
  }
  console.log('\n💡 Note: NeuroGraph nodes render on canvas. Use URL for time/node navigation.');
  console.log('   Filter buttons + searchbox are DOM elements for manual interaction.');
  
  console.log('\n✅ Navigation complete!');
  console.log(`   View: ${timeExpr.label}`);
  console.log(`   Filter: ${category}`);
  if (searchTerm) {
    console.log(`   Node: "${searchTerm}"`);
  }
}

/**
 * Run browser command via OpenClaw CLI
 */
function runBrowserCommand(action, options = {}) {
  return new Promise((resolve, reject) => {
    let cmd = `openclaw browser ${action}`;
    
    if (options.profile) cmd += ` --browser-profile ${options.profile}`;
    
    // Action-specific argument handling
    switch (action) {
      case 'navigate':
        // navigate <url> [--target-id <id>]
        cmd += ` "${options.url}"`;
        if (options.targetId) cmd += ` --target-id ${options.targetId}`;
        break;
      case 'open':
        // open <url>
        cmd += ` "${options.url}"`;
        break;
      case 'tabs':
        // tabs (no args)
        if (options.json) cmd += ` --json`;
        break;
      case 'snapshot':
        // snapshot [--format aria|ai] [--target-id <id>]
        if (options.refs) cmd += ` --format ${options.refs}`;
        if (options.targetId) cmd += ` --target-id ${options.targetId}`;
        if (options.json) cmd += ` --json`;
        break;
      case 'click':
        // click <ref> [--target-id <id>]
        if (options.ref) cmd += ` ${options.ref}`;
        if (options.targetId) cmd += ` --target-id ${options.targetId}`;
        break;
      case 'type':
        // type <ref> <text> [--target-id <id>]
        if (options.ref) cmd += ` ${options.ref}`;
        if (options.text) cmd += ` "${options.text.replace(/"/g, '\\"')}"`;
        if (options.targetId) cmd += ` --target-id ${options.targetId}`;
        break;
      default:
        // Generic: append remaining options
        if (options.targetId) cmd += ` ${options.targetId}`;
        if (options.url) cmd += ` ${options.url}`;
        if (options.refs) cmd += ` --format ${options.refs}`;
        if (options.ref) cmd += ` --ref ${options.ref}`;
        if (options.text) cmd += ` "${options.text.replace(/"/g, '\\"')}"`;
    }
    
    exec(cmd, { timeout: 30000 }, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        // Extract JSON from output (skip warning banners)
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        const cleanOutput = jsonMatch ? jsonMatch[0] : stdout.trim();
        resolve(cleanOutput);
      }
    });
  });
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Find filter button ref in aria snapshot
 * Aria snapshot format: { ok, format, targetId, url, nodes: [{ ref, role, name, depth }, ...] }
 */
function findFilterRef(snapshot, category) {
  const nodes = snapshot.nodes || [];
  const targetText = category.toLowerCase();
  
  for (const node of nodes) {
    if (!node) continue;
    
    // Look for button role with matching name
    if (node.role === 'button' && node.name) {
      const btnName = node.name.toLowerCase();
      if (btnName === targetText || btnName.includes(targetText)) {
        return node.ref || null;
      }
    }
  }
  
  return null;
}

/**
 * Find searchbox ref in aria snapshot
 */
function findSearchboxRef(snapshot) {
  const nodes = snapshot.nodes || [];
  
  for (const node of nodes) {
    if (!node) continue;
    
    // Look for searchbox role
    if (node.role === 'searchbox' && node.name) {
      const label = node.name.toLowerCase();
      if (label.includes('filter') || label.includes('search')) {
        return node.ref || null;
      }
    }
  }
  
  return null;
}

/**
 * Find node button ref in aria snapshot
 */
function findNodeRef(snapshot, searchTerm) {
  const nodes = snapshot.nodes || [];
  const termLower = searchTerm.toLowerCase();
  
  for (const node of nodes) {
    if (!node) continue;
    
    // Look for button with matching name
    if (node.role === 'button' && node.name) {
      const btnName = node.name.toLowerCase();
      if (btnName.includes(termLower)) {
        return node.ref || null;
      }
    }
  }
  
  return null;
}

/**
 * Get currently selected node from URL hash
 */
async function getSelectedNode() {
  return new Promise((resolve, reject) => {
    exec('openclaw browser evaluate --json --fn \'() => window.location.hash\' 2>/dev/null', (err, stdout) => {
      if (err) { reject(err); return; }
      // Parse JSON output: {"result":"#node-id"}
      try {
        const json = JSON.parse(stdout.trim());
        const hash = json.result || '';
        const nodeId = hash.replace('#', '');
        resolve(nodeId || 'none');
      } catch (e) {
        console.error('Failed to parse browser output:', e);
        resolve('none');
      }
    });
  });
}

/**
 * Get learning file content for selected node using neuro-graph-search skill
 */
async function getSelectedLearning() {
  const nodeId = await getSelectedNode();
  if (nodeId === 'none' || !nodeId) {
    console.log('❌ No node selected');
    return null;
  }
  
  // Use neuro-graph-search skill to query nodes.json
  console.log(`\n🧠 NeuroGraph Search — "${nodeId}"`);
  exec(`node ${path.join(JARVIS_HOME, 'skills', 'neuro-graph-search', 'scripts', 'search.js')} "${nodeId}"`, (err, stdout) => {
    if (err) {
      console.error('Search error:', err);
      return;
    }
    console.log(stdout);
    
    // After showing node details, offer to read the learning file
    const learningPath = path.join(JARVIS_HOME, 'RAW', 'learnings');
    const dirs = fs.readdirSync(learningPath).filter(d => fs.statSync(path.join(learningPath, d)).isDirectory());
    for (const dir of dirs) {
      const candidate = path.join(learningPath, dir, `${nodeId}.md`);
      if (fs.existsSync(candidate)) {
        console.log(`\n📖 ${nodeId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`);
        console.log(fs.readFileSync(candidate, 'utf8'));
        return;
      }
    }
  });
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const input = args.join(' ');
  
  if (!input) {
    console.log('Usage: node jarvis-nav.js <natural language command>');
    console.log('Examples:');
    console.log('  node jarvis-nav.js show me yesterday');
    console.log('  node jarvis-nav.js show me learnings from this week');
    console.log('  node jarvis-nav.js what node is selected');
    console.log('  node jarvis-nav.js show me this learning');
    process.exit(1);
  }
  
  // Handle special commands
  if (input.includes('what node') || input.includes('selected')) {
    getSelectedNode().then(nodeId => {
      console.log(`📍 Selected node: ${nodeId}`);
    }).catch(console.error);
  } else if (input.includes('show me this learning') || input.includes('show this learning')) {
    getSelectedLearning().catch(console.error);
  } else {
    navigate(input).catch(console.error);
  }
}

module.exports = { navigate, parseTimeExpression, parseCategory, parseNodeSearch, getSelectedNode, getSelectedLearning };
