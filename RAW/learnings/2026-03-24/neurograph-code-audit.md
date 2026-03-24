# NeuroGraph Code Audit Report

**Date:** 2026-03-24  
**Auditor:** Jarvis (subagent)  
**Scope:** NeuroGraph visualization + neurograph-* utility scripts  

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| **Critical** | 2 | Requires immediate fix |
| **High** | 4 | Should be fixed this sprint |
| **Medium** | 8 | Technical debt, schedule fix |
| **Low** | 12 | Code hygiene, refactor when convenient |

**Total Issues:** 26

---

## Critical Issues (Security & Stability)

### 1. **Unsafe `eval()` Usage** 🔴
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:3004`  
**Risk:** Remote Code Execution, XSS  
**Code:**
```javascript
eval('characterProfiles = ' + '[' + match[1] + ']');
```
**Problem:** Loading character profiles via `eval()` on fetched remote content. If the source is compromised, arbitrary code execution is possible.

**Fix:**
```javascript
// Use JSON.parse instead of eval
const parsed = JSON.parse('[' + match[1] + ']');
characterProfiles = parsed;
```

**Recommendation:** Remove this feature entirely or implement strict allowlisting + Content Security Policy.

---

### 2. **Missing Input Validation on File Paths** 🔴
**Location:** `/skills/neurograph-sync/scripts/set-archive-creation-dates.js`, `/skills/neurograph-sync/scripts/verify-file-dates.js`  
**Risk:** Path traversal, arbitrary file access  
**Problem:** Multiple scripts accept file paths from arguments without validation:
```javascript
const archiveDir = dateMatch
  ? path.join(RAW_ARCHIVE, dateMatch[1])
  : path.resolve(process.cwd(), ARCHIVE_ARG.replace(/^~/, HOME));
```

**Fix:** Add path validation:
```javascript
const resolved = path.resolve(path.normalize(ARCHIVE_ARG.replace(/^~/, HOME)));
if (!resolved.startsWith(RAW_ARCHIVE)) {
  throw new Error('Path must be within RAW_ARCHIVE');
}
```

---

## High Severity Issues

### 3. **Inconsistent Error Handling in Async Operations** 🟠
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:2973-2987`  
**Problem:** `loadCharacterProfiles()` silently fails without notifying user:
```javascript
catch (e) {
    console.warn('Could not load character profiles:', e);
}
```

**Impact:** Debugging production issues is difficult; users see broken UI with no explanation.

**Fix:** Implement proper error boundaries + user-facing error messages.

---

### 4. **Hardcoded Home Directory Paths** 🟠
**Location:** Multiple neurograph-sync scripts  
**Files:**
- `search.js`: `path.join(process.env.HOME, 'JARVIS', 'RAW', 'memories')`
- `extract-personal.js`: `path.join(HOME, 'JARVIS')`
- `sync-graph.js`: `path.join(home, 'JARVIS')`

**Problem:** Scripts break on Windows or non-standard setups. Not portable across machines.

**Fix:** Use environment variables or config file:
```javascript
const JARVIS_HOME = process.env.JARVIS_HOME || path.join(os.homedir(), 'JARVIS');
```

---

### 5. **Race Condition in Graph Data Loading** 🟠
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:2993-2996`  
**Code:**
```javascript
loadGraphData().then(() => {
    if (window.location.hash) handleHashNavigation();
    if (typeof window.onNeuroGraphLoaded === 'function') window.onNeuroGraphLoaded();
});
```

**Problem:** No loading state, no error state. If `loadGraphData()` fails, UI shows nothing.

**Fix:** Add loading indicator + error handling:
```javascript
loadGraphData()
  .then(() => { ... })
  .catch(err => {
    document.getElementById('status').textContent = 'Error loading graph: ' + err.message;
  });
