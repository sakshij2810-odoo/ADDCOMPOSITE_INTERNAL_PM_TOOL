/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable object-shorthand */
/* eslint-disable operator-assignment */
/* eslint-disable no-lonely-if */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  IAutomationState,
  IConditionTableRow,
  ICreateWorkflow,
  IGraphNode,
  IWorkFlowAction,
  IWorkFlowCondition,
  IWorkflowFinishEmail,
  IWorkflowFinishEmailAPIPayloadResponse,
} from './automation.types';

import axios_base_api, {
  axios_Loading_messages,
  server_base_endpoints,
} from 'src/utils/axios-base-api';

import { getUniqueId } from 'src/helpers';
import {
  closeLoadingDialog,
  openLoadingDialog,
  openSnackbarDialog,
} from '../../loading-and-snackbar';
import { parseFinialEmailApiToLocalPayload } from './parseFinialEmailApiToLocalPayload';
import { ISearchQueryParamsV2 } from 'src/redux/store.types';
import { getSearchQueryParamsV2 } from 'src/redux/store.utils';
import { IRecordCount } from '../../general';

// Helper functions similar to user profile actions
const createAsyncThunkGetWrapper = <T, Args = void>(
  typePrefix: string,
  thunk: (args: Args, thunkAPI: any) => Promise<T>
) => {
  return createAsyncThunk<T, Args>(typePrefix, async (args, thunkAPI) => {
    try {
      const data = await thunk(args, thunkAPI);
      return data;
    } catch (error: any) {
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'error',
          message: error.response?.data?.message || 'An error occurred',
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    } finally {
      thunkAPI.dispatch(closeLoadingDialog());
    }
  });
};

const createAsyncThunkPostWrapper = <T, Args = void>(
  typePrefix: string,
  thunk: (args: Args, thunkAPI: any) => Promise<T>
) => {
  return createAsyncThunk<T, Args>(typePrefix, async (args, thunkAPI) => {
    thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save));
    try {
      const data = await thunk(args, thunkAPI);
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'success',
          message: axios_Loading_messages.save_success,
        })
      );
      return data;
    } catch (error: any) {
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'error',
          message: error.response?.data?.message || axios_Loading_messages.save_error,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    } finally {
      thunkAPI.dispatch(closeLoadingDialog());
    }
  });
};

// Fetch automation graph data
export const fetchAutomationAsync = createAsyncThunkGetWrapper<
  IAutomationState['graphData'],
  string
>('automation/fetchAutomationAsync', async (code, thunkAPI) => {
  try {
    const res = await axios_base_api.get(
      `${server_base_endpoints.workflow.upsert_workflow_all_definition}?workflow_basic_code=${code}`
    );
    const data = res.data.data;

    if (data.length > 0) {
      const finalGraphData: IAutomationState['graphData'] = {
        nodes: [],
        edges: [],
        workflow_basic_code: null,
      };

      for (const item of data) {
        const { nodes, ...rest } = item;
        if (nodes && (rest.status === 'ACTIVE' || item.nodes.type === 'parentWorkflowNode')) {
          if (item.nodes.type === 'performEmailAction') {
            const { nodes, ...rest } = parseFinialEmailApiToLocalPayload(item);
            const graphNode: IGraphNode = {
              id: item.nodes.id,
              data: {
                label: item.nodes.data.label,
                payload: rest as IWorkflowFinishEmail,
              },
              position: item.nodes.position,
              type: item.nodes.type,
            };
            finalGraphData.nodes.push(graphNode);
          } else {
            const graphNode: IGraphNode = {
              id: item.nodes.id,
              data: {
                label: item.nodes.data.label,
                payload: rest as IWorkFlowCondition,
              },
              position: item.nodes.position,
              type: item.nodes.type,
            };
            finalGraphData.nodes.push(graphNode);
          }
        }
      }

      const placeholderId = getUniqueId();
      finalGraphData.nodes.push({
        id: placeholderId,
        data: { label: '+', payload: {} as any },
        position: { x: 0, y: 0 },
        type: 'placeholder',
      });

      for (let i = 0; i < finalGraphData.nodes.length; i++) {
        if (i !== 0) {
          const targetId = finalGraphData.nodes[i].id;
          const sourceId = finalGraphData.nodes[i - 1].id;
          finalGraphData.edges.push({
            id: sourceId + '=>' + targetId,
            source: sourceId,
            target: targetId,
            type: finalGraphData.nodes[i].type,
          });
        }
      }

      return thunkAPI.fulfillWithValue(finalGraphData);
    }
    return thunkAPI.rejectWithValue('No data found');
  } catch (error: any) {
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: error.response?.data?.message || axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(error.response?.data);
  } finally {
    thunkAPI.dispatch(closeLoadingDialog());
  }
});

