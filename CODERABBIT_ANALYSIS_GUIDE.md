# Using CodeRabbit AI for Full Repository Analysis

This guide explains how to use CodeRabbit AI to analyze your entire repository for code errors, style issues, and best practice violations.

## Prerequisites

Before you begin, make sure you have:

1. Git installed and configured on your machine
2. A GitHub repository with push access
3. CodeRabbit GitHub App installed on your repository
   - If not already installed, visit: [https://coderabbit.ai/](https://coderabbit.ai/)

## Method 1: Using the Automated Script

We've created a script that automates the process of triggering a full CodeRabbit analysis.

### Windows Users

1. Simply run the batch file:

   ```batch
   run-coderabbit-analysis.bat
   ```

### Mac/Linux Users

1. Make the script executable:

   ```bash
   chmod +x run-coderabbit-analysis.js
   ```

2. Run the script:

   ```bash
   ./run-coderabbit-analysis.js
   ```
   
   Or with Node.js:

   ```bash
   node run-coderabbit-analysis.js
   ```

### What the Script Does

The script performs the following actions:

1. Creates a new temporary branch
2. Creates an empty commit
3. Pushes the branch to GitHub
4. Opens your browser with a pre-filled Pull Request page
5. Returns to your original branch

After running the script, complete the PR creation on GitHub to trigger the analysis.

## Method 2: Manual Process

If you prefer to do this manually:

1. Create a new branch:

   ```bash
   git checkout -b coderabbit-analysis
   ```

2. Create an empty commit:

   ```bash
   git commit --allow-empty -m "CodeRabbit AI: Trigger full repository analysis"
   ```

3. Push the branch:

   ```bash
   git push -u origin coderabbit-analysis
   ```

4. Create a Pull Request on GitHub:
   - Base branch: main (or your default branch)
   - Compare branch: coderabbit-analysis
   - Title: "CodeRabbit AI: Full Repository Analysis"
   - Description: "This PR is intended to trigger CodeRabbit AI analysis of the entire codebase."

## Viewing the Results

Once you've created the PR:

1. Wait for CodeRabbit AI to complete its analysis (this may take a few minutes)
2. Check the PR comments for the full analysis report
3. Review all identified issues and suggestions
4. Address the issues in your codebase

## Understanding the Report

The CodeRabbit AI report typically includes:

- Code style and formatting issues
- Potential bugs and logical errors
- Security vulnerabilities
- Performance concerns
- Accessibility issues
- Best practice violations

## Notes on Configuration

The analysis is based on your `.coderabbit.yaml` configuration file. To customize the analysis:

1. Edit `.coderabbit.yaml` at the root of your repository
2. Adjust settings like severity thresholds, ignored files, etc.
3. Run a new analysis to see the changes take effect

For more information on configuration options, visit the CodeRabbit AI documentation.
