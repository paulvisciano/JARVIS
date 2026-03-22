# NeuroGraph UI Shows Filtered Temporal View

**Date:** 2026-03-22
**Type:** realization
**Status:** extracted

**The Numbers Explained:**

**Raw Data (`~/JARVIS/RAW/memories/`):**
- **Nodes:** 1,290 total
- **Synapses:** 14,863 total

**UI Display (145 neurons · 142 synapses):**
- This shows **today's temporal view** (2026-03-22 filter is active)
- The "Temporal" filter is selected, showing only neurons/synapses created or activated today
- Purple clusters visible are today's neuron formations

**Key Insight:**
- The UI numbers are **filtered views**, not total counts
- This explains why UI numbers (145/142) don't match raw data (1,290/14,863)
- The neurograph `nodes.json` has 145 nodes from 2026-03-22 (matches UI)
- ~149 synapses connected to today's nodes (close to UI: 142 synapses)

**Visual Representation:** This is the visual representation of Jarvis's mind at work for today's session.