import moment from 'moment';
import { IProjectActivity, IProjectActivityState } from './project-activities.types';
import { STANDARD_APP_DATE_FORMAT } from 'src/utils/format-date-time';
import { ILoadState } from 'src/redux/store.enums';

export const defaultProjectActivity: IProjectActivity = {
  project_uuid: null,
  project_id: null,
  name: null,
  description: null,
  status: 'PLANNING',
  priority: 'MEDIUM',
  projectType: 'CLIENT',
  startDate: moment().format(STANDARD_APP_DATE_FORMAT),
  endDate: moment().add('days', 30).format(STANDARD_APP_DATE_FORMAT),
  estimatedDays: null,
  budget: null,
  projectManagerId: null,
  clientId: null,
  tags: [],
  createdAt: moment().format(STANDARD_APP_DATE_FORMAT),
  updatedAt: moment().format(STANDARD_APP_DATE_FORMAT),
  createdBy: null,
  updatedBy: null,
  file_upload: null,
};

export const defaultProjectActivityState: IProjectActivityState = {
  multiple_project_activities: {
    data: [],
    count: 0,
    loading: ILoadState.idle,
    error: null,
  },
};
