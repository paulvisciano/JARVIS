#!/usr/bin/env python3
"""
Transform local file:// paths to GitHub URLs for published learnings.

Usage:
  python3 publish-learnings.py [--dry-run]

This script:
1. Reads nodes.json
2. Replaces local paths with GitHub URLs for published learning docs
3. Outputs to nodes.published.json (or overwrites with --commit)

Local path format:
  file:///Users/paulvisciano/JARVIS/RAW/learnings/2026-03-06/doc.md

Published URL format:
  https://raw.githubusercontent.com/paulvisciano/JARVIS/main/RAW/learnings/2026-03-06/doc.md
"""

import json
import re
import sys
import argparse

LOCAL_BASE = "file:///Users/paulvisciano/JARVIS/RAW/learnings/"
GITHUB_BASE = "https://raw.githubusercontent.com/paulvisciano/JARVIS/main/RAW/learnings/"

def transform_path(local_path):
    """Convert local file:// path to GitHub URL."""
    if not local_path.startswith("file:///Users/paulvisciano/JARVIS/RAW/learnings/"):
        return local_path  # Not a local learning path, return as-is
    return local_path.replace(LOCAL_BASE, GITHUB_BASE)

def main():
    parser = argparse.ArgumentParser(description='Transform local paths to GitHub URLs')
    parser.add_argument('--dry-run', action='store_true', help='Show changes without saving')
    parser.add_argument('--output', type=str, help='Output file (default: nodes.published.json)')
    args = parser.parse_args()

    with open('RAW/memories/nodes.json', 'r') as f:
        nodes = json.load(f)

    transformed = 0
    for node in nodes:
        attrs = node.get('attributes', {})
        sd = attrs.get('sourceDocument', '')
        # Handle both string and list types
        if isinstance(sd, str) and sd.startswith(LOCAL_BASE):
            new_sd = transform_path(sd)
            node['attributes']['sourceDocument'] = new_sd
            print(f"  {node['id']}: {sd.split('/')[-1]} → {new_sd.split('/')[-1]}")
            transformed += 1
        elif isinstance(sd, list):
            # Handle list of source documents
            new_list = []
            changed = False
            for item in sd:
                if isinstance(item, str) and item.startswith(LOCAL_BASE):
                    new_list.append(transform_path(item))
                    changed = True
                else:
                    new_list.append(item)
            if changed:
                node['attributes']['sourceDocument'] = new_list
                print(f"  {node['id']}: list with {len(new_list)} items (transformed)")
                transformed += 1

    print(f"\nTransformed {transformed} nodes")

    if args.dry_run:
        print("\n[DRY RUN] No files saved")
        return

    output_file = args.output or 'RAW/memories/nodes.published.json'
    with open(output_file, 'w') as f:
        json.dump(nodes, f, indent=2)

    print(f"Saved to {output_file}")

if __name__ == '__main__':
    main()
