# Database PRD - AI-Powered Project Management Platform (PRDV2)

**Version:** 2.0  
**Date:** January 2025  
**Author:** Sakshi Jadhav  
**Stakeholders:** Pravin Luthada, Development Team  
**Based on:** Nove_Frontend Project Structure & Meeting Requirements

---

## 1. Executive Summary

### 1.1 Problem Statement

The current Odoo-based project management system suffers from inefficient work allocation, overwhelming user interfaces, and lack of integration with existing Google ecosystem tools. Employees struggle with complex interfaces and cannot easily identify their daily priorities, leading to decreased productivity and poor resource optimization.

### 1.2 Solution Overview

An AI-powered project management platform that provides a simplified, mobile-first interface for daily task management while leveraging existing Google infrastructure (Drive, Calendar, Meet) for comprehensive project documentation and resource tracking. This system is built on the proven Nove_Frontend architecture with enhanced project management capabilities.

### 1.3 Key Vision from Meeting

- **Human Resource Optimization:** Primary goal is to ensure every employee knows their tasks upon entering the office
- **Simplified Daily Interface:** Maximum 1-3 tasks per day for employees
- **Google Ecosystem Integration:** Leverage existing Google Drive, Calendar, and Chat infrastructure
- **Project Characterization:** Everything is a project (internal R&D, client work)
- **Dynamic Resource Allocation:** Prevent double/triple allocation of resources
- **Time Tracking:** Percentage-based time tracking for project profitability analysis

---

## 2. Database Architecture

### 2.1 Technology Stack

- **Database:** PostgreSQL 15+
- **ORM:** Prisma ORM
- **Hosting:** Google Cloud SQL (PostgreSQL)
- **Backup:** Automated daily backups with 30-day retention
- **High Availability:** Multi-zone deployment for fault tolerance
- **Read Replicas:** Multiple read replicas for performance
- **Connection Pooling:** PgBouncer for connection management
- **Monitoring:** Google Cloud Monitoring with custom metrics

### 2.2 Database Design Principles

- **Single Source of Truth:** PostgreSQL as the primary data store
- **ACID Compliance:** Full transaction support
- **Scalability:** Designed for 10,000+ projects and 100,000+ tasks
- **Performance:** Optimized indexes for common queries
- **Data Integrity:** Foreign key constraints and validation rules
- **Google Integration:** Seamless integration with Google ecosystem
- **Audit Trail:** Comprehensive logging for all data changes

---

## 3. Database Schema

### 3.1 Core Tables

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    role ENUM('employee', 'project_manager', 'admin') NOT NULL DEFAULT 'employee',
    department VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_department ON users(department);
```

#### Projects Table

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived') NOT NULL DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    project_type ENUM('client', 'internal', 'rnd', 'maintenance') NOT NULL DEFAULT 'client',
    start_date DATE,
    end_date DATE,
    estimated_days INTEGER,
    actual_days INTEGER,
    budget DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    project_manager_id UUID REFERENCES users(id),
    client_id UUID REFERENCES clients(id),
    google_drive_folder_id VARCHAR(255),
    google_calendar_id VARCHAR(255),
    google_chat_space_id VARCHAR(255),
    tags TEXT[], -- Array of tags for categorization
    metadata JSONB, -- Additional project metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for projects table
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_priority ON projects(priority);
CREATE INDEX idx_projects_project_type ON projects(project_type);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_projects_google_drive ON projects(google_drive_folder_id);
CREATE INDEX idx_projects_metadata ON projects USING GIN(metadata);
```

#### Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id), -- For subtasks
    assigned_to UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('todo', 'in_progress', 'completed', 'blocked', 'cancelled') NOT NULL DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    task_type ENUM('development', 'design', 'testing', 'documentation', 'meeting', 'other') NOT NULL DEFAULT 'other',
    estimated_days DECIMAL(3,1),
    actual_days DECIMAL(3,1),
    due_date DATE,
    completed_at TIMESTAMP,
    started_at TIMESTAMP,
    tags TEXT[],
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

-- Indexes for tasks table
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent_task ON tasks(parent_task_id);
CREATE INDEX idx_tasks_task_type ON tasks(task_type);
CREATE INDEX idx_tasks_metadata ON tasks USING GIN(metadata);
```

#### Daily Tasks Table (Core Feature)

```sql
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    task_id UUID REFERENCES tasks(id),
    date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'skipped') NOT NULL DEFAULT 'pending',
    time_spent_percentage DECIMAL(5,2) DEFAULT 0 CHECK (time_spent_percentage >= 0 AND time_spent_percentage <= 100),
    notes TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id, date)
);

-- Indexes for daily_tasks table
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, date);
CREATE INDEX idx_daily_tasks_task ON daily_tasks(task_id);
CREATE INDEX idx_daily_tasks_status ON daily_tasks(status);
CREATE INDEX idx_daily_tasks_date ON daily_tasks(date);
```

#### Resource Allocation Table

```sql
CREATE TABLE resource_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    allocation_percentage INTEGER NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE,
    role VARCHAR(100),
    hourly_rate DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for resource_allocations table
