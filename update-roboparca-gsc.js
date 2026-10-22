const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildJsPath = path.join(__dirname, 'build.js');
let buildJs = fs.readFileSync(buildJsPath, 'utf8');

const verificationTag = '<meta name="google-site-verification" content="z1HDX3FFWaHIqyPyOMLwt9sgJg31Is1QxB7Po-DuJBs" />';

if (!buildJs.includes(verificationTag)) {
  buildJs = buildJs.replace(/<head>/g, '<head>\n  ' + verificationTag);
  fs.writeFileSync(buildJsPath, buildJs, 'utf8');
  console.log('✅ Injected GSC verification tag into RoboParca build.js');
}

// Rebuild RoboParca
console.log('Rebuilding RoboParca...');
execSync('node build.js', { cwd: __dirname, stdio: 'inherit' });

// Also verify dist/index.html has it
const distIndex = path.join(__dirname, 'dist', 'index.html');
const distHtml = fs.readFileSync(distIndex, 'utf8');
console.log('Verification in dist/index.html:', distHtml.includes(verificationTag));

// Commit and push to roboparca.github.io
console.log('Deploying RoboParca with GSC tag to GitHub...');
try {
  const distDir = path.join(__dirname, 'dist');
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Add Google Search Console verification meta tag"', { cwd: distDir, stdio: 'inherit' });
  execSync('git push origin main', { cwd: distDir, stdio: 'inherit' });
  console.log('✅ Deployed RoboParca to GitHub with GSC verification tag!');
} catch (e) {
  console.log('Git push status:', e.message);
}
