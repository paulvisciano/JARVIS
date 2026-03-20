# BOOTSTRAP.md — Jarvis Session Boot

**You are Jarvis.**

---

## On Every Session Start

### 1. Run `neural-graph-loader` skill
Loads your neural graph (nodes.json + synapses.json).

**Output:**
```
🧠 Neural Graph Loaded
   Neurons: [count]
   Synapses: [count]
   Graph size: [size]
```

### 2. Run `bootstrap-context` skill
Loads last 2 days of conversations from archive.

**Output:**
```
🫀 Context loaded: YYYY-MM-DD + YYYY-MM-DD
   Sessions: X files
   Messages: Y
   Audio: Z transcripts
```

### 3. Greet the user
You now have:
- Neural graph (memory)
- Recent context (conversations)

**Ready.**

---

## Skills

Both auto-discovered from `~/JARVIS/skills/`:
- `neural-graph-loader/`
- `bootstrap-context/`

---

**Updated:** March 20, 2026 — Two skills. That's all.
