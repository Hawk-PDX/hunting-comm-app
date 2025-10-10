#!/bin/bash

# Hunting Communication App Development Startup Script

echo "🦌 Hunting Communication App - Development Setup"
echo "================================================="

# Function to start backend
start_backend() {
    echo "🚀 Starting backend server..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    cd ..
}

# Function to start mobile app with different connection methods
start_mobile() {
    local connection_type=$1
    echo "📱 Starting mobile app with $connection_type connection..."
    cd mobile-app
    
    case $connection_type in
        "tunnel")
            echo "🌐 Starting with Expo tunnel (works from any network)..."
            npm run start-tunnel
            ;;
        "lan")
            echo "🏠 Starting with LAN connection (works on same network)..."
            npm run start-lan
            ;;
        *)
            echo "💻 Starting with default connection (localhost only)..."
            npm start
            ;;
    esac
    cd ..
}

# Check if ngrok is installed
check_ngrok() {
    if command -v ngrok &> /dev/null; then
        echo "✅ ngrok is installed"
        return 0
    else
        echo "❌ ngrok is not installed"
        echo "   Install it with: brew install ngrok (on macOS)"
        return 1
    fi
}

# Start ngrok tunnel for backend
start_ngrok() {
    echo "🔗 Starting ngrok tunnel for backend..."
    ngrok http 5000 &
    NGROK_PID=$!
    echo "ngrok started with PID: $NGROK_PID"
    echo "⏳ Waiting for ngrok to initialize..."
    sleep 3
    echo "🌐 ngrok dashboard: http://localhost:4040"
}

# Display menu
show_menu() {
    echo ""
    echo "Choose your connection method:"
    echo "1) Local only (localhost) - fastest, works only on this machine"
    echo "2) LAN connection - works on same WiFi network"
    echo "3) Tunnel connection - works from anywhere (requires internet)"
    echo "4) Full setup with ngrok - best for external network access"
    echo "5) Just start backend"
    echo "6) Exit"
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    echo "🧹 Cleaning up processes..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend stopped"
    fi
    if [ ! -z "$NGROK_PID" ]; then
        kill $NGROK_PID 2>/dev/null
        echo "ngrok stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main script
main() {
    show_menu
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            start_backend
            start_mobile "local"
            ;;
        2)
            start_backend
            start_mobile "lan"
            ;;
        3)
            start_backend
            start_mobile "tunnel"
            ;;
        4)
            if check_ngrok; then
                start_backend
                sleep 2
                start_ngrok
                sleep 3
                start_mobile "tunnel"
            else
                echo "Please install ngrok first"
                exit 1
            fi
            ;;
        5)
            start_backend
            echo "Backend is running. Press Ctrl+C to stop."
            wait
            ;;
        6)
            echo "Goodbye! 👋"
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            main
            ;;
    esac
    
    # Keep script running
    echo ""
    echo "🎯 Development servers are running!"
    echo "Press Ctrl+C to stop all services"
    wait
}

# Run main function
main