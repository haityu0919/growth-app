const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const importLine = "import { THEME } from '../constants/theme';\n";

for (const file of fs.readdirSync(screensDir)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('THEME.') || content.includes("from '../constants/theme'")) {
    continue;
  }

  const match = content.match(/from 'react-native';\n/);
  if (match) {
    content = content.replace(/from 'react-native';\n/, `from 'react-native';\n${importLine}`);
  } else {
    content = importLine + content;
  }

  fs.writeFileSync(filePath, content);
  console.log('Added import:', file);
}
