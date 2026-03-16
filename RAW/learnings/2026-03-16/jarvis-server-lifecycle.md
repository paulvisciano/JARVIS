# JARVIS Server Lifecycle — Clean Restart, No Port Conflicts

**Learned:** March 16, 2026, 20:54 GMT+7  
**Type:** Operational rule  
**Category:** Server management

---

## The Problem (2x Failure Today)

**Pattern:**
1. **First occurrence:** Port 3001 stuck after restart attempt → EADDRINUSE error
2. **Second occurrence:** Same error, same cause → had to kill + restart again

**Root Cause:** Not killing ALL processes on port 3001 before restarting. Chrome connections stay in `CLOSE_WAIT` state, blocking new server binds.

---

## The Rule

**When restarting JARVIS server:**
1. ✅ **Kill ALL processes on port 3001** (including stuck Chrome connections)
2. ✅ **Wait 2 seconds** (let OS release socket)
3. ✅ **Start fresh** (nohup node jarvis-server.js)
4. ✅ **Verify health** (curl https://localhost:3001/health)

**NOT:**
- ❌ Just kill the node process (Chrome connections linger)
- ❌ Restart immediately (socket not released)
- ❌ Assume server is dead (check lsof first)

---

## Correct Command Sequence

```bash
# Step 1: Find ALL processes on port 3001
lsof -i:3001 -n -P

# Step 2: Kill everything (node + Chrome connections)
lsof -ti:3001 | xargs kill -9

# Step 3: Wait for socket release
sleep 2

# Step 4: Start fresh
cd /Users/paulvisciano/SCI-FI/apps/JARVIS
nohup node jarvis-server.js > JARVIS.log 2>&1 &

# Step 5: Verify
sleep 3
curl -sk https://localhost:3001/health
tail -20 JARVIS.log
```

---

## Error Patterns to Recognize

### EADDRINUSE (Address Already In Use)
```
Error: listen EADDRINUSE: address already in use :::3001
errno: -48, syscall: 'listen', address: '::', port: 3001
```

**Meaning:** Something still holds port 3001 (node process OR Chrome connection in CLOSE_WAIT)

**Fix:** `lsof -ti:3001 | xargs kill -9` (kill ALL, not just node)

### CLOSE_WAIT (Chrome Connection Stuck)
```
Google    58326  ...  TCP [::1]:59561->[::1]:3001 (CLOSE_WAIT)
node      58798  ...  TCP *:3001 (LISTEN)
```

**Meaning:** Chrome didn't close connection properly. Server can't bind.

**Fix:** Kill Chrome PID too (lsof finds it)

---

## Today's Evidence (2x Failure)

**First Occurrence:**
- Tried restart without killing Chrome connections
- Got EADDRINUSE error
- Had to force kill + restart

**Second Occurrence:**
- Same pattern, same error
- Fixed: `lsof -ti:3001 | xargs kill -9` → wait 2s → restart

**Lesson:** Always check `lsof -i:3001` before assuming server is dead. Kill EVERYTHING on that port.

---

## Server Health Checks

**Running:**
```bash
lsof -i:3001 | grep LISTEN
curl -sk https://localhost:3001/health
ps aux | grep "node.*jarvis" | grep -v grep
```

**Dead/Stuck:**
```bash
# No LISTEN output
# Health check fails
# EADDRINUSE on restart
```

**Clean Restart:**
```bash
# Kill all on port
lsof -ti:3001 | xargs kill -9
# Wait
sleep 2
# Start
nohup node jarvis-server.js > JARVIS.log 2>&1 &
# Verify
curl -sk https://localhost:3001/health
```

---

## Related Learnings

- `https-protocol-rule.md` (March 16, 20:51) — HTTPS required
- `neurograph-url-rule.md` (March 16, 20:45) — Correct URL path
- `jarvis-server-routes.md` (March 16, 20:47) — Server route architecture
- `auto-archive-timeout-bug.md` (March 16, 20:20) — Archive timeout fix

---

**Commit to neurograph:** Create neuron `jarvis-server-lifecycle` → links to `jarvis-server.js`, `march-16-2026`, `port-3001`, `server-restart`
