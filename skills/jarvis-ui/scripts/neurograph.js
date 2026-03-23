#!/usr/bin/env node
// NeuroGraph Server — Serve neurograph with found memory path

const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const CONFIG = {
  neurographPath: process.env.NEUROGRAPH_PATH || path.join(process.env.HOME, 'SCI-FI', 'apps', 'neuro-graph'),
  port: 18788,
  sharedPath: 'shared'
};

// === Serve neurograph ===
function serve(memoryPath) {
  console.log(`🧭 Serving NeuroGraph from: ${memoryPath}`);
  
  const indexPath = path.join(CONFIG.neurographPath, CONFIG.sharedPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ NeuroGraph index not found: ${indexPath}`);
    return false;
  }
  
  // Simple HTTP server for neurograph
  const server = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(CONFIG.neurographPath, CONFIG.sharedPath, url);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  
  server.listen(CONFIG.port, () => {
    console.log(`✓ NeuroGraph serving on http://localhost:${CONFIG.port}`);
    console.log(`✓ Memory path: ${memoryPath}`);
  });
  
  return true;
}

// === Open in browser ===
function openInBrowser() {
  const browser = require('./browser.js');
  return browser.open('openclaw', `http://localhost:${CONFIG.port}`);
}

module.exports = {
  serve,
  openInBrowser
};
