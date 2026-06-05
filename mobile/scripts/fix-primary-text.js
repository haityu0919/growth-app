const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');
const styleKeys = [
  'buttonText',
  'acceptButtonText',
  'acceptText',
  'requestButtonText',
  'saveText',
  'submitText',
  'actionText',
  'listenText',
  'closeText',
  'startButtonText',
  'primaryText',
  'checkmark',
  'filterButtonTextSelected',
];

for (const file of fs.readdirSync(screensDir)) {
  if (!file.endsWith('.js') || file === 'FriendsScreen.js') continue;
  let content = fs.readFileSync(path.join(screensDir, file), 'utf8');

  for (const key of styleKeys) {
    const re = new RegExp(
      `(${key}:\\s*\\{[^}]*?)color:\\s*THEME\\.text`,
      'g',
    );
    content = content.replace(re, '$1color: THEME.primaryText');
  }

  fs.writeFileSync(path.join(screensDir, file), content);
}

console.log('Fixed primary button text colors');
