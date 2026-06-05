const fs = require('fs');
const path = require('path');
const { findDirWith } = require('./find-cursor-assets.cjs');

const mobile = path.join(__dirname, '..');
const dest = path.join(mobile, 'store-assets', 'screenshots');
const gen = findDirWith('store-01-hero-voice.png') || findDirWith('store-play-feature-1024x500.png');

if (!gen) {
  console.error('Store screenshots not found in .cursor/projects assets.');
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });

const files = [
  'store-01-hero-voice.png',
  'store-02-random-call.png',
  'store-04-anonymous-voice.png',
  'store-05-kumorin-waiting.png',
  'store-03-safety.png',
  'store-play-feature-1024x500.png',
  'daretalk-play-feature-1024x500.png',
];

let count = 0;
for (const name of files) {
  const src = path.join(gen, name);
  if (!fs.existsSync(src)) continue;
  const outName = name.startsWith('daretalk-play') ? 'play-feature-graphic.png' : name;
  const out = name.includes('play-feature')
    ? path.join(mobile, 'store-assets', 'play-feature-graphic.png')
    : path.join(dest, outName);
  fs.copyFileSync(src, out);
  console.log('OK:', path.relative(mobile, out));
  count++;
}

console.log('Copied', count, 'files from', gen);

const logPath = path.join(mobile, 'store-assets', '_copy-result.txt');
const lines = [`source: ${gen}`, `copied: ${count}`, ''];
const shots = path.join(dest);
if (fs.existsSync(shots)) {
  lines.push('--- screenshots ---');
  for (const ent of fs.readdirSync(shots).sort()) {
    const p = path.join(shots, ent);
    if (fs.statSync(p).isFile()) lines.push(`${ent}\t${fs.statSync(p).size}`);
  }
}
const play = path.join(mobile, 'store-assets', 'play-feature-graphic.png');
if (fs.existsSync(play)) {
  lines.push('--- play-feature ---');
  lines.push(`play-feature-graphic.png\t${fs.statSync(play).size}`);
}
fs.writeFileSync(logPath, lines.join('\n'), 'utf8');
console.log('Wrote', path.relative(mobile, logPath));
