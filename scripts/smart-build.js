#!/usr/bin/env node
/**
 * Smart build script for subprojects with Vite.
 * Only runs `vite build` when the ts/ folder is newer than the output in dist/
 * or when the output file is missing.
 *
 * Run from subproject directory (e.g., plane.ts/). Exits without running vite
 * if the project has no vite.config.ts.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = process.cwd();
const projectName = path.basename(projectDir);
const viteConfigPath = path.join(projectDir, 'vite.config.ts');

// Projects without vite build: exit successfully
if (!fs.existsSync(viteConfigPath)) {
  process.exit(0);
}

// Output filename matches directory name (plane.ts -> plane.js)
const outputBaseName = projectName.replace(/\.ts$/, '');
const distDir = path.join(projectDir, '..', 'dist');
const tsDir = path.join(projectDir, 'ts');

if (!fs.existsSync(tsDir)) {
  console.warn(`smart-build: ${projectName}: ts/ not found, skipping`);
  process.exit(0);
}

/**
 * Get the latest modification time of any file under dir (recursive).
 */
function getLatestMtime(dir) {
  let latest = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const subLatest = getLatestMtime(fullPath);
      if (subLatest > latest) latest = subLatest;
    } else {
      const m = stat.mtimeMs;
      if (m > latest) latest = m;
    }
  }
  return latest;
}

const sourceMtime = getLatestMtime(tsDir);

// Vite lib with formats: ['es'] outputs .js or .mjs
const outputJs = path.join(distDir, `${outputBaseName}.js`);
const outputMjs = path.join(distDir, `${outputBaseName}.mjs`);
const outputFile = fs.existsSync(outputMjs) ? outputMjs : outputJs;
const outputExists = fs.existsSync(outputFile);
const outputMtime = outputExists ? fs.statSync(outputFile).mtimeMs : 0;

const needsBuild = !outputExists || sourceMtime > outputMtime;

if (!needsBuild) {
  process.exit(0);
}

execSync('vite build', {
  stdio: 'inherit',
  cwd: projectDir,
});
