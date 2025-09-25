#!/bin/bash

echo "🧹 Cleaning up existing processes..."

# Kill any existing processes on our ports
pkill -f "working-auth-server.js" 2>/dev/null || true
pkill -f "working-user-server.js" 2>/dev/null || true
pkill -f "working-project-server.js" 2>/dev/null || true
pkill -f "working-task-server.js" 2>/dev/null || true
pkill -f "simple-server.js" 2>/dev/null || true
pkill -f "api-gateway.js" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

echo "✅ Cleanup complete!"
echo "🚀 Starting all services with API Gateway..."

# Set environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/pm_platform"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
export JWT_EXPIRES_IN="24h"

# Start all services
npm run dev
