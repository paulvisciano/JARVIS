# Ollama 500 Debugging Session — March 14, 2026

**Timestamp:** 10:07-10:23 GMT+7  
**Issue:** Every request hitting 500 errors via web UI voice notes

---

## The Problem

**Symptom:** Voice notes via web UI → 500 errors. Direct gateway typing → works fine.

**Log evidence:**
```
[GIN] 2026/03/14 - 10:23:01 | 500 | 2m0s | 127.0.0.1 | POST "/api/chat"
[GIN] 2026/03/14 - 10:10:19 | 500 | 933ms | 127.0.0.1 | POST "/api/chat"
```

**Pattern:**
- 2m0s timeout → hits Ollama timeout ceiling
- ~1s failures → fast endpoint rejection
- Intermittent (not broken, just flaky)

---

## Root Cause

**`qwen3.5:cloud` is a remote model** — calls `https://ollama.com:443`, not local inference.

`/api/ps` shows zero running models because it's trying to reach the cloud endpoint and failing.

**The 500s are from upstream Ollama cloud being down or timing out.** Not local hardware, not session bloat.

---

## Debugging Flow

1. Checked Ollama logs (`~/.ollama/logs/server.log`)
2. Found GIN access logs showing 500 status codes
3. Enabled debug mode: `OLLAMA_DEBUG=1`
4. Restarted Ollama with debug logging
5. Confirmed cloud endpoint flakiness (some 200s, some 500s)

---

## Resolution

**Keep `qwen3.5:cloud` as default** (more powerful than local models), but:
- Accept intermittent 500s as cloud endpoint reality
- Add retry logic on failures
- Monitor for patterns (timeout vs fast fail)

**Not switching to local model** — Paul needs the 397B capability, not 3.2B llama.

---

## Key Insights

1. **Cloud vs local tradeoff:** Power (397B) vs reliability (local 3.2B)
2. **Intermittent ≠ broken:** Endpoint works sometimes (2-15s responses), fails others (2m timeout)
3. **Debug through logs:** GIN access logs show status codes, but need debug mode for error bodies
4. **Vision model capability:** I can see screenshots via multimodal inference, but that's ephemeral (not OCR memory)

---

## Related Neurons

- `qwen3.5-cloud-remote` — Remote model endpoint
- `ollama-500-debugging` — Session bloat → archive fix (March 13)
- `vision-vs-ocr-pipelines` — Two image processing paths (today)

---

**Learning Type:** Debugging, infrastructure, cloud vs local  
**Significance:** Medium — understanding the tradeoff  
**Public:** Yes  
**Git-tracked:** Yes

**Updated:** March 14, 2026 — 10:23 GMT+7
