# Nove Backend - AI-Powered Project Management Platform

## Overview

This is the microservices backend for the AI-Powered Project Management Platform, built according to PRDV2 specifications. The system provides a simplified, mobile-first interface for daily task management while leveraging existing Google infrastructure.

## Architecture

### Microservices Structure

```
Nove_Backend/
├── api-gateway/                 # Kong API Gateway
├── microservices/
│   ├── auth-service/           # Authentication & Authorization
│   ├── user-service/           # User Profile Management
│   ├── project-service/        # Project Lifecycle Management
│   ├── task-service/           # Task & Daily Task Management
│   ├── analytics-service/      # Data Analytics & Reporting
│   ├── file-service/           # File & Document Management
│   ├── notification-service/   # Real-time Notifications
│   ├── integration-service/    # Google APIs Integration
│   └── reporting-service/      # Advanced Reporting
├── shared/                     # Shared Libraries
│   ├── types/                  # TypeScript Types
│   ├── utils/                  # Utility Functions
│   └── config/                 # Configuration
├── docker/                     # Docker Configurations
├── kubernetes/                 # Kubernetes Manifests
└── scripts/                    # Deployment Scripts
```

## Key Features

- **Human Resource Optimization**: AI-powered daily task generation (max 3 tasks per day)
- **Google Ecosystem Integration**: Drive, Calendar, Chat, Meet
- **Addcomposites oy API Integration**: Seamless integration with existing systems
- **Microservices Architecture**: Scalable, maintainable, and fault-tolerant
- **Real-time Updates**: WebSocket-based notifications
- **Time Tracking**: Percentage-based time tracking for profitability analysis

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **API Gateway**: Kong
- **Service Discovery**: Consul
- **Message Queue**: Redis Pub/Sub
- **Authentication**: Google OAuth 2.0 + Addcomposites oy Auth
- **Containerization**: Docker + Kubernetes
- **Cloud**: Google Cloud Platform

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository>
   cd Nove_Backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start Development Environment**

   ```bash
   # Start all services
   npm run dev

   # Or start individual services
   npm run dev:gateway
   npm run dev:auth
   ```

5. **Docker Development**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

## API Endpoints

### Authentication Service

- `POST /api/v1/authentication/login` - Google OAuth login
- `POST /api/v1/authentication/validate-otp-get-token` - OTP validation
- `PUT /api/v1/authentication/logout` - Logout

### Task Service (Core Feature)

- `GET /api/v1/daily-tasks` - Get user's daily tasks (1-3 max)
- `POST /api/v1/daily-tasks/generate` - Generate daily tasks
- `PUT /api/v1/daily-tasks/:id/status` - Update task status
- `POST /api/v1/daily-tasks/:id/timer` - Start/stop timer

### Project Service

- `GET /api/v1/projects` - Get all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id/analytics` - Get project analytics

### Resource Management

- `GET /api/v1/resources/availability` - Get resource availability
- `POST /api/v1/resources/allocate` - Allocate resource to project
- `GET /api/v1/resources/conflicts` - Check for resource conflicts

## Google Integration

- **Google Drive**: Project folder management
- **Google Calendar**: Availability checking and meeting integration
- **Google Chat**: Project-specific communication
- **Google Meet**: Meeting links and integration

## Development

### Adding New Features

1. Create feature branch
2. Implement in appropriate microservice
3. Add tests (unit, integration, e2e)
4. Update API documentation
5. Create pull request

### Testing

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests for specific service
cd microservices/auth-service && npm test
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment

### Docker Deployment

```bash
# Build all services
npm run docker:build

# Deploy to development
npm run docker:up

# View logs
npm run docker:logs
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods
kubectl get services
```

## Monitoring

- **Health Checks**: `/health` endpoint on each service
- **Metrics**: Prometheus metrics collection
- **Logging**: Structured JSON logging
- **Tracing**: Distributed tracing support

## Contributing

1. Follow the microservices architecture patterns
2. Maintain API versioning (`/api/v1/`)
3. Write comprehensive tests
4. Update documentation
5. Follow TypeScript best practices

## License

MIT License - see LICENSE file for details

## Support

For questions and support, contact the development team or create an issue in the repository.
