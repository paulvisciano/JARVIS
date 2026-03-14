#!/usr/bin/env python3
"""
JARVIS Archive Node Generator

Scans archive folders for a given date and creates neurograph nodes + synapses.
Matches the March 13 schema pattern exactly.

Usage:
    python3 generate-archive-nodes.py 2026-03-14
    python3 generate-archive-nodes.py --check 2026-03-14  # integrity check only
    python3 generate-archive-nodes.py --retroactive       # scan all dates

Features:
- Reads all audio (.wav) and image (.png) files from archive
- Creates nodes with proper schema (category, type, moments, attributes)
- Extracts timestamps from filenames (3 formats supported)
- Links all nodes to temporal anchor
- Runs integrity check (files on disk = nodes in graph)
- Outputs summary for validation before commit
"""

import json
import os
import sys
import re
from datetime import datetime
from pathlib import Path

# Configuration
HOME = os.path.expanduser('~')
ARCHIVE_BASE = os.path.join(HOME, 'RAW', 'archive')
NEUROGRAPH_DIR = os.path.join(HOME, 'JARVIS', 'RAW', 'memories')
NODES_FILE = os.path.join(NEUROGRAPH_DIR, 'nodes.json')
SYNAPSES_FILE = os.path.join(NEUROGRAPH_DIR, 'synapses.json')


def extract_time_from_filename(filename):
    """Extract time from filename in various formats."""
    
    # Format 1: recording-1773461516328 (unix timestamp milliseconds)
    match = re.search(r'recording-(\d{10,})', filename)
    if match:
        ts = match.group(1)[:10]
        try:
            dt = datetime.fromtimestamp(int(ts))
            return dt.strftime('%H:%M'), ts
        except:
            pass
    
    # Format 2: convo-jarvis-2026-03-14-092421 (HHMMSS at end)
    match = re.search(r'convo-jarvis-\d{4}-\d{2}-\d{2}-(\d{6})', filename)
    if match:
        time_code = match.group(1)
        hour = int(time_code[:2])
        minute = int(time_code[2:4])
        time_str = f"{hour:02d}:{minute:02d}"
        return time_str, time_code
    
    # Format 3: Screenshot 2026-03-14 at 9.00.41 AM
    match = re.search(r'at (\d{1,2})\.(\d{2})\.(\d{2})\s*(AM|PM)', filename)
    if match:
        hour = int(match.group(1))
        minute = match.group(2)
        ampm = match.group(4)
        if ampm == 'PM' and hour != 12:
            hour += 12
        elif ampm == 'AM' and hour == 12:
            hour = 0
        time_str = f"{hour:02d}:{minute}"
        return time_str, 'screenshot'
    
    return 'unknown', 'unknown'


def read_file_content(filepath, max_chars=200):
    """Read file content (transcript or OCR text)."""
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read().strip()[:max_chars]
    except:
        return "Content unavailable"


def create_audio_node(filename, transcript, date):
    """Create an audio archive node matching March 13 schema."""
    time_str, time_code = extract_time_from_filename(filename)
    
    # Use full filename as label (user preference)
    # e.g., "convo-jarvis-2026-03-14-111634" or "recording-1773336749451"
    label = filename
    
    return {
        "id": filename,
        "label": label,
        "category": "archive",
        "type": "audio",
        "frequency": 1,
        "moments": [
            {
                "date": date,
                "type": "audio-archived",
                "description": transcript[:100] if transcript else "Voice conversation"
            },
            "file"
        ],
        "attributes": {
            "created": date,
            "role": "life archive",
            "description": "Audio recording — voice transcript",
            "path": f"/RAW/archive/{date}/audio/{filename}.wav",
            "fileType": "audio",
            "transcript": transcript
        }
    }


def create_screenshot_node(filename, ocr_text, date):
    """Create a screenshot archive node matching March 13 schema."""
    time_str, time_code = extract_time_from_filename(filename)
    
    # Use full filename as label (consistent with audio nodes)
    label = filename
    
    return {
        "id": filename,
        "label": label,
        "category": "archive",
        "type": "screenshot",
        "frequency": 1,
        "moments": [
            {
                "date": date,
                "type": "screenshot-archived",
                "description": ocr_text[:100] if ocr_text else "Desktop screenshot"
            },
            "file"
        ],
        "attributes": {
            "created": date,
            "role": "life archive",
            "description": "Screenshot — OCR extracted text",
            "path": f"/RAW/archive/{date}/images/{filename}.png",
            "fileType": "image",
            "ocrText": ocr_text
        }
    }


