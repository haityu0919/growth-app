/**
 * One-off: replace hardcoded dark-theme hex with THEME tokens in screen files.
 */
const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const replacements = [
  ["backgroundColor: '#1a1a2e'", 'backgroundColor: THEME.bg'],
  ["backgroundColor: '#141420'", 'backgroundColor: THEME.bg'],
  ["backgroundColor: '#24243a'", 'backgroundColor: THEME.card'],
  ["backgroundColor: '#2d3436'", 'backgroundColor: THEME.surfaceMuted'],
  ["backgroundColor: '#3d3470'", 'backgroundColor: THEME.premiumCardBg'],
  ["backgroundColor: '#4a4a5a'", 'backgroundColor: THEME.disabledButton'],
  ["backgroundColor: '#6c5ce7'", 'backgroundColor: THEME.primary'],
  ["borderColor: '#3a3a52'", 'borderColor: THEME.border'],
  ["borderColor: '#4a4a5a'", 'borderColor: THEME.plannedBorder'],
  ["borderColor: '#6c5ce7'", 'borderColor: THEME.primary'],
  ["borderColor: '#a0a0ff'", 'borderColor: THEME.link'],
  ["borderTopColor: '#3a3a52'", 'borderTopColor: THEME.border'],
  ["color: '#1a1a2e'", 'color: THEME.text'],
  ["color: '#ffffff'", 'color: THEME.text'],
  ["color: '#fff'", 'color: THEME.text'],
  ["color: '#a0a0b0'", 'color: THEME.textMuted'],
  ["color: '#a0a0ff'", 'color: THEME.link'],
  ["color: '#c0c0d0'", 'color: THEME.textSecondary'],
  ["color: '#d8d8e8'", 'color: THEME.body'],
  ["color: '#d8d8ff'", 'color: THEME.textSecondary'],
  ["color: '#ffb86c'", 'color: THEME.notice'],
  ["color: '#6c5ce7'", 'color: THEME.primary'],
];

const importLine = "import { THEME } from '../constants/theme';\n";

for (const file of fs.readdirSync(screensDir)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("from 'react-native'")) continue;

  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }

  if (!content.includes("from '../constants/theme'")) {
    content = content.replace(
      /from 'react-native';\n/,
      "from 'react-native';\n" + importLine,
    );
  }

  content = content.replace(
    /color="#a0a0ff"/g,
    'color={THEME.link}',
  );
  content = content.replace(
    /color="#6c5ce7"/g,
    'color={THEME.primary}',
  );

  fs.writeFileSync(filePath, content);
}

console.log('Applied THEME to screens/*.js');