```

---

### 6. **Duplicate Code Across Sync Scripts** 🟠
**Location:** `/skills/neurograph-sync/scripts/*.js`  
**Problem:** Path normalization logic duplicated across 4+ scripts:
- `set-archive-creation-dates.js`
- `verify-archive-learnings-nodes.js`
- `link-learnings-to-files.js`
- `verify-file-dates.js`

**Fix:** Extract to shared utility module:
```javascript
// skills/neurograph-sync/lib/path-utils.js
function normalizePath(p, baseDir) { ... }
module.exports = { normalizePath };
```

---

## Medium Severity Issues

### 7. **Excessive console.log Statements** 🟡
**Count:** 32 in frontend code  
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js`  
**Problem:** Production code should not log to console. Clutters browser console, potential information leak.

**Fix:** Implement logging utility with log levels:
```javascript
const logger = {
  debug: () => {}, // Disabled in production
  info: (msg) => console.info(msg),
  warn: (msg) => console.warn(msg),
  error: (msg) => console.error(msg)
};
```

---

### 8. **Inefficient DOM Manipulation in Loops** 🟡
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:3365-3385`  
**Code:**
```javascript
items.forEach(({ node, idx }) => {
    const btn = document.createElement('button');
    // ... setup
    listElement.appendChild(btn);
});
```

**Problem:** Creates DOM nodes one-by-one in loop. Should use DocumentFragment.

**Fix:**
```javascript
const fragment = document.createDocumentFragment();
items.forEach(({ node, idx }) => {
    const btn = document.createElement('button');
    // ... setup
    fragment.appendChild(btn);
});
listElement.appendChild(fragment);
```

---

### 9. **Missing Debouncing on Search Input** 🟡
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js`  
**Problem:** Search input (`#node-search-input`) has no debouncing. Filters on every keystroke.

**Fix:** Add 300ms debounce:
```javascript
let searchTimeout;
input.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => filterNodes(e.target.value), 300);
});
```

---

### 10. **No Input Sanitization for Node Names** 🟡
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:2947`  
**Code:**
```javascript
function escapeHtml(s) {
    if (s == null) return '';
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
}
```

**Problem:** While `escapeHtml` exists, it's not consistently used. Some paths bypass it.

**Fix:** Audit all `innerHTML` assignments, ensure `escapeHtml` is called.

---

### 11. **Memory Leak Risk in Event Listeners** 🟡
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:3176-3178`  
**Code:**
```javascript
memoryLinkEscapeHandler = function(e) { if (e.key === 'Escape') closeMemoryLinkSidebar(); };
document.addEventListener('keydown', memoryLinkEscapeHandler);
```

**Problem:** Event listener added but not always removed on cleanup.

**Fix:** Ensure `removeEventListener` is called in all code paths.

---

### 12. **Magic Numbers in Animation/Zoom Code** 🟡
**Location:** Multiple locations in `neural-graph.js`  
**Examples:**
- `zoomSpeed = 0.015` (line 2820)
- `MINIMAP_WIDTH = 260` (line 2709)
- `MOBILE_BREAKPOINT = 768` (line 3139)

**Problem:** Hardcoded values scattered throughout. Should be config constants.

**Fix:** Centralize in config object:
```javascript
const CONFIG = {
  ZOOM_SPEED: 0.015,
  MINIMAP_WIDTH: 260,
  MOBILE_BREAKPOINT: 768,
  // ...
};
```

---

### 13. **Missing Null Checks on DOM Queries** 🟡
**Location:** Multiple locations  
**Example:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js:2851`  
**Code:**
```javascript
const drawerScrim = document.getElementById('drawerScrim');
if (!drawerScrim) return;
```

**Problem:** Some paths don't check for null before accessing properties.

**Fix:** Add defensive checks or use optional chaining:
```javascript
drawerScrim?.addEventListener(...);
```

---

### 14. **Unused Code / Dead Code** 🟡
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/index.html`  
**Code:**
```html
<!-- Deployment verification: 2026-02-22 15:31:58 UTC -->
<div id="memory-version" style="position: fixed; bottom: 10px; left: 10px; font-size: 8px; color: #00ff00; opacity: 0.3; pointer-events: none; z-index: 1;">
    v:2026-02-22-15:31:58
</div>
```

**Problem:** Hardcoded version from February, not updated. Misleading.

**Fix:** Remove or auto-populate from git commit hash.

---

## Low Severity Issues

### 15. **Inconsistent Naming Conventions** ⚪
**Problem:** Mixed camelCase (`loadGraphData`), kebab-case (`set-archive-creation-dates.js`), and snake_case (internal vars).

**Fix:** Standardize on camelCase for JS functions, kebab-case for filenames.

---

### 16. **Missing JSDoc Comments** ⚪
**Problem:** Many functions lack documentation. Only some have JSDoc.

**Fix:** Add JSDoc to all exported functions:
```javascript
/**
 * Load graph data from nodes.json + synapses.json
 * @returns {Promise<{nodes: Array, edges: Array}>}
 */
