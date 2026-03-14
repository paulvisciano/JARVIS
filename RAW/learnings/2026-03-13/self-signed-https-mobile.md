# Self-Signed HTTPS for Mobile Recording

**Date:** 2026-03-13  
**Type:** Security / Infrastructure  
**Related Neurons:** `privacy-first-development`, `three-layer-security-model`, `voice-first-ui-design`

---

## Problem

Mobile browsers require HTTPS for microphone access (`getUserMedia`).

**HTTP works fine on desktop** — but iOS Safari / Chrome block mic access over HTTP.

---

## Options Considered

1. **ngrok tunnel**
   - ✅ Instant HTTPS
   - ❌ Public exposure (didn't want this)
   - ❌ URL changes each restart

2. **Self-signed certificate**
   - ✅ Keeps everything local + private
   - ✅ No public exposure
   - ✅ Permanent solution
   - ⚠️ Need to trust cert on devices

3. **Accept limitation**
   - Record from Mac only (HTTP works)
   - ❌ Limits mobile workflow

---

## Decision: Self-Signed HTTPS

**Setup:**
1. Generate self-signed SSL cert (localhost)
2. Configure server for HTTPS (use cert + key)
3. Restart server (HTTPS mode)
4. Trust cert on Mac + phone (accept in browser)

---

## Why This Matters

- **Sovereign** — no third-party certs, no Let's Encrypt dependency
- **Private** — traffic encrypted, stays local
- **Mobile-ready** — mic access works on phone
- **Same WiFi** — phone + Mac on hotspot, no internet needed

---

## Tradeoffs

- Browser warning on first visit (accept manually)
- Cert expires after X days (regenerate annually)
- Phone needs to trust cert (one-time setup)

**Worth it** for sovereign mobile recording.

---

**Learning doc:** `2026-03-13/self-signed-https-mobile.md`  
**Neuron fires:** `self-signed-https-mobile` → `privacy-first-development`, `three-layer-security-model`
