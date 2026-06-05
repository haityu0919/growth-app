const fs = require('fs');
const path = require('path');

function findDirWith(fileName) {
  const roots = [
    path.join(
      process.env.USERPROFILE || '',
      '.cursor',
      'projects',
      'empty-window',
      'assets'
    ),
    path.join(process.env.USERPROFILE || '', '.cursor', 'projects'),
    path.join(__dirname, '..', 'store-assets'),
    path.join(__dirname, '..', 'store-assets', 'screenshots'),
  ];
  for (const root of roots) {
    if (!root || !fs.existsSync(root)) continue;
    const direct = path.join(root, fileName);
    if (fs.existsSync(direct)) return root;
    let entries = [];
    try {
      entries = fs.readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const assets = path.join(root, ent.name, 'assets');
      if (fs.existsSync(path.join(assets, fileName))) return assets;
    }
  }
  return null;
}

module.exports = { findDirWith };
