/* eslint-disable import/order */
/* eslint-disable object-shorthand */
/* eslint-disable operator-assignment */
/* eslint-disable prefer-template */
/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';
import { showMessage } from '../messages';
import { IStoreState } from 'src/redux/store.types';
import { ILoadState } from 'src/redux/store.enums';

interface IFetchColumnsArgs {
  tableType: 'VIEW' | 'BASE TABLE';
  tableName: string;
  onCallback: (columns: string[]) => void;
}

interface IFetchEndpointsArgs {
  method_type: 'post' | 'get';
}

export const fetchColumnsByTableNameAsync = createAsyncThunk<string[], IFetchColumnsArgs>(
  'common/fetchColumnsByTableNameAsync',
  async ({ tableType, tableName, onCallback }, thunkAPI) => {
    try {
      const url = `${server_base_endpoints.general.get_table_or_column_name}?table_type=${tableType}&table_name=${tableName}`;
      const response = await axios_base_api.get(url);
      const columns = response.data.data;

      if (onCallback) {
        onCallback(columns); // Call the callback with the data
      }
      return columns;

      // return response.data.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: 'error',
          message: error.response?.data?.message || error.message,
          displayAs: 'snackbar',
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEndpointsAsync = createAsyncThunk<any[], IFetchEndpointsArgs>(
  'common/fetchEndpointsAsync',
  async ({ method_type }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as IStoreState;
      const { loading } = state.common.endPointsByModule;
      const isAlreadyFetched = loading === ILoadState.succeeded;

      if (!isAlreadyFetched) {
        const url = `${server_base_endpoints.workflow.get_apis_endpoints}?method_type=${method_type}`;
        const response = await axios_base_api.get(url);
        return response.data.data;
      }
      return thunkAPI.fulfillWithValue(state.common.endPointsByModule.data);
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: 'error',
          message: error.response?.data?.message || error.message,
          displayAs: 'snackbar',
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

interface IFetchModulesArgs {
  tableType: 'VIEW' | 'BASE TABLE';
}

export const fetchModulesAsync = createAsyncThunk<string[], IFetchModulesArgs>(
  'common/fetchModules',
  async ({ tableType }, thunkAPI) => {
    const isView = tableType === 'VIEW';
    try {
      const state = thunkAPI.getState() as IStoreState;
      const modules = state.common.modules;

      const isAlreadyFetched = isView
        ? modules.tableViews.loading === ILoadState.succeeded
        : modules.tableNames.loading === ILoadState.succeeded;

      if (!isAlreadyFetched) {
        const url = `${server_base_endpoints.general.get_table_or_column_name}?table_type=${tableType}`;
        const res = await axios_base_api.get(url);
        return res.data.data;
      }
      return thunkAPI.fulfillWithValue(isView ? modules.tableViews.data : modules.tableNames.data);
    } catch (error: any) {
      thunkAPI.dispatch(
        showMessage({
          type: 'error',
          message: error.response?.data?.message || error.message,
          displayAs: 'snackbar',
        })
      );
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
