import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const portsPath = path.join(projectRoot, 'ports.json');
const packageJsonPath = path.join(projectRoot, 'package.json');

try {
  // Read ports.json
  const portsData = JSON.parse(fs.readFileSync(portsPath, 'utf8'));
  const activePort = portsData.activePort || '7001';

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update scripts
  let changed = false;

  const updateScript = (name, pattern, replacement) => {
    if (packageJson.scripts[name] && packageJson.scripts[name].includes(pattern)) {
      const newScript = packageJson.scripts[name].replace(new RegExp(`${pattern} \\d+`), `${pattern} ${replacement}`);
      if (packageJson.scripts[name] !== newScript) {
        packageJson.scripts[name] = newScript;
        changed = true;
      }
    }
  };

  updateScript('dev', '-p', activePort);
  updateScript('start', '-p', activePort);
  updateScript('dev:watch', '-p', activePort);

  if (changed) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated package.json to use port ${activePort}`);
  } else {
    console.log(`package.json is already using port ${activePort}`);
  }
} catch (error) {
  console.error('Error syncing port:', error.message);
  process.exit(1);
}
