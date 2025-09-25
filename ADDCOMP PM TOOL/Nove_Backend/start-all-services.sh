#!/bin/bash

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/pm_platform"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
export JWT_EXPIRES_IN="24h"

echo "🚀 Starting all microservices with API Gateway..."

# Start API Gateway
echo "📡 Starting API Gateway on port 3000..."
PORT=3000 node api-gateway.js &
GATEWAY_PID=$!

# Wait a moment for gateway to start
sleep 2

# Start Auth Service
echo "🔐 Starting Auth Service on port 3001..."
cd microservices/auth-service && PORT=3001 node working-auth-server.js &
AUTH_PID=$!

# Start User Service
echo "👤 Starting User Service on port 3002..."
cd ../user-service && PORT=3002 node working-user-server.js &
USER_PID=$!

# Start Project Service
echo "📋 Starting Project Service on port 3003..."
cd ../project-service && PORT=3003 node working-project-server.js &
PROJECT_PID=$!

# Start Task Service
echo "✅ Starting Task Service on port 3004..."
cd ../task-service && PORT=3004 node working-task-server.js &
TASK_PID=$!

# Start Company Service
echo "🏢 Starting Company Service on port 3005..."
cd ../company-information-service && PORT=3005 node simple-server.js &
COMPANY_PID=$!

# Start Leads Service
echo "🎯 Starting Leads Service on port 3006..."
cd ../leads-service && PORT=3006 node simple-server.js &
LEADS_PID=$!

# Start Analytics Service
echo "📊 Starting Analytics Service on port 3007..."
cd ../analytics-service && PORT=3007 node simple-server.js &
ANALYTICS_PID=$!

echo ""
echo "🎉 All services started!"
echo "🌐 API Gateway: http://localhost:3000"
echo "🔐 Auth Service: http://localhost:3001"
echo "👤 User Service: http://localhost:3002"
echo "📋 Project Service: http://localhost:3003"
echo "✅ Task Service: http://localhost:3004"
echo "🏢 Company Service: http://localhost:3005"
echo "🎯 Leads Service: http://localhost:3006"
echo "📊 Analytics Service: http://localhost:3007"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $GATEWAY_PID $AUTH_PID $USER_PID $PROJECT_PID $TASK_PID $COMPANY_PID $LEADS_PID $ANALYTICS_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM
