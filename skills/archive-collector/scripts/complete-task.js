#!/usr/bin/env node
/**
 * JARVIS Task Completion Helper
 * Adds system notification and inbox update to task completion workflow.
 * 
 * Usage:
 *   node complete-task.js --task "Task Name" --message "Success message"
 *   node complete-task.js --failure --task "Task Name" --message "Error details"
 *   node complete-task.js --status --message "Progress update"
 *   node complete-task.js --check
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || require('os').homedir();
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(HOME, 'JARVIS');
const INBOX_DIR = path.join(JARVIS_HOME, 'inbox');
const INBOX_STATUS = path.join(INBOX_DIR, 'coder-status.md');
const NOTIFICATION_SCRIPT = path.join(JARVIS_HOME, 'skills', 'archive-collector', 'scripts', 'notify.js');

const args = process.argv.slice(2);

const isComplete = args.includes('--complete');
const isFailure = args.includes('--failure');
const isStatus = args.includes('--status');
const isCheck = args.includes('--check');

const taskMatch = args.find(arg => arg.startsWith('--task='))?.split('=')[1] || '';
const messageMatch = args.find(arg => arg.startsWith('--message='))?.split('=')[1] || '';

// Ensure inbox directory exists
function ensureInbox() {
  if (!fs.existsSync(INBOX_DIR)) {
    fs.mkdirSync(INBOX_DIR, { recursive: true });
    console.log(`📁 Created inbox directory: ${INBOX_DIR}`);
  }
}

// Append to coder-status.md
function appendStatus(update) {
  ensureInbox();
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const entry = `\n## [${timestamp}]\n${update}\n`;
  
  if (!fs.existsSync(INBOX_STATUS)) {
    fs.writeFileSync(INBOX_STATUS, '# Coder Status\n\n');
  }
  
  fs.appendFileSync(INBOX_STATUS, entry);
  console.log(`📝 Updated inbox: ${INBOX_STATUS}`);
}

// Send notification
function sendNotification(type, task, message) {
  const cmd = `node "${NOTIFICATION_SCRIPT}" --${type} --task="${task}" --message="${message}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (e) {
    console.warn('⚠️  Notification failed:', e.message);
    return false;
  }
}

// Send completion notification
function completeTask() {
  const taskName = taskMatch || 'Task Complete';
  const message = messageMatch || 'Task completed successfully. Check inbox for details.';
  
  appendStatus(`✅ **${taskName}** - ${message}`);
  sendNotification('complete', taskName, message);
  console.log('\n✅ Task completed and notification sent!');
}

// Send failure notification
function failTask() {
  const taskName = taskMatch || 'Task Failed';
  const message = messageMatch || 'Task failed. Check inbox for details.';
  
  appendStatus(`❌ **${taskName}** - ${message}`);
  sendNotification('failure', taskName, message);
  console.log('\n❌ Task failed and notification sent!');
}

// Send progress update (no notification)
function updateStatus() {
  const message = messageMatch || 'Status update';
  appendStatus(`ℹ️  **Status** - ${message}`);
  console.log('\n📝 Status updated in inbox');
}

// Check configuration
function checkConfig() {
  console.log('🔍 Checking notification configuration...\n');
  
  console.log(`JARVIS_HOME: ${JARVIS_HOME}`);
  console.log(`Inbox: ${INBOX_DIR}`);
  console.log(`Inbox exists: ${fs.existsSync(INBOX_DIR) ? '✅' : '❌'}`);
  console.log(`Status file: ${INBOX_STATUS}`);
  console.log(`Status exists: ${fs.existsSync(INBOX_STATUS) ? '✅' : '❌'}`);
  console.log(`Notification script: ${NOTIFICATION_SCRIPT}`);
  console.log(`Script exists: ${fs.existsSync(NOTIFICATION_SCRIPT) ? '✅' : '❌'}`);
  
  console.log('\nNotification script help:');
  execSync(`node "${NOTIFICATION_SCRIPT}"`, { stdio: 'inherit' });
}

// Main
if (isCheck) {
  checkConfig();
} else if (isComplete) {
  completeTask();
} else if (isFailure) {
  failTask();
} else if (isStatus) {
  updateStatus();
} else {
  console.log('Usage: node complete-task.js --complete --task="Task Name" --message="Success message"');
  console.log('       node complete-task.js --failure --task="Task Name" --message="Error details"');
  console.log('       node complete-task.js --status --message="Progress update"');
  console.log('       node complete-task.js --check');
}
