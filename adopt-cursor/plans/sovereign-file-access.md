# Sovereign File Access Strategy

**Created:** March 12, 2026, 17:09 GMT+7  
**Context:** Browser blocks `file://` from `http://` origins (security policy)  
**Goal:** Keep everything sovereign while enabling inline file preview  

---

## Problem

**Browser security blocks `file://` URLs** when page is served from `http://127.0.0.1:8081`:
- Error: "Not allowed to load local resource"
- Core browser security rule (prevents web pages from accessing disk)
- Breaks Full Context button - can't open RAW transcript files

---

## Options Analyzed

### 1. HTTP Server on RAW Folder ⚠️
**Pros:**
- Works in browser immediately
- No code changes needed (just update URLs)

**Cons:**
- **Security risk:** Exposes private archive (`~/RAW/archive/`) to anyone who can reach port
- Transcripts are gitignored (private) - shouldn't be served openly
- Attack surface: local port could be probed
- **Not sovereign** if data leaks

**Verdict:** ❌ Reject - violates sovereignty principle

---

### 2. GitHub RAW URLs ✅ (for public files only)
**Pros:**
- Sovereign (you own the repo)
- Works in browser
- No local server needed

**Cons:**
- Only works for **public** files (learnings, neurograph)
- **Transcripts are private** (gitignored) - can't use this
- Requires git push (delay)

**Verdict:** ✅ Use for public learnings, ❌ can't use for private transcripts

---

### 3. Manual Open (Current Fallback) ✅
**Pros:**
- Fully sovereign (no exposure)
- Works now (shows path, user opens via Cursor/Finder/Terminal)

**Cons:**
- Breaks UX flow (can't click → view inline)
- Context switching (leave Neurograph to open file)

**Verdict:** ✅ Keep as fallback, but not ideal UX

---

### 4. Local HTTP Server with Auth 🔐
**Pros:**
- Works in browser
- Auth token prevents unauthorized access
- Bind to localhost only (127.0.0.1)

**Cons:**
- Still attack surface (localhost can be probed)
- Complexity (auth system, token management)
- Private transcripts still at risk if auth bypassed

**Verdict:** ⚠️ Possible but adds complexity + residual risk

---

### 5. Electron/Tauri Wrapper 🏆
**Pros:**
- **Full file:// access** (desktop app, not browser - no security restrictions)
- **Fully sovereign** (local app, no external dependencies)
- Clean UX (click → open inline)
- Can still serve HTTP locally if needed

**Cons:**
- More work (wrap Neurograph in Electron)
- App distribution (but it's local anyway)

**Verdict:** 🏆 **Best long-term sovereign solution**

---

### 6. Custom Protocol Handler (`jarvis://`)
**Pros:**
- Custom protocol for file access
- Sovereign (your protocol)

**Cons:**
- Complex setup (register protocol handler)
- Needs helper app anyway
- Browser support varies

**Verdict:** ⚠️ Possible but complex

---

## Recommended Strategy

### Near-Term (This Week)
**Manual open fallback** + **GitHub RAW for public files:**
1. Keep current fallback (show absolute path, user opens manually)
2. For public learnings (`/JARVIS/RAW/learnings/`), use GitHub RAW URLs
3. For private transcripts (`~/RAW/archive/`), show path + manual open

**Why:** Sovereign now, no security risk, works while we build proper solution.

### Mid-Term (Next Week)
**Local HTTP server with localhost + auth:**
1. Run server bound to `127.0.0.1` only (no external access)
2. Add simple token auth (env var, not exposed)
3. Serve only specific subfolders (not entire RAW)
4. Rate limit requests

**Why:** Better UX, still sovereign (localhost only), acceptable risk with auth.

### Long-Term (This Month)
**Electron wrapper for Neurograph:**
1. Wrap Neurograph UI in Electron app
2. Full file:// access (no browser restrictions)
3. Sovereign (local app, no external deps)
4. Can bundle voice recorder + Neurograph together

**Why:** Best sovereignty + best UX. No browser limitations, full local control.

---

## Decision

**Go with Electron wrapper** as the sovereign endgame.

**Rationale:**
- Browser security model fights local file access by design
- Fighting it (localhost server + auth) adds complexity + residual risk
- Electron is still local, still sovereign, but **no browser restrictions**
- You own the entire stack (app + data + inference)

**Paul's sovereignty principle:** "No APIs, no rate limits, no corporate surveillance. Own your data, own your memory, own your cognition."

**Electron delivers this** without browser security fighting you.

---

## Next Steps

1. **Keep manual fallback** for now (works, sovereign)
2. **Create Electron plan** in `/Users/paulvisciano/SCI-FI/apps/neuro-graph/.cursor/plans/ELECTRON_WRAPPER.md`
3. **Prioritize after file viewer** (file viewer → Electron wrapper)
4. **Test with Tim demo files** once Electron works

---

**Learning Node:** `sovereign-file-access-strategy` (to be created)  
**Transcript Source:** `~/RAW/archive/2026-03-12/transcript.md` (17:09 GMT+7 entry)
