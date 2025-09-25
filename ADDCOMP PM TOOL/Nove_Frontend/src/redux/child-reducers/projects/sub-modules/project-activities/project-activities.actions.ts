import { createAsyncThunk } from '@reduxjs/toolkit';
import axios_base_api, {
  axios_Loading_messages,
  server_base_endpoints,
} from 'src/utils/axios-base-api';
import { ISearchQueryParamsV2 } from 'src/redux/store.types';
import { getSearchQueryParamsV2 } from 'src/redux/store.utils';
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from 'src/redux/store.wrapper';
import { uuidv4 } from 'src/utils/uuidv4';
import { IProjectActivity } from './project-activities.types';
import { openSnackbarDialog } from 'src/redux/child-reducers/loading-and-snackbar';

// #########################################################################################################
// ####################################### Project Activities Module ##########################################
// #########################################################################################################

export const fetchMultipleProjectActivitiesAsync = createAsyncThunk<{
  count: number;
  data: IProjectActivity[];
}>('project-activities/fetchMultipleProjectActivitiesAsync', async () => {
  const response = await axios_base_api.get(server_base_endpoints.projects.get_projects);
  const { data } = response.data;
  const { projects, pagination } = data;
  const count = pagination.total;
  const finalList = projects.map((item: any) => ({
    ...item,
    id: uuidv4(),
    project_id: item.id,
    project_uuid: item.id, // Use id as project_uuid for editing
    create_ts: item.createdAt,
    insert_ts: item.updatedAt,
  }));
  return { count, data: finalList };
});

export const fetchMultipleProjectActivitiesWithArgsAsync = createAsyncThunk<
  { count: number; data: IProjectActivity[] },
  { queryParams: ISearchQueryParamsV2 }
>(
  'project-activities/fetchMultipleProjectActivitiesWithArgsAsync',
  async ({ queryParams }, thunkAPI) => {
    const searchQuery = getSearchQueryParamsV2(queryParams);
    const response = await axios_base_api.get(
      `${server_base_endpoints.projects.get_projects}${searchQuery}`
    );
    const { data } = response.data;
    const { projects, pagination } = data;
    const count = pagination.total;
    const finalList = projects.map((item: any) => ({
      ...item,
      id: uuidv4(),
      project_id: item.id, // Map id to project_id
      project_uuid: item.id, // Use id as project_uuid for editing
      create_ts: item.createdAt,
      insert_ts: item.updatedAt,
    }));
    return thunkAPI.fulfillWithValue({ count, data: finalList });
  }
);

export const fetchSingleProjectActivityWithArgsAsync = createAsyncThunkGetWrapper<
  IProjectActivity,
  string
>('project-activities/fetchSingleProjectActivityWithArgsAsync', async (uuid, thunkAPI) => {
  const response = await axios_base_api.get(
    `${server_base_endpoints.projects.get_projects}/${uuid}`
  );
  const item = response.data.data;
  const mappedItem = {
    ...item,
    id: uuidv4(),
    project_id: item.id,
    project_uuid: item.id, // Use id as project_uuid for editing
    create_ts: item.createdAt,
    insert_ts: item.updatedAt,
  };
  return thunkAPI.fulfillWithValue(mappedItem);
});

export interface IUpsertSingleProjectActivityWithCallback {
  payload: IProjectActivity;
  onSuccess: (isSuccess: boolean, data?: IProjectActivity) => void;
}
export const upsertSingleProjectActivityWithCallbackAsync = createAsyncThunkPostWrapper<
  IProjectActivity,
  IUpsertSingleProjectActivityWithCallback
>(
  'project-activities/upsertSingleProjectActivityWithCallbackAsync',
  async ({ payload, onSuccess }, thunkAPI) => {
    const { insert_ts, create_ts, ...restPayload } = payload;
    const response = await axios_base_api.post(
      server_base_endpoints.projects.upsert_project,
      restPayload
    );
    if (response.status === 200) {
      const item = response.data.data;
      const mappedItem = {
        ...item,
        id: uuidv4(),
        project_id: item.id,
        project_uuid: item.project_uuid || null,
        create_ts: item.createdAt,
        insert_ts: item.updatedAt,
      };
      onSuccess(true, mappedItem);
      thunkAPI.dispatch(
        openSnackbarDialog({
          variant: 'success',
          message: axios_Loading_messages.save_success,
        })
      );
      return thunkAPI.fulfillWithValue(mappedItem);
    }

    onSuccess(false);
    thunkAPI.dispatch(
      openSnackbarDialog({
        variant: 'error',
        message: axios_Loading_messages.save_error,
      })
    );
    return thunkAPI.rejectWithValue(response.status);
  }
);
