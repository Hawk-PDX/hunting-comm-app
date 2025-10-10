#!/bin/bash

# Hunting Communication App Startup Script
# This script automatically starts the backend, ngrok tunnel, and updates configurations

echo "🏹 Starting Hunting Communication App..."
echo "======================================="

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null
pkill -f "nodemon" 2>/dev/null  
pkill -f "ngrok" 2>/dev/null
sleep 2

# Start backend server
echo "🚀 Starting backend server..."
cd backend
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo "   ✅ Backend server started (PID: $BACKEND_PID)"

# Wait for backend to be ready
sleep 5

# Start ngrok tunnel
echo "🌐 Starting ngrok tunnel..."
ngrok http 5001 > ngrok.log 2>&1 &
NGROK_PID=$!
echo "   ✅ ngrok tunnel started (PID: $NGROK_PID)"

# Wait for ngrok to establish tunnel
echo "⏳ Waiting for ngrok tunnel to establish..."
sleep 8

# Get the ngrok URL
echo "📡 Retrieving ngrok tunnel URL..."
NGROK_URL=""
for i in {1..10}; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for tunnel in data.get('tunnels', []):
        if tunnel.get('proto') == 'https':
            print(tunnel['public_url'])
            break
except:
    pass
" 2>/dev/null)
    
    if [ ! -z "$NGROK_URL" ]; then
        break
    fi
    echo "   ⏳ Attempt $i/10 - waiting for ngrok..."
    sleep 2
done

if [ -z "$NGROK_URL" ]; then
    echo "   ❌ Failed to get ngrok URL. Check if ngrok is running."
    exit 1
fi

echo "   ✅ ngrok URL: $NGROK_URL"

# Test backend connectivity
echo "🔍 Testing backend connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$NGROK_URL/health")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "   ✅ Backend is accessible via tunnel"
else
    echo "   ⚠️  Backend test failed (HTTP $HTTP_STATUS)"
fi

# Display summary
echo ""
echo "🎉 Hunting Communication App Setup Complete!"
echo "============================================="
echo "Backend Server: http://localhost:5001"
echo "Backend Tunnel: $NGROK_URL"
echo ""
echo "📱 To start the mobile app:"
echo "   cd mobile-app"
echo "   npx expo start --tunnel"
echo ""
echo "📋 Process IDs (for stopping later):"
echo "   Backend: $BACKEND_PID"
echo "   ngrok:   $NGROK_PID"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $NGROK_PID"
echo ""
echo "✨ The mobile app will automatically use the current ngrok URL!"

# Save process IDs for later cleanup
echo "$BACKEND_PID" > .backend_pid
echo "$NGROK_PID" > .ngrok_pid

# Keep script running to show logs (optional)
read -p "Press Enter to view live logs (Ctrl+C to exit): "
echo ""
echo "📋 Live Backend Logs:"
echo "===================="
tail -f backend/backend.log