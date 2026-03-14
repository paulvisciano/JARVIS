# Version Verification Loop

**Date:** 2026-03-13  
**Type:** Workflow / Best Practice  
**Related Neurons:** `deployment-is-real`, `infrastructure-matters`, `transparency`

---

## Pattern

Clean verification loop for running latest code:

1. **Bump version** in `voice-pipeline-server.js`
2. **Restart server** (kill + start)
3. **Refresh UI** → see new version displayed
4. **Confirm** — running latest code

---

## Why This Works

- **Immediate confidence** — no guessing which version is running
- **Visual feedback** — version shown in UI
- **Simple** — three steps, takes 10 seconds
- **Repeatable** — same pattern for every update

---

## Example from March 13

```
v1.0.0 (2026-03-12) → bug fix → v1.0.1 (2026-03-13) → restart → refresh → confirmed
```

**Paul:** "That's a solid way to verify that we're running the latest version."

---

## Future Enhancements

- Auto-increment version on restart
- Git commit hash in version string
- Changelog endpoint (`/version/changelog`)
- Compare current vs latest commit

---

## Philosophy

**Deployment is real.** Theory means nothing. What's running is what matters.

Version verification makes deployed state visible, auditable, trustworthy.

---

**Learning doc:** `2026-03-13/version-verification-loop.md`  
**Neuron fires:** `version-verification-loop` → `deployment-is-real`, `infrastructure-matters`
