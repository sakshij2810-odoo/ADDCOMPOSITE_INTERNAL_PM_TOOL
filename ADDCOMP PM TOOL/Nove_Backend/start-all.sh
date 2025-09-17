#!/bin/bash

# Start all backend services
echo "Starting all backend services..."

# Set environment variables
export NODE_ENV=development
export DATABASE_URL=postgresql://user:password@localhost:5432/pm_platform
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=your-jwt-secret-key-development
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
export CORS_ORIGIN=http://localhost:3000

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Start services in background
echo "Starting Auth Service on port 3001..."
cd "$SCRIPT_DIR/microservices/auth-service" && PORT=3001 npm run dev &

echo "Starting User Service on port 3002..."
cd "$SCRIPT_DIR/microservices/user-service" && PORT=3002 npm run dev &

echo "Starting Project Service on port 3003..."
cd "$SCRIPT_DIR/microservices/project-service" && PORT=3003 npm run dev &

echo "Starting Task Service on port 3004..."
cd "$SCRIPT_DIR/microservices/task-service" && PORT=3004 npm run dev &

echo "All services started! Check the logs above for any errors."
echo "Services running on:"
echo "- Auth Service: http://localhost:3001"
echo "- User Service: http://localhost:3002"
echo "- Project Service: http://localhost:3003"
echo "- Task Service: http://localhost:3004"

# Keep script running
wait