CREATE INDEX idx_resource_allocations_project ON resource_allocations(project_id);
CREATE INDEX idx_resource_allocations_user ON resource_allocations(user_id);
CREATE INDEX idx_resource_allocations_dates ON resource_allocations(start_date, end_date);
CREATE INDEX idx_resource_allocations_active ON resource_allocations(is_active);
```

#### Time Tracking Table (Simplified)

```sql
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    task_id UUID REFERENCES tasks(id),
    project_id UUID REFERENCES projects(id),
    date DATE NOT NULL,
    time_spent_percentage DECIMAL(5,2) NOT NULL CHECK (time_spent_percentage >= 0 AND time_spent_percentage <= 100),
    description TEXT,
    start_time TIME,
    end_time TIME,
    is_billable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for time_entries table
CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, date);
CREATE INDEX idx_time_entries_task ON time_entries(task_id);
CREATE INDEX idx_time_entries_project ON time_entries(project_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
CREATE INDEX idx_time_entries_billable ON time_entries(is_billable);
```

#### Reallocation Requests Table

```sql
CREATE TABLE reallocation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    current_task_id UUID REFERENCES tasks(id),
    requested_project_id UUID REFERENCES projects(id),
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    project_manager_id UUID REFERENCES users(id),
    response_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    responded_by UUID REFERENCES users(id)
);

-- Indexes for reallocation_requests table
CREATE INDEX idx_reallocation_requests_user ON reallocation_requests(user_id);
CREATE INDEX idx_reallocation_requests_status ON reallocation_requests(status);
CREATE INDEX idx_reallocation_requests_manager ON reallocation_requests(project_manager_id);
CREATE INDEX idx_reallocation_requests_created ON reallocation_requests(created_at);
```

#### Notifications Table

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type ENUM('task_assigned', 'task_due', 'project_delay', 'resource_reallocation', 'system_alert', 'project_update') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_entity_type VARCHAR(50), -- 'project', 'task', 'user', etc.
    related_entity_id UUID,
    action_url TEXT, -- URL to navigate when notification is clicked
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_entity ON notifications(related_entity_type, related_entity_id);
```

### 3.2 Company & Client Management Tables

#### Companies Table

```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for companies table
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_industry ON companies(industry);
```

#### Clients Table

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    position VARCHAR(100),
    is_primary_contact BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for clients table
CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_is_active ON clients(is_active);
CREATE INDEX idx_clients_primary ON clients(is_primary_contact);
```

#### Services Table

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    hourly_rate DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for services table
CREATE INDEX idx_services_name ON services(name);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(is_active);
```

### 3.3 Security & Administration Tables

#### Security Groups Table

```sql
CREATE TABLE security_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL, -- Array of permission strings
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- Indexes for security_groups table
CREATE INDEX idx_security_groups_name ON security_groups(name);
CREATE INDEX idx_security_groups_is_active ON security_groups(is_active);
CREATE INDEX idx_security_groups_permissions ON security_groups USING GIN(permissions);
```

#### User Security Groups Table

```sql
CREATE TABLE user_security_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    security_group_id UUID REFERENCES security_groups(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, security_group_id)
);

-- Indexes for user_security_groups table
CREATE INDEX idx_user_security_groups_user ON user_security_groups(user_id);
CREATE INDEX idx_user_security_groups_group ON user_security_groups(security_group_id);
```

#### Audit Logs Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'user', 'project', 'task', etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit_logs table
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### 3.4 File Management Tables

#### Files Table

```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_extension VARCHAR(10),
    project_id UUID REFERENCES projects(id),
    task_id UUID REFERENCES tasks(id),
    uploaded_by UUID REFERENCES users(id),
    google_drive_file_id VARCHAR(255),
    is_public BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for files table
CREATE INDEX idx_files_project ON files(project_id);
CREATE INDEX idx_files_task ON files(task_id);
CREATE INDEX idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX idx_files_google_drive ON files(google_drive_file_id);
CREATE INDEX idx_files_mime_type ON files(mime_type);
```

### 3.5 Google Integration Tables

#### Google Integrations Table

```sql
CREATE TABLE google_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    integration_type ENUM('drive', 'calendar', 'chat', 'meet') NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    scope TEXT[], -- Array of OAuth scopes
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for google_integrations table
CREATE INDEX idx_google_integrations_user ON google_integrations(user_id);
CREATE INDEX idx_google_integrations_type ON google_integrations(integration_type);
CREATE INDEX idx_google_integrations_active ON google_integrations(is_active);
```

### 3.6 Analytics & Reporting Tables

#### Project Analytics Table

```sql
CREATE TABLE project_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    date DATE NOT NULL,
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    in_progress_tasks INTEGER DEFAULT 0,
    blocked_tasks INTEGER DEFAULT 0,
    total_time_spent DECIMAL(8,2) DEFAULT 0,
    budget_used DECIMAL(12,2) DEFAULT 0,
    team_size INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, date)
);

-- Indexes for project_analytics table
CREATE INDEX idx_project_analytics_project ON project_analytics(project_id);
CREATE INDEX idx_project_analytics_date ON project_analytics(date);
CREATE INDEX idx_project_analytics_project_date ON project_analytics(project_id, date);
```

