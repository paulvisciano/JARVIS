# Graph Scale Reality

**Date:** 2026-03-23
**Type:** insight
**Status:** extracted

Combined neurograph size is ~12.6 MB (3.15M tokens), far exceeding context window limits (200k). `neurograph-load` skill deprecated/removed because loading full graphs is impossible. `neurograph-search` used instead for disk-based queries without context bloat. Reality check: we traverse via memory-link nodes, not full loads. This ensures scalability as the graph grows over years.