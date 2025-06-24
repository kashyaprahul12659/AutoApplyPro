@echo off
setlocal

echo 🚀 AutoApplyPro Heroku Deployment Script

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    exit /b 1
)

REM Check if Heroku CLI is installed
where heroku >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI is not installed. Installing...
    call npm install -g heroku
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Heroku CLI. Please install it manually:
        echo npm install -g heroku
        exit /b 1
    )
)

echo 🔄 Switching to backend directory...
cd "%~dp0backend"

REM Check Heroku login status
echo 🔑 Checking Heroku login status...
heroku auth:whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔒 Not logged in to Heroku. Initiating login...
    call heroku login
) else (
    echo ✅ Already logged in to Heroku.
)

REM Check if git is initialized
if not exist ".git" (
    echo 📂 Initializing git repository...
    git init
)

REM Set Heroku remote
set APP_NAME=autoapplypro-backend
echo 🔗 Setting up Heroku remote for app: %APP_NAME%
git remote | findstr "heroku" >nul
if %errorlevel% neq 0 (
    echo 🔗 Adding Heroku remote...
    git remote add heroku "https://git.heroku.com/%APP_NAME%.git"
) else (
    echo ✅ Heroku remote already exists.
)

REM Commit changes
echo 💾 Checking for changes to commit...
git status --porcelain > temp.txt
set /p HAS_CHANGES=<temp.txt
del temp.txt

if defined HAS_CHANGES (
    echo 💾 Changes detected. Committing...
    git add .
    git commit -m "Update server for production deployment"
    if %errorlevel% neq 0 (
        echo ❌ Git commit failed. Please check Git configuration.
        exit /b 1
    )
) else (
    echo ✅ No changes to commit.
)

REM Deploy to Heroku
echo 🚀 Deploying to Heroku...
git push heroku master
if %errorlevel% neq 0 (
    echo ❌ Deployment failed. Please check the error message above.
    exit /b 1
)

REM Check app status
echo 🔍 Checking application status...
heroku ps -a %APP_NAME%

REM View logs (will run until user exits with Ctrl+C)
echo 📜 Viewing recent logs (Press Ctrl+C to exit):
heroku logs --tail -a %APP_NAME%

endlocal
