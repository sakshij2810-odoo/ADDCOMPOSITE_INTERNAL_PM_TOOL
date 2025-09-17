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
import { IWorkflowFinishEmail, IWorkflowFinishEmailAPIPayloadResponse } from './automation.types';

export const parseFinialEmailApiToLocalPayload = (
  payload: IWorkflowFinishEmailAPIPayloadResponse
): IWorkflowFinishEmail => {
  const finalData: IWorkflowFinishEmail = {
    workflow_action_code: payload.workflow_action_code,
    workflow_basic_code: payload.workflow_basic_code,
    workflow_action_email_code: payload.workflow_action_email_code,
    emailsTo: [],
    emailsCC: [],
    emailsBCC: [],
    apiTo: [],
    apiCC: [],
    apiBCC: [],
    call_type: payload.call_type,
    nodes: payload.nodes,
    sending_order: payload.sending_order,
    status: payload.status,
    template_code: payload.template_code,
    variablesTo: [],
    variablesCC: [],
    variablesBCC: [],
  };

  if (payload.call_type === 'VARIABLE') {
    for (const toData of payload.to) {
      const data = toData.split('.');
      if (data.length > 0) {
        finalData.variablesTo.push({
          view: data[0],
          columnName: data[1] || '',
        });
      }
    }
    for (const ccData of payload.cc) {
      const data = ccData.split('.');
      if (data.length > 0) {
        finalData.variablesCC.push({
          view: data[0],
          columnName: data[1] || '',
        });
      }
    }
    for (const bccData of payload.bcc) {
      const data = bccData.split('.');
      if (data.length > 0) {
        finalData.variablesBCC.push({
          view: data[0],
          columnName: data[1] || '',
        });
      }
    }
  } else if (payload.call_type === 'API') {
    for (const toData of payload.to) {
      finalData.apiTo.push({
        api: toData.api,
        emailColumn: toData.emailColumn,
        userName: toData.userName,
        queryParams: toData.queryParams,
        endpoint: toData.endpoint,
        endpointType: toData.endpointType,
        module_name: toData.module_name,
      });
    }
    for (const ccData of payload.cc) {
      finalData.apiCC.push({
        api: ccData.api,
        emailColumn: ccData.emailColumn,
        userName: ccData.userName,
        queryParams: ccData.queryParams,
        endpoint: ccData.endpoint,
        endpointType: ccData.endpointType,
        module_name: ccData.module_name,
      });
    }
    for (const bccData of payload.bcc) {
      finalData.apiBCC.push({
        api: bccData.api,
        emailColumn: bccData.emailColumn,
        userName: bccData.userName,
        queryParams: bccData.queryParams,
        endpoint: bccData.endpoint,
        endpointType: bccData.endpointType,
        module_name: bccData.module_name,
      });
    }
  } else if (payload.call_type === 'EMAIL_ADDRESS') {
    finalData.emailsTo = payload.to;
    finalData.emailsCC = payload.cc;
    finalData.emailsBCC = payload.bcc;
  }

  return finalData;
};
