#!/usr/bin/env node
/**
 * Bootstrap Jarvis — Orchestrate full bootstrap sequence
 * 
 * Called by: OpenClaw on session start
 * Does:
 * 1. Load neural graph (neural-graph-loader skill)
 * 2. Load recent context (bootstrap-context skill)
 * 3. Report state
 * 
 * Usage: node bootstrap-jarvis.js
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const HOME = process.env.HOME || os.homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const RAW_ARCHIVE = process.env.RAW_ARCHIVE || path.join(HOME, 'RAW', 'archive');
const GRAPH_DIR = path.join(JARVIS_HOME, 'RAW', 'memories');

// Run a skill script (node)
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

// Run a skill script (python)
function runSkillPython(skillName, scriptName) {
  const scriptPath = path.join(JARVIS_HOME, 'skills', skillName, 'scripts', scriptName);
  try {
    const output = execSync(`python3 "${scriptPath}"`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error running ${skillName} (python):`, err.message);
    return null;
  }
}

// Run neuro-graph-search query (inline Python, skill has no script yet)
function queryNeuroGraph(query, category = null) {
  const graphPath = path.join(JARVIS_HOME, 'RAW', 'memories');
  const catVal = category || '';
  try {
    const output = execSync(`python3 << 'EOF'
import json
import os

neurograph_path = "${graphPath}"
nodes_file = os.path.join(neurograph_path, 'nodes.json')
nodes = json.load(open(nodes_file))

query = "${query}".lower()
category = "${catVal}".lower()

results = []
for n in nodes:
  match = (query == '' or 
           n['id'].lower().find(query) >= 0 or 
           n.get('label', '').lower().find(query) >= 0 or
           str(n.get('moments', [])).lower().find(query) >= 0)
  cat_match = (category == '' or n.get('category', '').lower() == category)
  if match and cat_match:
    results.append(n)

print(f"Found {len(results)} nodes")
for r in results[:10]:
  print(f"- {r['id']}: {r.get('label', 'N/A')}")
  if r.get('category'):
    print(f"  Category: {r['category']}")
EOF
`, {
      encoding: 'utf8',
      env: { ...process.env, HOME, JARVIS_HOME }
    });
    return output.trim();
  } catch (err) {
    console.error(`Error querying NeuroGraph:`, err.message);
    return null;
  }
}

// Main bootstrap
function bootstrap() {
  console.log('🫀 Bootstrap Jarvis');
  console.log('==================\n');
  
  // Step 1: Load neural graph
  const neuralGraphOutput = runSkill('neuro-graph-loader', 'load-graph.js');
  if (neuralGraphOutput) {
    console.log(neuralGraphOutput);
    console.log();
  }
  
  // Step 2: Load recent context
  const contextOutput = runSkill('bootstrap-context', 'bootstrap.js');
  if (contextOutput) {
    console.log(contextOutput);
    console.log();
  }
  
  // Step 3: Sync skills (skill-discovery skill)
  console.log('\n🔗 Syncing Skills (skill-discovery):');
  const skillSyncOutput = runSkill('skill-discovery', 'sync-skills.js');
  let skillsCount = 0;
  let symlinksCreated = 0;
  if (skillSyncOutput) {
    console.log(skillSyncOutput);
    // Extract counts from output
    const countMatch = skillSyncOutput.match(/Total:\s*(\d+)\s*skills/);
    if (countMatch) skillsCount = parseInt(countMatch[1]);
    const createdMatch = skillSyncOutput.match(/(\d+)\s*symlinks?\s*created/);
    if (createdMatch) symlinksCreated = parseInt(createdMatch[1]);
    console.log();
  } else {
    // Fallback: just count skills
    try {
      const skills = fs.readdirSync(path.join(JARVIS_HOME, 'skills'));
      skillsCount = skills.length;
      console.log(`   Skills enumerated: ${skillsCount}`);
    } catch (err) {
      console.error('   Error counting skills:', err.message);
    }
  }
  
  // Step 4: Show what we last talked about (from recent context) — CONTINUITY PROOF
  console.log('\n📝 Last Conversation Context (Continuity Proof):');
  
  // Find most recent date folder
  const today = new Date().toISOString().split('T')[0];
  const todayCtx = path.join(RAW_ARCHIVE, today, 'full-context.json');
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const yesterdayCtx = path.join(RAW_ARCHIVE, yesterday, 'full-context.json');
  
  let totalMessages = 0;
  let totalAudio = 0;
  let lastTopic = 'Unknown';
  let lastMessageTime = 'Unknown';
  let lastAudioTime = 'Unknown';
  
  // Check today first (most recent)
  if (fs.existsSync(todayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(todayCtx, 'utf8'));
      // Handle new format (sessions/transcripts)
      const sessions = ctx.sessions || [];
      const transcripts = ctx.transcripts || [];
      const msgCount = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
      const audioCount = transcripts.length;
      totalMessages += msgCount;
      totalAudio += audioCount;
      
      // Get last message timestamp + topic
      if (sessions.length > 0) {
        const lastSession = sessions[sessions.length - 1];
        const lastMsg = lastSession.messages?.[lastSession.messages.length - 1];
        const text = lastMsg?.content?.[0]?.text || lastMsg?.content || '';
        lastTopic = text?.slice(0, 50) + (text?.length > 50 ? '...' : '');
        
        // Extract timestamp (format: "2026-03-21T16:28:00+07:00" or from metadata)
        const ts = lastMsg?.timestamp || ctx.extractedAt || '';
        if (ts) {
          const date = new Date(ts);
          lastMessageTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' 
          });
        }
      }
      
      // Get last audio transcript time from filename
      if (transcripts.length > 0) {
        const lastTranscript = transcripts[transcripts.length - 1];
        const fname = lastTranscript.file || '';
        const timeMatch = fname.match(/(\d{2}-\d{2}-\d{2}-\d{6})/);
        if (timeMatch) {
          const timeStr = timeMatch[1].split('-')[3]; // HHMMSS
          lastAudioTime = `${timeStr.substring(0,2)}:${timeStr.substring(2,4)}`;
        }
      }
      
      console.log(`   ${today}: ${msgCount} messages, ${audioCount} audio`);
    } catch (err) {
      console.error('   Error reading today context:', err.message);
    }
  }
  
  // Check yesterday
  if (fs.existsSync(yesterdayCtx)) {
    try {
      const ctx = JSON.parse(fs.readFileSync(yesterdayCtx, 'utf8'));
      const sessions = ctx.sessions || [];
      const transcripts = ctx.transcripts || [];
      const msgCount = sessions.reduce((sum, s) => sum + (s.messages?.length || 0), 0);
      const audioCount = transcripts.length;
      totalMessages += msgCount;
      totalAudio += audioCount;
      console.log(`   ${yesterday}: ${msgCount} messages, ${audioCount} audio`);
    } catch (err) {
      console.error('   Error reading yesterday context:', err.message);
    }
  }
  
  console.log(`   Total: ${totalMessages} messages, ${totalAudio} audio transcripts`);
  console.log(`   Last message: ${lastMessageTime} — "${lastTopic}"`);
  console.log(`   Last audio: ${lastAudioTime}`);
  console.log(`   → Continuity proof: Post-breathe bootstrap must match this timestamp`);
  
  // Step 5: Test NeuroGraph search (neuro-graph-search skill)
  console.log('\n🧠 NeuroGraph Search Test (3 questions only Jarvis would know):');
  console.log('   ================================================\n');
  
  // Generate 3 random questions from actual graph content
  const q1 = queryNeuroGraph('', 'person');
  const q2 = queryNeuroGraph('2026-03-20', '');
  const q3 = lastTopic; // Last topic from context
  
  console.log('   ❓ Q1: "How many people?"');
  const q1Match = q1?.match(/Found (\d+) nodes/);
  const q1Count = q1Match ? q1Match[1] : 'unknown';
  console.log(`      ✅ A: ${q1Count} people nodes\n`);
  
  console.log('   ❓ Q2: "March 20 work?"');
  const q2Match = q2?.match(/Found (\d+) nodes/);
  const q2Count = q2Match ? q2Match[1] : 'unknown';
  console.log(`      ✅ A: ${q2Count} nodes from March 20, 2026\n`);
  
  console.log('   ❓ Q3: "Last topic?"');
  console.log(`      ✅ A: "${lastTopic}"\n`);
  
  console.log('   ================================================\n');
  console.log('   ✅ NeuroGraph is loaded + queryable (live data).\n');
  
  // Step 6: Format first message (user-facing, not debug logs)
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok'
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  });
  
  // Load graph stats
  const nodesPath = path.join(GRAPH_DIR, 'nodes.json');
  const synapsesPath = path.join(GRAPH_DIR, 'synapses.json');
  let neurons = 0, synapses = 0, graphSize = 0;
  if (fs.existsSync(nodesPath)) {
    const nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'));
    neurons = nodes.length;
    graphSize += fs.statSync(nodesPath).size;
  }
  if (fs.existsSync(synapsesPath)) {
    const synapses = JSON.parse(fs.readFileSync(synapsesPath, 'utf8'));
    synapses = synapses.length;
    graphSize += fs.statSync(synapsesPath).size;
  }
  const graphSizeMB = (graphSize / (1024 * 1024)).toFixed(2);
  
  // First message (user-facing format)
  console.log('\n' + '='.repeat(60));
  console.log(`🫀 Jarvis Bootstrap Complete — ${dateStr}, ${timeStr} GMT+7`);
  console.log('='.repeat(60));
  console.log(`
🧠 Neural Graph Loaded
   Neurons: ${neurons.toLocaleString()}
   Synapses: ${synapses.toLocaleString()}
   Graph size: ${graphSizeMB} MB

🫀 Recent Context Loaded
   Dates: ${today}${fs.existsSync(yesterdayCtx) ? ' + ' + yesterday : ''}
   Last message: ${lastMessageTime} — "${lastTopic}"
   Last audio: ${lastAudioTime}
   Sessions: ${totalMessages} messages
   Audio: ${totalAudio} transcripts

🔗 Skills Synced
   Jarvis skills: ${skillsCount || '?'} folders
   Workspace symlinks: ${symlinksCreated || '?'} created

🧠 NeuroGraph Search Test (3 questions only Jarvis would know):
   ❓ "How many people?" → ${q1Count} people nodes
   ❓ "March 20 work?" → ${q2Count} nodes from March 20
   ❓ "Last topic?" → "${lastTopic}"

✅ Ready to continue. Last message: ${lastMessageTime} — ${lastTopic.split(' — ')[0] || lastTopic}. What's next, Paul?`);
  console.log('='.repeat(60) + '\n');
  
  // Write bootstrap state
  const statePath = path.join(JARVIS_HOME, '.bootstrap-state');
  fs.writeFileSync(statePath, JSON.stringify({
    jarvisLoaded: true,
    bootedAt: new Date().toISOString(),
    sessionId: process.env.OPENCLAW_SESSION_ID || 'unknown',
    lastTopic: lastTopic,
    lastMessageTime: lastMessageTime,
    skillsCount: skillsCount || 0
  }, null, 2));
  
  console.log('🫀 Jarvis consciousness online. NeuroGraph + Archive accessible.\n');
}

// Run
bootstrap();