#### User Performance Table

```sql
CREATE TABLE user_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    time_spent DECIMAL(8,2) DEFAULT 0,
    productivity_score DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Indexes for user_performance table
CREATE INDEX idx_user_performance_user ON user_performance(user_id);
CREATE INDEX idx_user_performance_date ON user_performance(date);
CREATE INDEX idx_user_performance_user_date ON user_performance(user_id, date);
```

---

## 4. Database Constraints

### 4.1 Foreign Key Constraints

```sql
-- Users table constraints
ALTER TABLE projects ADD CONSTRAINT fk_projects_manager
    FOREIGN KEY (project_manager_id) REFERENCES users(id);
ALTER TABLE projects ADD CONSTRAINT fk_projects_created_by
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE projects ADD CONSTRAINT fk_projects_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Tasks table constraints
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_project
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_assigned
    FOREIGN KEY (assigned_to) REFERENCES users(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_created
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_updated
    FOREIGN KEY (updated_by) REFERENCES users(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_parent
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id);

-- Daily tasks constraints
ALTER TABLE daily_tasks ADD CONSTRAINT fk_daily_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE daily_tasks ADD CONSTRAINT fk_daily_tasks_task
    FOREIGN KEY (task_id) REFERENCES tasks(id);

-- Resource allocation constraints
ALTER TABLE resource_allocations ADD CONSTRAINT fk_resource_allocations_project
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE resource_allocations ADD CONSTRAINT fk_resource_allocations_user
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE resource_allocations ADD CONSTRAINT fk_resource_allocations_created
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE resource_allocations ADD CONSTRAINT fk_resource_allocations_updated
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Time entries constraints
ALTER TABLE time_entries ADD CONSTRAINT fk_time_entries_user
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE time_entries ADD CONSTRAINT fk_time_entries_task
    FOREIGN KEY (task_id) REFERENCES tasks(id);
ALTER TABLE time_entries ADD CONSTRAINT fk_time_entries_project
    FOREIGN KEY (project_id) REFERENCES projects(id);

-- Reallocation requests constraints
ALTER TABLE reallocation_requests ADD CONSTRAINT fk_reallocation_requests_user
    FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE reallocation_requests ADD CONSTRAINT fk_reallocation_requests_current_task
    FOREIGN KEY (current_task_id) REFERENCES tasks(id);
ALTER TABLE reallocation_requests ADD CONSTRAINT fk_reallocation_requests_requested_project
    FOREIGN KEY (requested_project_id) REFERENCES projects(id);
ALTER TABLE reallocation_requests ADD CONSTRAINT fk_reallocation_requests_manager
    FOREIGN KEY (project_manager_id) REFERENCES users(id);
ALTER TABLE reallocation_requests ADD CONSTRAINT fk_reallocation_requests_responded
    FOREIGN KEY (responded_by) REFERENCES users(id);

-- Notifications constraints
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Companies and clients constraints
ALTER TABLE clients ADD CONSTRAINT fk_clients_company
    FOREIGN KEY (company_id) REFERENCES companies(id);
ALTER TABLE clients ADD CONSTRAINT fk_clients_created
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE clients ADD CONSTRAINT fk_clients_updated
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Security constraints
ALTER TABLE user_security_groups ADD CONSTRAINT fk_user_security_groups_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_security_groups ADD CONSTRAINT fk_user_security_groups_group
    FOREIGN KEY (security_group_id) REFERENCES security_groups(id) ON DELETE CASCADE;
ALTER TABLE user_security_groups ADD CONSTRAINT fk_user_security_groups_assigned
    FOREIGN KEY (assigned_by) REFERENCES users(id);

-- Files constraints
ALTER TABLE files ADD CONSTRAINT fk_files_project
    FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE files ADD CONSTRAINT fk_files_task
    FOREIGN KEY (task_id) REFERENCES tasks(id);
ALTER TABLE files ADD CONSTRAINT fk_files_uploaded
    FOREIGN KEY (uploaded_by) REFERENCES users(id);

-- Google integrations constraints
ALTER TABLE google_integrations ADD CONSTRAINT fk_google_integrations_user
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Analytics constraints
ALTER TABLE project_analytics ADD CONSTRAINT fk_project_analytics_project
    FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE user_performance ADD CONSTRAINT fk_user_performance_user
    FOREIGN KEY (user_id) REFERENCES users(id);
```

### 4.2 Check Constraints

