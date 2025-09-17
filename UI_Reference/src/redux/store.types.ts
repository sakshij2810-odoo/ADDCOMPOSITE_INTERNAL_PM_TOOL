/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable perfectionist/sort-imports */
import type { IDataTableV2DateState } from 'src/mui-components/TableV2/preDefinedPlugins/DataTableV2Date/DataTableV2Date.types';
import type { IDatatableV2AdvancedSearchFilter } from 'src/mui-components/TableV2/preDefinedPlugins/SearchFilter/SearchFilter.types';

import type {
  ICRSDrawState,
  ICustomerAutomationState,
  ICustomerState,
  IDocumentState,
  IGeneralState,
  ILoadingAndSnackbarState,
  IMessagesState,
  INocCodeState,
  IPrivateLeadState,
  IQuestionnaireState,
  ISecurityState,
  IServiceState,
  IStudyProgramState,
  ITemplateState,
} from './child-reducers';
import { ICommentState } from './child-reducers/comments';
import { ICompanyInformationState } from './child-reducers/configurations';
import { IUserProfileState } from './child-reducers/user-profile';
import { IBranchState } from './child-reducers/data-management';
import { IAutomationState } from './child-reducers/settings/automation/automation.types';
import { ICommonState } from './child-reducers/common';
import { ITaskActivityState } from './child-reducers';

export interface ISearchQueryParams {
  status?: string;
  page: number;
  rowsPerPage: number;
  columns?: string[];
  value?: string;
  fromDate?: string;
  toDate?: string;
}
export interface ISearchQueryParamsV2 {
  page: number;
  rowsPerPage: number;
  status?: string;
  date?: IDataTableV2DateState['dates'];
  searchValue?: IDatatableV2AdvancedSearchFilter;
  moduleName?: string;
  subModuleName?: string;
  tableName?:
    | 'latest_leads'
    | 'documents'
    | 'crs_draws'
    | 'answers'
    | 'latest_questions_options'
    | 'latest_noc_codes'
    | 'latest_study_program'
    | 'latest_services'
    | 'latest_user'
    | 'latest_role'
    | 'latest_role_group'
    | 'latest_approval'
    | 'latest_approval_count'
    | 'latest_crs_draws'
    | 'latest_questionnaire'
    | 'latest_workflow_basic';
}

export interface IStoreState {
  general: IGeneralState;
  leads: {
    leads: IPrivateLeadState;
    crsDraws: ICRSDrawState;
    nocCodes: INocCodeState;
    studyPrograms: IStudyProgramState;
    customers: ICustomerState;
    documents: IDocumentState;
  };
  comments: ICommentState;
  message: IMessagesState;
  common: ICommonState;
  templates: ITemplateState;
  loadingAndSnackbar: ILoadingAndSnackbarState;
  configurations: {
    comapny: ICompanyInformationState;
  };
  management: {
    settings: {
      customerAutomation: ICustomerAutomationState;
      automation: IAutomationState;
    };
    services: IServiceState;
    questionnaire: IQuestionnaireState;
    userProfiles: IUserProfileState;
    security: ISecurityState;
  };
  dataManagement: {
    branch: IBranchState;
  };
  tasks: {
    taskActivities: ITaskActivityState;
  };
}

export interface IPostWrapperWithCallback<P, R> {
  payload: P;
  onSuccess: (isSuccess: boolean, data?: R) => void;
}