// Add placeholder node
export const addPlaceholderNodeAsync = createAsyncThunk(
  'automation/addPlaceholderNodeAsync',
  async (_, thunkAPI) => {
    try {
      const nodes: any = [
        {
          id: getUniqueId(),
          data: { label: '+', payload: {} as any },
          position: { x: 0, y: 0 },
          type: 'placeholder',
        },
      ];
      const edges: any = [];

      for (let i = 0; i < nodes.length; i++) {
        if (i !== 0) {
          const targetId = nodes[i].id;
          const sourceId = nodes[i - 1].id;
          edges.push({
            id: sourceId + '=>' + targetId,
            source: sourceId,
            target: targetId,
            type: nodes[i].type,
          });
        }
      }

      return thunkAPI.fulfillWithValue({
        edges,
        nodes,
        workflow_basic_code: '',
      });
    } catch (error: any) {
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'error',
          message: error.response?.data?.message || axios_Loading_messages.save_error,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    } finally {
      thunkAPI.dispatch(closeLoadingDialog());
    }
  }
);

// Workflow node actions
interface IUpsertWorkflowArgs {
  data: ICreateWorkflow;
  onCallback: (isSuccess: boolean, code?: string) => void;
}

export const upsertWorkflowAsync = createAsyncThunkPostWrapper<IGraphNode, IUpsertWorkflowArgs>(
  'automation/upsertWorkflowAsync',
  async ({ data, onCallback }, thunkAPI) => {
    try {
      const res = await axios_base_api.post(
        `${server_base_endpoints.workflow.upsert_workflow_basic}`,
        data
      );
      const { nodes, ...rest } = res.data.data;

      const finalData: IGraphNode = {
        id: nodes.id,
        data: {
          label: nodes.data.label,
          payload: rest as ICreateWorkflow,
        },
        position: nodes.position,
        type: nodes.type,
      };

      onCallback(true, (rest as ICreateWorkflow).workflow_basic_code as string);
      // return finalData;
      return {
        nodes: [finalData],
        edges: [],
        workflow_basic_code: (rest as ICreateWorkflow).workflow_basic_code,
      };
    } catch (error: any) {
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'error',
          message: error.response?.data?.message || axios_Loading_messages.save_error,
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data);
    } finally {
      thunkAPI.dispatch(closeLoadingDialog());
    }
  }
);

// Condition node actions
interface IUpsertConditionNodeArgs {
  data: IWorkFlowCondition;
  onCallback: (isSuccess: boolean) => void;
}

export const upsertConditionNodeAsync = createAsyncThunkPostWrapper<
  IGraphNode,
  IUpsertConditionNodeArgs
