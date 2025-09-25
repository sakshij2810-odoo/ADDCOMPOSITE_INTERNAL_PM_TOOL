#!/bin/bash

# Environment variables
export DATABASE_URL="postgresql://postgres:password@localhost:5432/pm_platform"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-2024"
export JWT_EXPIRES_IN="24h"
export NODE_ENV="development"
export CORS_ORIGIN="http://localhost:8004"

echo "🚀 Starting all microservices with database connection..."
echo "📊 Database: $DATABASE_URL"
echo "🔐 JWT Secret: $JWT_SECRET"
echo "🌐 CORS Origin: $CORS_ORIGIN"
echo ""

# Start all services
npm run dev
