import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const zipName = 'PagePilot-MERN-Integration-POC.zip';
const zipPath = path.join(rootDir, zipName);

console.log('📦 Preparing clean submission package...');

if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log(`Removed previous ${zipName}`);
}

const excludes = [
  'node_modules/*',
  '*/node_modules/*',
  'client/node_modules/*',
  'server/node_modules/*',
  'client/dist/*',
  'dist/*',
  'build/*',
  '*.zip',
  '.DS_Store',
  '*/.DS_Store',
  '.env',
  'server/.env',
  'client/.env',
  '*.log',
  'logs/*',
  'coverage/*'
];

const excludeArgs = excludes.map(pattern => `-x "${pattern}"`).join(' ');
const cmd = `cd "${rootDir}" && zip -r "${zipName}" . ${excludeArgs}`;

try {
  execSync(cmd, { stdio: 'inherit' });
  const stats = fs.statSync(zipPath);
  console.log(`\n✅ Successfully generated clean submission ZIP: ${zipName}`);
  console.log(`📁 Location: ${zipPath}`);
  console.log(`📊 Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} catch (err) {
  console.error('❌ Failed to create zip package:', err.message);
  process.exit(1);
}
