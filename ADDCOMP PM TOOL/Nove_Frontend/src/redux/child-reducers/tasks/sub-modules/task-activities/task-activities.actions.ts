import { createAsyncThunk } from "@reduxjs/toolkit";
import axios_base_api, { axios_Loading_messages, server_base_endpoints } from "src/utils/axios-base-api";
import { ISearchQueryParamsV2 } from "src/redux/store.types";
import { getSearchQueryParamsV2 } from "src/redux/store.utils";
import { createAsyncThunkGetWrapper, createAsyncThunkPostWrapper } from "src/redux/store.wrapper";
import { uuidv4 } from "src/utils/uuidv4";
import { ITaskActivity } from "./task-activities.types";
import { openSnackbarDialog } from "src/redux/child-reducers/loading-and-snackbar";





// #########################################################################################################
// ####################################### Task Activities Module ##########################################
// #########################################################################################################

export const fetchMultipleTaskActivitiesAsync = createAsyncThunk<{ count: number, data: ITaskActivity[] }>(
    'task-activities/fetchMultipleTaskActivitiesAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.tasks.get_task_module_wise)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

export const fetchMultipleTaskActivitiesWithArgsAsync = createAsyncThunk<{ count: number, data: ITaskActivity[] }, { queryParams: ISearchQueryParamsV2 }>(
    'task-activities/fetchMultipleTaskActivitiesWithArgsAsync', async ({ queryParams }, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.tasks.get_task_module_wise}${searchQuery}`)
        const { data, totalRecords: count } = response.data;
        const finalList = data.map((item: any) => ({ ...item, id: uuidv4() }))
        return thunkAPI.fulfillWithValue({ count, data: finalList })
    }
)


export const fetchSingleTaskActivityWithArgsAsync = createAsyncThunkGetWrapper<ITaskActivity, string>(
    'task-activities/fetchSingleTaskActivityWithArgsAsync', async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(`${server_base_endpoints.tasks.get_task_module_wise}?task_module_wise_id=${uuid}`)
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)


export interface IUpsertSingleTaskActivityWithCallback {
    payload: ITaskActivity,
    onSuccess: (isSuccess: boolean, data?: ITaskActivity) => void
}
export const upsertSingleTaskActivityWithCallbackAsync = createAsyncThunkPostWrapper<ITaskActivity, IUpsertSingleTaskActivityWithCallback>(
    'task-activities/upsertSingleTaskActivityWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const { insert_ts, create_ts, ...restPayload } = payload
        const response = await axios_base_api.post(server_base_endpoints.tasks.upsert_task_module_wise, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)