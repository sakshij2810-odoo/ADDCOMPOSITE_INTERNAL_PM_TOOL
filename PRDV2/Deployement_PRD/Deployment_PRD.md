# Deployment PRD - AI-Powered Project Management Platform (PRDV2)

**Version:** 2.0  
**Date:** January 2025  
**Author:** Sakshi Jadhav  
**Stakeholders:** Pravin Luthada, Development Team  
**Based on:** Nove_Frontend Project Structure & Meeting Requirements

---

## 1. Executive Summary

### 1.1 Deployment Overview

This document outlines the deployment strategy for the AI-Powered Project Management Platform (PRDV2), built on the proven Nove_Frontend architecture with enhanced project management capabilities. The deployment focuses on Google Cloud Platform integration, containerization, and seamless scaling for a 20-person team.

### 1.2 Key Requirements

- **Google Cloud Platform:** Leverage existing Google infrastructure
- **Containerization:** Docker-based deployment
- **Scalability:** Support 100+ concurrent users
- **High Availability:** 99.9% uptime target
- **Security:** Enterprise-grade security
- **Mobile Distribution:** Direct SDK distribution to team

---

## 2. Infrastructure Architecture

### 2.1 Google Cloud Platform Setup

#### 2.1.1 Core Services

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                    │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)                                          │
│  ├── Cloud Run (Web App)                                   │
│  ├── Cloud Storage (Static Assets)                         │
│  └── Cloud CDN (Global Distribution)                       │
├─────────────────────────────────────────────────────────────┤
│  Microservices (Google Kubernetes Engine)                 │
│  ├── API Gateway (Kong)                                    │
│  ├── Auth Service                                          │
│  ├── User Service                                          │
│  ├── Project Service                                       │
│  ├── Task Service                                          │
│  ├── Analytics Service                                     │
│  ├── File Service                                          │
│  ├── Notification Service                                  │
│  ├── Integration Service                                   │
│  └── Reporting Service                                     │
├─────────────────────────────────────────────────────────────┤
│  Databases (Per Service)                                   │
│  ├── Cloud SQL (PostgreSQL) - Multiple Instances          │
│  ├── Cloud Memorystore (Redis Cluster)                    │
│  └── Cloud Storage (Files & Backups)                      │
├─────────────────────────────────────────────────────────────┤
│  Service Management                                        │
│  ├── Consul (Service Discovery)                           │
│  ├── Istio (Service Mesh)                                 │
│  └── Prometheus + Grafana (Monitoring)                    │
├─────────────────────────────────────────────────────────────┤
│  Monitoring & Logging                                       │
│  ├── Cloud Monitoring                                       │
│  ├── Cloud Logging                                          │
│  └── Error Reporting                                        │
├─────────────────────────────────────────────────────────────┤
│  Security                                                   │
│  ├── Identity and Access Management (IAM)                   │
│  ├── Cloud Security Command Center                          │
│  └── Cloud Armor (DDoS Protection)                         │
└─────────────────────────────────────────────────────────────┘
```

#### 2.1.2 Project Structure

```yaml
# gcp-microservices-setup.yaml
project_id: "addcomposites-pm-platform"
project_name: "Addcomposites PM Platform"
billing_account: "billing-account-id"
region: "us-central1"
zones: ["us-central1-a", "us-central1-b", "us-central1-c"]

# Kubernetes Cluster
gke_cluster:
  name: "pm-platform-cluster"
  version: "1.28"
  node_count: 3
  machine_type: "e2-standard-4"
  auto_scaling: true

# Microservices
microservices:
  - name: "api-gateway"
    service: "kong"
    replicas: 2
  - name: "auth-service"
    replicas: 2
  - name: "user-service"
    replicas: 2
  - name: "project-service"
    replicas: 3
  - name: "task-service"
    replicas: 3
  - name: "analytics-service"
    replicas: 2
  - name: "file-service"
    replicas: 2
  - name: "notification-service"
    replicas: 2
  - name: "integration-service"
    replicas: 2
  - name: "reporting-service"
    replicas: 2

# Service Discovery
service_discovery:
  consul:
    enabled: true
    replicas: 3

# Service Mesh
istio:
  enabled: true
  version: "1.19"

# Monitoring
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
  elk_stack:
    enabled: true

# Databases
databases:
  postgresql:
    instances: 5 # One per core service
    version: "15"
  redis:
    cluster_mode: true
    nodes: 3
