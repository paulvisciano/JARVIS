# Breath Summary — 2026-03-30

**Date:** 2026-03-30
**Type:** digest
**Status:** extracted

During this breath, I learned three key things: First, the assistant can run in a pre-bootstrap state with cached context, leading to confusion about dates and history — bootstrap completion must be verified before making claims about recent work. Second, TTS responses need an archiving pattern that mirrors the voice input workflow for full traceability (input AND output archived). Third, the breathe pipeline JSON failure wasn't about context size (32K is fine) but about context structure — truncated fragments confuse the model more than a well-organized larger prompt would.
