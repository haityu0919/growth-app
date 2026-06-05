const fs = require('fs');
const path = require('path');
const { findDirWith } = require('./find-cursor-assets.cjs');

const mobile = path.join(__dirname, '..');
const assets = path.join(mobile, 'assets');
const store = path.join(mobile, 'store-assets');

const gen =
  findDirWith('daretalk-app-icon-1024.png') ||
  findDirWith('daretalk-launch-logo.png');

if (!gen) {
  console.error('Generated assets not found under .cursor/projects or store-assets.');
  process.exit(1);
}

fs.mkdirSync(store, { recursive: true });

const brandMap = [
  ['daretalk-app-icon-1024.png', 'icon.png'],
  ['daretalk-app-icon-1024.png', 'adaptive-icon.png'],
  ['daretalk-launch-logo.png', 'launch-logo.png'],
  ['daretalk-splash-portrait.png', 'splash.png'],
];

for (const [srcName, dstName] of brandMap) {
  const src = path.join(gen, srcName);
  if (!fs.existsSync(src)) {
    console.warn('SKIP:', srcName);
    continue;
  }
  fs.copyFileSync(src, path.join(assets, dstName));
  fs.copyFileSync(src, path.join(store, dstName));
  console.log('OK: assets/' + dstName);
}

const iconSrc = path.join(assets, 'icon.png');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, path.join(store, 'app-icon-1024.png'));
}

console.log('Source:', gen);
console.log('Done. Run optimize-pngs next.');
