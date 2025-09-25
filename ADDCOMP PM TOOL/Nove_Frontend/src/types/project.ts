export interface IProject {
  project_uuid: string | null;
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  projectType: ProjectType;
  startDate: Date | null;
  endDate: Date | null;
  estimatedDays: number | null;
  actualDays: number | null;
  budget: number | null;
  actualCost: number | null;
  projectManagerId: string;
  clientId: string;
  googleDriveFolderId: string;
  googleCalendarId: string;
  googleChatSpaceId: string;
  tags: string[];
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  create_ts?: string;
  insert_ts?: string;

  // Relations
  projectManager?: IUser | null;
  client?: IClient | null;
  members: IProjectMember[];
  tasks: ITask[];
  _count: {
    tasks: number;
    members: number;
  };
}

export interface IProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  addedBy: string;
  addedAt: Date;
  user: IUser;
}

export interface IClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: string;
  projectId: string;
  parentTaskId: string | null;
  assignedTo: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  taskType: TaskType;
  estimatedDays: number | null;
  actualDays: number | null;
  dueDate: Date | null;
  completedAt: Date | null;
  startedAt: Date | null;
  tags: string[];
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IUser {
  id: string;
  googleId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: UserRole;
  department: string;
  position: string;
  phone: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export type ProjectStatus =
  | 'PLANNING'
  | 'ACTIVE'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProjectType = 'CLIENT' | 'INTERNAL' | 'RND' | 'MAINTENANCE';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'CANCELLED';

export type TaskType = 'DEVELOPMENT' | 'DESIGN' | 'TESTING' | 'DOCUMENTATION' | 'MEETING' | 'OTHER';

export type UserRole = 'EMPLOYEE' | 'PROJECT_MANAGER' | 'ADMIN';

export interface IProjectFormData {
  project_uuid: string | null;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  projectType: ProjectType;
  startDate: Date | null;
  endDate: Date | null;
  estimatedDays: number | null;
  budget: number | null;
  projectManagerId: string;
  clientId: string;
  tags: string[];
}
