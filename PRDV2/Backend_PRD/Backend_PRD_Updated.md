# Backend PRD - AI-Powered Project Management Platform (PRDV2)

**Version:** 2.0  
**Date:** January 2025  
**Author:** Sakshi Jadhav  
**Stakeholders:** Pravin Luthada, Development Team  
**Based on:** Nova World Group API Structure & Meeting Requirements

---

## 1. Executive Summary

### 1.1 Problem Statement

The current Odoo-based project management system suffers from inefficient work allocation, overwhelming user interfaces, and lack of integration with existing Google ecosystem tools. Employees struggle with complex interfaces and cannot easily identify their daily priorities, leading to decreased productivity and poor resource optimization.

### 1.2 Solution Overview

An AI-powered project management platform that provides a simplified, mobile-first interface for daily task management while leveraging existing Google infrastructure (Drive, Calendar, Meet) for comprehensive project documentation and resource tracking. This system is built on the proven Nova World Group API architecture with enhanced project management capabilities.

### 1.3 Key Vision from Meeting

- **Human Resource Optimization:** Primary goal is to ensure every employee knows their tasks upon entering the office
- **Simplified Daily Interface:** Maximum 1-3 tasks per day for employees
- **Google Ecosystem Integration:** Leverage existing Google Drive, Calendar, and Chat infrastructure
- **Project Characterization:** Everything is a project (internal R&D, client work)
- **Dynamic Resource Allocation:** Prevent double/triple allocation of resources
- **Time Tracking:** Percentage-based time tracking for project profitability analysis

---

## 2. Backend Architecture

### 2.1 Technology Stack

#### Microservices Backend

- **Framework:** Node.js with Express.js (per service)
- **API Gateway:** Kong or Express Gateway
- **Service Discovery:** Consul
- **Message Queue:** Redis Pub/Sub
- **Database:** PostgreSQL with Prisma ORM (per service)
- **Authentication:** Google OAuth 2.0 + Nova World Group Auth
- **API:** RESTful APIs with OpenAPI documentation
- **Real-time:** WebSocket for live updates
- **Caching:** Redis for session management and caching
- **File Storage:** Google Drive API + S3 integration
- **Validation:** Joi for request validation
- **Documentation:** Swagger/OpenAPI 3.0
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana)

#### Infrastructure

- **Hosting:** Google Cloud Platform
- **Containerization:** Docker + Kubernetes
- **Orchestration:** Google Kubernetes Engine (GKE)
- **Service Mesh:** Istio (optional)
- **CI/CD:** GitHub Actions + ArgoCD
- **Monitoring:** Prometheus + Grafana + Google Cloud Monitoring
- **Logging:** ELK Stack + Google Cloud Logging
- **Database:** Google Cloud SQL (PostgreSQL) per service
- **CDN:** Google Cloud CDN
- **Load Balancer:** Google Cloud Load Balancer + Kong Gateway
- **Service Discovery:** Consul on GKE
- **Message Queue:** Redis Cluster on GKE

### 2.2 Microservices Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile SDK    │    │   Web App       │    │   Admin Panel   │
│   (React Native)│    │   (React)       │    │   (React)       │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      API Gateway          │
                    │   (Kong/Express Gateway)  │
                    └─────────────┬─────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────┴────────┐    ┌──────────┴──────────┐    ┌───────┴────────┐
│  Auth Service  │    │  Project Service    │    │  Task Service  │
│  (Node.js)     │    │  (Node.js)          │    │  (Node.js)     │
└────────────────┘    └─────────────────────┘    └────────────────┘
        │                        │                        │
┌───────┴────────┐    ┌──────────┴──────────┐    ┌───────┴────────┐
│  User Service  │    │  Analytics Service  │    │  File Service  │
│  (Node.js)     │    │  (Node.js)          │    │  (Node.js)     │
└────────────────┘    └─────────────────────┘    └────────────────┘
        │                        │                        │
┌───────┴────────┐    ┌──────────┴──────────┐    ┌───────┴────────┐
│  Notification  │    │  Integration       │    │  Reporting     │
│  Service       │    │  Service           │    │  Service       │
│  (Node.js)     │    │  (Node.js)         │    │  (Node.js)     │
└────────────────┘    └─────────────────────┘    └────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Shared Databases     │
                    │  (PostgreSQL + Redis)     │
                    └───────────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │   Google APIs Integration │
                    │   (Drive, Calendar, Meet) │
                    └───────────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │   Nova World Group API    │
                    │   (External Integration)  │
                    └───────────────────────────┘
