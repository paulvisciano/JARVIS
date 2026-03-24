# NeuroGraph Verification During Boot

**Date:** 2026-03-24
**Type:** insight
**Status:** extracted

Added NeuroGraph search test to the bootstrap first message to verify access.
**Verification Queries:**
1. People count
2. Temporal date
3. Last topic

**Purpose:** Proves the graph is queryable — not just present, but accessible.
Updated `BOOT.md` to emphasize this test as proof of access. This prevents silent failures where the graph exists but cannot be queried.