>('automation/upsertConditionNodeAsync', async ({ data, onCallback }, thunkAPI) => {
  try {
    const isDelete = data.status === 'INACTIVE';

    const state = thunkAPI.getState();

    const workflowNode = state.management.settings.automation.graphData.nodes[0].data
      .payload as ICreateWorkflow;

    const isSelfChanges = workflowNode.real_time_type === 'SELF_CHANGES';
    const isCron = workflowNode.run_as == 'CRON';
    const conditionVariables: string[] = [];
    const finalDataList: IWorkFlowCondition = {
      ...data,
      conditions: !isCron ? [...data.conditions] : [],
    };

    let consitionsList: { [key: string]: IConditionTableRow[] } = {};
    for (let i = 0; i < data.conditions.length; i++) {
      const condition = data.conditions[i];
      const firstKey = Object.keys(condition)[0];
      if (firstKey) {
        for (const row of condition[firstKey]) {
          let column = row.view + '.' + row.viewColumn;
          let columnOrValue = '';
          if (row.isCompareWithOldValue && isSelfChanges) {
            columnOrValue = row.view + '.' + row.columnCompColumn + '.old_value';
          } else {
            if (row.isColumnComparison) {
              columnOrValue = row.columnCompView + '.' + row.columnCompColumn;
            } else {
              columnOrValue = row.compareColumnValue as string;
            }
          }
          if (isSelfChanges) {
            column = column + '.new_value';
          }
          conditionVariables.push(column);
          if (consitionsList[firstKey]) {
            consitionsList[firstKey].push({
              ...row,
              column: column,
              columnOrValue: columnOrValue,
            });
          } else {
            consitionsList[firstKey] = [
              {
                ...row,
                column: column,
                columnOrValue: columnOrValue,
              },
            ];
          }
        }
        if (condition[firstKey].length === 0) {
          consitionsList['and'] = [];
          finalDataList.conditions[i] = consitionsList;
          consitionsList = {};
        } else {
          finalDataList.conditions[i] = consitionsList;
          consitionsList = {};
        }
      } else {
        consitionsList['and'] = [];
        finalDataList.conditions[i] = consitionsList;
        consitionsList = {};
      }
    }

    if (!isCron) {
      finalDataList.condition_variables = conditionVariables;
    }

    const res = await axios_base_api.post(
      `${server_base_endpoints.workflow.upsert_workflow_condition}`,
      {
        ...finalDataList,
        workflow_basic_code: workflowNode.workflow_basic_code,
        conditions: isCron ? {} : finalDataList.conditions,
      }
    );

    const { nodes, ...rest } = res.data.data;
    const finalData: IGraphNode = {
      id: nodes.id,
      data: {
        label: nodes.data.label,
        payload: rest as IWorkFlowCondition,
      },
      position: nodes.position,
      type: nodes.type,
    };

    onCallback(true);
    return { node: finalData, isDelete };
  } catch (error: any) {
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: error.response?.data?.message || axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(error.response?.data);
  } finally {
    thunkAPI.dispatch(closeLoadingDialog());
  }
});

// Action node actions
interface IUpsertActionNodeArgs {
  data: IWorkFlowAction;
  onCallback: (isSuccess: boolean) => void;
}

export const upsertActionNodeAsync = createAsyncThunkPostWrapper<
  { node: IGraphNode; isDelete: boolean },
  IUpsertActionNodeArgs
>('automation/upsertActionNodeAsync', async ({ data, onCallback }, thunkAPI) => {
  try {
    const isDelete = data.status === 'INACTIVE';
    const state = thunkAPI.getState();
    const workflowNode = state.management.settings.automation.graphData.nodes[0].data
      .payload as ICreateWorkflow;
    const conditionNode = state.management.settings.automation.graphData.nodes.find(
      // @ts-ignore
      (x) => x.type === 'conditionNode'
    );

    if (!conditionNode) {
      throw new Error('Parent node should be condition node');
    }

    const res = await axios_base_api.post(
      `${server_base_endpoints.workflow.upsert_workflow_action}`,
      {
        ...data,
        workflow_basic_code: workflowNode.workflow_basic_code,
        workflow_condition_code: (conditionNode.data.payload as IWorkFlowCondition)
          .workflow_condition_code,
      }
    );

    const { nodes, ...rest } = res.data.data;
    const finalData: IGraphNode = {
      id: nodes.id,
      data: {
        label: nodes.data.label,
        payload: rest as IWorkFlowAction,
      },
      position: nodes.position,
      type: nodes.type,
    };

    onCallback(true);
    return { node: finalData, isDelete };
  } catch (error: any) {
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: error.response?.data?.message || axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(error.response?.data);
  } finally {
    thunkAPI.dispatch(closeLoadingDialog());
  }
});

// Finish email action node
interface IUpsertFinishEmailActionNodeArgs {
  data: IWorkflowFinishEmail;
  onCallback: (isSuccess: boolean) => void;
}

export const upsertFinishEmailActionNodeAsync = createAsyncThunkPostWrapper<
  { node: IGraphNode; isDelete: boolean },
  IUpsertFinishEmailActionNodeArgs