```

### 2.3 Microservices Breakdown

#### 2.3.1 Core Services

**1. API Gateway Service**

- **Purpose:** Single entry point for all client requests
- **Technology:** Kong or Express Gateway
- **Responsibilities:**
  - Request routing and load balancing
  - Authentication and authorization
  - Rate limiting and throttling
  - Request/response transformation
  - API versioning

**2. Authentication Service**

- **Purpose:** User authentication and authorization
- **Database:** PostgreSQL (users, sessions, tokens)
- **Responsibilities:**
  - Google OAuth 2.0 integration
  - Nova World Group auth integration
  - JWT token management
  - Session management
  - Multi-factor authentication (MFA)

**3. User Service**

- **Purpose:** User profile and management
- **Database:** PostgreSQL (users, profiles, preferences)
- **Responsibilities:**
  - User profile management
  - Role and permission management
  - User preferences and settings
  - User analytics and activity tracking

**4. Project Service**

- **Purpose:** Project lifecycle management
- **Database:** PostgreSQL (projects, project_members, project_settings)
- **Responsibilities:**
  - Project CRUD operations
  - Project member management
  - Project settings and configuration
  - Project status tracking
  - Project analytics

**5. Task Service**

- **Purpose:** Task and daily task management
- **Database:** PostgreSQL (tasks, daily_tasks, task_dependencies)
- **Responsibilities:**
  - Task CRUD operations
  - Daily task generation and management
  - Task status updates
  - Task dependencies and workflows
  - Task time tracking

**6. Analytics Service**

- **Purpose:** Data analytics and reporting
- **Database:** PostgreSQL (analytics, reports, metrics)
- **Responsibilities:**
  - Project progress analytics
  - Resource utilization metrics
  - Team performance analytics
  - Profitability analysis
  - Custom report generation

**7. File Service**

- **Purpose:** File and document management
- **Storage:** Google Drive API + S3
- **Database:** PostgreSQL (files, file_permissions)
- **Responsibilities:**
  - File upload and download
  - Google Drive integration
  - File versioning
  - File permissions and sharing
  - Document processing

**8. Notification Service**

- **Purpose:** Real-time notifications and messaging
- **Technology:** WebSocket + Redis
- **Database:** PostgreSQL (notifications, notification_preferences)
- **Responsibilities:**
  - Real-time notifications
  - Email notifications
  - Push notifications (mobile)
  - Notification preferences
  - Notification history

**9. Integration Service**

- **Purpose:** Third-party integrations
- **Technology:** Google APIs, Microsoft Graph
- **Responsibilities:**
  - Google Calendar integration
  - Google Meet integration
  - Google Chat integration
  - Microsoft Graph integration
  - Webhook management

**10. Reporting Service**

- **Purpose:** Advanced reporting and data export
- **Database:** PostgreSQL (reports, report_templates)
- **Responsibilities:**
  - Custom report generation
  - Data export (PDF, Excel, CSV)
  - Scheduled reports
  - Report templates
  - Dashboard data

#### 2.3.2 Service Communication

**Synchronous Communication:**

- **HTTP/REST:** Service-to-service API calls
- **Load Balancing:** Round-robin and health-based routing
- **Circuit Breaker:** Fault tolerance and resilience

**Asynchronous Communication:**

- **Message Queue:** Redis Pub/Sub for event-driven communication
- **Event Sourcing:** Event-driven architecture for data consistency
- **Webhooks:** Real-time updates between services

**Service Discovery:**

- **Consul:** Service registration and discovery
- **Health Checks:** Automated service health monitoring
- **Load Balancing:** Dynamic service routing

#### 2.3.3 Data Management

**Database per Service:**

- Each microservice owns its data
- No direct database sharing between services
- Eventual consistency through events

**Shared Databases:**

- **PostgreSQL:** Primary data store for core services
- **Redis:** Caching, session storage, and message queuing
- **Google Cloud SQL:** Managed PostgreSQL instances

**Data Consistency:**

- **Saga Pattern:** Distributed transaction management
- **Event Sourcing:** Audit trail and data consistency
- **CQRS:** Command Query Responsibility Segregation

---

## 3. API Endpoints (Based on Nova World Group API Structure)

### 3.1 Authentication Endpoints

```
POST /api/v1/authentication/user-verification    # User account verification
POST /api/v1/authentication/login                # Login
POST /api/v1/authentication/validate-otp-get-token # Validate OTP for getting token
POST /api/v1/authentication/forget-password      # Generate OTP for forget password
PUT  /api/v1/authentication/logout               # Logout a user
```

### 3.2 User Management Endpoints

```
POST /api/v1/user/upsert-user                    # Create or Update primary details of User
POST /api/v1/user/update-profile                 # Create or update User
GET  /api/v1/user/get-user                       # Get all User
POST /api/v1/user/change-user-role               # Create or update User
GET  /api/v1/user/get-assignee                   # Get all Assignee
```

### 3.3 Task Management (Core Feature)

```
POST /api/v1/tasks/upsert-user-taskboard         # Create user task
GET  /api/v1/tasks/get-user-taskboard            # Retrieve user taskboard
POST /api/v1/tasks/create-task-module-wise       # Create Tasks module wise
GET  /api/v1/tasks/get-task-module-wise          # Get all task module wise
```

### 3.4 Daily Task Management (Core Feature - Custom Implementation)

```
GET    /api/v1/daily-tasks                       # Get user's daily tasks (1-3 max)
GET    /api/v1/daily-tasks/:date                 # Get tasks for specific date
POST   /api/v1/daily-tasks/generate              # Generate daily tasks for user
PUT    /api/v1/daily-tasks/:id/status            # Update task status
POST   /api/v1/daily-tasks/:id/complete          # Mark task as complete
POST   /api/v1/daily-tasks/:id/skip              # Skip task
POST   /api/v1/daily-tasks/:id/timer             # Start/stop timer
GET    /api/v1/daily-tasks/today                 # Get today's tasks
GET    /api/v1/daily-tasks/upcoming              # Get upcoming tasks
GET    /api/v1/daily-tasks/completed             # Get completed tasks
```

### 3.5 Project Management (Custom Implementation)

```
GET    /api/v1/projects                          # Get all projects
POST   /api/v1/projects                          # Create new project
GET    /api/v1/projects/:id                      # Get project details
PUT    /api/v1/projects/:id                      # Update project
DELETE /api/v1/projects/:id                      # Delete project
GET    /api/v1/projects/:id/tasks                # Get project tasks
GET    /api/v1/projects/:id/gantt                # Get Gantt chart data
GET    /api/v1/projects/:id/resources            # Get project resources
GET    /api/v1/projects/:id/timeline             # Get project timeline
GET    /api/v1/projects/:id/analytics            # Get project analytics
POST   /api/v1/projects/:id/allocate-resource    # Allocate resource to project
PUT    /api/v1/projects/:id/status               # Update project status
POST   /api/v1/projects/:id/archive              # Archive project
```

### 3.6 Resource Management (Custom Implementation)

```
GET    /api/v1/resources/availability            # Get resource availability
GET    /api/v1/resources/overallocation          # Check for resource conflicts
POST   /api/v1/resources/allocate                # Allocate resource to project
PUT    /api/v1/resources/:id                     # Update allocation
DELETE /api/v1/resources/:id                     # Remove allocation
GET    /api/v1/resources/planning                # Get resource planning view
GET    /api/v1/resources/reports                 # Get resource reports
GET    /api/v1/resources/conflicts               # Get resource conflicts
```

### 3.7 Reallocation Management (Custom Implementation)

```
GET    /api/v1/reallocation-requests             # Get reallocation requests
POST   /api/v1/reallocation-requests             # Create reallocation request
PUT    /api/v1/reallocation-requests/:id         # Approve/reject request
GET    /api/v1/reallocation-requests/pending     # Get pending requests
```

### 3.8 Google Integration (Custom Implementation)

```
GET    /api/v1/google/drive/folders              # Get Google Drive folders
POST   /api/v1/google/drive/sync                 # Sync with Google Drive
GET    /api/v1/google/drive/:folderId            # Get specific folder
GET    /api/v1/google/calendar/availability      # Get calendar availability
POST   /api/v1/google/calendar/sync              # Sync with Google Calendar
GET    /api/v1/google/meet/links                 # Get Google Meet links
GET    /api/v1/google/chat/messages              # Get chat messages
POST   /api/v1/google/chat/send                  # Send chat message
```

### 3.9 Analytics & Reporting

```
GET /api/v1/analytics/get-analytics              # Count Active users|leads|customer
GET /api/v1/analytics/project-progress           # Project progress analytics
GET /api/v1/analytics/resource-utilization       # Resource utilization
GET /api/v1/analytics/profitability              # Project profitability
GET /api/v1/analytics/daily-summary              # Daily work summary
GET /api/v1/analytics/timeline-deviations        # Timeline deviation analytics
GET /api/v1/analytics/team-performance           # Team performance metrics
```

### 3.10 Time Tracking Endpoints (Custom Implementation)

```
GET    /api/v1/time-entries                      # Get time entries
POST   /api/v1/time-entries                      # Create time entry
PUT    /api/v1/time-entries/:id                  # Update time entry
DELETE /api/v1/time-entries/:id                  # Delete time entry
GET    /api/v1/time-entries/summary              # Get time summary
GET    /api/v1/time-entries/export               # Export time data
GET    /api/v1/time-entries/user/:userId         # Get user time entries
```

### 3.11 Notification Endpoints (Custom Implementation)

```
GET    /api/v1/notifications                     # Get notifications
PUT    /api/v1/notifications/:id/read            # Mark notification as read
PUT    /api/v1/notifications/mark-all-read       # Mark all notifications as read
POST   /api/v1/notifications/send                # Send notification
GET    /api/v1/notifications/unread              # Get unread notifications
```

### 3.12 File Manager Integration

```
POST /api/v1/general/upload-files                # Upload files
GET  /api/v1/general/download-files              # Download files
POST /api/v1/general/file-explorer               # Explore files and folders in S3
POST /api/v1/general/file-move                   # Move files in S3
POST /api/v1/general/file-rename-folder          # Rename folder in S3
POST /api/v1/general/file-rename                 # Rename file in S3
```

### 3.13 Company Management

```
POST /api/v1/companyInformation/upsert-company-information        # Post Company Information
GET  /api/v1/companyInformation/get-company-information           # Get Company Information
POST /api/v1/companyInformation/upsert-environment-configuration  # Post Site Configuration
GET  /api/v1/companyInformation/get-environment-configuration     # Get Site Configuration
GET  /api/v1/companyInformation/get-public-company-information    # Get Company Information (Public)
```

### 3.14 Security & Administration

```
POST /api/v1/security/upsert-roles                               # Post Roles
GET  /api/v1/security/get-roles                                  # Get Roles
POST /api/v1/security/upsert-role-module-content-access-permission # Upsert Security Modules
GET  /api/v1/security/get-role-module-content-access-permission  # Get Roles
GET  /api/v1/security/get-modules                                # Get Modules
POST /api/v1/security/upsert-role-group                          # Create or update role groups
GET  /api/v1/security/get-role-group                             # Retrieve Role Groups
```

### 3.15 Customer Management

```
POST /api/v1/customer/upsert-customer                            # Create leads from outside and update status
GET  /api/v1/customer/get-customer                               # Get all customer personal information
POST /api/v1/customer/edit-customer-prospact-details             # Create customer prospect details
GET  /api/v1/customer/check-customer-prospact-details-customer-code # Check customer prospect details customer code
GET  /api/v1/customer/get-customer-prospact-details              # Get all customer prospect details
POST /api/v1/customer/edit-customer-social                       # Create customer social
GET  /api/v1/customer/get-customer-social                        # Get all customer social
POST /api/v1/customer/edit-document                               # Create or update a document
GET  /api/v1/customer/get-document                                # Get all customer documents
POST /api/v1/customer/edit-customer-pr                           # Create or update customer PR details
GET  /api/v1/customer/get-customer-pr                            # Get all customer PR details
POST /api/v1/customer/upsert-customer-service                    # Create policy business customer info
GET  /api/v1/customer/get-customer-service                       # Get all customer service
POST /api/v1/customer/upsert-customer-automation                 # Create or update customer automation
GET  /api/v1/customer/get-customer-automation                    # Get all customer automation
POST /api/v1/customer/upsert-customer-invoice                    # Create or update customer invoice
GET  /api/v1/customer/get-customer-invoice                       # Get customer invoice details
```

### 3.16 Service Management

```
GET  /api/v1/services/get-services-public                        # Get all business customer info (Public)
POST /api/v1/services/create-services                            # Create policy business customer info
GET  /api/v1/services/get-services                               # Get all business customer info
```

### 3.17 Lead Management

```
POST /api/v1/lead/upsert-lead                                    # Create leads from logged-in user
POST /api/v1/lead/auth-upsert-lead                               # Create leads from logged-in user (Auth)
GET  /api/v1/lead/get-leads                                      # Retrieve all leads or specific lead by ID
POST /api/v1/lead/create-opportunity                             # Create leads from outside and update status
GET  /api/v1/lead/get-opportunity                                # Get all leads as well as lead by id
POST /api/v1/lead/edit-crs_draws                                 # Create or update CRS draws
GET  /api/v1/lead/get-crs_draws                                  # Get all CRS draws
POST /api/v1/lead/edit-noc_codes                                 # Create or update NOC codes
GET  /api/v1/lead/get-noc_codes                                  # Get all NOC codes
POST /api/v1/lead/edit-crs_draws_group                           # Create or update CRS draws group
GET  /api/v1/lead/get-crs_draws_group                            # Get all CRS draws group
POST /api/v1/lead/edit-study                                     # Create or update study program
GET  /api/v1/lead/get-study                                      # Get all study programs
GET  /api/v1/lead/lead-reports                                   # Download lead information
POST /api/v1/lead/lead-suggestion                                # Get lead suggestions based on provided data
POST /api/v1/lead/sign-document                                  # Send document for electronic signature
GET  /api/v1/lead/signature-history                              # Get document signature history
GET  /api/v1/lead/generate-signed-document                       # Generate signed document
POST /api/v1/lead/sign-document-webhook                          # Receive webhook notifications for document signing
GET  /api/v1/lead/lead-signature                                 # Retrieve all leads or specific lead by ID
POST /api/v1/lead/retainer                                       # Create or update retainer
GET  /api/v1/lead/get-retainer                                   # Get all retainer
GET  /api/v1/lead/create-retainer-pdf-document                   # Create retainer PDF document
POST /api/v1/lead/signature-customer-webhook                     # Receive webhook notifications for document signing
POST /api/v1/lead/fetch-graphs-from-lead-data                    # Fetch graphs from lead data using genai
GET  /api/v1/lead/get-lead-graph-data                            # Get lead graph data
POST /api/v1/lead/extract-lead-with-genai                        # Extract lead with genai
```

### 3.18 Accounting Management

```
POST /api/v1/accounting/edit-account-payment-accounts-receivable  # Create customer prospect details
GET  /api/v1/accounting/get-account-payment-accounts-receivable   # Get all customer prospect details
POST /api/v1/accounting/edit-account-invoice-payment-transaction-items # Create customer prospect details
GET  /api/v1/accounting/get-account-invoice-payment-transaction-items # Get all customer prospect details
GET  /api/v1/accounting/get-account-payment-accounts-receivable-history # Get all customer prospect details
POST /api/v1/accounting/edit-account-company-charts-of-accounts  # Create customer prospect details
GET  /api/v1/accounting/get-account-company-charts-of-accounts   # Get all customer prospect details
POST /api/v1/accounting/edit-account-company-gl-accounts         # Create customer prospect details
GET  /api/v1/accounting/get-account-company-gl-accounts          # Get all customer prospect details
POST /api/v1/accounting/edit-account-company-information         # Create customer prospect details
GET  /api/v1/accounting/get-account-company-information          # Get all customer prospect details
GET  /api/v1/accounting/get-account-company-information-public   # Get all customer prospect details (Public)
POST /api/v1/accounting/edit-account-company-onboarding         # Create customer prospect details
GET  /api/v1/accounting/get-account-company-onboarding          # Get all customer prospect details
POST /api/v1/accounting/edit-account-invoice                    # Create customer prospect details
GET  /api/v1/accounting/get-account-invoice                     # Get all customer prospect details
GET  /api/v1/accounting/get-account-invoice-and-payment-history # Get all customer prospect details
POST /api/v1/accounting/edit-accn-transaction-report            # Create customer prospect details
GET  /api/v1/accounting/get-accn-transaction-report-history     # Get history of transaction report
GET  /api/v1/accounting/get-accn-reports-fields-to-exports      # Get all fields of reports
GET  /api/v1/accounting/get-account-amount-sum                  # Get all customer prospect details
POST /api/v1/accounting/edit-account-invoice-template           # Create customer prospect details
GET  /api/v1/accounting/get-account-invoice-template            # Get all customer prospect details
POST /api/v1/accounting/edit-account-transaction-type           # Create customer prospect details
GET  /api/v1/accounting/get-account-transaction-type            # Get all customer prospect details
POST /api/v1/accounting/edit-account-transaction-description    # Create customer prospect details
GET  /api/v1/accounting/get-account-transaction-description     # Get all customer prospect details
POST /api/v1/accounting/edit-account-create-bill                # Creating Bills
GET  /api/v1/accounting/get-account-create-bill                 # Get all customer prospect details
GET  /api/v1/accounting/get-account-bill-and-payment-history    # Get all customer prospect details
POST /api/v1/accounting/edit-account-bill-payment-transaction-items # Create customer prospect details
GET  /api/v1/accounting/get-account-bill-payment-transaction-items # Get all customer prospect details
POST /api/v1/accounting/edit-account-bill-template              # Create customer prospect details
GET  /api/v1/accounting/get-account-bill-template               # Get all customer prospect details
POST /api/v1/accounting/edit-account-create-payment             # Create customer prospect details
GET  /api/v1/accounting/get-account-create-payment              # Get all customer prospect details
POST /api/v1/accounting/edit-account-bank-account               # Create customer prospect details
GET  /api/v1/accounting/get-account-bank-account                # Get all customer prospect details
POST /api/v1/accounting/edit-account-cheque                     # Create customer prospect details
GET  /api/v1/accounting/get-account-cheque                      # Get all customer prospect details
POST /api/v1/accounting/edit-account-vendor                     # Create customer prospect details
GET  /api/v1/accounting/get-account-vendor                      # Get all customer prospect details
POST /api/v1/accounting/edit-account-system-gl-account          # Create account system gl account
GET  /api/v1/accounting/get-account-system-gl-account           # Get all system gl accounts
```

### 3.19 Approval Management

```
POST /api/v1/approval/insert-approval                           # Create or insert Approval
POST /api/v1/approval/handle-approval                           # Create or update Approval
GET  /api/v1/approval/get-approval                              # Get Approvals
POST /api/v1/approval/insert-approval-count                     # Create or update Approval Count
GET  /api/v1/approval/get-approval-count                        # Get Approvals
GET  /api/v1/approval/get-table-status                          # Get Table Status
```

### 3.20 Comment Management

```
POST /api/v1/comment/upsert-comment                             # Post Comment
GET  /api/v1/comment/get-comment                                # Get Comment
```

### 3.21 Conversation Management

```
GET  /api/v1/conversation/get-conversation                      # Get conversation
POST /api/v1/conversation/upsert-messages                       # Upsert messages
GET  /api/v1/conversation/get-messages                          # Get messages
```

### 3.22 Data Management

```
POST /api/v1/dataManagement/upsert-branch                       # Create or update branch
GET  /api/v1/dataManagement/get-branch                          # Get all branch
POST /api/v1/dataManagement/upsert-zone                         # Create or update zone
GET  /api/v1/dataManagement/get-zone                            # Get all zone
```

### 3.23 Formula Management

```
POST /api/v1/formula/upsert-formula                             # Create or Update Formula
GET  /api/v1/formula/get-formula                                # Get Formula
```

### 3.24 General Utilities

```
POST /api/v1/general/send-grid-email                            # Send an email
POST /api/v1/general/upload-files                               # Upload files
GET  /api/v1/general/download-files                             # Download files
GET  /api/v1/general/microsoftgraph/get-inbox                   # Get Inbox through Microsoft Graph
GET  /api/v1/general/microsoftgraph/search                      # Search Subject through Microsoft Graph
GET  /api/v1/general/microsoftgraph/fetchUnreadEmails           # Fetch unread emails through Microsoft Graph
POST /api/v1/general/microsoftgraph/send-email                  # Send an email
POST /api/v1/general/approval/status-approval                   # Approval Status
POST /api/v1/general/base64-to-buffer                           # Convert base64 to buffer
GET  /api/v1/general/get-table-info                             # Get Table Info
GET  /api/v1/general/get-table-description                      # Get Table Info
POST /api/v1/general/generate-dynamic-sql                       # Generate Dynamic SQL
POST /api/v1/general/file-explorer                              # Explore files and folders in S3
POST /api/v1/general/file-move                                  # Move files in S3
POST /api/v1/general/file-rename-folder                         # Rename folder in S3
POST /api/v1/general/file-rename                                # Rename file in S3
GET  /api/v1/general/get-record-counts                          # Get count of total records per column
GET  /api/v1/general/get-table-or-column-name                   # Get all commauto additional information
POST /api/v1/general/upsert-country-state                       # Create or update country state information
GET  /api/v1/general/get-country-state                          # Get country state information
GET  /api/v1/general/get-process                                # Get country state information
```

### 3.25 History Management

```
POST /api/v1/history/upsert-history                             # Post History
GET  /api/v1/history/get-history                                # Get History
POST /api/v1/history/upsert-email-history                       # Post Email History
GET  /api/v1/history/get-email-history                          # Get Email History
```

### 3.26 Questionnaire Management

```
POST /api/v1/questionnaire/upsert-questionnaire                 # Post Questionnaire
GET  /api/v1/questionnaire/get-questionnaire                    # Get questionnaire
POST /api/v1/questionnaire/upsert-question                      # Post Question
GET  /api/v1/questionnaire/get-question                         # Get question
POST /api/v1/questionnaire/upsert-answer                        # Post Answer
GET  /api/v1/questionnaire/get-answer                           # Get Answer
POST /api/v1/questionnaire/upsert-questions-options             # Post questions-options
GET  /api/v1/questionnaire/get-questions-options                # Get questions-options
GET  /api/v1/questionnaire/get-question-answer                  # Get question-answer
POST /api/v1/questionnaire/duplicate-questionnaire              # Duplicate Questionnaire
```

### 3.27 Template Management

```
POST /api/v1/template/edit-template                             # Create or update policy commauto additional information
GET  /api/v1/template/get-templates                             # Retrieve all commauto additional information
POST /api/v1/template/render-template                           # Render a template with the provided payload
GET  /api/v1/template/get-sql-view-or-columns                   # Retrieve SQL views or columns for templates
POST /api/v1/template/upsert-sql-view-or-columns                # Upsert SQL view
POST /api/v1/template/create-document-template                  # Create a new document template
GET  /api/v1/template/get-document-template                     # Retrieve document templates
```

### 3.28 Workflow Management

```
POST /api/v1/workflow/upsert-workflow-basic                     # Create policy business customer info
GET  /api/v1/workflow/get-workflow-basic                        # Work flow basic get
POST /api/v1/workflow/upsert-workflow-condition                 # Create policy business customer info
GET  /api/v1/workflow/get-workflow-condition                    # Work flow basic get
POST /api/v1/workflow/upsert-workflow-action                    # Work Flow Action
GET  /api/v1/workflow/get-workflow-action                       # Work flow action get
POST /api/v1/workflow/upsert-workflow-action-email              # Work Flow Action
GET  /api/v1/workflow/get-workflow-action-email                 # Work flow action email get
POST /api/v1/workflow/upsert-workflow-action-message            # Work Flow Action
GET  /api/v1/workflow/get-workflow-action-message               # Work flow action message get
GET  /api/v1/workflow/get-workflow-all-definition               # Work flow All definition
POST /api/v1/workflow/workflow-initiate                         # Work Flow Initiate
GET  /api/v1/workflow/get-apis-endpoints                        # Return all APIs endpoint
```

---

## 4. Core Features & Workflows

### 4.1 Daily Task Generation Algorithm

1. **AI-Powered Selection Criteria:**

   - User availability (from Google Calendar)
   - Task priority and deadline
   - Project status and dependencies
   - Resource allocation conflicts
   - User skill set and preferences

2. **Limitation:** Maximum 3 tasks per day per user
3. **Dynamic Updates:** Real-time task updates based on progress
4. **Reallocation Logic:** Automatic task redistribution when conflicts arise

### 4.2 Resource Optimization Engine

1. **Conflict Detection:**

   - Prevent double/triple allocation
   - Check availability against Google Calendar
   - Validate allocation percentages (max 100%)

2. **Availability Checking:**

   - Real-time sync with Google Calendar
   - Consider time zones and working hours
   - Account for holidays and time off

3. **Dynamic Reallocation:**
   - Automatic adjustments based on delays
   - Project manager notifications for manual intervention
   - Timeline impact analysis

### 4.3 Time Tracking System (Simplified)

1. **Percentage-Based Tracking:**

   - Track percentage of day spent on tasks
   - Fluid time measurement (not exact hours)
   - Focus on "how did I spend my day" rather than precise timing

2. **Timer Functionality:**

   - Start/stop timer for active tasks
   - Visual progress indicators
   - Automatic time allocation suggestions

3. **Project Profitability Analysis:**
   - Track "people's days spent" per project
   - Cost analysis and profit margin calculation
   - Historical data for future project estimation

### 4.4 Google Ecosystem Integration

1. **Google Drive Integration:**

   - Each project links to a Google Drive folder
   - Embedded file browser in the application
   - Seamless document access without re-authentication

2. **Google Calendar Integration:**

   - Real-time availability sync
   - Meeting integration and conflict detection
   - Time blocking visualization

3. **Google Chat Integration:**
   - Project-specific chat channels
   - Direct messaging within the application
   - Notification integration

### 4.5 Nova World Group API Integration

1. **Authentication Integration:**

   - Seamless login with existing Nova World Group accounts
   - OTP validation and token management
   - User profile synchronization

2. **Data Synchronization:**

   - Customer data from Nova World Group system
   - Lead management integration
   - Accounting data synchronization

3. **Workflow Integration:**
   - Approval workflows from Nova World Group
   - Document management integration
   - Template rendering and generation

---

## 5. API Request/Response Examples

### 5.1 Daily Tasks Generation

**Request:**

```json
POST /api/v1/daily-tasks/generate
{
  "userId": "uuid",
  "date": "2025-01-15",
  "preferences": {
    "maxTasks": 3,
    "priority": "high",
    "excludeProjects": ["project-uuid-1"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "dailyTasks": [
      {
        "id": "uuid",
        "taskId": "uuid",
        "title": "Implement user authentication",
        "projectName": "Customer Portal",
        "priority": "high",
        "estimatedHours": 4,
        "dueDate": "2025-01-15",
        "googleDriveFolderId": "folder-id",
        "googleChatChannelId": "channel-id"
      }
    ],
    "generatedAt": "2025-01-15T09:00:00Z"
  }
}
```

### 5.2 Resource Allocation

**Request:**

```json
POST /api/v1/resources/allocate
{
  "projectId": "uuid",
  "userId": "uuid",
  "allocationPercentage": 50,
  "startDate": "2025-01-15",
  "endDate": "2025-02-15",
  "role": "developer"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "allocationId": "uuid",
    "conflicts": [],
    "warnings": ["User is already allocated 30% to another project"]
  }
}
```

### 5.3 Time Entry Creation

**Request:**

```json
POST /api/v1/time-entries
{
  "userId": "uuid",
  "taskId": "uuid",
  "projectId": "uuid",
  "date": "2025-01-15",
  "timeSpentPercentage": 25.5,
  "description": "Worked on authentication module"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "timeEntryId": "uuid",
    "dailyTotal": 75.5,
    "remainingPercentage": 24.5
  }
}
```

---

## 6. Security and Compliance

### 6.1 Authentication & Authorization

- **Google OAuth 2.0:** Secure authentication via Google accounts
- **Nova World Group Integration:** Seamless integration with existing auth system
- **Multi-Factor Authentication (MFA):** Optional 2FA for enhanced security
- **Role-Based Access Control:**
  - Employee: Daily tasks, time tracking, reallocation requests
  - Project Manager: Project management, resource allocation, analytics
  - Admin: System administration, user management, security settings
- **Session Management:** Secure session handling with automatic timeout
- **API Rate Limiting:** Prevent abuse with configurable rate limits
- **API Key Management:** Secure API key rotation and management

### 6.2 Data Protection

- **Data Encryption:** End-to-end encryption for sensitive data
- **GDPR Compliance:** Full compliance with data protection regulations
- **Audit Logging:** Comprehensive audit trail for all actions
- **Data Retention:** Configurable data retention policies
- **Right to be Forgotten:** Support for data deletion requests

### 6.3 API Security

- **Input Validation:** Comprehensive validation using Joi
- **CORS Configuration:** Proper cross-origin resource sharing setup
- **API Key Management:** Secure API key rotation and management
- **Request Sanitization:** Prevent injection attacks
- **SQL Injection Prevention:** Parameterized queries and input sanitization
- **XSS Protection:** Content Security Policy and input encoding

---

## 7. Performance Requirements

### 7.1 Response Times

- **API Response:** < 200ms for 95% of requests
- **Page Load:** < 2 seconds for initial page load
- **Mobile App:** < 1 second for task operations
- **Database Queries:** < 100ms for 90% of queries
- **Google API Calls:** < 500ms for 95% of requests
- **Nova World Group API Calls:** < 1000ms for 95% of requests

### 7.2 Scalability

- **Concurrent Users:** Support 100+ concurrent users
- **Data Volume:** Handle 10,000+ projects and 100,000+ tasks
- **Storage:** Efficient storage for time tracking and analytics data
- **API Throughput:** 1000+ requests per minute
- **Database Connections:** Support 50+ concurrent connections

### 7.3 Availability

- **Uptime:** 99.9% availability target
- **Backup:** Daily automated backups with 30-day retention
- **Monitoring:** Real-time monitoring and alerting
- **Disaster Recovery:** 4-hour RTO, 1-hour RPO
- **Load Balancing:** Automatic failover and load distribution

---

## 8. Integration Specifications

### 8.1 Google APIs Integration

#### Google Drive API

- **Authentication:** OAuth 2.0 with refresh token support
- **Permissions:** Read/Write access to project folders
- **Rate Limits:** 1000 requests per 100 seconds per user
- **File Types:** Support for all Google Workspace file types

#### Google Calendar API

- **Authentication:** OAuth 2.0 with calendar access
- **Permissions:** Read availability, create/update events
- **Rate Limits:** 1000 requests per 100 seconds per user
- **Sync Frequency:** Real-time updates via webhooks

#### Google Chat API

- **Authentication:** OAuth 2.0 with chat access
- **Permissions:** Read messages, send messages, manage spaces
- **Rate Limits:** 100 requests per 100 seconds per user
- **Integration:** Project-specific chat channels

### 8.2 Nova World Group API Integration

#### Authentication Integration

- **Base URL:** https://api.novaworldgroup.ca
- **API Version:** v1
- **Authentication:** Token-based authentication
- **Rate Limits:** As per Nova World Group API specifications

#### Data Synchronization

- **Customer Data:** Real-time sync with customer management
- **Lead Data:** Integration with lead management system
- **Accounting Data:** Financial data synchronization
- **User Data:** User profile and role synchronization

### 8.3 Webhook Configuration

```
POST /api/v1/webhooks/google/calendar    # Calendar event updates
POST /api/v1/webhooks/google/drive       # Drive file changes
POST /api/v1/webhooks/google/chat        # Chat message updates
POST /api/v1/webhooks/nova/leads         # Lead updates from Nova World Group
POST /api/v1/webhooks/nova/customers     # Customer updates from Nova World Group
POST /api/v1/webhooks/tasks/status       # Task status updates
POST /api/v1/webhooks/projects/update    # Project updates
POST /api/v1/webhooks/users/activity     # User activity updates
POST /api/v1/webhooks/notifications      # Notification delivery status
```

### 8.4 Real-time Updates

- **WebSocket Integration:** Real-time updates for task changes
- **Push Notifications:** Mobile app notifications for task assignments
- **Email Notifications:** Automated email alerts for important events
- **In-app Notifications:** Real-time notifications within the application

---

## 9. Error Handling

### 9.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2025-01-15T10:30:00Z",
    "requestId": "req-uuid"
  }
}
```

