/* eslint-disable import/no-cycle */
import {
  defaultBranchState,
  defaultCRSDrawState,
  defaultCustomerAutomationState,
  defaultCustomerState,
  defaultDocumentState,
  defaultGeneralState,
  defaultLoadingAndSnackbarState,
  defaultNocCodeState,
  defaultPrivateLeadState,
  defaultQuestionnaireState,
  defaultSecurityState,
  defaultServiceState,
  defaultStudyProgramState,
  defaultTaskActivityState,
  initialMessagesState,
  initialTemplateState,
} from './child-reducers';

import { defaultCommentState } from './child-reducers/comments';
import { defaultCommonState } from './child-reducers/common';
import { defaultCompanyInformationState } from './child-reducers/configurations';
import { defaultAutomationState } from './child-reducers/settings/automation/automation.state';
import { defaultUserProfileState } from './child-reducers/user-profile';

import type { IStoreState } from './store.types';

export const defaultStoreState: IStoreState = {
  general: defaultGeneralState,
  leads: {
    leads: defaultPrivateLeadState,
    crsDraws: defaultCRSDrawState,
    nocCodes: defaultNocCodeState,
    studyPrograms: defaultStudyProgramState,
    customers: defaultCustomerState,
    documents: defaultDocumentState,
  },
  comments: defaultCommentState,
  message: initialMessagesState,
  common: defaultCommonState,
  templates: initialTemplateState,

  loadingAndSnackbar: defaultLoadingAndSnackbarState,
  configurations: {
    comapny: defaultCompanyInformationState,
  },
  management: {
    settings: {
      customerAutomation: defaultCustomerAutomationState,
      automation: defaultAutomationState,
    },
    services: defaultServiceState,
    questionnaire: defaultQuestionnaireState,
    userProfiles: defaultUserProfileState,
    security: defaultSecurityState,
  },
  dataManagement: {
    branch: defaultBranchState,
  },
  tasks: {
    taskActivities: defaultTaskActivityState,
  },
};