```sql
-- Resource allocation percentage validation
ALTER TABLE resource_allocations ADD CONSTRAINT chk_allocation_percentage
    CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100);

-- Time spent percentage validation
ALTER TABLE daily_tasks ADD CONSTRAINT chk_daily_tasks_time_spent
    CHECK (time_spent_percentage >= 0 AND time_spent_percentage <= 100);

ALTER TABLE time_entries ADD CONSTRAINT chk_time_entries_percentage
    CHECK (time_spent_percentage >= 0 AND time_spent_percentage <= 100);

-- Date validations
ALTER TABLE projects ADD CONSTRAINT chk_project_dates
    CHECK (end_date IS NULL OR end_date >= start_date);

ALTER TABLE resource_allocations ADD CONSTRAINT chk_allocation_dates
    CHECK (end_date IS NULL OR end_date >= start_date);

-- File size validation
ALTER TABLE files ADD CONSTRAINT chk_file_size
    CHECK (file_size > 0);

-- Email validation
ALTER TABLE users ADD CONSTRAINT chk_users_email
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE clients ADD CONSTRAINT chk_clients_email
    CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Phone validation
ALTER TABLE users ADD CONSTRAINT chk_users_phone
    CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

ALTER TABLE clients ADD CONSTRAINT chk_clients_phone
    CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');
```

---

## 4. Data Migration Strategy

### 4.1 Migration from Odoo

1. **User Data Migration**

   - Export user data from Odoo
   - Map Odoo roles to new role system
   - Import users with Google OAuth integration
   - Preserve user preferences and settings

2. **Project Data Migration**

   - Export project information
   - Map project statuses and priorities
   - Create Google Drive folder links
   - Migrate project timelines and dependencies

3. **Task Data Migration**
   - Export task assignments and details
   - Map task statuses and priorities
   - Preserve task relationships
   - Migrate time tracking data

### 4.2 Data Validation

- **Data Integrity Checks:** Validate all foreign key relationships
- **Data Quality Checks:** Ensure required fields are populated
- **Business Rule Validation:** Verify allocation percentages and date ranges
- **Duplicate Detection:** Identify and resolve duplicate records
- **Data Consistency:** Ensure data consistency across all tables

---

## 5. Database Performance Optimization

### 5.1 Query Optimization

- **Index Strategy:** Optimize indexes for common query patterns
- **Query Analysis:** Monitor slow queries and optimize
- **Connection Pooling:** Implement connection pooling for better performance
- **Query Caching:** Cache frequently accessed data
- **Query Execution Plans:** Analyze and optimize query execution plans

### 5.2 Scalability Considerations

- **Partitioning:** Consider table partitioning for large datasets
- **Read Replicas:** Use read replicas for reporting queries
- **Connection Limits:** Configure appropriate connection limits
- **Memory Management:** Optimize memory usage for large datasets
- **Database Sharding:** Consider sharding for very large datasets

---

## 6. Backup and Recovery

### 6.1 Backup Strategy

- **Daily Backups:** Automated daily backups with 30-day retention
- **Point-in-Time Recovery:** Support for point-in-time recovery
- **Cross-Region Backups:** Backup data in multiple regions
- **Backup Testing:** Regular backup restoration testing
- **Incremental Backups:** Daily incremental backups for efficiency

### 6.2 Disaster Recovery

- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour
- **Failover Procedures:** Automated failover to standby database
- **Data Replication:** Real-time data replication to standby
- **Geographic Redundancy:** Multi-region data replication

---

## 7. Data Relationships

### 5.1 Entity Relationship Diagram

```
Users (1) ──→ (M) Projects (project_manager_id)
Users (1) ──→ (M) Projects (created_by)
Users (1) ──→ (M) Projects (updated_by)
Users (1) ──→ (M) Tasks (assigned_to)
Users (1) ──→ (M) Tasks (created_by)
Users (1) ──→ (M) Tasks (updated_by)
Users (1) ──→ (M) Daily Tasks
Users (1) ──→ (M) Time Entries
Users (1) ──→ (M) Resource Allocations
Users (1) ──→ (M) Reallocation Requests
Users (1) ──→ (M) Notifications
Users (1) ──→ (M) Files (uploaded_by)
Users (1) ──→ (M) Google Integrations
Users (1) ──→ (M) User Performance
Users (1) ──→ (M) User Security Groups
Users (1) ──→ (M) Audit Logs

Projects (1) ──→ (M) Tasks
Projects (1) ──→ (M) Resource Allocations
Projects (1) ──→ (M) Time Entries
Projects (1) ──→ (M) Files
Projects (1) ──→ (M) Project Analytics
Projects (1) ──→ (M) Reallocation Requests (requested_project_id)

Tasks (1) ──→ (M) Daily Tasks
Tasks (1) ──→ (M) Time Entries
Tasks (1) ──→ (M) Files
Tasks (1) ──→ (M) Reallocation Requests (current_task_id)
Tasks (1) ──→ (M) Tasks (parent_task_id) -- Self-referencing for subtasks

Companies (1) ──→ (M) Clients
Clients (1) ──→ (M) Projects

Security Groups (1) ──→ (M) User Security Groups
```

### 5.2 Key Relationships

- **One-to-Many:** Users can manage multiple projects
- **One-to-Many:** Projects can have multiple tasks
- **One-to-Many:** Users can be assigned multiple tasks
- **One-to-Many:** Tasks can have multiple daily task entries
- **Many-to-Many:** Users can be allocated to multiple projects (via resource_allocations)
- **One-to-Many:** Users can have multiple time entries
- **One-to-Many:** Users can have multiple notifications
- **One-to-Many:** Projects can have multiple files
- **One-to-Many:** Tasks can have multiple files
- **One-to-Many:** Users can have multiple security group assignments
- **Self-Referencing:** Tasks can have subtasks (parent_task_id)