### 9.2 Error Codes

- **AUTHENTICATION_ERROR:** 401 - Authentication required
- **AUTHORIZATION_ERROR:** 403 - Insufficient permissions
- **VALIDATION_ERROR:** 400 - Invalid request data
- **NOT_FOUND:** 404 - Resource not found
- **CONFLICT_ERROR:** 409 - Resource conflict
- **RATE_LIMIT_ERROR:** 429 - Rate limit exceeded
- **SERVER_ERROR:** 500 - Internal server error
- **GOOGLE_API_ERROR:** 502 - Google API error
- **NOVA_API_ERROR:** 503 - Nova World Group API error

---

## 10. Monitoring and Logging

### 10.1 Application Metrics

- **API Response Times:** Track endpoint performance
- **Error Rates:** Monitor error frequency and types
- **User Activity:** Track user engagement and usage patterns
- **Resource Utilization:** Monitor database and server performance
- **Google API Usage:** Track API quota consumption
- **Nova World Group API Usage:** Track external API usage

### 10.2 Logging Strategy

- **Structured Logging:** JSON format for all logs
- **Log Levels:** ERROR, WARN, INFO, DEBUG
- **Sensitive Data:** Mask PII and sensitive information
- **Retention:** 90 days for application logs, 1 year for audit logs
- **Real-time Monitoring:** Live dashboards for critical metrics

