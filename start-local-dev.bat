@echo off
echo Starting AutoApplyPro Local Development Environment...

echo.
echo Starting Backend Server...
cd backend
start "AutoApplyPro Backend" cmd /k "npm run dev"

echo.
echo Starting Frontend Development Server...
cd ../frontend
start "AutoApplyPro Frontend" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause > nul