```

### 2.2 Microservices Container Architecture

#### 2.2.1 Microservices Docker Images

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```dockerfile
# Microservice Dockerfile (Template)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
CMD ["npm", "start"]
```

```dockerfile
# API Gateway Dockerfile (Kong)
FROM kong:3.4-alpine
COPY kong.yml /usr/local/kong/declarative/kong.yml
EXPOSE 8000 8001 8443 8444
CMD ["kong", "docker-start"]
```

```dockerfile
# Consul Dockerfile
FROM consul:1.16
COPY consul.hcl /consul/config/consul.hcl
EXPOSE 8500 8600
CMD ["consul", "agent", "-config-file=/consul/config/consul.hcl"]
```

#### 2.2.2 Microservices Docker Compose (Development)

```yaml
# docker-compose.microservices.yml
version: "3.8"
services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://api-gateway:8000
    depends_on:
      - api-gateway

  # API Gateway
  api-gateway:
    build: ./api-gateway
    ports:
      - "8000:8000"
      - "8001:8001"
    environment:
      - KONG_DATABASE=off
      - KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
    depends_on:
      - consul

  # Service Discovery
  consul:
    build: ./consul
    ports:
      - "8500:8500"
      - "8600:8600"
    environment:
      - CONSUL_BIND_INTERFACE=eth0
    command: consul agent -server -bootstrap-expect=1 -ui -client=0.0.0.0

  # Microservices
  auth-service:
    build: ./microservices/auth-service
    environment:
      - DATABASE_URL=postgresql://user:pass@auth-db:5432/auth_service
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul:8500
    depends_on:
      - auth-db
      - redis
      - consul

  user-service:
    build: ./microservices/user-service
    environment:
      - DATABASE_URL=postgresql://user:pass@user-db:5432/user_service
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul:8500
    depends_on:
      - user-db
      - redis
      - consul

  project-service:
    build: ./microservices/project-service
    environment:
      - DATABASE_URL=postgresql://user:pass@project-db:5432/project_service
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul:8500
    depends_on:
      - project-db
      - redis
      - consul

  task-service:
    build: ./microservices/task-service
    environment:
      - DATABASE_URL=postgresql://user:pass@task-db:5432/task_service
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul:8500
    depends_on:
      - task-db
      - redis
      - consul

  analytics-service:
    build: ./microservices/analytics-service
    environment:
      - DATABASE_URL=postgresql://user:pass@analytics-db:5432/analytics_service
      - REDIS_URL=redis://redis:6379
      - CONSUL_HOST=consul:8500
    depends_on:
      - analytics-db
      - redis
      - consul

  # Databases (Per Service)
  auth-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=auth_service
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - auth_postgres_data:/var/lib/postgresql/data

  user-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=user_service
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - user_postgres_data:/var/lib/postgresql/data

  project-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=project_service
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - project_postgres_data:/var/lib/postgresql/data

  task-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=task_service
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - task_postgres_data:/var/lib/postgresql/data

  analytics-db:
    image: postgres:15
    environment:
      - POSTGRES_DB=analytics_service
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - analytics_postgres_data:/var/lib/postgresql/data

  # Redis Cluster
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  auth_postgres_data:
  user_postgres_data:
  project_postgres_data:
  task_postgres_data:
  analytics_postgres_data:
  redis_data:
```

---

## 3. Deployment Environments

### 3.1 Development Environment

#### 3.1.1 Local Development

```bash
# Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Cloud SDK
- PostgreSQL 15+

# Setup commands
git clone <repository>
cd pm-platform
docker-compose up -d
npm run dev
```

#### 3.1.2 Development Cloud Environment

```yaml
# cloudbuild-dev.yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/pm-platform-dev", "./"]
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/pm-platform-dev"]
  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "pm-platform-dev",
        "--image",
        "gcr.io/$PROJECT_ID/pm-platform-dev",
        "--region",
        "us-central1",
      ]
```

### 3.2 Staging Environment

#### 3.2.1 Staging Configuration

```yaml
# staging-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pm-platform-staging
data:
  DATABASE_URL: "postgresql://user:pass@staging-db:5432/pm_platform"
  REDIS_URL: "redis://staging-redis:6379"
  GOOGLE_CLIENT_ID: "staging-client-id"
  NODE_ENV: "staging"
```

#### 3.2.2 Staging Deployment

```bash
# Deploy to staging
gcloud run deploy pm-platform-staging \
  --image gcr.io/$PROJECT_ID/pm-platform:staging \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=staging
```

### 3.3 Production Environment

#### 3.3.1 Production Configuration

```yaml
# production-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pm-platform-production
data:
  DATABASE_URL: "postgresql://user:pass@prod-db:5432/pm_platform"
  REDIS_URL: "redis://prod-redis:6379"
  GOOGLE_CLIENT_ID: "prod-client-id"
  NODE_ENV: "production"
  LOG_LEVEL: "info"
