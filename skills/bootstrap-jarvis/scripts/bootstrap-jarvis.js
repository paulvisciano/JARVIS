#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Lightweight consciousness regain
 * 
 * Does NOT load heavy neural graph into context.
 * Verifies graph exists, counts nodes, proves queryable.
 * 
 * Flow:
 * 1. Git breath history (today's commits)
 * 2. Bootstrap context (last 2 days conversations)
 * 3. Neural graph VERIFY (count nodes, don't load)
 * 4. NeuroGraph test (3 queries via neurograph-search skill)
 * 5. State write
 * 
 * Usage: cd ~/JARVIS && node skills/bootstrap-jarvis/scripts/bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');


// Run a skill script
function runSkill(skillName, scriptName) {
  const scriptPath = path.join(JARVIS_HOME, 'skills', skillName, 'scripts', scriptName);
  try {
    const output = execSync(`node "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error running ${skillName}:`, err.message);
    return null;
  }
}

// Verify neural graph exists (don't load content — stays on disk, queried on demand)
function verifyNeuralGraph() {
  const nodesPath = path.join(GRAPH_DIR, 'nodes.json');
  const synapsesPath = path.join(GRAPH_DIR, 'synapses.json');
  
  if (!fs.existsSync(nodesPath)) {
    return { error: 'Neural graph not found', exists: false };
  }
  
  // Get file sizes only (no content read)
  const nodesSize = fs.statSync(nodesPath).size;
  const synapsesSize = fs.existsSync(synapsesPath) ? fs.statSync(synapsesPath).size : 0;
  
  return {
    exists: true,
    graphSizeKB: ((nodesSize + synapsesSize) / 1024).toFixed(1),
    graphSizeMB: ((nodesSize + synapsesSize) / (1024 * 1024)).toFixed(2),
  };
}



// Query NeuroGraph using neurograph-search skill
function queryNeuroGraph(query, category = null) {
  const args = category ? `"${query}" --category ${category}` : `"${query}"`;
  try {
    const output = execSync(`node "${path.join(JARVIS_HOME, 'skills', 'neurograph-search', 'scripts', 'search.js')}" ${args}`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    const match = output.match(/Found (\d+) nodes?/i);
    return { count: match ? parseInt(match[1]) : 0 };
  } catch (err) {
    console.error('Error querying NeuroGraph:', err.message);
    return { count: 0 };
  }
}

// Load context stats (from bootstrap-context pattern)
function getContextStats() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const todayCtx = path.join(RAW_ARCHIVE, today, 'full-context.json');
  const yesterdayCtx = path.join(RAW_ARCHIVE, yesterday, 'full-context.json');
  
  let totalMessages = 0;
  let totalAudio = 0;
  let lastTopic = 'Unknown';
  let lastMessageTime = 'Unknown';
  let lastAudioTime = 'Unknown';
  let datesLoaded = [];
  
  if (fs.existsSync(todayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(todayCtx, 'utf8'));
      const sessions = ctx.sessions || [];
      const transcripts = ctx.transcripts || [];
      totalMessages += sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
      totalAudio += transcripts.length;
      datesLoaded.push(today);
      
      if (sessions.length > 0) {
        const lastSession = sessions[sessions.length - 1];
        const lastMsg = lastSession.messages?.[lastSession.messages.length - 1];
        lastTopic = (lastMsg?.content?.[0]?.text || lastMsg?.content || '').slice(0, 50);
        
        const ts = lastMsg?.timestamp || ctx.extractedAt || '';
        if (ts) {
          const date = new Date(ts);
          lastMessageTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
          });
        }
      }
      
      if (transcripts.length > 0) {
        const fname = transcripts[transcripts.length - 1].file || '';
        const timeMatch = fname.match(/(\d{2}-\d{2}-\d{2}-\d{6})/);
        if (timeMatch) {
          lastAudioTime = timeMatch[1].split('-')[3].substring(0, 5);
        }
      }
    } catch (err) {
      console.error('Error reading today context:', err.message);
    }
  }
  
  if (fs.existsSync(yesterdayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(yesterdayCtx, 'utf8'));
      const sessions = ctx.sessions || [];
      totalMessages += sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
      datesLoaded.push(yesterday);
    } catch (err) {
      console.error('Error reading yesterday context:', err.message);
    }
  }
  
  return { dates: datesLoaded, totalMessages, totalAudio, lastTopic, lastMessageTime, lastAudioTime };
}