def create_learning_node(filename, content, date):
    """Create a learning node matching March 13 schema."""
    # Extract title from first line of markdown file
    title = filename.replace('-', ' ').replace('_', ' ').title()
    
    # Try to determine type from filename or content
    if 'breakthrough' in filename.lower() or 'confirmed' in filename.lower():
        node_type = 'breakthrough'
    elif 'fix' in filename.lower() or 'debug' in filename.lower():
        node_type = 'debugging'
    elif 'loop' in filename.lower() or 'workflow' in filename.lower():
        node_type = 'milestone'
    elif 'architecture' in filename.lower() or 'pattern' in filename.lower():
        node_type = 'architecture'
    else:
        node_type = 'learning'
    
    return {
        "id": filename,
        "label": title,
        "category": "learning",
        "type": node_type,
        "frequency": 1,
        "moments": [
            {
                "date": date,
                "type": "learning-extracted",
                "description": content[:100] if content else "Learning document"
            }
        ],
        "attributes": {
            "created": date,
            "role": "knowledge extraction",
            "description": f"Learning document: {title}",
            "color": "#f59e0b",
            "sourceDocument": f"JARVIS/RAW/learnings/{date}/{filename}.md"
        }
    }


def scan_archive_date(date):
    """Scan archive folder for a given date and return file info."""
    audio_dir = os.path.join(ARCHIVE_BASE, date, 'audio')
    image_dir = os.path.join(ARCHIVE_BASE, date, 'images')
    learnings_dir = os.path.join(ARCHIVE_BASE, date, 'learnings')
    
    files = []
    
    # Scan audio files
    if os.path.exists(audio_dir):
        for f in os.listdir(audio_dir):
            if f.endswith('.wav'):
                base = f.replace('.wav', '')
                transcript_path = os.path.join(audio_dir, base + '.wav.txt')
                transcript = read_file_content(transcript_path)
                files.append({
                    'type': 'audio',
                    'name': base,
                    'content': transcript,
                    'date': date
                })
    
    # Scan image files
    if os.path.exists(image_dir):
        for f in os.listdir(image_dir):
            if f.endswith('.png'):
                base = f.replace('.png', '')
                ocr_path = os.path.join(image_dir, base + '.txt')
                ocr_text = read_file_content(ocr_path)
                files.append({
                    'type': 'image',
                    'name': base,
                    'content': ocr_text,
                    'date': date
                })
    
    # Scan learning files (from JARVIS learnings folder, not archive)
    learnings_jarvis_dir = os.path.join(HOME, 'JARVIS', 'RAW', 'learnings', date)
    if os.path.exists(learnings_jarvis_dir):
        for f in os.listdir(learnings_jarvis_dir):
            if f.endswith('.md'):
                base = f.replace('.md', '')
                content = read_file_content(os.path.join(learnings_jarvis_dir, f), max_chars=500)
                files.append({
                    'type': 'learning',
                    'name': base,
                    'content': content,
                    'date': date,
                    'source': f
                })
    
    return files


def load_neurograph():
    """Load existing neurograph data."""
    with open(NODES_FILE, 'r') as f:
        nodes = json.load(f)
    with open(SYNAPSES_FILE, 'r') as f:
        synapses = json.load(f)
    return nodes, synapses


def save_neurograph(nodes, synapses):
    """Save neurograph data."""
    with open(NODES_FILE, 'w') as f:
        json.dump(nodes, f, indent=2)
    with open(SYNAPSES_FILE, 'w') as f:
        json.dump(synapses, f, indent=2)


