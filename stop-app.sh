#!/bin/bash

# Hunting Communication App Stop Script

echo "🛑 Stopping Hunting Communication App..."
echo "======================================="

# Kill processes by name
echo "🧹 Stopping backend server..."
pkill -f "node.*server.js" 2>/dev/null && echo "   ✅ Backend stopped" || echo "   ℹ️  No backend process found"

echo "🧹 Stopping nodemon..."
pkill -f "nodemon" 2>/dev/null && echo "   ✅ nodemon stopped" || echo "   ℹ️  No nodemon process found"

echo "🧹 Stopping ngrok..."
pkill -f "ngrok" 2>/dev/null && echo "   ✅ ngrok stopped" || echo "   ℹ️  No ngrok process found"

# Clean up PID files
if [ -f ".backend_pid" ]; then
    rm .backend_pid
    echo "   🗑️  Removed backend PID file"
fi

if [ -f ".ngrok_pid" ]; then
    rm .ngrok_pid
    echo "   🗑️  Removed ngrok PID file"
fi

echo ""
echo "✅ All services stopped successfully!"
echo "🏹 Hunting Communication App is now offline."