---

---

## 🚀 **CURRENT IMPLEMENTATION STATUS**

### ✅ **COMPLETED FEATURES**

#### 1. **Security Module - FULLY IMPLEMENTED** ✅

- **Security Service**: `microservices/security-service/` (Port 3008)
- **Database Tables**: `user_roles`, `latest_role_group`, `module_security`
- **API Endpoints**:
  - ✅ `GET /api/v1/security/get-user-roles` - Returns user roles with pagination
  - ✅ `GET /api/v1/security/get-role-group` - Returns role groups with pagination
  - ✅ `GET /api/v1/security/get-role-module-content-access-permission` - Returns module permissions for roles
  - ✅ `POST /api/v1/security/upsert-roles` - Create/update roles
  - ✅ `POST /api/v1/security/upsert-role-group` - Create/update role groups
  - ✅ `POST /api/v1/security/upsert-role-module-content-access-permission` - Manage module permissions

#### 2. **API Gateway - FULLY IMPLEMENTED** ✅

- **Gateway**: `simple-api-gateway-with-socket.js` (Port 3000)
- **Security Routing**: Routes `/api/v1/security/*` to Security Service (Port 3008)
- **Health Check**: `/health` endpoint with service status
- **CORS**: Configured for frontend integration

#### 3. **Database Schema - FULLY IMPLEMENTED** ✅

