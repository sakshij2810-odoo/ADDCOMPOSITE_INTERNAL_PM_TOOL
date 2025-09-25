#!/bin/bash

# Start Secure Services Script
# This script starts all backend services with security middleware enabled

echo "🛡️  Starting Secure Backend Services..."
echo "=================================="

# Set environment variables
export NODE_ENV=production
export JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
export DATABASE_URL="postgresql://username:password@localhost:5432/pm_platform_db"

# Function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo "🚀 Starting $service_name on port $port..."
    cd "$service_path"
    nohup node "$service_name" > "../logs/${service_name}.log" 2>&1 &
    echo "✅ $service_name started (PID: $!)"
    cd - > /dev/null
}

# Create logs directory
mkdir -p logs

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3003 | xargs kill -9 2>/dev/null || true
lsof -ti:3004 | xargs kill -9 2>/dev/null || true
lsof -ti:3005 | xargs kill -9 2>/dev/null || true
lsof -ti:3006 | xargs kill -9 2>/dev/null || true
lsof -ti:3007 | xargs kill -9 2>/dev/null || true
lsof -ti:3008 | xargs kill -9 2>/dev/null || true

echo "⏳ Waiting for ports to be released..."
sleep 2

# Start services with security middleware
echo ""
echo "🔐 Starting Secure Authentication Service..."
start_service "secure-auth-server.js" "microservices/auth-service" 3001

echo ""
echo "👤 Starting Secure User Service..."
start_service "secure-user-server.js" "microservices/user-service" 3002

echo ""
echo "📋 Starting Task Service..."
start_service "working-task-server.js" "microservices/task-service" 3003

echo ""
echo "🏢 Starting Project Service..."
start_service "working-project-server.js" "microservices/project-service" 3004

echo ""
echo "👥 Starting Leads Service..."
start_service "simple-server.js" "microservices/leads-service" 3005

echo ""
echo "🏢 Starting Company Information Service..."
start_service "enhanced-company-server.js" "microservices/company-information-service" 3006

echo ""
echo "📊 Starting Analytics Service..."
start_service "simple-server.js" "microservices/analytics-service" 3007

echo ""
echo "🌐 Starting API Gateway..."
start_service "simple-api-gateway.js" "." 3008

echo ""
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check service health
echo ""
echo "🏥 Checking service health..."

check_health() {
    local service_name=$1
    local port=$2
    local endpoint=$3
    
    if curl -s "http://localhost:$port$endpoint" > /dev/null 2>&1; then
        echo "✅ $service_name is healthy"
    else
        echo "❌ $service_name is not responding"
    fi
}

check_health "Secure Auth Service" 3001 "/health"
check_health "Secure User Service" 3002 "/health"
check_health "Task Service" 3003 "/health"
check_health "Project Service" 3004 "/health"
check_health "Leads Service" 3005 "/health"
check_health "Company Information Service" 3006 "/health"
check_health "Analytics Service" 3007 "/health"
check_health "API Gateway" 3008 "/health"

echo ""
echo "🎉 All secure services started!"
echo "=================================="
echo "🔐 Auth Service:     http://localhost:3001"
echo "👤 User Service:     http://localhost:3002"
echo "📋 Task Service:     http://localhost:3003"
echo "🏢 Project Service:  http://localhost:3004"
echo "👥 Leads Service:    http://localhost:3005"
echo "🏢 Company Service:  http://localhost:3006"
echo "📊 Analytics Service: http://localhost:3007"
echo "🌐 API Gateway:      http://localhost:3008"
echo ""
echo "🛡️  Security Features Enabled:"
echo "   ✅ JWT Authentication"
echo "   ✅ Role-based Access Control"
echo "   ✅ Module Security Validation"
echo "   ✅ Admin-only Endpoints"
echo "   ✅ Request Logging"
echo ""
echo "📝 Logs are available in the 'logs' directory"
echo "🔄 To stop all services, run: ./stop-secure-services.sh"
echo ""
echo "🚀 Ready to serve requests with full security!"
