/* eslint-disable prefer-const */
/* eslint-disable operator-assignment */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
// templates.actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IDataTableV2DateState } from 'src/mui-components/TableV2/preDefinedPlugins/DataTableV2Date/DataTableV2Date.types';
import { IDatatableV2AdvancedSearchFilter } from 'src/mui-components/TableV2/preDefinedPlugins/SearchFilter/SearchFilter.types';
import { ICreateTemplate } from './templates.types';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';
import { showMessage } from '../messages';
import { formatText } from 'src/helpers/formatText';
import { TEMPLATE_RELATED_MODULE_ID } from 'src/constants/enums';
import { ISelectOption } from 'src/constants/types';

interface IFetchTemplateListArgs {
  pageNumber: number;
  rowsInPerPage: number;
  limit: number;
  status: string;
  date: IDataTableV2DateState['dates'];
  searchValue: IDatatableV2AdvancedSearchFilter;
  allTemplates?: boolean;
}

interface IFetchTemplateArgs {
  templateCode: number;
}

interface IFetchTemplateByIdArgs {
  templateId: number;
}

interface IUpsertTemplateArgs {
  template: ICreateTemplate;
  isDuplicate: boolean;
}

interface IFetchTemplateModuleSubModuleArgs {
  tableName?: string;
  callback?: (modules: ISelectOption[]) => void;
}

interface IFetchTemplateSQLViewAndColumnsArgs {
  tableName?: string;
  callback?: (modules: ISelectOption[]) => void;
}

export const fetchTemplateListAsync = createAsyncThunk(
  'templates/fetchTemplateList',
  async (
    { pageNumber, rowsInPerPage, limit, status, date, searchValue }: IFetchTemplateListArgs,
    thunkAPI
  ) => {
    try {
      let finalUrl = `${server_base_endpoints.template.get_templates}?pageNo=${pageNumber}&pageLimit=${limit}&itemPerPage=${rowsInPerPage}&from_date=${date.fromDate}&to_date=${date.toDate}`;
      if (searchValue.length > 0) {
        finalUrl = `${server_base_endpoints.template.get_templates}?pageNo=${pageNumber}&pageLimit=${limit}&itemPerPage=${rowsInPerPage}&from_date=${
          date.fromDate
        }&to_date=${date.toDate}&advanceFilter=${JSON.stringify(searchValue)}`;
      }
      if (status !== '-1') {
        finalUrl += '&status=' + status;
      }

      const res = await axios_base_api.get(finalUrl);
      return {
        data: res.data.data,
        totalRecords: res.data.totalRecords,
      };
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

export const fetchTemplateListAllTempsAsync = createAsyncThunk(
  'templates/fetchTemplateListAll',
  async (
    args: { relatedModule?: keyof typeof TEMPLATE_RELATED_MODULE_ID } = {},
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { relatedModule } = args;
      let url = `${server_base_endpoints.template.get_templates}?status=ACTIVE`;
      if (relatedModule) {
        url = url + `&related_module=${relatedModule}`;
      }
      const res = await axios_base_api.get(url);

      return {
        data: res.data.data,
        totalRecords: res.data.totalRecords,
      };
    } catch (error: any) {
      dispatch(
        showMessage({
          type: 'error',
          message: error.response?.data?.message || error.message,
          displayAs: 'snackbar',
        })
      );
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTemplateByIdAsync = createAsyncThunk(
  'templates/fetchTemplateById',
  async ({ templateId }: IFetchTemplateByIdArgs, thunkAPI) => {
    try {
      const res = await axios_base_api.get(
        `${server_base_endpoints.template.get_templates}?templates_id=${templateId}`
      );
      return res.data.data;
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

export const fetchTemplateAsync = createAsyncThunk(
  'templates/fetchTemplate',
  async ({ templateCode }: IFetchTemplateArgs, thunkAPI) => {
    try {
      console.log('action templateCode:', templateCode);
      const res = await axios_base_api.get(
        `${server_base_endpoints.template.get_templates}?template_code=${templateCode}`
      );
      const data: ICreateTemplate[] = res.data.data;
      if (data.length > 0) {
        return data[0];
      } else {
        throw new Error(
          "Oops! We couldn't find any records associated with your template name at the moment."
        );
      }
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

export const upsertTemplateAsync = createAsyncThunk(
  'templates/upsertTemplate',
  async (
    { template, isDuplicate }: { template: ICreateTemplate; isDuplicate: boolean },
    thunkAPI
  ) => {
    try {
      let finalTemplate = { ...template };

      // Clear ID and template code if it's a duplicate
      if (isDuplicate) {
        finalTemplate = {
          ...finalTemplate,
          templates_id: null,
          template_code: '',
          templates_uuid: '',
          template_name: finalTemplate.template_name.includes(' - Copy')
            ? finalTemplate.template_name
            : `${finalTemplate.template_name} - Copy`,
        };
      }

      const res = await axios_base_api.post(
        `${server_base_endpoints.template.edit_template}`,
        finalTemplate // Use the modified template for duplicates
      );

      thunkAPI.dispatch(
        showMessage({
          type: 'success',
          message: isDuplicate
            ? 'Template duplicated successfully!'
            : 'Template saved successfully!',
          displayAs: 'snackbar',
        })
      );

      return res.data.data;
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
export const fetchTemplateModuleSubModuleAsync = createAsyncThunk(
  'templates/fetchModuleSubModule',
  async ({ tableName, callback }: IFetchTemplateModuleSubModuleArgs, thunkAPI) => {
    try {
      let url = `${server_base_endpoints.general.get_table_or_column_name}?table_type=VIEW`;
      if (tableName) {
        url = url + '&table_name=' + tableName;
      }
      const res = await axios_base_api.get(url);
      const data: string[] = res.data.data;
      const result = data.map((item) => ({
        label: formatText(item),
        value: item,
      }));
      if (callback) callback(result);
      return result;
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

// In templates.actions.ts (code 1)
export const fetchTemplateSQLViewAndColumnsAsync = createAsyncThunk(
  'templates/fetchSQLViewAndColumns',
  async ({ tableName, callback }: IFetchTemplateSQLViewAndColumnsArgs, thunkAPI) => {
    try {
      let url = `${server_base_endpoints.template.get_sql_view_or_columns}?`;
      if (tableName) {
        url = url + 'templates_dynamic_views_code=' + tableName;
      }
      const res = await axios_base_api.get(url);

      if (!tableName) {
        const data: {
          view_for: string;
          templates_dynamic_views_code: string;
        }[] = res.data.data;

        const result = data.map((item) => ({
          label: item.view_for ? formatText(item.view_for) : 'Untitled View',
          value: item.templates_dynamic_views_code,
        }));

        if (callback) callback(result);
        return result;
      } else {
        const data: string[] = res.data.data;
        const result = data.map((item) => ({ label: item, value: item }));
        if (callback) callback(result);
        return result;
      }
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