- **Core Tables**: `users`, `user_roles`, `latest_role_group`, `module_security`
- **Security Tables**: Complete role-based access control system
- **Module Security**: 15+ modules with access permissions
- **Data Integrity**: Foreign key constraints and validation

### 🔄 **IN PROGRESS FEATURES**

#### 1. **Project Management Module** 🔄

- **Project Service**: `microservices/project-service/` (Port 3006)
- **Status**: Basic structure created, needs full implementation
- **Missing**: Project CRUD operations, resource allocation, analytics

#### 2. **Task Management Module** 🔄

- **Task Service**: `microservices/task-service/` (Port 3007)
- **Status**: Basic structure created, needs full implementation
- **Missing**: Daily task generation, task dependencies, time tracking

### ❌ **PENDING FEATURES**

#### 1. **Analytics Service** ❌

- **Status**: Not started
- **Required**: Project analytics, resource utilization, profitability analysis

#### 2. **File Service** ❌

- **Status**: Not started
- **Required**: Google Drive integration, file management

#### 3. **Notification Service** ❌

- **Status**: Not started
- **Required**: Real-time notifications, email alerts

#### 4. **Integration Service** ❌

- **Status**: Not started
- **Required**: Google Calendar, Google Meet, Google Chat integration

---

## 📊 **CURRENT API ENDPOINTS STATUS**

