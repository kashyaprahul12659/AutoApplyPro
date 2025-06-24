# Heroku Deployment Script for AutoApplyPro

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if Heroku CLI is installed
if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Heroku CLI is not installed." -ForegroundColor Red
    Write-Host "💻 Installing Heroku CLI..." -ForegroundColor Yellow
    
    # Install Heroku CLI
    & npm install -g heroku
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Heroku CLI. Please install it manually:" -ForegroundColor Red
        Write-Host "💻 npm install -g heroku" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "🚀 Starting Heroku deployment process..." -ForegroundColor Cyan

# Change to backend directory
$backendDir = Join-Path $PSScriptRoot "backend"
Set-Location -Path $backendDir

Write-Host "📂 Current directory: $backendDir" -ForegroundColor Yellow

# Login to Heroku
Write-Host "🔑 Checking Heroku login status..." -ForegroundColor Cyan
$loginCheck = heroku auth:whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔒 Not logged in to Heroku. Initiating login..." -ForegroundColor Yellow
    heroku login
}
else {
    Write-Host "✅ Already logged in to Heroku as: $loginCheck" -ForegroundColor Green
}

# Check if git is initialized
if (-not (Test-Path -Path (Join-Path $backendDir ".git"))) {
    Write-Host "📂 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Set Heroku remote
$appName = "autoapplypro-backend"
Write-Host "🔗 Setting up Heroku remote for app: $appName" -ForegroundColor Cyan
$remoteCheck = git remote 2>&1

if ($remoteCheck -notcontains "heroku") {
    Write-Host "🔗 Adding Heroku remote..." -ForegroundColor Yellow
    git remote add heroku "https://git.heroku.com/$appName.git"
}
else {
    Write-Host "✅ Heroku remote already exists" -ForegroundColor Green
}

# Commit changes
Write-Host "💾 Checking for changes to commit..." -ForegroundColor Cyan
$statusOutput = git status --porcelain
if ($statusOutput) {
    Write-Host "💾 Changes detected. Committing..." -ForegroundColor Yellow
    git add .
    git commit -m "Update server for production deployment"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Git commit failed. Please check Git configuration." -ForegroundColor Red
        Write-Host "Try setting your Git identity:" -ForegroundColor Yellow
        Write-Host "git config --global user.email 'you@example.com'" -ForegroundColor Yellow
        Write-Host "git config --global user.name 'Your Name'" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "✅ No changes to commit." -ForegroundColor Green
}

# Deploy to Heroku
Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Cyan
git push heroku master

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed. Please check the error message above." -ForegroundColor Red
    exit 1
}

# Check app status
Write-Host "🔍 Checking application status..." -ForegroundColor Cyan
heroku ps -a $appName

# View logs
Write-Host "📜 Viewing recent logs (Press Ctrl+C to exit):" -ForegroundColor Cyan
heroku logs --tail -a $appName