>('automation/upsertFinishEmailActionNodeAsync', async ({ data, onCallback }, thunkAPI) => {
  try {
    const isDelete = data.status === 'INACTIVE';
    const state = thunkAPI.getState();
    const workflowNode = state.management.settings.automation.graphData.nodes[0].data
      .payload as ICreateWorkflow;
    // @ts-ignore
    const actionNode = state.management.settings.automation.graphData.nodes.find((x) =>
      ['actionNodeEmail', 'actionNodeSMS', 'actionNodeWhatsApp', 'actionNodeModification'].includes(
        x.type
      )
    );

    if (!actionNode) {
      throw new Error('Parent node should be action node');
    }

    const finalPayload: IWorkflowFinishEmailAPIPayloadResponse = {
      workflow_action_email_code: data.workflow_action_email_code,
      workflow_basic_code: workflowNode.workflow_basic_code as string,
      workflow_action_code: (actionNode.data.payload as IWorkFlowAction)
        .workflow_action_code as string,
      call_type: data.call_type,
      to: [],
      cc: [],
      bcc: [],
      sending_order: data.sending_order,
      template_code: data.template_code,
      nodes: data.nodes,
      status: data.status,
    };

    if (data.call_type === 'VARIABLE') {
      const varaibleTo: string[] = [];
      const varaibleCC: string[] = [];
      const varaibleBcc: string[] = [];
      for (const variable of data.variablesTo) {
        varaibleTo.push(variable.view + '.' + variable.columnName);
      }
      for (const variable of data.variablesCC) {
        varaibleCC.push(variable.view + '.' + variable.columnName);
      }
      for (const variable of data.variablesBCC) {
        varaibleBcc.push(variable.view + '.' + variable.columnName);
      }
      finalPayload.to = varaibleTo;
      finalPayload.cc = varaibleCC;
      finalPayload.bcc = varaibleBcc;
    } else if (data.call_type === 'API') {
      for (const endPoint of data.apiTo) {
        finalPayload.to.push({
          ...endPoint,
          api: endPoint.api,
          emailColumn: endPoint.emailColumn,
          userName: endPoint.userName,
        });
      }
      for (const endPoint of data.apiCC) {
        finalPayload.cc.push({
          ...endPoint,
          api: endPoint.api,
          emailColumn: endPoint.emailColumn,
          userName: endPoint.userName,
        });
      }
      for (const endPoint of data.apiBCC) {
        finalPayload.bcc.push({
          ...endPoint,
          api: endPoint.api,
          emailColumn: endPoint.emailColumn,
          userName: endPoint.userName,
        });
      }
    } else if (data.call_type === 'EMAIL_ADDRESS') {
      finalPayload.to = data.emailsTo;
      finalPayload.cc = data.emailsCC;
      finalPayload.bcc = data.emailsBCC;
    }

    const res = await axios_base_api.post(
      `${server_base_endpoints.workflow.upsert_workflow_action_email}`,
      finalPayload
    );
    const { nodes, ...rest } = parseFinialEmailApiToLocalPayload(res.data.data);

    const finalData: IGraphNode = {
      id: nodes.id,
      data: {
        label: nodes.data.label,
        payload: rest as IWorkflowFinishEmail,
      },
      position: nodes.position,
      type: nodes.type,
    };

    onCallback(true);
    return { node: finalData, isDelete };
  } catch (error: any) {
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: error.response?.data?.message || axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(error.response?.data);
  } finally {
    thunkAPI.dispatch(closeLoadingDialog());
  }
});

// Fetch workflows list

export const fetchWorkflowListAsync = createAsyncThunk<
  { count: number; data: IRecordCount[] },
  ISearchQueryParamsV2
>('automation/fetchWorkflowListAsync', async (queryParams, thunkAPI) => {
  try {
    const searchQuery = getSearchQueryParamsV2(queryParams);
    const response = await axios_base_api.get(
      `${server_base_endpoints.workflow.get_workflow_basic}${searchQuery}`
    );
    const { data } = response.data;
    const count = response.data.totalRecords;
    return { count, data };
  } catch (error: any) {
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: error.response?.data?.message || axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(error.response?.data);
  } finally {
    thunkAPI.dispatch(closeLoadingDialog());
  }
});

export const clearAutomationState = createAsyncThunk(
  'automation/clearAutomationState',
  async () => {
    return {};
  }
);
