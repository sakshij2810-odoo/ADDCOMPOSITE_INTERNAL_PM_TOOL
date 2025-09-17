/* eslint-disable import/no-cycle */
import { getUniqueId } from 'src/helpers';
import { ILoadState } from 'src/redux/store.enums';

export interface IAutomationState {
  graphData: {
    nodes: IGraphNode[];
    edges: IGraphEdge[];
    workflow_basic_code: string | null;
  };
  graphLoadState: ILoadState;
  list: IWorkflowGET[];
  loading: ILoadState;
  totalRecords: number;
}

export interface IWorkflowGET {
  workflow_basic_id: number;
  workflow_basic_code: string;
  run_as: string;
  table_name: string;
  is_repetation: string | null;
  repeat_on: string | null;
  repeat_every_at: string | null;
  repetation_ends: string | null;
  nodes: string | null;
  edges: string | null;
  status: string;
  created_by_id: number;
  modified_by_id: number;
  create_ts: string;
  insert_ts: string;
}

export interface IGraphNode {
  id: string;
  data: { label: string; payload: AutomationNodes };
  type: GRAPH_NODE_TYPE;
  position: { x: number; y: number };
}

export interface IGraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface ICreateWorkflow {
  workflow_basic_code: string | null;
  run_as: 'CRON' | 'REAL_TIME' | null;
  workflow_name: string | null;
  real_time_type: 'CREATE' | 'SELF_CHANGES' | 'CUSTOM' | null;
  module_name: string | null;
  endpoint_path: string | null;

  cron_schedule_at: {
    second: number | null;
    minute: number | null;
    hour: number | null;
    date: number | null;
    month: number | null;
    week: number | null;
    repeatEvery: boolean;
  };
  status: string;
  nodes: {
    id: string;
    data: { label: string };
    type: GRAPH_NODE_TYPE;
    position: { x: number; y: number };
    height?: number;
    width?: number;
  };
  edges: IGraphEdge[];
}

export interface IWorkFlowCondition {
  workflow_condition_code: string | null;
  workflow_basic_code: string;
  call_type: 'API' | 'SQL' | null;
  conditions: {
    [key: string]: IConditionTableRow[];
  }[];
  ui_module_name: string;
  ui_related: {
    [key: string]: {
      rows: ICronConditionTableRow[];
    };
  }[];
  sql_statement: string | null;
  nodes: {
    id: string;
    data: { label: string };
    type: GRAPH_NODE_TYPE;
    position: { x: number; y: number };
    height?: number;
    width?: number;
  };
  condition_variables: string[];
  status: string;
}

export interface IConditionTableRow {
  view: string;
  viewColumn: string;
  column: string;
  operant:
    | 'EQUAL'
    | 'NOT_EQUAL'
    | 'GREATER'
    | 'LESSER'
    | 'GREATER_THAN_EQUAL'
    | 'LESSER_THAN_EQUAL'
    | null;
  columnCompView: string | null;
  columnCompColumn: null;
  columnOrValue: string | null;
  compareColumnValue: string | null;
  isColumnComparison: boolean;
  isCompareWithOldValue: boolean;
}

export interface ICronConditionTableRow {
  viewColumn: string;
  column: string;
  operant:
    | 'EQUAL'
    | 'NOT_EQUAL'
    | 'GREATER'
    | 'LESSER'
    | 'GREATER_THAN_EQUAL'
    | 'LESSER_THAN_EQUAL'
    | null;
  columnCompView: string | null;
  columnCompColumn: null;
  columnOrValue: string | null;
  compareColumnValue: string | null;
  isColumnComparison: boolean;
}

export interface IWorkFlowAction {
  workflow_action_code: string | null;
  workflow_basic_code: string;
  workflow_condition_code: string | null;
  action_type: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'MODIFICATION' | null;
  comment: string | null;
  status: string;
  nodes: {
    id: string;
    data: { label: string };
    type: GRAPH_NODE_TYPE;
    position: { x: number; y: number };
    height?: number;
    width?: number;
  };
}

export interface IWorkflowFinishEmail {
  workflow_action_email_code: string | null;
  workflow_basic_code: string;
  workflow_action_code: string;
  call_type: 'API' | 'SQL' | 'VARIABLE' | 'EMAIL_ADDRESS';
  emailsTo: string[];
  emailsCC: string[];
  emailsBCC: string[];
  variablesTo: {
    view: string | null;
    columnName: string | null;
  }[];
  apiTo: IAutomationApiEndpoint[];

  variablesCC: {
    view: string | null;
    columnName: string | null;
  }[];
  apiCC: IAutomationApiEndpoint[];

