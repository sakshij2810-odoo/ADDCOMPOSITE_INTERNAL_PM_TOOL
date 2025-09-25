#!/bin/bash

# Database Setup Script for PM Platform
echo "🚀 Setting up PM Platform Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed. Please install PostgreSQL first.${NC}"
    echo "Visit: https://www.postgresql.org/download/"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${RED}❌ PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    echo "On macOS: brew services start postgresql"
    echo "On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"

# Create database
echo -e "${BLUE}📦 Creating database 'pm_platform'...${NC}"
createdb pm_platform 2>/dev/null || echo -e "${YELLOW}⚠️  Database 'pm_platform' might already exist${NC}"

# Run schema
echo -e "${BLUE}📋 Running database schema...${NC}"
psql -d pm_platform -f database/schema.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema created successfully!${NC}"
else
    echo -e "${RED}❌ Failed to create database schema${NC}"
    exit 1
fi

# Generate Prisma client for each service
echo -e "${BLUE}🔧 Generating Prisma clients...${NC}"

# Auth service (needs to be updated to PostgreSQL)
echo -e "${YELLOW}⚠️  Updating auth-service to use PostgreSQL...${NC}"
cd microservices/auth-service
# Update Prisma schema to use PostgreSQL
sed -i.bak 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
sed -i.bak 's|url      = "file:./dev.db"|url      = env("DATABASE_URL")|' prisma/schema.prisma
npx prisma generate
cd ../..

# Project service
cd microservices/project-service
npx prisma generate
cd ../..

# Task service
cd microservices/task-service
npx prisma generate
cd ../..

# User service
cd microservices/user-service
npx prisma generate
cd ../..

echo -e "${GREEN}✅ Prisma clients generated successfully!${NC}"

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"

cd microservices/auth-service
npx prisma db push
cd ../..

cd microservices/project-service
npx prisma db push
cd ../..

cd microservices/task-service
npx prisma db push
cd ../..

cd microservices/user-service
npx prisma db push
cd ../..

echo -e "${GREEN}✅ Database migrations completed!${NC}"

# Verify database setup
echo -e "${BLUE}🔍 Verifying database setup...${NC}"
psql -d pm_platform -c "\dt" | head -20

echo -e "${GREEN}🎉 Database setup completed successfully!${NC}"
echo -e "${BLUE}📊 You can now view your database in Cursor using a PostgreSQL extension${NC}"
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Install PostgreSQL extension in Cursor"
echo "2. Connect to: postgresql://postgres:password@localhost:5432/pm_platform"
echo "3. Start your microservices with: npm run dev"
