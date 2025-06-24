const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const HEROKU_APP_NAME = 'autoapplypro-backend';

// Function to execute shell commands and print output
function runCommand(command) {
  console.log(`\n🚀 Running: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    console.error(error);
    throw error;
  }
}

// Main deployment function
async function deployToHeroku() {
  try {
    console.log('🔄 Starting Heroku deployment process...');

    // 1. Check if Heroku CLI is installed
    try {
      console.log('✅ Checking Heroku CLI installation...');
      execSync('heroku --version', { encoding: 'utf8' });
      console.log('✅ Heroku CLI is installed.');
    } catch (error) {
      console.error('❌ Heroku CLI is not installed. Please install it first:');
      console.error('💻 Run: npm install -g heroku');
      process.exit(1);
    }
    
    // 2. Check login status
    try {
      console.log('🔑 Checking Heroku login status...');
      execSync('heroku auth:whoami', { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ Already logged in to Heroku.');
    } catch (error) {
      console.log('🔒 Not logged in to Heroku. Initiating login...');
      runCommand('heroku login');
    }

    // 3. Check if git is initialized
    const isGitRepo = fs.existsSync(path.join(__dirname, '.git'));
    if (!isGitRepo) {
      console.log('📂 Initializing git repository...');
      runCommand('git init');
    }

    // 4. Check if Heroku remote exists
    try {
      const remotes = execSync('git remote', { encoding: 'utf8' });
      if (!remotes.includes('heroku')) {
        console.log('🔗 Adding Heroku remote...');
        runCommand(`heroku git:remote -a ${HEROKU_APP_NAME}`);
      }
    } catch (error) {
      console.log('🔗 Adding Heroku remote...');
      runCommand(`heroku git:remote -a ${HEROKU_APP_NAME}`);
    }

    // 5. Commit changes to git
    const hasChanges = execSync('git status --porcelain', { encoding: 'utf8' });
    if (hasChanges) {
      console.log('💾 Committing changes...');
      runCommand('git add .');
      runCommand('git commit -m "Update server for production deployment"');
    } else {
      console.log('✅ No changes to commit.');
    }

    // 6. Push to Heroku
    console.log('🚀 Deploying to Heroku...');
    runCommand('git push heroku master');

    console.log('\n✅ Deployment completed successfully!');
    console.log(`🌐 Your app should be live at: https://${HEROKU_APP_NAME}.herokuapp.com`);
    
    // 7. Check deployment status
    console.log('\n🔍 Checking deployment status...');
    runCommand('heroku logs --tail');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run deployment
deployToHeroku();
