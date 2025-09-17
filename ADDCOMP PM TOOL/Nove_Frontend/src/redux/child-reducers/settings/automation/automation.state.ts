/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ILoadState } from 'src/redux/store.enums';
import {
  IAutomationState,
  initialAutomationParentNode,
  intitalWorkflowConditionNode,
  intitialWorkFlowActionNode,
  intitialWorkFinishEmailActionNode,
} from './automation.types';

export const defaultAutomationState: IAutomationState = {
  graphData: {
    nodes: [],
    edges: [],
    workflow_basic_code: null,
  },
  graphLoadState: ILoadState.idle,
  list: [],
  loading: ILoadState.idle,
  totalRecords: 0,
};

export const defaultAutomationNodes = {
  parentNode: initialAutomationParentNode,
  conditionNode: intitalWorkflowConditionNode,
  actionNode: intitialWorkFlowActionNode,
  finishEmailNode: intitialWorkFinishEmailActionNode,
};
