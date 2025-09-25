import axios from 'axios';
import { CONFIG } from '../config-global';

// Create axios instance for task API calls
const taskApi = axios.create({
  baseURL: CONFIG.serverBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
taskApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Task module wise types
export interface TaskModuleWise {
  task_module_wise_uuid?: string;
  task_module_wise_code?: string;
  module_name: string;
  sub_module_name: string;
  module_reference_column?: string;
  module_reference_code_or_id?: string;
  task_name: string;
  description?: string;
  task_completed_date?: string | null;
  task_priority?: string | null;
  assigned_to_uuid?: string;
  assigned_to_name?: string;
  created_by_uuid?: string;
  created_by_name?: string;
  modified_by_uuid?: string;
  modified_by_name?: string;
  task_type: string;
  status?: string;
  file_upload?: any;
  date_created?: string;
  due_date?: string;
  due_time?: string;
  date_completed?: string | null;
  time_completed?: string | null;
  create_ts?: string;
  insert_ts?: string;
}

export interface CreateTaskModuleWiseRequest {
  task_module_wise_uuid?: string | null;
  task_module_wise_code?: string | null;
  module_name: string;
  sub_module_name: string;
  module_reference_column?: string;
  module_reference_code_or_id?: string;
  task_name: string;
  description?: string;
  task_completed_date?: string | null;
  task_priority?: string | null;
  assigned_to_uuid?: string;
  assigned_to_name?: string;
  created_by_uuid?: string;
  created_by_name?: string;
  task_type: string;
  status?: string;
  file_upload?: any;
  date_created?: string;
  due_date?: string;
  due_time?: string;
  date_completed?: string | null;
  time_completed?: string | null;
}

export interface CreateTaskModuleWiseResponse {
  message: string;
  data: {
    module_name: string;
    sub_module_name: string;
    module_reference_column: string | null;
    module_reference_code_or_id: string | null;
    task_name: string;
    description: string | null;
    assigned_to_uuid: string | null;
    assigned_to_name: string | null;
    created_by_uuid: string | null;
    created_by_name: string | null;
    modified_by_uuid: string | null;
    modified_by_name: string | null;
    task_type: string;
    status: string;
    date_created: string | null;
    due_date: string | null;
    due_time: string | null;
    task_module_wise_uuid: string;
    task_module_wise_code: string;
    create_ts: string;
  };
}

export interface GetTasksResponse {
  message: string;
  totalRecords: number;
  currentRecords: number;
  data: TaskModuleWise[];
}

export interface GetTaskResponse {
  message: string;
  data: TaskModuleWise;
}

// Task API functions
export const taskService = {
  // Create task module wise
  createTaskModuleWise: async (
    taskData: CreateTaskModuleWiseRequest
  ): Promise<CreateTaskModuleWiseResponse> => {
    try {
      console.log('📝 [TASK SERVICE] Creating task:', taskData);
      const response = await taskApi.post('/task/create-task-module-wise', taskData);
      console.log('✅ [TASK SERVICE] Task created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TASK SERVICE] Error creating task:', error);
      throw error;
    }
  },

  // Get all tasks
  getTasks: async (params?: {
    status?: string;
    assigned_to_uuid?: string;
    module_name?: string;
    pageNo?: number;
    itemPerPage?: number;
  }): Promise<GetTasksResponse> => {
    try {
      console.log('📝 [TASK SERVICE] Getting tasks with params:', params);
      const response = await taskApi.get('/task/get-tasks', { params });
      console.log('✅ [TASK SERVICE] Tasks retrieved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TASK SERVICE] Error getting tasks:', error);
      throw error;
    }
  },

  // Get task by UUID
  getTask: async (uuid: string): Promise<GetTaskResponse> => {
    try {
      console.log('📝 [TASK SERVICE] Getting task by UUID:', uuid);
      const response = await taskApi.get(`/task/get-task/${uuid}`);
      console.log('✅ [TASK SERVICE] Task retrieved successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TASK SERVICE] Error getting task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (uuid: string, taskData: Partial<TaskModuleWise>): Promise<GetTaskResponse> => {
    try {
      console.log('📝 [TASK SERVICE] Updating task:', uuid, taskData);
      const response = await taskApi.put(`/task/update-task/${uuid}`, taskData);
      console.log('✅ [TASK SERVICE] Task updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TASK SERVICE] Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (uuid: string): Promise<{ message: string }> => {
    try {
      console.log('📝 [TASK SERVICE] Deleting task:', uuid);
      const response = await taskApi.delete(`/task/delete-task/${uuid}`);
      console.log('✅ [TASK SERVICE] Task deleted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ [TASK SERVICE] Error deleting task:', error);
      throw error;
    }
  },
};

export default taskService;