### ✅ **WORKING ENDPOINTS**

#### Security Endpoints (Port 3008)

```
✅ GET  /api/v1/security/get-user-roles
✅ GET  /api/v1/security/get-role-group
✅ GET  /api/v1/security/get-role-module-content-access-permission
✅ POST /api/v1/security/upsert-roles
✅ POST /api/v1/security/upsert-role-group
✅ POST /api/v1/security/upsert-role-module-content-access-permission
```

#### Company Information Endpoints (Port 3004)

```
✅ GET  /api/v1/companyInformation/get-public-company-information
✅ POST /api/v1/companyInformation/upsert-company-information
✅ GET  /api/v1/companyInformation/get-company-information
```

#### User Endpoints (Port 3005)

```
✅ GET  /api/v1/user/get-user
✅ POST /api/v1/user/upsert-user
✅ GET  /api/v1/user/get-assignee
```

### ⚠️ **PARTIALLY WORKING ENDPOINTS**

#### Project Endpoints (Port 3006)

```
⚠️ GET  /api/v1/project/get-projects (Basic implementation)
❌ POST /api/v1/project/create-project
❌ PUT  /api/v1/project/update-project
❌ DELETE /api/v1/project/delete-project
```

#### Task Endpoints (Port 3007)

```
⚠️ GET  /api/v1/task/get-tasks (Basic implementation)
❌ POST /api/v1/task/create-task
❌ PUT  /api/v1/task/update-task
❌ DELETE /api/v1/task/delete-task
```

