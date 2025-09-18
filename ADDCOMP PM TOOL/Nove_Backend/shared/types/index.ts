// Shared TypeScript types for all microservices

export interface User {
  id: string;
  googleId?: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  position?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Nova World Group specific user interface
export interface NovaWorldUser {
  user_fact_id: number;
  user_uuid: string;
  email: string;
  status: string;
  created_by_uuid?: string;
  created_by_name?: string;
  create_ts?: string;
  insert_ts?: string;
  user_dim_id?: number;
  role_uuid?: string;
  role_value?: string;
  user_profile_id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  personal_email?: string;
  job_title?: string;
  user_type?: string;
  assigned_phone_number?: string;
  shared_email?: string;
  mobile?: string;
  home_phone?: string;
  linkedin_profile?: string;
  hire_date?: string;
  last_day_at_work?: string;
  department?: string;
  fax?: string;
  date_of_birth?: string;
  mother_maiden_name?: string;
  photo?: string;
  signature?: string;
  street_address?: string;
  unit_or_suite?: string;
  city?: string;
  csr?: string;
  csr_code?: string;
  marketer?: string;
  marketer_code?: string;
  producer_one?: string;
  producer_one_code?: string;
  producer_two?: string;
  producer_two_code?: string;
  producer_three?: string;
  producer_three_code?: string;
  branch_code?: string;
  province_or_state?: string;
  postal_code?: string;
  country?: string;
  languages_known?: string;
  documents?: string;
  branch_name?: string;
  branch_uuid?: string;
  referral_code?: string;
}

// Nova World Group API response structure
export interface NovaWorldUserResponse {
  message: string;
  totalRecords: number;
  currentRecords: number;
  data: NovaWorldUser[];
}

export enum UserRole {
  EMPLOYEE = "employee",
  PROJECT_MANAGER = "project_manager",
  ADMIN = "admin",
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  projectType: ProjectType;
  startDate?: Date;
  endDate?: Date;
  estimatedDays?: number;
  actualDays?: number;
  budget?: number;
  actualCost?: number;
  projectManagerId: string;
  clientId?: string;
  googleDriveFolderId?: string;
  googleCalendarId?: string;
  googleChatSpaceId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export enum ProjectStatus {
  PLANNING = "planning",
  ACTIVE = "active",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  ARCHIVED = "archived",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum ProjectType {
  CLIENT = "client",
  INTERNAL = "internal",
  RND = "rnd",
  MAINTENANCE = "maintenance",
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId?: string;
  assignedTo?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  taskType: TaskType;
  estimatedDays?: number;
  actualDays?: number;
  dueDate?: Date;
  completedAt?: Date;
  startedAt?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BLOCKED = "blocked",
  CANCELLED = "cancelled",
}

export enum TaskType {
  DEVELOPMENT = "development",
  DESIGN = "design",
  TESTING = "testing",
  DOCUMENTATION = "documentation",
  MEETING = "meeting",
  OTHER = "other",
}

export interface DailyTask {
  id: string;
  userId: string;
  taskId: string;
  date: Date;
  status: DailyTaskStatus;
  timeSpentPercentage: number;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum DailyTaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

export interface ResourceAllocation {
  id: string;
  projectId: string;
  userId: string;
  allocationPercentage: number;
  startDate: Date;
  endDate?: Date;
  role?: string;
  hourlyRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  taskId: string;
  projectId: string;
  date: Date;
  timeSpentPercentage: number;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  isBillable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReallocationRequest {
  id: string;
  userId: string;
  currentTaskId: string;
  requestedProjectId: string;
  reason: string;
  status: ReallocationStatus;
  projectManagerId?: string;
  responseNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  respondedBy?: string;
}

export enum ReallocationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  TASK_ASSIGNED = "task_assigned",
  TASK_DUE = "task_due",
  PROJECT_DELAY = "project_delay",
  RESOURCE_REALLOCATION = "resource_reallocation",
  SYSTEM_ALERT = "system_alert",
  PROJECT_UPDATE = "project_update",
}

export interface GoogleIntegration {
  id: string;
  userId: string;
  integrationType: GoogleIntegrationType;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scope?: string[];
  isActive: boolean;
  lastSyncAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum GoogleIntegrationType {
  DRIVE = "drive",
  CALENDAR = "calendar",
  CHAT = "chat",
  MEET = "meet",
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  requestId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Request Types
export interface CreateProjectRequest {
  name: string;
  description?: string;
  priority: Priority;
  projectType: ProjectType;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  clientId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  actualCost?: number;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface CreateTaskRequest {
  projectId: string;
  parentTaskId?: string;
  assignedTo?: string;
  title: string;
  description?: string;
  priority: Priority;
  taskType: TaskType;
  estimatedDays?: number;
  dueDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assignedTo?: string;
  estimatedDays?: number;
  actualDays?: number;
  dueDate?: Date;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ResourceAllocationRequest {
  projectId: string;
  userId: string;
  allocationPercentage: number;
  startDate: Date;
  endDate?: Date;
  role?: string;
  hourlyRate?: number;
}

export interface DailyTaskGenerationRequest {
  userId: string;
  date: string;
  preferences?: {
    maxTasks?: number;
    priority?: Priority;
    excludeProjects?: string[];
  };
}

// Filter Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: Priority[];
  projectType?: ProjectType[];
  projectManagerId?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  search?: string;
}

export interface TaskFilters {
  projectId?: string;
  assignedTo?: string;
  status?: TaskStatus[];
  priority?: Priority[];
  taskType?: TaskType[];
  dueDate?: Date;
  tags?: string[];
  search?: string;
}

export interface UserFilters {
  role?: UserRole[];
  department?: string[];
  isActive?: boolean;
  search?: string;
}

// Analytics Types
export interface ProjectAnalytics {
  projectId: string;
  date: Date;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  totalTimeSpent: number;
  budgetUsed: number;
  teamSize: number;
  progressPercentage: number;
}

export interface UserPerformance {
  userId: string;
  date: Date;
  tasksCompleted: number;
  timeSpent: number;
  productivityScore: number;
}

// Google API Types
export interface GoogleDriveFolder {
  id: string;
  name: string;
  parents?: string[];
  mimeType: string;
  webViewLink?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  attendees?: Array<{
    email: string;
    responseStatus: string;
  }>;
}

export interface GoogleChatMessage {
  name: string;
  text: string;
  createTime: string;
  author: {
    name: string;
    displayName: string;
  };
}

// Service Communication Types
export interface ServiceRequest {
  service: string;
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

// Event Types
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: Record<string, any>;
  metadata: Record<string, any>;
  occurredAt: Date;
}

export interface TaskAssignedEvent extends DomainEvent {
  type: "TaskAssigned";
  data: {
    taskId: string;
    userId: string;
    projectId: string;
    assignedBy: string;
  };
}

export interface TaskCompletedEvent extends DomainEvent {
  type: "TaskCompleted";
  data: {
    taskId: string;
    userId: string;
    projectId: string;
    completedAt: Date;
  };
}

export interface ProjectCreatedEvent extends DomainEvent {
  type: "ProjectCreated";
  data: {
    projectId: string;
    name: string;
    projectManagerId: string;
    clientId?: string;
  };
}

// Configuration Types
export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  ssl: boolean;
}

export interface RedisConfig {
  url: string;
  password?: string;
  db: number;
}

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface NovaConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

export interface ServiceConfig {
  name: string;
  port: number;
  host: string;
  version: string;
  healthCheckPath: string;
}
