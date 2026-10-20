// deploy-to-github.js - 1-Click Direct Deployment to GitHub Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoUrl = process.argv[2];

if (!repoUrl) {
  console.log(`
Usage:
  node deploy-to-github.js <GITHUB_REPO_URL_OR_SSH>

Examples:
  node deploy-to-github.js https://github.com/USERNAME/USERNAME.github.io.git
  node deploy-to-github.js https://github.com/USERNAME/roboparca.git
  node deploy-to-github.js git@github.com:USERNAME/roboparca.git
`);
  process.exit(1);
}

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.log('Building site first...');
  execSync('node build.js', { stdio: 'inherit' });
}

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf8');

console.log(`🚀 Deploying dist/ to ${repoUrl}...`);

try {
  // Initialize git inside dist if not already
  const gitDir = path.join(distDir, '.git');
  if (fs.existsSync(gitDir)) {
    fs.rmSync(gitDir, { recursive: true, force: true });
  }

  execSync('git init -b main', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.name "RoboParca Deployer"', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.email "deploy@roboparca.local"', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Production GitHub Pages Release (1,323 Pages)"', { cwd: distDir, stdio: 'inherit' });
  execSync(`git remote add origin ${repoUrl}`, { cwd: distDir, stdio: 'inherit' });
  execSync('git push -u origin main --force', { cwd: distDir, stdio: 'inherit' });

  console.log(`\n✅ Successfully deployed to GitHub Pages!`);
  console.log(`Your site will be live within 1-2 minutes at your github.io URL.`);
} catch (err) {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
}