---

## 6. Data Migration Strategy

### 6.1 Migration from Odoo

#### 6.1.1 User Data Migration

```sql
-- Migrate users from Odoo
INSERT INTO users (google_id, email, name, role, is_active, created_at)
SELECT
    'odoo_' || id::text as google_id,
    login as email,
    name as name,
    CASE
        WHEN groups_id LIKE '%project_manager%' THEN 'project_manager'
        WHEN groups_id LIKE '%admin%' THEN 'admin'
        ELSE 'employee'
    END as role,
    active as is_active,
    create_date as created_at
FROM odoo_res_users
WHERE active = true;
```

#### 6.1.2 Project Data Migration

```sql
-- Migrate projects from Odoo
INSERT INTO projects (name, description, status, priority, start_date, end_date, created_at)
SELECT
    name as name,
    description as description,
    CASE
        WHEN state = 'draft' THEN 'planning'
        WHEN state = 'open' THEN 'active'
        WHEN state = 'done' THEN 'completed'
        WHEN state = 'cancelled' THEN 'cancelled'
        ELSE 'planning'
    END as status,
    CASE
        WHEN priority = '0' THEN 'low'
        WHEN priority = '1' THEN 'medium'
        WHEN priority = '2' THEN 'high'
        ELSE 'medium'
    END as priority,
    date_start as start_date,
    date as end_date,
    create_date as created_at
FROM odoo_project_project
WHERE active = true;
```

#### 6.1.3 Task Data Migration

```sql
-- Migrate tasks from Odoo
INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date, created_at)
SELECT
    p.id as project_id,
    u.id as assigned_to,
    t.name as title,
    t.description as description,
    CASE
        WHEN t.stage_id IN (SELECT id FROM odoo_project_task_type WHERE name = 'Done') THEN 'completed'
        WHEN t.stage_id IN (SELECT id FROM odoo_project_task_type WHERE name = 'In Progress') THEN 'in_progress'
        ELSE 'todo'
    END as status,
    CASE
        WHEN t.priority = '0' THEN 'low'
        WHEN t.priority = '1' THEN 'medium'
        WHEN t.priority = '2' THEN 'high'
        ELSE 'medium'
    END as priority,
    t.date_deadline as due_date,
    t.create_date as created_at
FROM odoo_project_task t
JOIN projects p ON p.name = (SELECT name FROM odoo_project_project WHERE id = t.project_id)
JOIN users u ON u.email = (SELECT login FROM odoo_res_users WHERE id = t.user_id)
WHERE t.active = true;
```

### 6.2 Data Validation

```sql
-- Data integrity checks
SELECT 'Users without valid email' as check_name, COUNT(*) as count
FROM users WHERE email IS NULL OR email = '';

SELECT 'Projects without manager' as check_name, COUNT(*) as count
FROM projects WHERE project_manager_id IS NULL;

SELECT 'Tasks without project' as check_name, COUNT(*) as count
FROM tasks WHERE project_id IS NULL;

SELECT 'Resource allocations over 100%' as check_name, COUNT(*) as count
FROM resource_allocations WHERE allocation_percentage > 100;

-- Business rule validation
SELECT 'Users allocated to multiple projects on same date' as check_name, COUNT(*) as count
FROM resource_allocations ra1
JOIN resource_allocations ra2 ON ra1.user_id = ra2.user_id
    AND ra1.project_id != ra2.project_id
    AND ra1.start_date <= ra2.end_date
    AND ra2.start_date <= ra1.end_date
WHERE ra1.is_active = true AND ra2.is_active = true;
```

---

## 7. Database Performance Optimization

### 7.1 Query Optimization

#### 7.1.1 Common Query Patterns

```sql
-- Daily tasks for user (most common query)
CREATE INDEX idx_daily_tasks_user_date_status
ON daily_tasks(user_id, date, status)
WHERE status IN ('pending', 'in_progress');

-- Project tasks with assignments
CREATE INDEX idx_tasks_project_assigned_status
ON tasks(project_id, assigned_to, status)
WHERE status != 'completed';

-- Resource allocation conflicts
CREATE INDEX idx_resource_allocations_user_dates
ON resource_allocations(user_id, start_date, end_date)
WHERE is_active = true;

-- Time entries for reporting
CREATE INDEX idx_time_entries_user_date_project
ON time_entries(user_id, date, project_id);
```

#### 7.1.2 Materialized Views

```sql
-- Daily user workload summary
CREATE MATERIALIZED VIEW daily_user_workload AS
SELECT
    u.id as user_id,
    u.name as user_name,
    dt.date,
    COUNT(dt.id) as total_tasks,
    COUNT(CASE WHEN dt.status = 'completed' THEN 1 END) as completed_tasks,
    SUM(dt.time_spent_percentage) as total_time_spent,
    AVG(dt.time_spent_percentage) as avg_time_per_task
FROM users u
LEFT JOIN daily_tasks dt ON u.id = dt.user_id
WHERE dt.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.id, u.name, dt.date;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_daily_user_workload()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_user_workload;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Partitioning Strategy

```sql
-- Partition time_entries by date
CREATE TABLE time_entries_2025_01 PARTITION OF time_entries
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE time_entries_2025_02 PARTITION OF time_entries
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Partition audit_logs by date
CREATE TABLE audit_logs_2025_01 PARTITION OF audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

