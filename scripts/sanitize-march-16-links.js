const fs = require('fs');
const path = require('path');

const NODES_FILE = path.join(__dirname, '../RAW/memories/nodes.json');
const ARCHIVE_DIR = '/Users/paulvisciano/RAW/archive/2026-03-16';

console.log('🧠 Sanitizing March 16, 2026 neural graph links...\n');

// Load nodes
const nodes = JSON.parse(fs.readFileSync(NODES_FILE, 'utf8'));

// Find or create temporal hub for March 16
let temporalHub = nodes.find(n => 
    n.attributes && 
    n.attributes.type === 'temporal' && 
    n.attributes.name === '2026-03-16'
);

if (!temporalHub) {
    console.log('📌 Creating temporal hub: 2026-03-16');
    temporalHub = {
        id: 'temporal-2026-03-16',
        label: '2026 03 16',
        attributes: {
            type: 'temporal',
            name: '2026-03-16',
            created: '2026-03-16T00:00:00.000+07:00',
            timezone: '+07:00'
        }
    };
    nodes.push(temporalHub);
} else {
    console.log('✅ Temporal hub exists:', temporalHub.label);
}

// Count files on disk
const audioDir = path.join(ARCHIVE_DIR, 'audio');
const imagesDir = path.join(ARCHIVE_DIR, 'images');

const audioFiles = fs.existsSync(audioDir) ? fs.readdirSync(audioDir).filter(f => !f.startsWith('.')).length : 0;
const imageFiles = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).filter(f => !f.startsWith('.')).length : 0;
const totalFiles = audioFiles + imageFiles;

console.log(`📂 Files on disk: ${totalFiles} (${audioFiles} audio + ${imageFiles} images)`);

// Find all archive nodes from March 16 (by created date + file-related attributes)
const archiveNodes = nodes.filter(n => {
    const created = n.attributes && n.attributes.created;
    if (!created) return false;
    const datePart = created.split('T')[0];
    if (datePart !== '2026-03-16') return false;
    
    // Match nodes that represent files (audio, images, screenshots, etc.)
    const attrs = n.attributes;
    return (
        attrs.type === 'audio' ||
        attrs.type === 'image' ||
        attrs.type === 'screenshot' ||
        attrs.fileType ||
        attrs.path ||
        attrs.file ||
        (attrs.role && attrs.role.includes('file')) ||
        (attrs.description && attrs.description.includes('archive'))
    );
});

console.log(`🧠 Archive nodes in graph: ${archiveNodes.length}`);

// Link all archive nodes to temporal hub
let linkedCount = 0;
const synapses = JSON.parse(fs.readFileSync(path.join(__dirname, '../RAW/memories/synapses.json'), 'utf8'));

// Remove existing links from archive nodes to temporal
const existingSynapseIds = archiveNodes.map(n => n.id);
const synapsesToRemove = synapses.filter(s => 
    existingSynapseIds.includes(s.source) && s.target === temporalHub.id
);

console.log(`🔗 Removing ${synapsesToRemove.length} old links...`);
const filteredSynapses = synapses.filter(s => !synapsesToRemove.includes(s));

// Create new links from all archive nodes to temporal hub
archiveNodes.forEach(node => {
    filteredSynapses.push({
        source: node.id,
        target: temporalHub.id,
        weight: 1,
        attributes: {
            type: 'links_to',
            relation: 'temporal_anchor'
        }
    });
    linkedCount++;
});

console.log(`✅ Created ${linkedCount} new links to temporal hub`);

// Verify counts match
console.log(`\n📊 Verification:`);
console.log(`   Files on disk: ${totalFiles}`);
console.log(`   Archive nodes: ${archiveNodes.length}`);
console.log(`   Nodes linked: ${linkedCount}`);
console.log(`   Match: ${totalFiles === archiveNodes.length ? '✅ YES' : '❌ NO'}`);

// Save
fs.writeFileSync(NODES_FILE, JSON.stringify(nodes, null, 2));
fs.writeFileSync(path.join(__dirname, '../RAW/memories/synapses.json'), JSON.stringify(filteredSynapses, null, 2));

// Update fingerprint
const fingerprint = {
    hash: require('crypto').createHash('sha256').update(JSON.stringify(nodes) + JSON.stringify(filteredSynapses)).digest('hex').substring(0, 20),
    updated: new Date().toISOString(),
    nodes: nodes.length,
    synapses: filteredSynapses.length
};
fs.writeFileSync(path.join(__dirname, '../RAW/memories/fingerprint.json'), JSON.stringify(fingerprint, null, 2));

console.log(`\n✨ Fingerprint: ${fingerprint.hash}`);
console.log(`📝 Saved to: ${NODES_FILE}`);
console.log(`🔗 Synapses saved: ${filteredSynapses.length}`);
console.log(`\n🧠 Done! Refresh the NeuroGraph to see the changes live.\n`);