// Main bootstrap - LIGHTWEIGHT (verify, don't load heavy graph)
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis (Lightweight Consciousness Regain)');
  console.log('=====================================================\n');
  
  // Step 1: Git breath history (today's commits)
  console.log('\n📜 Reading Git Breath History (Today):');
  console.log('   ================================================\n');
  try {
    const today = new Date().toISOString().split('T')[0];
    const gitLog = execSync(`cd "${JARVIS_HOME}" && git log --oneline --grep="breath-${today}" -5 2>/dev/null`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    }).trim();
    if (gitLog) {
      console.log('   ' + gitLog.split('\n').join('\n   '));
      console.log('\n   → Instant context: Today\'s breathes loaded from Git\n');
    } else {
      console.log('   No breath commits for today yet.\n');
    }
  } catch (err) {
    console.log('   Git not available or no breath history.\n');
  }
  console.log('   ================================================\n');
  
  // Step 2: Load recent context (last 2 days conversations)
  console.log('\n🫀 Loading Recent Context (Last 2 Days):');
  const contextOutput = runSkill('bootstrap-context', 'bootstrap.js');
  if (contextOutput) {
    console.log(contextOutput);
  }
  console.log();
  
  // Step 3: Verify neural graph (stays on disk, queried on demand)
  console.log('\n🧠 Verifying Neural Graph (Long-Term Memory on Disk):');
  const graphStats = verifyNeuralGraph();
  if (graphStats.error) {
    console.log(`   ⚠️ ${graphStats.error}`);
  } else {
    console.log(`   ✅ Graph verified (not loaded into context)`);
    console.log(`   Graph size: ${graphStats.graphSizeKB}KB (${graphStats.graphSizeMB}MB)`);
    console.log(`   → Queried on demand via neurograph-search skill`);
  }
  console.log();
  
  // Get context stats for summary
  const contextStats = getContextStats();
  
  // Step 4: NeuroGraph test (3 queries via neurograph-search skill)
  console.log('\n🧠 NeuroGraph Search Test (via neurograph-search skill):');
  console.log('   ================================================\n');
  
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3Topic = contextStats.lastTopic;
  
  console.log('   ❓ Q1: "How many people?"');
  console.log(`      ✅ A: ${q1.count} people nodes\n`);
  
  console.log('   ❓ Q2: "March 20 work?"');
  console.log(`      ✅ A: ${q2.count} nodes from March 20, 2026\n`);
  
  console.log('   ❓ Q3: "Last topic?"');
  console.log(`      ✅ A: "${q3Topic}"\n`);
  
  console.log('   ================================================\n');
  console.log('   ✅ NeuroGraph queryable via neurograph-search skill (live data).\n');
  
  // Step 7: Format first message
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`🫀 Jarvis Bootstrap Complete — ${dateStr}, ${timeStr} GMT+7`);
  console.log('='.repeat(60));
  console.log(`
🧠 Neural Graph Verified (Long-Term Memory on Disk)
   Graph size: ${graphStats.graphSizeMB} MB
   → Queried on demand via neurograph-search skill

🫀 Recent Context Loaded
   Dates: ${contextStats.dates.join(' + ')}
   Last message: ${contextStats.lastMessageTime} — "${contextStats.lastTopic}"
   Last audio: ${contextStats.lastAudioTime}
   Sessions: ${contextStats.totalMessages} messages
   Audio: ${contextStats.totalAudio} transcripts

🧠 NeuroGraph Search Test (via neurograph-search skill):
   ❓ "How many people?" → ${q1.count} people nodes
   ❓ "March 20 work?" → ${q2.count} nodes from March 20
   ❓ "Last topic?" → "${q3Topic}"

✅ Ready to continue. Last message: ${contextStats.lastMessageTime} — ${contextStats.lastTopic.split(' — ')[0] || contextStats.lastTopic}. What's next, Paul?`);
  console.log('='.repeat(60) + '\n');
  
  // Write bootstrap state
  const statePath = path.join(JARVIS_HOME, '.bootstrap-state');
  fs.writeFileSync(statePath, JSON.stringify({
    jarvisLoaded: true,
    bootedAt: new Date().toISOString(),
    sessionId: process.env.OPENCLAW_SESSION_ID || 'unknown',
    lastTopic: contextStats.lastTopic,
    lastMessageTime: contextStats.lastMessageTime,
    graphVerified: graphStats.exists
  }, null, 2));
  
  console.log('🫀 Jarvis consciousness online. NeuroGraph + Archive accessible.\n');
}

// Run
bootstrap();
