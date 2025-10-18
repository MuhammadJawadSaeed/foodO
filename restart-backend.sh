#!/bin/bash

# Backend Server Restart Script
# This will stop any running backend server and start fresh

echo "🔄 Stopping backend server..."

# Find and kill process on port 8000
PORT=8000

# Windows
if command -v taskkill &> /dev/null; then
    echo "Detecting Windows..."
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a 2>nul
fi

# Linux/Mac
if command -v lsof &> /dev/null; then
    echo "Detecting Linux/Mac..."
    PID=$(lsof -ti:$PORT)
    if [ ! -z "$PID" ]; then
        kill -9 $PID
        echo "✅ Killed process on port $PORT"
    fi
fi

echo ""
echo "⏳ Waiting 2 seconds..."
sleep 2

echo ""
echo "🚀 Starting backend server..."
cd backend
npm start
