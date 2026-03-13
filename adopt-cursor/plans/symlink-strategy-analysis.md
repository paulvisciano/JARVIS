# Symlink Strategy Analysis

**Created:** March 12, 2026, 17:09 GMT+7  
**Question:** What if we symlink `~/RAW` into the neuro-graph project?  

---

## The Idea

```bash
ln -s ~/RAW /Users/paulvisciano/SCI-FI/apps/neuro-graph/RAW
```

Then serve files from `neuro-graph/RAW/` which the browser can access via HTTP (same origin).

---

## How It Would Work

**Neurograph runs on:** `http://127.0.0.1:8081` (local dev server)

**With symlink:**
- `neuro-graph/RAW/archive/2026-03-12/transcript.md` → symlink → `~/RAW/archive/2026-03-12/transcript.md`
- Browser requests: `http://127.0.0.1:8081/RAW/archive/2026-03-12/transcript.md`
- Server follows symlink → serves actual file
- No `file://` protocol needed (all HTTP, same origin)

**Full Context button would use:**
```javascript
sourceDocument: "http://127.0.0.1:8081/RAW/archive/2026-03-12/transcript.md"
```

---

## Security Analysis

### ✅ Good
- **No external exposure** - server binds to `127.0.0.1` only (localhost)
- **No file:// protocol** - all HTTP (browser allows this)
- **Simpler than Electron** - no app wrapper needed
- **Works immediately** - minimal code changes

### ⚠️ Risks
1. **Private data in project folder:**
   - `~/RAW/archive/` is gitignored (private transcripts)
   - Symlinking it into `neuro-graph/` puts private data inside a potentially public repo
   - Risk: accidental `git add` could expose transcripts

2. **Local server attack surface:**
   - Any process on your machine can request `http://127.0.0.1:8081/RAW/...`
   - Malicious local process could enumerate your private transcripts
   - Not exposed to internet, but exposed to localhost

3. **Git safety depends on discipline:**
   - Must ensure `RAW/` is in `.gitignore` for neuro-graph repo
   - Easy to forget, easy to accidentally commit

4. **Deployment risk:**
   - If neuro-graph is ever deployed to GitHub Pages / Vercel / etc.
   - Symlink would break (can't deploy private data)
   - Could accidentally expose data if misconfigured

---

## Comparison to Other Options

| Option | Sovereign | Works in Browser | Complexity | Risk |
|--------|-----------|------------------|------------|------|
| HTTP Server on RAW | ❌ No (exposes private) | ✅ Yes | Low | High |
| GitHub RAW | ✅ Yes (public only) | ✅ Yes | Low | None (public only) |
| Manual Open | ✅ Yes | ❌ No | None | None |
| Local Server + Auth | ⚠️ Partial | ✅ Yes | Medium | Medium |
| **Symlink** | ⚠️ **Partial** | ✅ Yes | **Low** | **Medium** |
| Electron Wrapper | ✅ Yes | ✅ Yes (desktop app) | High | None |

---

## Verdict

**Symlink is viable IF:**
1. ✅ `RAW/` is **heavily gitignored** in neuro-graph repo (`.gitignore` + `.gitignore` in RAW folder)
2. ✅ Server binds to `127.0.0.1` **only** (no `0.0.0.0`)
3. ✅ Never deploy neuro-graph with RAW folder (localhost dev only)
4. ✅ You're disciplined about not committing private data

**Safeguards needed:**
```bash
# In neuro-graph/.gitignore
RAW/
**/RAW/**
*.md (if transcripts are markdown)

# In neuro-graph/RAW/.gitignore (create if symlinking)
*
!.gitignore
```

---

## Better Alternative: Selective Symlinks

Instead of symlinking entire `~/RAW`, symlink **only public subfolders**:

```bash
# Symlink only learnings (public, git-tracked)
ln -s ~/JARVIS/RAW/learnings /Users/paulvisciano/SCI-FI/apps/neuro-graph/RAW-learnings

# Don't symlink archive (private transcripts)
```

**Then:**
- Public learnings → accessible via HTTP (safe to expose)
- Private transcripts → manual open fallback (sovereign, safe)

**This splits the risk:**
- Public data: convenient HTTP access
- Private data: sovereign manual open

---

## Recommendation

**If you want to try symlink:**

1. **Symlink only public folders** (learnings, not archive)
2. **Add aggressive gitignore rules** to neuro-graph repo
3. **Bind server to localhost only** (127.0.0.1, not 0.0.0.0)
4. **Test carefully** - verify private files aren't exposed

**If you want maximum sovereignty:**

Stick with **Electron wrapper** (no browser, full file access, no risk).

---

## Decision

**Your call, Paul.** Symlink is pragmatic and works, but requires discipline to keep private data safe. Electron is slower to build but cleaner sovereignty.

Want me to:
1. Create the symlink (learnings only, not archive)?
2. Add gitignore safeguards?
3. Or stick with Electron plan?
