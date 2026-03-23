#!/usr/bin/env node
// Setup Agent Paths — Eric runs this after sync-configs to set his own paths

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME;
const OPENCLAW_HOME = HOME + '/.openclaw';

console.log('🔧 Setting up your Jarvis agent paths...\n');

// === Get Eric's username ===
const username = HOME.split('/').pop();
console.log(`👤 Detected user: ${username}`);
console.log(`   Home: ${HOME}\n`);

// === Create jarvis agent config ===
const jarvisAgentDir = path.join(OPENCLAW_HOME, 'agents', 'jarvis');
if (!fs.existsSync(jarvisAgentDir)) {
  fs.mkdirSync(jarvisAgentDir, { recursive: true });
}

const jarvisAgentConfig = {
  id: 'jarvis',
  name: 'jarvis',
  workspace: `${HOME}/JARVIS`,
  agentDir: `${OPENCLAW_HOME}/agents/jarvis`,
  identity: {
    name: 'Jarvis',
    emoji: '🧠'
  }
};

fs.writeFileSync(
  path.join(jarvisAgentDir, 'agent.json'),
  JSON.stringify(jarvisAgentConfig, null, 2)
);
console.log('✓ Created ~/.openclaw/agents/jarvis/agent.json');
console.log(`   workspace: ${HOME}/JARVIS\n`);

// === Update openclaw.json with correct paths ===
const openclawConfigPath = path.join(OPENCLAW_HOME, 'openclaw.json');
const config = JSON.parse(fs.readFileSync(openclawConfigPath, 'utf8'));

// Update jarvis agent workspace
const jarvisAgent = config.agents.list.find(a => a.id === 'jarvis');
if (jarvisAgent) {
  jarvisAgent.workspace = `${HOME}/JARVIS`;
  jarvisAgent.agentDir = `${OPENCLAW_HOME}/agents/jarvis`;
  console.log('✓ Updated openclaw.json → jarvis agent paths');
}

// Update default workspace
config.agents.defaults.workspace = `${HOME}/.openclaw/workspace`;
console.log('✓ Updated openclaw.json → default workspace\n');

fs.writeFileSync(openclawConfigPath, JSON.stringify(config, null, 2));

// === Restart Gateway ===
console.log('🔄 Restarting Gateway...');
try {
  execSync('openclaw gateway restart', { stdio: 'inherit' });
  console.log('✓ Gateway restarted\n');
} catch (err) {
  console.error('⚠️  Gateway restart failed:', err.message);
}

// === Report ===
console.log('✅ Agent paths configured!');
console.log(`   Jarvis workspace: ${HOME}/JARVIS`);
console.log(`   Default workspace: ${HOME}/.openclaw/workspace`);
console.log('\n💡 You now have your own isolated Jarvis agent channel.');
console.log('   Paul\'s Jarvis runs in his OpenClaw.');
console.log('   Your Jarvis runs in your OpenClaw.\n');