  variablesBCC: {
    view: string | null;
    columnName: string | null;
  }[];
  apiBCC: IAutomationApiEndpoint[];

  sending_order: 'ONE_BY_ONE' | 'ALL_AT_ONCE';
  template_code: string | null;
  nodes: {
    id: string;
    data: { label: string };
    type: GRAPH_NODE_TYPE;
    position: { x: number; y: number };
    height?: number;
    width?: number;
  };
  status: string;
}

export interface IAutomationApiEndpoint {
  api: string;
  emailColumn: string;
  userName: string;
  queryParams: {
    name: string;
    isStaticValue: boolean;
    module_name: string;
    column_name: string;
    value: string;
  }[];
  endpointType: string;
  module_name: string | null;
  endpoint: string | null;
}

export interface IWorkflowFinishEmailAPIPayloadResponse {
  workflow_action_email_code: string | null;
  workflow_basic_code: string;
  workflow_action_code: string;
  call_type: 'API' | 'SQL' | 'VARIABLE' | 'EMAIL_ADDRESS';

  to: any[];
  cc: any[];
  bcc: any[];
  sending_order: 'ONE_BY_ONE' | 'ALL_AT_ONCE';
  template_code: string | null;
  nodes: {
    id: string;
    data: { label: string };
    type: GRAPH_NODE_TYPE;
    position: { x: number; y: number };
    height?: number;
    width?: number;
  };
  status: string;
}

export type AutomationNodes =
  | IWorkFlowCondition
  | ICreateWorkflow
  | IWorkFlowAction
  | IWorkflowFinishEmail;

export type GRAPH_NODE_TYPE =
  | 'parentWorkflowNode'
  | 'conditionNode'
  | 'actionNodeEmail'
  | 'actionNodeSMS'
  | 'actionNodeWhatsApp'
  | 'actionNodeModification'
  | 'performEmailAction'
  | 'placeholder';

export const initialAutomationState: IAutomationState = {
  graphData: {
    nodes: [],
    edges: [],
    workflow_basic_code: null,
  },
  graphLoadState: ILoadState.failed,
  list: [],
  totalRecords: 0,
  loading: ILoadState.failed,
};

export const initialAutomationParentNode: ICreateWorkflow = {
  workflow_basic_code: null,
  run_as: null,
  endpoint_path: null,
  module_name: null,
  real_time_type: null,
  workflow_name: null,
  cron_schedule_at: {
    date: null,
    hour: null,
    minute: null,
    month: null,
    repeatEvery: false,
    second: null,
    week: null,
  },
  status: 'ACTIVE',
  nodes: {
    id: getUniqueId(),
    data: { label: 'Start Workflow' },
    position: { x: 100, y: 150 },
    type: 'parentWorkflowNode',
    height: 100,
    width: 170,
  },
  edges: [],
};

export const intitalWorkflowConditionNode: IWorkFlowCondition = {
  workflow_condition_code: null,
  workflow_basic_code: '',
  call_type: null,
  conditions: [
    {
      and: [],
    },
  ],
  ui_module_name: '',
  ui_related: [
    {
      and: {
        rows: [],
      },
    },
  ],
  sql_statement: null,
  condition_variables: [],
  status: 'ACTIVE',
  nodes: {
    id: '',
    data: { label: '' },
    type: 'conditionNode',
    position: { x: 0, y: 0 },
    height: 100,
    width: 170,
  },
};

export const intitialWorkFlowActionNode: IWorkFlowAction = {
  workflow_action_code: null,
  workflow_basic_code: '',
  workflow_condition_code: null,
  action_type: null,
  comment: null,
  status: 'ACTIVE',
  nodes: {
    id: '',
    data: { label: '' },
    type: 'conditionNode',
    position: { x: 0, y: 0 },
    height: 100,
    width: 170,
  },
};
export const intitialWorkFinishEmailActionNode: IWorkflowFinishEmail = {
  workflow_action_email_code: null,
  workflow_action_code: '',
  emailsTo: [],
  emailsCC: [],
  emailsBCC: [],
  variablesTo: [],
  variablesCC: [],
  variablesBCC: [],
  apiTo: [],
  apiCC: [],
  apiBCC: [],
  call_type: 'VARIABLE',
  sending_order: 'ONE_BY_ONE',
  workflow_basic_code: '',
  template_code: null,
  nodes: {
    id: '',
    data: { label: '' },
    type: 'performEmailAction',
    position: { x: 0, y: 0 },
    height: 100,
    width: 170,
  },
  status: 'ACTIVE',
};
