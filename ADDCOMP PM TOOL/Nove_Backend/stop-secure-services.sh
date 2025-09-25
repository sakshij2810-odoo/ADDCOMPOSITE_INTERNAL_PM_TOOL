#!/bin/bash

# Stop Secure Services Script
# This script stops all backend services

echo "🛑 Stopping Secure Backend Services..."
echo "=================================="

# Function to stop services on specific ports
stop_service() {
    local port=$1
    local service_name=$2
    
    echo "🛑 Stopping $service_name on port $port..."
    local pids=$(lsof -ti:$port)
    
    if [ -n "$pids" ]; then
        echo "   Found PIDs: $pids"
        kill -9 $pids
        echo "✅ $service_name stopped"
    else
        echo "   No process found on port $port"
    fi
}

# Stop all services
stop_service 3001 "Secure Auth Service"
stop_service 3002 "Secure User Service"
stop_service 3003 "Task Service"
stop_service 3004 "Project Service"
stop_service 3005 "Leads Service"
stop_service 3006 "Company Information Service"
stop_service 3007 "Analytics Service"
stop_service 3008 "API Gateway"

echo ""
echo "⏳ Waiting for processes to terminate..."
sleep 2

# Double-check and force kill if needed
echo "🧹 Force cleaning any remaining processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3003 | xargs kill -9 2>/dev/null || true
lsof -ti:3004 | xargs kill -9 2>/dev/null || true
lsof -ti:3005 | xargs kill -9 2>/dev/null || true
lsof -ti:3006 | xargs kill -9 2>/dev/null || true
lsof -ti:3007 | xargs kill -9 2>/dev/null || true
lsof -ti:3008 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ All secure services stopped!"
echo "=================================="
echo "📝 Logs are preserved in the 'logs' directory"
echo "🚀 To start services again, run: ./start-secure-services.sh"