```

#### 3.3.2 Production Deployment

```bash
# Deploy to production
gcloud run deploy pm-platform-production \
  --image gcr.io/$PROJECT_ID/pm-platform:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10
```

---

## 4. CI/CD Pipeline

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: |
          docker build -t gcr.io/$PROJECT_ID/pm-platform:$GITHUB_SHA .
          docker push gcr.io/$PROJECT_ID/pm-platform:$GITHUB_SHA

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Deploy to staging
        run: |
          gcloud run deploy pm-platform-staging \
            --image gcr.io/$PROJECT_ID/pm-platform:$GITHUB_SHA \
            --region us-central1

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: |
          gcloud run deploy pm-platform-production \
            --image gcr.io/$PROJECT_ID/pm-platform:$GITHUB_SHA \
            --region us-central1
```

### 4.2 Cloud Build Configuration

```yaml
# cloudbuild.yaml
steps:
  # Install dependencies
  - name: "gcr.io/cloud-builders/npm"
    args: ["ci"]

  # Run tests
  - name: "gcr.io/cloud-builders/npm"
    args: ["run", "test"]

  # Build frontend
  - name: "gcr.io/cloud-builders/npm"
    args: ["run", "build"]
    dir: "frontend"

  # Build backend
  - name: "gcr.io/cloud-builders/npm"
    args: ["run", "build"]
    dir: "backend"

  # Build Docker image
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/pm-platform:$SHORT_SHA", "."]

  # Push to registry
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/pm-platform:$SHORT_SHA"]

  # Deploy to Cloud Run
  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "pm-platform",
        "--image",
        "gcr.io/$PROJECT_ID/pm-platform:$SHORT_SHA",
        "--region",
        "us-central1",
      ]
```

---

## 5. Database Deployment

### 5.1 Cloud SQL Setup

#### 5.1.1 Database Instance

```bash
# Create Cloud SQL instance
gcloud sql instances create pm-platform-db \
  --database-version=POSTGRES_15 \
  --tier=db-n1-standard-2 \
  --region=us-central1 \
  --storage-type=SSD \
  --storage-size=100GB \
  --backup-start-time=02:00 \
  --enable-bin-log \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=03
```

#### 5.1.2 Database Configuration

```sql
-- Database setup
CREATE DATABASE pm_platform;
CREATE USER pm_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE pm_platform TO pm_user;

-- Enable extensions
\c pm_platform;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

### 5.2 Database Migration

#### 5.2.1 Prisma Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

#### 5.2.2 Migration Scripts

```typescript
// scripts/migrate.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrate() {
  // Create default admin user
  await prisma.user.create({
    data: {
      googleId: "admin-google-id",
      email: "admin@addcomposites.com",
      name: "Admin User",
      role: "admin",
    },
  });

  // Create default security groups
  await prisma.securityGroup.createMany({
    data: [
      {
        name: "Employees",
        description: "Default employee group",
        permissions: ["read:own_tasks", "update:own_tasks"],
      },
      {
        name: "Project Managers",
        description: "Project management group",
        permissions: ["read:projects", "create:projects", "update:projects"],
      },
    ],
  });
}

migrate()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 6. Security Configuration

### 6.1 IAM Setup

#### 6.1.1 Service Accounts

```bash
# Create service accounts
gcloud iam service-accounts create pm-platform-backend \
  --display-name="PM Platform Backend"

gcloud iam service-accounts create pm-platform-frontend \
  --display-name="PM Platform Frontend"

# Assign roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:pm-platform-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:pm-platform-backend@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/redis.editor"
```

#### 6.1.2 Security Policies

```yaml
# security-policy.yaml
apiVersion: networking.gke.io/v1
kind: SecurityPolicy
metadata:
  name: pm-platform-security-policy
spec:
  rules:
    - action: ALLOW
      match:
        versionedExpr: SRC_IPS_V1
        srcIpRanges: ["0.0.0.0/0"]
      priority: 1000
    - action: DENY
      match:
        versionedExpr: SRC_IPS_V1
        srcIpRanges: ["10.0.0.0/8"]
      priority: 2000
```

### 6.2 SSL/TLS Configuration

#### 6.2.1 SSL Certificate

```bash
# Create SSL certificate
gcloud compute ssl-certificates create pm-platform-ssl \
  --domains=pm.addcomposites.com,api.pm.addcomposites.com \
  --global
```

#### 6.2.2 Load Balancer

```yaml
# load-balancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: pm-platform-lb
  annotations:
    cloud.google.com/load-balancer-type: "External"
spec:
  type: LoadBalancer
  ports:
    - port: 443
      targetPort: 3000
      protocol: TCP
  selector:
    app: pm-platform
```

---

## 7. Monitoring and Logging

### 7.1 Cloud Monitoring Setup