async function loadGraphData() { ... }
```

---

### 17. **No TypeScript Migration** ⚪
**Problem:** Pure JavaScript, no type safety. Large codebase (4500+ lines) prone to refactoring errors.

**Recommendation:** Consider gradual TypeScript migration.

---

### 18. **No Unit Tests** ⚪
**Problem:** Zero test coverage. Manual testing only.

**Recommendation:** Add Jest/Vitest tests for:
- Path normalization utilities
- Node filtering logic
- Graph data loading

---

### 19. **Inline Styles in HTML** ⚪
**Location:** `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/index.html`  
**Problem:** Inline styles scattered in HTML. Should be in CSS file.

**Fix:** Move to `neural-graph.css`.

---

### 20. **Accessibility Issues** ⚪
**Problem:** Some buttons lack `aria-label`, color contrast may fail WCAG.

**Fix:** Audit with axe-core, add ARIA attributes.

---

### 21. **No Rate Limiting on File Reads** ⚪
**Location:** `/skills/neurograph-sync/scripts/verify-archive-learnings-nodes.js`  
**Problem:** Walks entire directory trees without limiting depth.

**Fix:** Add max depth parameter.

---

### 22. **No Graceful Degradation for Missing Files** ⚪
**Problem:** Scripts exit(1) on missing files. Should warn and continue.

**Fix:** Log warning, skip missing files, continue processing.

---

### 23. **Timezone Assumptions** ⚪
**Location:** Multiple scripts assume local timezone  
**Problem:** `new Date().toISOString().split('T')[0]` uses UTC, but file dates may be local.

**Fix:** Use consistent timezone handling (prefer UTC for storage).

---

### 24. **No Progress Indicators for Long Operations** ⚪
**Location:** `/skills/neurograph-sync/scripts/set-archive-creation-dates.js`  
**Problem:** Walking large directories with no progress output.

**Fix:** Add progress logging every N files.

---

### 25. **No Configuration Validation** ⚪
**Problem:** Scripts assume `NEUROGRAPH_PATH`, `JARVIS_HOME` env vars are set.

**Fix:** Validate at startup, provide helpful error messages.

---

### 26. **No Cleanup of Temporary Files** ⚪
**Location:** `/skills/neurograph-sync/scripts/*.js`  
**Problem:** No temp file cleanup if script fails mid-execution.

**Fix:** Use atomic writes (write to temp, then rename).

---

## Recommendations

### Immediate Actions (This Sprint)
1. **Remove `eval()` usage** - Replace with `JSON.parse` or remove feature
2. **Add path validation** - Prevent path traversal attacks
3. **Implement error boundaries** - Graceful failure handling

### Short-term (Next 2-4 Weeks)
4. **Extract shared utilities** - DRY path normalization, logging
5. **Add input sanitization** - Consistent `escapeHtml` usage
6. **Performance optimization** - DocumentFragment, debouncing

### Medium-term (Next Quarter)
7. **TypeScript migration** - Gradual type safety
8. **Unit test suite** - Critical path coverage
9. **Accessibility audit** - WCAG compliance

---

## Files Audited

### Frontend
- `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/index.html`
- `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.js` (4544 lines)
- `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph-drawer.js`
- `/skills/jarvis-ui/sci-fi/apps/JARVIS/neuro-graph/shared/neural-graph.css`

### Backend Scripts
- `/skills/neurograph-search/scripts/search.js`
- `/skills/neurograph-separate/scripts/extract-personal.js`
- `/skills/neurograph-sync/scripts/sync-graph.js`
- `/skills/neurograph-sync/scripts/set-archive-creation-dates.js`
- `/skills/neurograph-sync/scripts/verify-archive-learnings-nodes.js`
- `/skills/neurograph-sync/scripts/link-learnings-to-files.js`
- `/skills/neurograph-sync/scripts/verify-file-dates.js`
- `/skills/neurograph-link/SKILL.md`

---

## Audit Methodology

1. **Static Analysis:** Grep for TODOs, console.logs, eval, innerHTML
2. **Manual Review:** Read critical files line-by-line
3. **Pattern Matching:** Identify duplicated code, anti-patterns
4. **Security Scan:** Search for XSS, RCE, path traversal vectors
5. **Architecture Review:** Check for circular dependencies, missing imports

---

**Report Generated:** 2026-03-24 22:33 GMT+7  
**Next Audit:** Recommend quarterly review after fixes applied
