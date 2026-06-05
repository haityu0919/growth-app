const fs = require('fs');
const path = require('path');

const gen = 'C:\\Users\\matsuda\\.cursor\\projects\\empty-window\\assets';
const mobile = path.join(__dirname, '..');
const dest = path.join(mobile, 'store-assets', 'screenshots');
const playDest = path.join(mobile, 'store-assets', 'play-feature-graphic.png');
const logPath = path.join(mobile, 'store-assets', '_copy-result.txt');

const files = [
  'store-01-hero-voice.png',
  'store-02-random-call.png',
  'store-03-safety.png',
  'store-04-anonymous-voice.png',
  'store-05-kumorin-waiting.png',
  'store-play-feature-1024x500.png',
];

const lines = [];
fs.mkdirSync(dest, { recursive: true });

for (const name of files) {
  const src = path.join(gen, name);
  if (!fs.existsSync(src)) {
    lines.push(`MISSING_SRC ${name}`);
    continue;
  }
  const out = path.join(dest, name);
  fs.copyFileSync(src, out);
  lines.push(`COPIED ${name} -> ${out} (${fs.statSync(out).size} bytes)`);
}

const playSrc = path.join(gen, 'store-play-feature-1024x500.png');
if (fs.existsSync(playSrc)) {
  fs.copyFileSync(playSrc, playDest);
  lines.push(`COPIED play -> ${playDest} (${fs.statSync(playDest).size} bytes)`);
} else {
  lines.push('MISSING_SRC store-play-feature-1024x500.png for play-feature');
}

lines.push('\n--- screenshots ---');
for (const ent of fs.readdirSync(dest).sort()) {
  const p = path.join(dest, ent);
  if (fs.statSync(p).isFile()) lines.push(`${ent}\t${fs.statSync(p).size}`);
}

fs.writeFileSync(logPath, lines.join('\n'), 'utf8');
console.log('wrote', logPath);