#### 7.1.1 Monitoring Configuration

```yaml
# monitoring-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: monitoring-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'pm-platform'
      static_configs:
      - targets: ['pm-platform:3000']
```

#### 7.1.2 Alerting Rules

```yaml
# alerting-rules.yaml
groups:
  - name: pm-platform
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: DatabaseConnectionFailure
        expr: up{job="postgresql"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database connection failed"
```

### 7.2 Logging Configuration

#### 7.2.1 Structured Logging

```typescript
// logging.ts
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;
```

#### 7.2.2 Cloud Logging Integration

```typescript
// cloud-logging.ts
import { LoggingWinston } from "@google-cloud/logging-winston";

const loggingWinston = new LoggingWinston({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

logger.add(loggingWinston);
```

---

## 8. Mobile SDK Distribution

### 8.1 SDK Build Process

#### 8.1.1 React Native Build

```bash
# Build Android APK
cd mobile-sdk
npx react-native build-android --mode=release

# Build iOS IPA
npx react-native build-ios --mode=release
```

#### 8.1.2 Distribution Script

```bash
#!/bin/bash
# distribute-sdk.sh

# Build SDK
npm run build:sdk

# Create distribution package
zip -r pm-platform-sdk-v1.0.0.zip \
  dist/ \
  README.md \
  install.sh

# Upload to Cloud Storage
gsutil cp pm-platform-sdk-v1.0.0.zip gs://pm-platform-sdk/

# Generate download link
echo "SDK Download Link:"
echo "https://storage.googleapis.com/pm-platform-sdk/pm-platform-sdk-v1.0.0.zip"
```

### 8.2 Over-the-Air Updates

#### 8.2.1 Update Server

```typescript
// update-server.ts
import express from "express";
import { Storage } from "@google-cloud/storage";

const app = express();
const storage = new Storage();

app.get("/api/update/check", async (req, res) => {
  const { version, platform } = req.query;

  // Check for updates
  const latestVersion = await getLatestVersion(platform);

  if (version !== latestVersion) {
    const downloadUrl = await getDownloadUrl(latestVersion, platform);
    res.json({
      updateAvailable: true,
      version: latestVersion,
      downloadUrl,
    });
  } else {
    res.json({ updateAvailable: false });
  }
});
```

---

## 9. Backup and Disaster Recovery

### 9.1 Backup Strategy

#### 9.1.1 Database Backups

```bash
#!/bin/bash
# backup-database.sh

# Create backup
gcloud sql backups create \
  --instance=pm-platform-db \
  --description="Daily backup $(date +%Y%m%d)"

# Export to Cloud Storage
gcloud sql export sql pm-platform-db \
  gs://pm-platform-backups/db-backup-$(date +%Y%m%d).sql \
  --database=pm_platform
```

#### 9.1.2 Application Backups

```bash
#!/bin/bash
# backup-application.sh

# Backup application data
gsutil -m rsync -r /app/uploads gs://pm-platform-backups/uploads/

# Backup configuration
gsutil cp /app/config/* gs://pm-platform-backups/config/
```

### 9.2 Disaster Recovery

#### 9.2.1 Recovery Procedures

```bash
#!/bin/bash
# disaster-recovery.sh

# Restore database
gcloud sql backups restore BACKUP_ID \
  --restore-instance=pm-platform-db-new \
  --backup-instance=pm-platform-db

# Restore application
gcloud run deploy pm-platform-recovery \
  --image gcr.io/$PROJECT_ID/pm-platform:latest \
  --region us-central1
```

---

## 10. Performance Optimization

### 10.1 CDN Configuration

#### 10.1.1 Cloud CDN Setup

```yaml
# cdn-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cdn-config
data:
  nginx.conf: |
    server {
        listen 80;
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
```

### 10.2 Caching Strategy

#### 10.2.1 Redis Configuration

```yaml
# redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-config
data:
  redis.conf: |
    maxmemory 256mb
    maxmemory-policy allkeys-lru
    save 900 1
    save 300 10
    save 60 10000
```

---

## 11. Cost Optimization

### 11.1 Resource Optimization

#### 11.1.1 Auto-scaling

```yaml
# autoscaling.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pm-platform-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pm-platform
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

### 11.2 Cost Monitoring

#### 11.2.1 Budget Alerts

```bash
# Create budget alert
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="PM Platform Budget" \
  --budget-amount=1000USD \
  --threshold-rule=percent=80 \
  --threshold-rule=percent=100
```

---

**Document Status:** Deployment Focus - PRDV2  
**Next Review:** After infrastructure setup  
**Approval Required:** Pravin Luthada, Technical Lead  
**Based on:** Nove_Frontend Architecture & Meeting Requirements
