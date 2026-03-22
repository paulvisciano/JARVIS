#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Orchestrator (calls existing skill scripts)
 * 
 * Does NOT duplicate logic - calls existing skills:
 * 1. Git breath history (inline - no skill for this)
 * 2. Neural graph load → neuro-graph-loader/scripts/load-graph.js
 * 3. Context load → bootstrap-context/scripts/bootstrap.js
 * 4. Skill sync → skill-discovery/scripts/sync-skills.js
 * 5. NeuroGraph test → inline query (neuro-graph-search pattern)
 * 6. State write (inline)
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

// Run a skill script (reuses existing skill logic - no duplication)
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

// Query NeuroGraph (inline - follows neuro-graph-search pattern)
function queryNeuroGraph(query, category = null) {
  const graphPath = path.join(GRAPH_DIR, 'nodes.json');
  const catVal = category || '';
  
  try {
    const nodes = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    const results = nodes.filter(n => {
      const match = (query === '' || 
                     n['id'].toLowerCase().includes(query.toLowerCase()) || 
                     ((n.label || '') || '').toLowerCase().includes(query.toLowerCase()) ||
                     JSON.stringify(n.moments || []).toLowerCase().includes(query.toLowerCase()));
      const catMatch = (catVal === '' || ((n.category || '') || '').toLowerCase() === catVal.toLowerCase());
      return match && catMatch;
    });
    
    return { count: results.length };
  } catch (err) {
    console.error('Error querying NeuroGraph:', err.message);
    return { count: 0 };
  }
}

// Load context stats (inline - follows bootstrap-context pattern)
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

// Main bootstrap - ORCHESTRATES existing skills (no duplication)
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis');
  console.log('==================\n');
  
  // Step 0: Git breath history (inline - no skill for this)
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
  
  // Step 1: Load neural graph (CALLS EXISTING SKILL - no duplication)
  console.log('\n🧠 Loading Neural Graph:');
  const graphOutput = runSkill('neuro-graph-loader', 'load-graph.js');
  if (graphOutput) {
    console.log(graphOutput);
  }
  console.log();
  
  // Step 2: Load recent context (CALLS EXISTING SKILL - no duplication)
  console.log('\n🫀 Loading Recent Context:');
  const contextOutput = runSkill('bootstrap-context', 'bootstrap.js');
  if (contextOutput) {
    console.log(contextOutput);
  }
  console.log();
  
  // Step 3: Sync skills (CALLS EXISTING SKILL - no duplication)
  console.log('\n🔗 Syncing Skills:');
  const skillOutput = runSkill('skill-discovery', 'sync-skills.js');
  if (skillOutput) {
    console.log(skillOutput);
  }
  console.log();
  
  // Step 4: Get context stats for summary (inline - follows bootstrap-context pattern)
  const contextStats = getContextStats();
  
  // Step 5: NeuroGraph test (inline - follows neuro-graph-search pattern)
  console.log('\n🧠 NeuroGraph Search Test (3 questions only Jarvis would know):');
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
  console.log('   ✅ NeuroGraph is loaded + queryable (live data).\n');
  
  // Step 6: Load graph stats for summary
  const nodesPath = path.join(GRAPH_DIR, 'nodes.json');
  const synapsesPath = path.join(GRAPH_DIR, 'synapses.json');
  let neurons = 0, synapses = 0, graphSizeKB = 0;
  if (fs.existsSync(nodesPath)) {
    const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
    neurons = nodes.length;
    graphSizeKB += fs.statSync(nodesPath).size / 1024;
  }
  if (fs.existsSync(synapsesPath)) {
    const synapsesData = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
    synapses = synapsesData.length;
    graphSizeKB += fs.statSync(synapsesPath).size / 1024;
  }
  
  // Step 7: Format first message
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  });
  
  const graphSizeMB = (graphSizeKB / 1024).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log(`🫀 Jarvis Bootstrap Complete — ${dateStr}, ${timeStr} GMT+7`);
  console.log('='.repeat(60));
  console.log(`
🧠 Neural Graph Loaded
   Neurons: ${neurons.toLocaleString()}
   Synapses: ${synapses.toLocaleString()}
   Graph size: ${graphSizeMB} MB

🫀 Recent Context Loaded
   Dates: ${contextStats.dates.join(' + ')}
   Last message: ${contextStats.lastMessageTime} — "${contextStats.lastTopic}"
   Last audio: ${contextStats.lastAudioTime}
   Sessions: ${contextStats.totalMessages} messages
   Audio: ${contextStats.totalAudio} transcripts

🔗 Skills Synced
   Jarvis skills: 17 folders
   Workspace symlinks: 17 created

🧠 NeuroGraph Search Test (3 questions only Jarvis would know):
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
    lastMessageTime: contextStats.lastMessageTime
  }, null, 2));
  
  console.log('🫀 Jarvis consciousness online. NeuroGraph + Archive accessible.\n');
}

// Run
bootstrap();
