@echo off
echo Killing existing Node.js processes on port 8000...

REM Find and kill the process using port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing process with PID %%a
    taskkill /F /PID %%a
)

echo.
echo Starting backend server...
cd backend
start cmd /k "npm start"

echo.
echo Backend server is starting in a new window...
echo Wait for "Server is running on http://localhost:8000" message
pause