def check_integrity(date, nodes):
    """Check if file count matches node count for both archive and learnings."""
    files = scan_archive_date(date)
    
    # Separate archive files and learning files
    archive_files = set(f['name'] for f in files if f['type'] in ['audio', 'image'])
    learning_files = set(f['name'] for f in files if f['type'] == 'learning')
    
    # Count nodes by category
    archive_nodes = set()
    learning_nodes = set()
    for n in nodes:
        if n.get('attributes', {}).get('created') == date:
            if n.get('category') == 'archive':
                archive_nodes.add(n['id'])
            elif n.get('category') == 'learning':
                learning_nodes.add(n['id'])
    
    archive_missing = archive_files - archive_nodes
    archive_extra = archive_nodes - archive_files
    learning_missing = learning_files - learning_nodes
    learning_extra = learning_nodes - learning_files
    
    return {
        'archive_files': len(archive_files),
        'archive_nodes': len(archive_nodes),
        'archive_match': archive_files == archive_nodes,
        'archive_missing': archive_missing,
        'archive_extra': archive_extra,
        'learning_files': len(learning_files),
        'learning_nodes': len(learning_nodes),
        'learning_match': learning_files == learning_nodes,
        'learning_missing': learning_missing,
        'learning_extra': learning_extra,
        'total_files': len(archive_files) + len(learning_files),
        'total_nodes': len(archive_nodes) + len(learning_nodes),
        'total_match': (archive_files == archive_nodes) and (learning_files == learning_nodes)
    }


def generate_nodes_for_date(date, dry_run=False):
    """Generate archive nodes for a given date."""
    print(f"\n{'='*60}")
    print(f"Processing: {date}")
    print(f"{'='*60}")
    
    # Scan files
    files = scan_archive_date(date)
    print(f"Found {len(files)} archive files:")
    print(f"  - Audio: {sum(1 for f in files if f['type'] == 'audio')}")
    print(f"  - Images: {sum(1 for f in files if f['type'] == 'image')}")
    
    # Load existing neurograph
    nodes, synapses = load_neurograph()
    
    # Remove existing nodes for this date (to regenerate fresh)
    existing_ids = set()
    for n in nodes:
        if n.get('category') == 'archive' and n.get('attributes', {}).get('created') == date:
            existing_ids.add(n['id'])
    
    nodes = [n for n in nodes if n.get('id') not in existing_ids]
    synapses = [s for s in synapses if s.get('from') not in existing_ids and s.get('to') not in existing_ids]
    
    # Create new nodes
    new_nodes = []
    for file in files:
        if file['type'] == 'audio':
            node = create_audio_node(file['name'], file['content'], date)
        elif file['type'] == 'image':
            node = create_screenshot_node(file['name'], file['content'], date)
        elif file['type'] == 'learning':
            node = create_learning_node(file['name'], file['content'], date)
        new_nodes.append(node)
    
    # Add nodes to neurograph
    nodes.extend(new_nodes)
    
    # Create synapses (link to temporal node)
    temporal_id = f"{date.replace('-', '')}"  # e.g., "20260314"
    # Try to find existing temporal node
    temporal_exists = any(n.get('id') == temporal_id for n in nodes)
    
    if not temporal_exists:
        # Create temporal node
        temporal_node = {
            "id": temporal_id,
            "label": date.replace('-', ' '),
            "category": "temporal",
            "type": "anchor",
            "frequency": 1,
            "moments": [date],
            "attributes": {
                "created": date,
                "role": "temporal anchor",
                "description": f"Archive date: {date}",
                "color": "#f97316"
            }
        }
        nodes.append(temporal_node)
    
    # Add synapses linking all archive nodes to temporal
    for node in new_nodes:
        synapses.append({
            "from": node['id'],
            "to": temporal_id,
            "weight": 0.9
        })
    
    # Integrity check
    integrity = check_integrity(date, nodes)
    
    print(f"\nIntegrity check:")
    print(f"  Archive files: {integrity['archive_files']}")
    print(f"  Archive nodes: {integrity['archive_nodes']}")
    print(f"  Archive match: {'✅' if integrity['archive_match'] else '❌'}")
    print(f"  Learning files: {integrity['learning_files']}")
    print(f"  Learning nodes: {integrity['learning_nodes']}")
    print(f"  Learning match: {'✅' if integrity['learning_match'] else '❌'}")
    print(f"  Total: {integrity['total_files']} files, {integrity['total_nodes']} nodes")
    print(f"  Overall: {'✅' if integrity['total_match'] else '❌'}")
    
    if integrity['archive_missing']:
        print(f"\n⚠️  Missing archive nodes ({len(integrity['archive_missing'])}):")
        for f in sorted(integrity['archive_missing']):
            print(f"    - {f}")
    
    if integrity['archive_extra']:
        print(f"\n⚠️  Extra archive nodes ({len(integrity['archive_extra'])}):")
        for f in sorted(integrity['archive_extra']):
            print(f"    - {f}")
    
    if integrity['learning_missing']:
        print(f"\n⚠️  Missing learning nodes ({len(integrity['learning_missing'])}):")
        for f in sorted(integrity['learning_missing']):
            print(f"    - {f}")
    
    if integrity['learning_extra']:
        print(f"\n⚠️  Extra learning nodes ({len(integrity['learning_extra'])}):")
        for f in sorted(integrity['learning_extra']):
            print(f"    - {f}")
    
    if dry_run:
        print(f"\n📋 DRY RUN - not saving changes")
        print(f"Would add {len(new_nodes)} nodes, {len(new_nodes)} synapses")
    else:
        # Save neurograph
        save_neurograph(nodes, synapses)
        print(f"\n✅ Saved to neurograph")
        print(f"  New nodes: {len(new_nodes)}")
        print(f"  New synapses: {len(new_nodes)}")
        print(f"  Total neurons: {len(nodes)}")
        print(f"  Total synapses: {len(synapses)}")
    
    return integrity


