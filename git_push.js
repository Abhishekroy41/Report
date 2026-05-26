const { execSync } = require('child_process');

try {
  console.log('Running git add...');
  execSync('git add .', { stdio: 'inherit' });
  
  console.log('Running git commit...');
  try {
    execSync('git commit -m "Fix Vercel deployment: remove base path and unused github workflows"', { stdio: 'inherit' });
  } catch (commitErr) {
    console.log('Commit might have failed if there were no changes, ignoring...');
  }
  
  console.log('Running git push...');
  execSync('git push', { stdio: 'inherit' });
  console.log('Push completed successfully.');
} catch (error) {
  console.error('Error occurred:', error.message);
}