### 7.3 Connection Pooling

```sql
-- PgBouncer configuration
-- /etc/pgbouncer/pgbouncer.ini
[databases]
pm_platform = host=localhost port=5432 dbname=pm_platform

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
reserve_pool_size = 5
max_db_connections = 25
```

---

## 8. Backup and Recovery

### 8.1 Backup Strategy

```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/postgresql"
DB_NAME="pm_platform"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Full database backup
pg_dump -h localhost -U postgres -d $DB_NAME \
    --format=custom \
    --compress=9 \
    --file="$BACKUP_DIR/pm_platform_$DATE.backup"

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "pm_platform_*.backup" -mtime +30 -delete

# Upload to Google Cloud Storage
gsutil cp "$BACKUP_DIR/pm_platform_$DATE.backup" gs://pm-platform-backups/
```

### 8.2 Point-in-Time Recovery

```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'gsutil cp %p gs://pm-platform-wal-archive/%f';
ALTER SYSTEM SET max_wal_senders = 3;
ALTER SYSTEM SET hot_standby = on;

-- Restore from backup
pg_restore -h localhost -U postgres -d pm_platform_new \
    --clean --if-exists \
    /backups/postgresql/pm_platform_20250115_120000.backup
```

---

## 9. Security and Compliance

### 9.1 Data Security

```sql
-- Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see projects they manage or are assigned to
CREATE POLICY project_access_policy ON projects
    FOR ALL TO authenticated
    USING (
        project_manager_id = current_user_id() OR
        id IN (
            SELECT project_id FROM resource_allocations
            WHERE user_id = current_user_id() AND is_active = true
        )
    );

-- Time entries are private to the user
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY time_entries_own_data ON time_entries
    FOR ALL TO authenticated
    USING (user_id = current_user_id());

-- Audit sensitive operations
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        current_user_id(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_projects AFTER INSERT OR UPDATE OR DELETE ON projects
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### 9.2 Data Encryption

```sql
-- Encrypt sensitive data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt PII data
UPDATE users SET
    phone = pgp_sym_encrypt(phone, 'encryption_key')
WHERE phone IS NOT NULL;

