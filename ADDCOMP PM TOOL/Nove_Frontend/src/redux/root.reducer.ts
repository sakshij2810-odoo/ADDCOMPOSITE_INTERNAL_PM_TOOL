/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';

import {
  branchReducer,
  comapnyInformationReducer,
  commentsReducer,
  crsDrawsReducer,
  customerAutomationReducer,
  customersReducer,
  documentsReducer,
  generalReducer,
  leadsReducer,
  loadingAndSnackbarReducer,
  messagesReducer,
  nocCodesReducer,
  questionnaireReducer,
  securityReducer,
  servicesReducer,
  studyProgramsReducer,
  taskActivitiesReducer,
  templatesReducer,
  userProfileReducer,
} from './child-reducers';
import { automationReducer } from './child-reducers/settings/automation/automation.reducer';
import { commonReducer } from './child-reducers/common';

export const root_reducer = combineReducers({
  general: generalReducer,
  leads: combineReducers({
    leads: leadsReducer,
    nocCodes: nocCodesReducer,
    crsDraws: crsDrawsReducer,
    studyPrograms: studyProgramsReducer,
    customers: customersReducer,
    documents: documentsReducer,
  }),
  comments: commentsReducer,
  message: messagesReducer,
  common: commonReducer,
  templates: templatesReducer,
  loadingAndSnackbar: loadingAndSnackbarReducer,
  configurations: combineReducers({
    comapny: comapnyInformationReducer,
  }),
  management: combineReducers({
    settings: combineReducers({
      customerAutomation: customerAutomationReducer,
      automation: automationReducer,
    }),
    services: servicesReducer,
    questionnaire: questionnaireReducer,
    userProfiles: userProfileReducer,
    security: securityReducer,
  }),
  dataManagement: combineReducers({
    branch: branchReducer,
  }),
  tasks: combineReducers({
    taskActivities: taskActivitiesReducer,
  }),
});
