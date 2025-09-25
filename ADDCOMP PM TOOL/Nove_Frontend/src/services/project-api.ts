import { IProject, IProjectFormData } from 'src/types/project';
import { CONFIG } from 'src/config-global';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';

// ----------------------------------------------------------------------

export interface ProjectListResponse {
  success: boolean;
  data: {
    projects: IProject[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ProjectResponse {
  success: boolean;
  data: IProject;
}

// ----------------------------------------------------------------------

class ProjectApiService {
  async getProjects(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<ProjectListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = `${server_base_endpoints.projects.get_projects}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await axios_base_api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      throw error;
    }
  }

  async getProject(project_uuid: string): Promise<ProjectResponse> {
    try {
      const response = await axios_base_api.get(
        `${server_base_endpoints.projects.get_projects}/${project_uuid}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project:', error);
      throw error;
    }
  }

  async upsertProject(projectData: IProjectFormData): Promise<ProjectResponse> {
    try {
      // Remove create_ts and insert_ts from payload as backend will handle these
      const { create_ts, insert_ts, ...restPayload } = projectData as any;
      const response = await axios_base_api.post(
        server_base_endpoints.projects.upsert_project,
        restPayload
      );
      return response.data;
    } catch (error) {
      console.error('Failed to upsert project:', error);
      throw error;
    }
  }

  async deleteProject(project_uuid: string): Promise<{ success: boolean }> {
    try {
      const response = await axios_base_api.delete(
        `${server_base_endpoints.projects.get_projects}/${project_uuid}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  async addProjectMember(
    project_uuid: string,
    userId: string,
    role: string = 'MEMBER'
  ): Promise<{ success: boolean }> {
    try {
      const response = await axios_base_api.post(
        `${server_base_endpoints.projects.get_projects}/${project_uuid}/members`,
        {
          userId,
          role,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add project member:', error);
      throw error;
    }
  }

  async removeProjectMember(project_uuid: string, memberId: string): Promise<{ success: boolean }> {
    try {
      const response = await axios_base_api.delete(
        `${server_base_endpoints.projects.get_projects}/${project_uuid}/members/${memberId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to remove project member:', error);
      throw error;
    }
  }

  async getProjectAnalytics(project_uuid: string): Promise<any> {
    try {
      const response = await axios_base_api.get(
        `${server_base_endpoints.projects.get_projects}/${project_uuid}/analytics`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch project analytics:', error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export const projectApi = new ProjectApiService();