### ❌ **MISSING ENDPOINTS**

#### Daily Task Management (Core Feature)

```
❌ GET    /api/v1/daily-tasks
❌ GET    /api/v1/daily-tasks/:date
❌ POST   /api/v1/daily-tasks/generate
❌ PUT    /api/v1/daily-tasks/:id/status
❌ POST   /api/v1/daily-tasks/:id/complete
❌ POST   /api/v1/daily-tasks/:id/skip
❌ POST   /api/v1/daily-tasks/:id/timer
```

#### Resource Management

```
❌ GET    /api/v1/resources/availability
❌ GET    /api/v1/resources/overallocation
❌ POST   /api/v1/resources/allocate
❌ PUT    /api/v1/resources/:id
❌ DELETE /api/v1/resources/:id
```

#### Time Tracking

```
❌ GET    /api/v1/time-entries
❌ POST   /api/v1/time-entries
❌ PUT    /api/v1/time-entries/:id
❌ DELETE /api/v1/time-entries/:id
❌ GET    /api/v1/time-entries/summary
```

#### Google Integration

```
❌ GET    /api/v1/google/drive/folders
❌ POST   /api/v1/google/drive/sync
❌ GET    /api/v1/google/calendar/availability
❌ POST   /api/v1/google/calendar/sync
❌ GET    /api/v1/google/meet/links
❌ GET    /api/v1/google/chat/messages
```

