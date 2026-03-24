#!/usr/bin/env node
// Setup — Clone SCI-FI repo + download Whisper model + generate SSL certs

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOME = process.env.HOME || require('os').homedir();
const INSTALL_PATH = path.join(HOME, 'JARVIS', 'skills', 'jarvis-ui', 'sci-fi');

const CONFIG = {
  uiRepo: 'https://github.com/paulvisciano/SCI-FI.git',
  installPath: INSTALL_PATH,
  uiPath: path.join(INSTALL_PATH, 'apps', 'JARVIS'),
  neurographPath: path.join(INSTALL_PATH, 'apps', 'neuro-graph'),
  assetsPath: path.join(INSTALL_PATH, 'apps', 'JARVIS', 'assets'),
  whisperModel: process.env.VOICE_WHISPER_MODEL || 'ggml-large-v3.bin',
  whisperModelUrl: 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin'
};

// === Check installed ===
function checkInstalled() {
  return fs.existsSync(CONFIG.uiPath);
}

// === Clone ===
function clone() {
  console.log('📦 Cloning SCI-FI...');
  
  if (!fs.existsSync(CONFIG.installPath)) {
    fs.mkdirSync(CONFIG.installPath, { recursive: true });
  }
  
  try {
    execSync(`git clone ${CONFIG.uiRepo} ${CONFIG.installPath}`, { stdio: 'inherit' });
    console.log('✓ SCI-FI cloned');
    return true;
  } catch (err) {
    console.error('❌ Clone failed:', err.message);
    return false;
  }
}

// === Ensure assets directory ===
function ensureAssetsDir() {
  if (!fs.existsSync(CONFIG.assetsPath)) {
    fs.mkdirSync(CONFIG.assetsPath, { recursive: true });
    console.log('✓ Assets directory created');
  }
}

// === Download Whisper model ===
function downloadWhisperModel() {
  const modelPath = path.join(CONFIG.assetsPath, CONFIG.whisperModel);
  
  if (fs.existsSync(modelPath)) {
    const size = fs.statSync(modelPath).size;
    console.log(`✓ Whisper model exists: ${CONFIG.whisperModel} (${(size / 1024 / 1024).toFixed(1)} MB)`);
    return true;
  }
  
  console.log(`📥 Downloading Whisper model: ${CONFIG.whisperModel}...`);
  console.log(`   URL: ${CONFIG.whisperModelUrl}`);
  console.log(`   Size: ~3.1 GB (this may take a few minutes)`);
  
  try {
    execSync(`curl -L -o "${modelPath}" "${CONFIG.whisperModelUrl}"`, { stdio: 'inherit' });
    
    if (fs.existsSync(modelPath)) {
      const size = fs.statSync(modelPath).size;
      console.log(`✓ Whisper model downloaded: ${(size / 1024 / 1024).toFixed(1)} MB`);
      return true;
    }
  } catch (err) {
    console.error('❌ Download failed:', err.message);
    console.log('   Set VOICE_WHISPER_MODEL or VOICE_MODEL_DIR env vars to use custom model');
    return false;
  }
}

// === Generate self-signed SSL certs ===
function generateSSLCerts() {
  const keyPath = path.join(CONFIG.assetsPath, 'https-key.pem');
  const certPath = path.join(CONFIG.assetsPath, 'https-cert.pem');
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    console.log('✓ SSL certs exist (self-signed)');
    return true;
  }
  
  console.log('🔑 Generating self-signed SSL certs...');
  
  try {
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost"`, { stdio: 'inherit' });
    console.log('✓ SSL certs generated (localhost, 365 days)');
    console.log('   Note: Mobile browsers will show warning — accept to proceed');
    return true;
  } catch (err) {
    console.error('❌ SSL cert generation failed:', err.message);
    console.log('   Install OpenSSL or provide custom certs');
    return false;
  }
}

// === Create symlinks for neuro-graph ===
function createSymlinks() {
  const jarvisNeurographLink = path.join(CONFIG.uiPath, 'neuro-graph');
  
  if (fs.existsSync(jarvisNeurographLink)) {
    console.log('✓ Neuro-graph symlink exists');
    return true;
  }
  
  console.log('🔗 Creating neuro-graph symlink...');
  
  try {
    fs.symlinkSync(CONFIG.neurographPath, jarvisNeurographLink);
    console.log(`✓ Symlink created: ${jarvisNeurographLink} -> ${CONFIG.neurographPath}`);
    return true;
  } catch (err) {
    console.error('❌ Symlink creation failed:', err.message);
    return false;
  }
}

// === Full setup ===
function setup() {
  console.log('🔧 Jarvis UI Setup\n');
  
  ensureAssetsDir();
  
  const cloned = clone();
  if (!cloned) return false;
  
  const symlinksReady = createSymlinks();
  const modelReady = downloadWhisperModel();
  const certsReady = generateSSLCerts();
  
  console.log('\n✅ Setup complete!\n');
  console.log('Ready to run:');
  console.log('  node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open jarvis ui\n');
  console.log('  node ~/JARVIS/skills/jarvis-ui/scripts/jarvis-ui.js open neurograph\n');
  
  if (!symlinksReady) {
    console.log('⚠️  Neuro-graph symlink missing — /neuro-graph route will fail');
  }
  
  if (!modelReady) {
    console.log('⚠️  Whisper model not ready — set VOICE_MODEL_DIR or VOICE_WHISPER_MODEL');
  }
  
  if (!certsReady) {
    console.log('⚠️  SSL certs not ready — HTTPS will fail');
  }
  
  return symlinksReady && modelReady && certsReady;
}

module.exports = {
  checkInstalled,
  clone,
  ensureAssetsDir,
  downloadWhisperModel,
  generateSSLCerts,
  setup
};