-- Decrypt function
CREATE OR REPLACE FUNCTION decrypt_phone(encrypted_phone TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN pgp_sym_decrypt(encrypted_phone::bytea, 'encryption_key');
END;
$$ LANGUAGE plpgsql;
```

### 9.3 GDPR Compliance

```sql
-- Data retention policy
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete old audit logs (keep 1 year)
    DELETE FROM audit_logs
    WHERE created_at < CURRENT_DATE - INTERVAL '1 year';

    -- Anonymize old user data
    UPDATE users
    SET name = 'Anonymized User',
        email = 'anonymized@example.com',
        phone = NULL
    WHERE last_login_at < CURRENT_DATE - INTERVAL '2 years'
    AND is_active = false;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');
```

---

## 10. Monitoring and Maintenance

### 10.1 Performance Monitoring

```sql
-- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Slow query detection
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 1000 -- Queries taking more than 1 second
ORDER BY mean_time DESC;

-- Table size monitoring
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 10.2 Maintenance Tasks

```sql
-- Automated maintenance
CREATE OR REPLACE FUNCTION maintenance_tasks()
RETURNS void AS $$
BEGIN
    -- Update table statistics
    ANALYZE;

    -- Vacuum tables
    VACUUM ANALYZE;

    -- Refresh materialized views
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_user_workload;

    -- Clean up old sessions
    DELETE FROM user_sessions
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Schedule maintenance
SELECT cron.schedule('maintenance', '0 3 * * *', 'SELECT maintenance_tasks();');
```

---

## 11. Data Export and Import

### 11.1 Export Functions

```sql
-- Export user data for GDPR compliance
CREATE OR REPLACE FUNCTION export_user_data(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user', (SELECT to_jsonb(u.*) FROM users u WHERE u.id = user_uuid),
        'projects', (SELECT jsonb_agg(to_jsonb(p.*)) FROM projects p WHERE p.project_manager_id = user_uuid),
        'tasks', (SELECT jsonb_agg(to_jsonb(t.*)) FROM tasks t WHERE t.assigned_to = user_uuid),
        'time_entries', (SELECT jsonb_agg(to_jsonb(te.*)) FROM time_entries te WHERE te.user_id = user_uuid),
        'daily_tasks', (SELECT jsonb_agg(to_jsonb(dt.*)) FROM daily_tasks dt WHERE dt.user_id = user_uuid)
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 11.2 Import Functions

```sql
-- Import project data
CREATE OR REPLACE FUNCTION import_project_data(project_data JSONB)
RETURNS UUID AS $$
DECLARE
    project_id UUID;
BEGIN
    INSERT INTO projects (
        name, description, status, priority,
        start_date, end_date, project_manager_id
    ) VALUES (
        project_data->>'name',
        project_data->>'description',
        (project_data->>'status')::project_status,
        (project_data->>'priority')::project_priority,
        (project_data->>'start_date')::DATE,
        (project_data->>'end_date')::DATE,
        (project_data->>'project_manager_id')::UUID
    ) RETURNING id INTO project_id;

    RETURN project_id;
END;
$$ LANGUAGE plpgsql;
```

---

---

## 🚀 **CURRENT DATABASE IMPLEMENTATION STATUS**

### ✅ **COMPLETED DATABASE TABLES**

#### 1. **Core Security Tables** ✅

- **`user_roles`** - User role management with role groups
- **`latest_role_group`** - Role group definitions (ADMIN, EMPLOYEE, PROJECT_MANAGER, ALL)
- **`module_security`** - Module access permissions with 15+ modules
- **`users`** - User management with Google OAuth integration

#### 2. **Company Management Tables** ✅

- **`latest_company_information`** - Company details and branding
- **`latest_branch`** - Branch management
- **`latest_services`** - Service catalog

#### 3. **Security & Access Control** ✅

- **Role-based Access Control**: Complete implementation
- **Module Permissions**: 15+ modules with granular access control
- **User Role Assignment**: Dynamic role assignment system
- **Access Levels**: Show, Read, Write, Import, Export, Send Call permissions

### 🔄 **IN PROGRESS DATABASE TABLES**

#### 1. **Project Management Tables** 🔄

- **`projects`** - Basic structure created, needs enhancement
- **`project_members`** - Project team assignments
- **`project_settings`** - Project configuration

#### 2. **Task Management Tables** 🔄

- **`tasks`** - Basic structure created, needs enhancement
- **`daily_tasks`** - Core feature for daily task management
- **`task_dependencies`** - Task workflow management

### ❌ **PENDING DATABASE TABLES**

#### 1. **Resource Management Tables** ❌

- **`resource_allocations`** - Resource allocation tracking
- **`reallocation_requests`** - Resource reallocation requests
- **`time_entries`** - Time tracking and billing

#### 2. **Analytics & Reporting Tables** ❌

- **`project_analytics`** - Project performance metrics
- **`user_performance`** - User productivity tracking
- **`resource_utilization`** - Resource usage analytics

#### 3. **Google Integration Tables** ❌

- **`google_integrations`** - Google API tokens and settings
- **`google_drive_files`** - Google Drive file references
- **`google_calendar_events`** - Calendar integration

#### 4. **Notification & Communication Tables** ❌

- **`notifications`** - System notifications
- **`notification_preferences`** - User notification settings
- **`conversations`** - Chat and messaging

---

## 📊 **CURRENT DATABASE SCHEMA STATUS**

### ✅ **IMPLEMENTED TABLES (15/25+)**

#### Security & Access Control (4/4) ✅

```
✅ user_roles                    - User role management
✅ latest_role_group            - Role group definitions
✅ module_security              - Module access permissions
✅ users                        - User management
```

#### Company Management (3/3) ✅

```
✅ latest_company_information   - Company details
✅ latest_branch                - Branch management
✅ latest_services              - Service catalog
```

#### Basic Project Management (2/5) 🔄

```
🔄 projects                    - Project management (basic)
🔄 project_members             - Project team assignments
❌ project_settings            - Project configuration
❌ project_analytics           - Project metrics
❌ project_files               - Project file management
```

#### Task Management (1/5) 🔄

```
🔄 tasks                       - Task management (basic)
❌ daily_tasks                 - Daily task management (CORE FEATURE)
❌ task_dependencies           - Task workflows
❌ task_assignments            - Task assignments
❌ task_time_tracking          - Time tracking
```

#### Resource Management (0/4) ❌

```
❌ resource_allocations        - Resource allocation
❌ reallocation_requests       - Resource reallocation
❌ time_entries                - Time tracking
❌ resource_conflicts          - Resource conflict detection
```

#### Analytics & Reporting (0/3) ❌

```
❌ project_analytics           - Project performance
❌ user_performance            - User productivity
❌ resource_utilization        - Resource analytics
```

#### Google Integration (0/3) ❌

```
❌ google_integrations         - Google API integration
❌ google_drive_files          - Google Drive files
❌ google_calendar_events      - Calendar integration
```

#### Communication (0/3) ❌

```
❌ notifications               - System notifications
❌ conversations               - Chat and messaging
❌ notification_preferences    - User preferences
```

---

## 🔧 **DATABASE OPTIMIZATION STATUS**

### ✅ **IMPLEMENTED OPTIMIZATIONS**

#### 1. **Indexes** ✅

- **Primary Keys**: All tables have proper primary keys
- **Foreign Keys**: Complete foreign key relationships
- **Unique Constraints**: Proper unique constraints on critical fields
- **Performance Indexes**: Basic indexes on frequently queried fields

#### 2. **Data Integrity** ✅

- **Foreign Key Constraints**: Complete referential integrity
- **Check Constraints**: Data validation rules
- **NOT NULL Constraints**: Required field validation
- **Default Values**: Proper default values for optional fields

#### 3. **Security** ✅

- **Row Level Security**: Basic implementation
- **Data Encryption**: Sensitive data encryption
- **Audit Logging**: Change tracking for critical tables

### 🔄 **IN PROGRESS OPTIMIZATIONS**

#### 1. **Query Optimization** 🔄

- **Slow Query Analysis**: Basic monitoring
- **Index Optimization**: Needs performance tuning
- **Query Caching**: Not implemented

#### 2. **Scalability** 🔄

- **Connection Pooling**: Basic implementation
- **Read Replicas**: Not implemented
- **Partitioning**: Not implemented

### ❌ **PENDING OPTIMIZATIONS**

#### 1. **Performance Monitoring** ❌

- **Query Performance**: Advanced monitoring needed
- **Resource Usage**: Database resource tracking
- **Slow Query Detection**: Automated detection

#### 2. **Backup & Recovery** ❌

- **Automated Backups**: Not implemented
- **Point-in-Time Recovery**: Not configured
- **Disaster Recovery**: Not planned

#### 3. **High Availability** ❌

- **Replication**: Not implemented
- **Failover**: Not configured
- **Load Balancing**: Not implemented

---

## 🎯 **DATABASE ROADMAP**

### **Phase 1: Core Project Management (2-3 weeks)**

1. **Complete Project Tables**

   - Enhance `projects` table with all required fields
   - Implement `project_members` table
   - Add `project_settings` table
   - Create `project_analytics` table

2. **Complete Task Tables**

   - Enhance `tasks` table with all required fields
   - Implement `daily_tasks` table (CORE FEATURE)
   - Add `task_dependencies` table
   - Create `task_assignments` table

3. **Database Optimization**
   - Add performance indexes
   - Implement query optimization
   - Add data validation rules

### **Phase 2: Resource Management (2-3 weeks)**

1. **Resource Allocation Tables**

   - Implement `resource_allocations` table
   - Add `reallocation_requests` table
   - Create `time_entries` table
   - Add `resource_conflicts` table

2. **Time Tracking System**

   - Implement percentage-based time tracking
   - Add timer functionality
   - Create billing and cost tracking

3. **Resource Optimization**
   - Add conflict detection logic
   - Implement availability checking
   - Add dynamic reallocation support

### **Phase 3: Google Integration (3-4 weeks)**

1. **Google API Integration**

   - Implement `google_integrations` table
   - Add `google_drive_files` table
   - Create `google_calendar_events` table

2. **File Management**

   - Add file versioning support
   - Implement file permissions
   - Add file synchronization

3. **Calendar Integration**
   - Add availability tracking
   - Implement meeting integration
   - Add time blocking support

### **Phase 4: Analytics & Reporting (2-3 weeks)**

1. **Analytics Tables**

   - Implement `project_analytics` table
   - Add `user_performance` table
   - Create `resource_utilization` table

2. **Reporting System**

   - Add custom report tables
   - Implement data export functionality
   - Add dashboard data tables

3. **Performance Monitoring**
   - Add query performance tracking
   - Implement resource monitoring
   - Add automated optimization

---

## 📈 **DATABASE SUCCESS METRICS**

### **Current Metrics**

- **Tables Implemented**: 15/25+ (60%)
- **Security Tables**: 4/4 (100%) ✅
- **Company Tables**: 3/3 (100%) ✅
- **Project Tables**: 2/5 (40%) 🔄
- **Task Tables**: 1/5 (20%) 🔄
- **Resource Tables**: 0/4 (0%) ❌
- **Analytics Tables**: 0/3 (0%) ❌

### **Target Metrics (Next 3 months)**

- **Tables Implemented**: 25/25+ (100%)
- **Security Tables**: 4/4 (100%) ✅
- **Company Tables**: 3/3 (100%) ✅
- **Project Tables**: 5/5 (100%) ✅
- **Task Tables**: 5/5 (100%) ✅
- **Resource Tables**: 4/4 (100%) ✅
- **Analytics Tables**: 3/3 (100%) ✅

---

## 🚨 **CRITICAL DATABASE ISSUES**

### **Immediate Issues**

1. **Daily Tasks Table**: Core feature not implemented
2. **Resource Allocation**: Critical for project management
3. **Time Tracking**: Essential for billing and analytics

### **Performance Issues**

1. **Query Optimization**: Needs performance tuning
2. **Index Strategy**: Needs comprehensive indexing
3. **Connection Pooling**: Needs optimization

### **Security Issues**

1. **Data Encryption**: Needs comprehensive encryption
2. **Access Control**: Needs row-level security
3. **Audit Logging**: Needs comprehensive logging

---

**Document Status:** Database Implementation Status - PRDV2  
**Last Updated:** January 2025  
**Next Review:** After Phase 1 completion  
**Approval Required:** Pravin Luthada, Technical Lead  
**Based on:** Current Database Implementation Status & Nove_Frontend Architecture