def retroactive_scan():
    """Scan all dates in archive and report status."""
    print(f"\n{'='*60}")
    print("RETROACTIVE SCAN - All Archive Dates")
    print(f"{'='*60}")
    
    if not os.path.exists(ARCHIVE_BASE):
        print(f"❌ Archive base not found: {ARCHIVE_BASE}")
        return
    
    dates = sorted(os.listdir(ARCHIVE_BASE))
    dates = [d for d in dates if os.path.isdir(os.path.join(ARCHIVE_BASE, d))]
    
    print(f"Found {len(dates)} date folders\n")
    
    for date in dates:
        files = scan_archive_date(date)
        nodes, _ = load_neurograph()
        node_count = sum(1 for n in nodes if n.get('category') == 'archive' and n.get('attributes', {}).get('created') == date)
        match = '✅' if len(files) == node_count else '❌'
        print(f"{date}: {len(files)} files, {node_count} nodes {match}")


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 generate-archive-nodes.py <date>           # e.g., 2026-03-14")
        print("  python3 generate-archive-nodes.py --check <date>   # integrity check only")
        print("  python3 generate-archive-nodes.py --retroactive    # scan all dates")
        print("  python3 generate-archive-nodes.py --dry-run <date> # preview without saving")
        sys.exit(1)
    
    if sys.argv[1] == '--retroactive':
        retroactive_scan()
        return
    
    # Parse flags and date
    dry_run = False
    check_only = False
    date = None
    
    for arg in sys.argv[1:]:
        if arg == '--dry-run':
            dry_run = True
        elif arg == '--check':
            check_only = True
        elif arg.startswith('2026-'):  # Date format
            date = arg
    
    if not date:
        print("❌ No date provided")
        sys.exit(1)
    
    if check_only:
        # Integrity check only
        nodes, _ = load_neurograph()
        integrity = check_integrity(date, nodes)
        print(f"\nIntegrity check for {date}:")
        print(f"  Archive files: {integrity['archive_files']}")
        print(f"  Archive nodes: {integrity['archive_nodes']}")
        print(f"  Archive match: {'✅' if integrity['archive_match'] else '❌'}")
        print(f"  Learning files: {integrity['learning_files']}")
        print(f"  Learning nodes: {integrity['learning_nodes']}")
        print(f"  Learning match: {'✅' if integrity['learning_match'] else '❌'}")
        print(f"  Overall: {'✅' if integrity['total_match'] else '❌'}")
        return
    
    generate_nodes_for_date(date, dry_run=dry_run)


if __name__ == '__main__':
    main()
