/**
 * 採用中 PNG を軽量化（sharp 使用・高圧縮）
 * node scripts/optimize-pngs.cjs
 */
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const logPath = path.join(__dirname, '..', 'optimize-pngs-log.txt');

const targets = [
  { name: 'icon.png', maxWidth: 1024 },
  { name: 'adaptive-icon.png', maxWidth: 1024 },
  { name: 'splash.png', maxWidth: 1280 },
  { name: 'favicon.png', maxWidth: 48 },
  { name: 'launch-logo.png', maxWidth: 512 },
  { name: 'splash.png', maxWidth: 1280 },
  { name: 'kumorin-waiting.png', maxWidth: 720 },
];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function optimizeOne(sharp, filePath, maxWidth) {
  const before = fs.statSync(filePath).size;
  const tmp = `${filePath}.opt`;
  const meta = await sharp(filePath).metadata();
  let pipeline = sharp(filePath);
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }
  const small = maxWidth <= 256;
  await pipeline
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: small,
      quality: small ? 85 : 82,
      effort: 10,
    })
    .toFile(tmp);
  fs.renameSync(tmp, filePath);
  const after = fs.statSync(filePath).size;
  const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0;
  return {
    line: `${path.basename(filePath)}: ${formatKb(before)} -> ${formatKb(after)} (-${pct}%)  ${meta.width}x${meta.height} max ${maxWidth}px`,
  };
}

async function main() {
  const lines = [`=== PNG optimize (sharp) ${new Date().toISOString()} ===`];
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    lines.push('ERROR: sharp not found. Run optimize-pngs.bat or scripts/optimize-pngs.ps1');
    fs.writeFileSync(logPath, lines.join('\n'), 'utf8');
    console.error(lines.join('\n'));
    process.exit(1);
  }

  for (const { name, maxWidth } of targets) {
    const filePath = path.join(assetsDir, name);
    if (!fs.existsSync(filePath)) {
      lines.push(`SKIP: ${name}`);
      continue;
    }
    const { line } = await optimizeOne(sharp, filePath, maxWidth);
    lines.push(line);
  }

  lines.push('DONE');
  fs.writeFileSync(logPath, lines.join('\n'), 'utf8');
  console.log(lines.join('\n'));
}

main().catch((err) => {
  fs.writeFileSync(logPath, `FAIL: ${err.message}`, 'utf8');
  process.exit(1);
});
