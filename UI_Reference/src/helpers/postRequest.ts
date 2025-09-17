/* eslint-disable prefer-template */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-useless-catch */
import axios_base_api from 'src/utils/axios-base-api';
import { compareTwoObejcts } from './compareTwoObjects';

export const findPrimaryFieldValue = (
  obj: any,
  primaryFieldName: string,
  entryKeys: string[] = []
): any => {
  // Base case
  if (!obj || typeof obj !== 'object') {
    return null;
  }

  // Start search from a specific entry key if provided
  for (const key of entryKeys) {
    if (obj.hasOwnProperty(key)) {
      const result = findPrimaryFieldValue(obj[key], primaryFieldName);
      if (result !== null) return result;
    }
  }

  // Check current level for primaryFieldName
  if (obj.hasOwnProperty(primaryFieldName)) {
    return obj[primaryFieldName];
  }

  // Recursively check all other properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const result = findPrimaryFieldValue(obj[key], primaryFieldName);
      if (result !== null) return result;
    }
  }

  return null;
};

export const makeApiCall = async (
  config: {
    url: string;
    method: 'GET' | 'POST';
    automation?: {
      primaryFieldName: string;
      isUpdate: boolean;
    };
  },
  initialData?: any,
  payload?: any
) => {
  try {
    if (config.method === 'POST') {
      const response = await axios_base_api.post(config.url, payload);
      if (config.automation) {
        const primaryFieldValue = findPrimaryFieldValue(
          response.data,
          config.automation.primaryFieldName
        );
        if (primaryFieldValue) {
          await initiateWorkFlow(
            initialData,
            payload,
            config.url,
            config.automation.isUpdate,
            config.automation.primaryFieldName,
            primaryFieldValue
          );
        }
      }
      return response;
    }

    const response = await axios_base_api.get(config.url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const initiateWorkFlow = async (
  initialData: any,
  currentData: any,
  apiUrl: string,
  isUpdate: boolean,
  primaryFieldName: string,
  primaryFieldValue: any
) => {
  try {
    const payload: {
      endpoint_path: string;
      upsert_type: 'CREATE' | 'UPDATE';
      identifier: {
        column_name: string;
        column_value: any;
      };
      changed_column: {
        [key: string]: {
          old_value: any;
          new_value: any;
        };
      };
      no_changed_column: {
        [key: string]: any;
      };
    } = {
      endpoint_path: '/api/v1' + apiUrl,
      upsert_type: isUpdate ? 'UPDATE' : 'CREATE',
      identifier: {
        column_name: primaryFieldName,
        column_value: primaryFieldValue || null,
      },
      changed_column: {},
      no_changed_column: {},
    };

    if (isUpdate) {
      const finalData = compareTwoObejcts(initialData, currentData);
      payload.changed_column = finalData.changed;
      payload.no_changed_column = finalData.unchanged;
    } else {
      payload.no_changed_column = currentData;
    }

    await axios_base_api.post('/workflow/workflow-initiate', payload);
  } catch (err: any) {
    throw err;
  }
};
