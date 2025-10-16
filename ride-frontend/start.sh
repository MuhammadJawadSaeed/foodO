#!/bin/bash

# Check if the Backend server is running
check_backend() {
  curl -s http://localhost:3000 > /dev/null
  return $?
}

echo "Checking if the backend server is running..."

if check_backend; then
  echo "Backend server is running."
else
  echo "Backend server is NOT running. Starting it now..."
  cd ../Backend
  # Use this line for Windows
  start cmd /k "npm start"
  # Use this line for macOS/Linux
  # gnome-terminal -- npm start
  # Wait for the server to start
  echo "Waiting for backend server to start..."
  sleep 5
fi

# Start the frontend
echo "Starting frontend..."
npm run dev