#### Analytics & Reporting

```
❌ GET /api/v1/analytics/get-analytics
❌ GET /api/v1/analytics/project-progress
❌ GET /api/v1/analytics/resource-utilization
❌ GET /api/v1/analytics/profitability
❌ GET /api/v1/analytics/daily-summary
```

---

## 🎯 **NEXT PRIORITIES**

### **Phase 1: Core Project Management (2-3 weeks)**

1. **Complete Project Service**

   - Implement project CRUD operations
   - Add project analytics
   - Implement resource allocation

2. **Complete Task Service**

   - Implement task CRUD operations
   - Add daily task generation
   - Implement time tracking

3. **Enhance User Service**
   - Add Google OAuth integration
   - Implement user preferences
   - Add user analytics

### **Phase 2: Daily Task Management (2-3 weeks)**

1. **Daily Task Generation Algorithm**

   - AI-powered task selection
   - User availability checking
   - Conflict resolution

2. **Time Tracking System**

   - Percentage-based tracking
   - Timer functionality
   - Project profitability analysis

3. **Resource Optimization**
   - Conflict detection
   - Dynamic reallocation
   - Availability checking

### **Phase 3: Google Integration (3-4 weeks)**

1. **Google Drive Integration**

   - File management
   - Folder synchronization
   - Document processing

2. **Google Calendar Integration**

   - Availability sync
   - Meeting integration
   - Time blocking

3. **Google Chat Integration**
   - Project channels
   - Direct messaging
   - Notification integration

### **Phase 4: Analytics & Reporting (2-3 weeks)**

1. **Analytics Service**

   - Project progress tracking
   - Resource utilization
   - Team performance metrics

2. **Reporting Service**
   - Custom reports
   - Data export
   - Dashboard data

---

## 📈 **SUCCESS METRICS**

### **Current Metrics**

- **API Endpoints**: 6/50+ implemented (12%)
- **Database Tables**: 15/25+ implemented (60%)
- **Microservices**: 4/10+ implemented (40%)
- **Security Module**: 100% complete ✅

### **Target Metrics (Next 3 months)**

- **API Endpoints**: 40/50+ implemented (80%)
- **Database Tables**: 25/25+ implemented (100%)
- **Microservices**: 8/10+ implemented (80%)
- **Google Integration**: 100% complete
- **Daily Task Management**: 100% complete

---

**Document Status:** Backend Implementation Status - PRDV2  
**Last Updated:** January 2025  
**Next Review:** After Phase 1 completion  
**Approval Required:** Pravin Luthada, Technical Lead  
**Based on:** Current Implementation Status & Nova World Group API Architecture
