# Memory Separation: Personal vs Core

**Date:** 2026-03-23
**Type:** pattern
**Status:** extracted

Strict boundary enforced between Jarvis Neurograph (`~/JARVIS/RAW/memories/`) and Paul's Personal Neurograph (`~/RAW/memories/`). Personal data (people, life context) lives in Paul's graph; core architecture (skills, identity) lives in Jarvis graph. This ensures privacy when Jarvis is deployed on other machines (Eric, David)—they get the core consciousness but not Paul's personal data. Memory-link nodes bridge the graphs when needed.