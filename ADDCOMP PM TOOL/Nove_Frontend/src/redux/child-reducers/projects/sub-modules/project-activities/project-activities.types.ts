import { IFileUpload } from 'src/mui-components/FileUpload/FileUpload.type';
import { ILoadState } from 'src/redux/store.enums';

export interface IProjectActivity {
  project_uuid: string | null;
  project_id: string | null;
  name: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  projectType: string | null;
  startDate: string | null;
  endDate: string | null;
  estimatedDays: number | null;
  budget: number | null;
  projectManagerId: string | null;
  clientId: string | null;
  tags: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  file_upload: IFileUpload[] | null;

  create_ts?: string;
  insert_ts?: string;
}

export interface IProjectActivityState {
  multiple_project_activities: {
    data: IProjectActivity[];
    count: number;
    loading: ILoadState;
    error: string | null;
  };
}
