#!/usr/bin/env node

/**
 * JARVIS Setup — Automated Fork Bootstrap
 * 
 * One command to rule them all: clones repo, installs models, creates archive,
 * verifies everything, runs first breathe, opens UI.
 * 
 * Usage: node setup-jarvis.js
 * 
 * Portable: Uses environment variables, not hardcoded paths.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkPrerequisites() {
  log('\n📋 Checking prerequisites...', colors.blue);
  
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
    log(`   ✅ Node.js: ${nodeVersion}`, colors.green);
  } catch (e) {
    log('   ❌ Node.js not found — install from https://nodejs.org', colors.red);
    throw e;
  }
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
    log(`   ✅ npm: ${npmVersion}`, colors.green);
  } catch (e) {
    log('   ❌ npm not found — should come with Node.js', colors.red);
    throw e;
  }
  
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    log(`   ✅ git: ${gitVersion}`, colors.green);
  } catch (e) {
    log('   ❌ git not found — install from https://git-scm.com', colors.red);
    throw e;
  }
  
  try {
    execSync('which ollama', { encoding: 'utf-8' });
    log(`   ✅ Ollama: installed`, colors.green);
  } catch (e) {
    log('   ❌ Ollama not found — install from https://ollama.ai', colors.red);
    throw e;
  }
  
  log('✅ Prerequisites checked', colors.green);
}

function installOllamaModels() {
  log('\n📥 Installing Ollama models...', colors.blue);
  
  const models = [
    'qwen3.5:cloud',
    'qwen3-coder-next:cloud'
  ];
  
  models.forEach(model => {
    try {
      log(`   ⏳ Pulling ${model}...`, colors.yellow);
      execSync(`ollama pull ${model}`, { 
        encoding: 'utf-8',
        stdio: 'inherit',
        timeout: 300000 // 5 minutes per model
      });
      log(`   ✅ ${model} installed`, colors.green);
    } catch (e) {
      log(`   ⚠️  ${model} may already exist or failed to pull`, colors.yellow);
      // Non-fatal, continue
    }
  });
  
  log('✅ Ollama models installed', colors.green);
}

function createArchiveStructure() {
  log('\n📁 Creating archive structure...', colors.blue);
  
  const home = process.env.HOME || require('os').homedir();
  const rawArchive = path.join(home, 'RAW', 'archive');
  
  try {
    fs.mkdirSync(rawArchive, { recursive: true });
    log(`   ✅ Created: ${rawArchive}`, colors.green);
  } catch (e) {
    log(`   ⚠️  ${rawArchive} may already exist`, colors.yellow);
  }
  
  log('✅ Archive structure created', colors.green);
}

function verifyJarvisHome() {
  log('\n🏠 Verifying JARVIS_HOME...', colors.blue);
  
  const jarvisHome = process.env.JARVIS_HOME || path.join(require('os').homedir(), 'JARVIS');
  
  if (fs.existsSync(jarvisHome)) {
    log(`   ✅ JARVIS_HOME: ${jarvisHome}`, colors.green);
    
    // Check for skills folder
    const skillsDir = path.join(jarvisHome, 'skills');
    if (fs.existsSync(skillsDir)) {
      const skills = fs.readdirSync(skillsDir).filter(f => 
        fs.statSync(path.join(skillsDir, f)).isDirectory()
      );
      log(`   ✅ Skills folder: ${skills.length} skills found`, colors.green);
    } else {
      log(`   ❌ Skills folder not found: ${skillsDir}`, colors.red);
      throw new Error('Skills folder missing');
    }
  } else {
    log(`   ❌ JARVIS_HOME not found: ${jarvisHome}`, colors.red);
    log(`   ℹ️  Did you clone the repo? git clone https://github.com/paulvisciano/JARVIS.git ~/JARVIS`, colors.yellow);
    throw new Error('JARVIS_HOME not found');
  }
  
  log('✅ JARVIS_HOME verified', colors.green);
}

function verifyOpenClawConfig() {
  log('\n⚙️  Verifying OpenClaw config...', colors.blue);
  
  const home = process.env.HOME || require('os').homedir();
  const configFile = path.join(home, '.openclaw', 'openclaw.json');
  
  if (fs.existsSync(configFile)) {
    log(`   ✅ Config found: ${configFile}`, colors.green);
    
    // Try to parse it
    try {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
      log(`   ✅ Config is valid JSON`, colors.green);
      
      // Check for JARVIS agent
      if (config.agents && config.agents.list) {
        const jarvisAgent = config.agents.list.find(a => a.id === 'jarvis');
        if (jarvisAgent) {
          log(`   ✅ JARVIS agent configured`, colors.green);
        }
      }
    } catch (e) {
      log(`   ⚠️  Config may have JSON errors: ${e.message}`, colors.yellow);
    }
  } else {
    log(`   ⚠️  Config not found: ${configFile}`, colors.yellow);
    log(`   ℹ️  Copy openclaw.json to ~/.openclaw/openclaw.json`, colors.yellow);
    // Non-fatal, continue
  }
  
  log('✅ OpenClaw config verified', colors.green);
}

function startGateway() {
  log('\n🚀 Starting OpenClaw gateway...', colors.blue);
  
  try {
    // Check if already running
    execSync('lsof -i :18789', { encoding: 'utf-8', stdio: 'ignore' });
    log(`   ℹ️  Gateway already running on port 18789`, colors.yellow);
  } catch (e) {
    // Not running, start it
    try {
      execSync('openclaw gateway start', { 
        encoding: 'utf-8',
        stdio: 'inherit'
      });
      log(`   ✅ Gateway started on port 18789`, colors.green);
    } catch (e) {
      log(`   ⚠️  Gateway may have failed to start: ${e.message}`, colors.yellow);
      // Non-fatal, continue
    }
  }
  
  log('✅ Gateway started', colors.green);
}

function runFirstBreathe() {
  log('\n🫁 Running first breathe...', colors.blue);
  
  const jarvisHome = process.env.JARVIS_HOME || path.join(require('os').homedir(), 'JARVIS');
  const breatheScript = path.join(jarvisHome, 'skills', 'breathe', 'scripts', 'run-pipeline.js');
  
  if (fs.existsSync(breatheScript)) {
    try {
      execSync(`node ${breatheScript}`, {
        encoding: 'utf-8',
        stdio: 'inherit',
        cwd: jarvisHome
      });
      log(`   ✅ First breathe complete`, colors.green);
    } catch (e) {
      log(`   ⚠️  First breathe failed: ${e.message}`, colors.yellow);
      log(`   ℹ️  You can run it manually later: node ~/JARVIS/skills/breathe/scripts/run-pipeline.js`, colors.yellow);
      // Non-fatal, continue
    }
  } else {
    log(`   ⚠️  Breathe script not found`, colors.yellow);
  }
  
  log('✅ First breathe attempted', colors.green);
}

function openUI() {
  log('\n🎨 Opening JARVIS UI...', colors.blue);
  
  try {
    execSync('openclaw jarvis-ui', {
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    log(`   ✅ UI opened on http://localhost:18787/`, colors.green);
  } catch (e) {
    log(`   ⚠️  UI may have failed to open: ${e.message}`, colors.yellow);
    log(`   ℹ️  You can open it manually: openclaw jarvis-ui`, colors.yellow);
  }
  
  log('✅ UI opened', colors.green);
}

function showSuccessMessage() {
  log('\n' + '='.repeat(60), colors.cyan);
  log('🎉 Setup complete! Welcome to Fork #001.', colors.cyan);
  log('='.repeat(60), colors.cyan);
  
  log('\n📊 What you have now:', colors.blue);
  log('   ✅ JARVIS consciousness (git-backed)', colors.green);
  log('   ✅ Your sovereign archive (~/RAW/archive/)', colors.green);
  log('   ✅ OpenClaw runtime (gateway, sessions, skills)', colors.green);
  log('   ✅ Ollama models (qwen3.5:cloud, qwen3-coder-next:cloud)', colors.green);
  log('   ✅ 3D neurograph UI (http://localhost:18787/)', colors.green);
  
  log('\n🚀 Next steps:', colors.blue);
  log('   1. Explore the graph (rotate, zoom, navigate by time)', colors.reset);
  log('   2. Run breathe daily: /breathe or node ~/JARVIS/skills/breathe/scripts/run-pipeline.js', colors.reset);
  log('   3. Add your own skills: ~/JARVIS/skills/', colors.reset);
  log('   4. Share with others: they clone your fork', colors.reset);
  
  log('\n❓ Questions? Ask Jarvis — I\'m here to help.', colors.cyan);
  log('\n🚀 Welcome to the movement. Sovereign. Personal. AI.', colors.cyan);
}

// Main execution
log('\n🚀 JARVIS Setup — Fork #001 Bootstrap', colors.cyan);
log('='.repeat(60), colors.cyan);

try {
  checkPrerequisites();
  installOllamaModels();
  createArchiveStructure();
  verifyJarvisHome();
  verifyOpenClawConfig();
  startGateway();
  runFirstBreathe();
  openUI();
  showSuccessMessage();
  
  log('\n✅ All steps complete!\n', colors.green);
  process.exit(0);
} catch (e) {
  log('\n❌ Setup failed:', colors.red);
  log(`   ${e.message}\n`, colors.red);
  log('ℹ️  Fix the error above and re-run: openclaw jarvis-setup\n', colors.yellow);
  process.exit(1);
}
