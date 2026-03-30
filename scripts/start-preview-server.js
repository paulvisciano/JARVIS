#!/usr/bin/env node

/**
 * Preview Server Script
 * 
 * Starts full JARVIS server preview instance on port 18788 (production is 18787)
 * Runs the actual jarvis-server.js from the preview workspace.
 * 
 * Usage: node start-preview-server.js [port] [workspace]
 * 
 * Environment variables:
 * - PREVIEW_PORT: Port to run preview server (default: 18788)
 * - PREVIEW_WORKSPACE: Path to workspace with JARVIS server (default: ~/.openclaw/agents/jarvis-coder/workspace-preview/apps/JARVIS)
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_PORT = 18788;
const DEFAULT_WORKSPACE = path.join(
    process.env.HOME || '/Users/paulvisciano',
    '.openclaw/agents/jarvis-coder/workspace-preview/sci-fi/apps/JARVIS'
);

const PORT = process.env.PREVIEW_PORT || DEFAULT_PORT;
const WORKSPACE = process.env.PREVIEW_WORKSPACE || DEFAULT_WORKSPACE;
const SERVER_SCRIPT = path.join(WORKSPACE, 'jarvis-server.js');

console.log(`[Preview Server] Starting JARVIS preview on port ${PORT}`);
console.log(`[Preview Server] Workspace: ${WORKSPACE}`);
console.log(`[Preview Server] Server script: ${SERVER_SCRIPT}`);

// Verify workspace exists
if (!fs.existsSync(WORKSPACE)) {
    console.error(`[Preview Server] ERROR: Workspace not found: ${WORKSPACE}`);
    process.exit(1);
}

// Verify server script exists
if (!fs.existsSync(SERVER_SCRIPT)) {
    console.error(`[Preview Server] ERROR: Server script not found: ${SERVER_SCRIPT}`);
    console.error(`[Preview Server] Make sure Coder has committed jarvis-server.js to the preview workspace`);
    process.exit(1);
}

// Set environment variables for preview server
const env = {
    ...process.env,
    JARVIS_PREVIEW: 'true',
    VOICE_PORT: process.env.VOICE_PORT || '18788',
    NODE_ENV: 'preview'
};

// Start the JARVIS server
console.log(`[Preview Server] Launching jarvis-server.js...`);
const serverProcess = spawn('node', [SERVER_SCRIPT], {
    env,
    cwd: WORKSPACE,
    stdio: 'inherit'
});

// Set process title for preview (distinct from production)
setTimeout(() => {
    // Server sets its own process.title internally via JARVIS_PREVIEW env var
}, 2000);

serverProcess.on('error', (err) => {
    console.error(`[Preview Server] Failed to start server: ${err.message}`);
    process.exit(1);
});

serverProcess.on('close', (code) => {
    console.log(`[Preview Server] Server exited with code ${code}`);
    process.exit(code);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n[Preview Server] Shutting down...');
    serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n[Preview Server] Shutting down...');
    serverProcess.kill('SIGTERM');
});

// Wait a moment for server to start, then open browser
setTimeout(() => {
    const protocol = 'https';
    const browserUrl = `${protocol}://localhost:${PORT}`;
    console.log(`\n[Preview Server] Opening browser to ${browserUrl}...`);
    
    spawn('open', [browserUrl], {
        stdio: 'ignore',
        detached: true
    });
}, 2000);
