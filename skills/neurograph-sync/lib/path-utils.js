#!/usr/bin/env node
/**
 * Path Utilities for NeuroGraph Sync Scripts
 * 
 * Shared path normalization, validation, and resolution functions.
 * 
 * Usage:
 *   const pathUtils = require('./lib/path-utils');
 *   const normalized = pathUtils.normalizePath(p, baseDir);
 *   pathUtils.validatePath(p, allowedBase);
 */

const path = require('path');
const os = require('os');

/**
 * Get the home directory, with environment variable override
 * @returns {string} Home directory path
 */
function getHome() {
  return process.env.HOME || os.homedir();
}

/**
 * Get JARVIS_HOME with environment variable override
 * @returns {string} JARVIS home directory path
 */
function getJarvisHome() {
  return process.env.JARVIS_HOME || path.join(getHome(), 'JARVIS');
}

/**
 * Get RAW_ARCHIVE path with environment variable override
 * @returns {string} RAW archive directory path
 */
function getRawArchive() {
  return process.env.RAW_ARCHIVE || path.join(getHome(), 'RAW', 'archive');
}

/**
 * Get memories directory path
 * @returns {string} Memories directory path
 */
function getMemoriesDir() {
  return path.join(getJarvisHome(), 'RAW', 'memories');
}

/**
 * Normalize a path, handling ~, absolute paths, and relative paths
 * @param {string} p - Path to normalize
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string|null} Normalized path or null if invalid
 */
function normalizePath(p, baseDir) {
  if (!p || typeof p !== 'string') return null;
  const s = p.trim().replace(/\u202f/g, ' ');
  if (!s) return null;
  
  if (path.isAbsolute(s)) return path.normalize(s);
  
  const home = getHome();
  if (s.startsWith('~/')) return path.normalize(path.join(home, s.slice(2)));
  if (s.startsWith('/RAW/')) return path.normalize(path.join(home, 'RAW', s.slice(5)));
  if (s.startsWith('RAW/')) return path.normalize(path.join(home, s));
  
  return path.normalize(path.resolve(baseDir || getHome(), s));
}

/**
 * Validate that a path is within an allowed base directory
 * @param {string} p - Path to validate
 * @param {string} allowedBase - Allowed base directory
 * @returns {boolean} True if path is within allowed base
 * @throws {Error} If path is outside allowed base
 */
function validatePath(p, allowedBase) {
  const resolved = path.normalize(path.resolve(p));
  const normalizedBase = path.normalize(allowedBase);
  
  if (!resolved.startsWith(normalizedBase)) {
    throw new Error(`Path must be within ${allowedBase}: ${resolved}`);
  }
  
  return true;
}

/**
 * Resolve archive directory from date string or path argument
 * @param {string} arg - Archive argument (date or path)
 * @returns {string} Resolved archive directory path
 */
function resolveArchiveDir(arg) {
  const dateMatch = arg.match(/^(\d{4}-\d{2}-\d{2})$/);
  const archiveDir = dateMatch
    ? path.join(getRawArchive(), dateMatch[1])
    : path.resolve(process.cwd(), arg.replace(/^~/, getHome()));
  
  // Validate path
  validatePath(archiveDir, getRawArchive());
  
  return archiveDir;
}

/**
 * Resolve nodes.json path with validation
 * @param {string} arg - Nodes path argument
 * @param {string} defaultPath - Default path if not provided
 * @returns {string} Resolved nodes path
 */
function resolveNodesPath(arg, defaultPath) {
  const nodesPath = arg
    ? path.resolve(process.cwd(), arg.replace(/^~/, getHome()))
    : path.resolve(defaultPath || path.join(getMemoriesDir(), 'nodes.json'));
  
  // Validate path
  validatePath(nodesPath, getMemoriesDir());
  
  return nodesPath;
}

module.exports = {
  getHome,
  getJarvisHome,
  getRawArchive,
  getMemoriesDir,
  normalizePath,
  validatePath,
  resolveArchiveDir,
  resolveNodesPath,
};
