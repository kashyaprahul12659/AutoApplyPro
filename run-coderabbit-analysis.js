#!/usr/bin/env node

/**
 * CodeRabbit AI Full Repository Analysis Tool
 * 
 * This script creates a temporary branch with no changes and pushes it to GitHub
 * to trigger CodeRabbit AI analysis of the entire codebase.
 * 
 * After pushing, you'll need to manually create a PR on GitHub.
 * 
 * Requirements:
 * - Git installed and configured
 * - GitHub remote configured (origin)
 * - CodeRabbit GitHub App installed on the repository
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const BRANCH_NAME = `coderabbit-full-analysis-${Date.now()}`;
const PR_TITLE = "CodeRabbit AI: Full Repository Analysis";
const PR_BODY = "This is an automated PR to trigger CodeRabbit AI analysis of the entire codebase. No actual code changes are included.";

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to run commands and handle errors
function runCommand(command, errorMessage) {
    try {
        const output = execSync(command, { encoding: 'utf-8' });
        return output.trim();
    } catch (error) {
        console.error(`${colors.red}${errorMessage}${colors.reset}`);
        console.error(`Error details: ${error.message}`);
        process.exit(1);
    }
}

// Check if .coderabbit.yaml exists
function checkCodeRabbitConfig() {
    if (!fs.existsSync(path.join(process.cwd(), '.coderabbit.yaml'))) {
        console.error(`${colors.red}Error: .coderabbit.yaml not found in the current directory.${colors.reset}`);
        console.error("Please create a .coderabbit.yaml file or run this script from the repository root.");
        process.exit(1);
    }
}

// Check if git is installed
function checkGitInstalled() {
    try {
        execSync('git --version', { encoding: 'utf-8' });
    } catch (error) {
        console.error(`${colors.red}Error: Git is not installed or not available in PATH.${colors.reset}`);
        process.exit(1);
    }
}

// Check if current directory is a git repository
function checkGitRepo() {
    try {
        execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8' });
    } catch (error) {
        console.error(`${colors.red}Error: Current directory is not a git repository.${colors.reset}`);
        process.exit(1);
    }
}

// Check if git repository has a remote named 'origin'
function checkGitRemote() {
    try {
        const remotes = execSync('git remote', { encoding: 'utf-8' });
        if (!remotes.split('\n').includes('origin')) {
            console.error(`${colors.red}Error: No 'origin' remote found in this repository.${colors.reset}`);
            console.error("Please set up a remote repository: git remote add origin <your-github-repo-url>");
            process.exit(1);
        }
    } catch (error) {
        console.error(`${colors.red}Error checking git remotes:${colors.reset}`);
        console.error(error.message);
        process.exit(1);
    }
}

// Get GitHub repository URL
function getRepoUrl() {
    try {
        const url = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        // Extract the username/repo from different URL formats
        let repoPath;
        if (url.startsWith('https://')) {
            repoPath = url.replace('https://github.com/', '').replace('.git', '');
        } else if (url.startsWith('git@github.com:')) {
            repoPath = url.replace('git@github.com:', '').replace('.git', '');
        } else {
            throw new Error(`Unrecognized GitHub URL format: ${url}`);
        }
        return `https://github.com/${repoPath}`;
    } catch (error) {
        console.error(`${colors.red}Error getting repository URL:${colors.reset}`);
        console.error(error.message);
        return null;
    }
}

// Get current branch
function getCurrentBranch() {
    return runCommand('git rev-parse --abbrev-ref HEAD', 'Failed to get current branch');
}

// Create a new branch for analysis
function createAnalysisBranch() {
    console.log(`${colors.cyan}Creating analysis branch: ${BRANCH_NAME}...${colors.reset}`);
    runCommand(`git checkout -b ${BRANCH_NAME}`, 'Failed to create new branch');
}

// Create an empty commit
function createEmptyCommit() {
    console.log(`${colors.cyan}Creating empty commit...${colors.reset}`);
    runCommand('git commit --allow-empty -m "CodeRabbit AI: Trigger full repository analysis"', 
        'Failed to create empty commit');
}

// Push branch to GitHub
function pushBranch() {
    console.log(`${colors.cyan}Pushing branch to GitHub...${colors.reset}`);
    runCommand(`git push -u origin ${BRANCH_NAME}`, 'Failed to push branch to GitHub');
}

// Generate PR creation URL
function generatePrUrl(repoUrl) {
    // GitHub PR creation URL format - use only title parameter to avoid issues with & in URLs in Windows
    return `${repoUrl}/compare/main...${BRANCH_NAME}?quick_pull=1&title=${encodeURIComponent(PR_TITLE)}`;
}

// Switch back to original branch
function switchBackToOriginalBranch(originalBranch) {
    console.log(`${colors.cyan}Switching back to ${originalBranch}...${colors.reset}`);
    runCommand(`git checkout ${originalBranch}`, `Failed to switch back to ${originalBranch}`);
}

// Open URL in browser
function openBrowser(url) {
    const platform = os.platform();
    try {
        if (platform === 'win32') {
            execSync(`start ${url}`);
        } else if (platform === 'darwin') {
            execSync(`open ${url}`);
        } else {
            execSync(`xdg-open ${url}`);
        }
        return true;
    } catch (error) {
        console.error(`${colors.yellow}Failed to open browser automatically:${colors.reset}`, error.message);
        return false;
    }
}

// Main function
function main() {
    console.log(`${colors.magenta}=== CodeRabbit AI Full Repository Analysis Tool ===${colors.reset}`);
    
    // Perform checks
    checkGitInstalled();
    checkGitRepo();
    checkGitRemote();
    checkCodeRabbitConfig();
    
    const originalBranch = getCurrentBranch();
    console.log(`${colors.cyan}Current branch: ${originalBranch}${colors.reset}`);
    
    createAnalysisBranch();
    createEmptyCommit();
    pushBranch();
    
    const repoUrl = getRepoUrl();
    const prUrl = repoUrl ? generatePrUrl(repoUrl) : null;
    
    switchBackToOriginalBranch(originalBranch);
    
    console.log(`${colors.green}=== Success! ===${colors.reset}`);
    console.log(`${colors.green}Branch '${BRANCH_NAME}' has been pushed to GitHub.${colors.reset}`);
    
    if (prUrl) {
        console.log(`${colors.green}To create the PR for CodeRabbit analysis, go to:${colors.reset}`);
        console.log(prUrl);
        
        const browserOpened = openBrowser(prUrl);
        if (!browserOpened) {
            console.log(`${colors.yellow}Please copy and paste the URL above into your web browser.${colors.reset}`);
        }
    } else {
        console.log(`${colors.yellow}Could not determine PR creation URL.${colors.reset}`);
        console.log(`${colors.yellow}Please go to your GitHub repository and create a PR manually:${colors.reset}`);
        console.log(`- Base branch: main (or your default branch)`);
        console.log(`- Compare branch: ${BRANCH_NAME}`);
    }
    
    console.log(`${colors.green}After creating the PR, CodeRabbit AI will analyze the entire repository.${colors.reset}`);
    console.log(`${colors.green}Check the PR for analysis results (this may take a few minutes).${colors.reset}`);
}

main();
