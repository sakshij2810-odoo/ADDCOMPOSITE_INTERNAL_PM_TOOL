import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { INocCode } from "./noc-codes.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSearchQueryParamsV2 } from "src/redux/store.utils";
import { ISearchQueryParamsV2 } from "src/redux/store.types";




export const fetchMultipleNocCodesWithArgsAsync = createAsyncThunk<{ count: number, data: INocCode[] }, ISearchQueryParamsV2>(
    'noc-codes/fetchMultipleNocCodesWithArgsAsync', async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${server_base_endpoints.leads.noc_codes.get_noc_codes}${searchQuery}`)
            const { data } = response.data;
            const count = response.data.totalRecords
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


export const fetchSingleNocCodeWithArgsAsync = createAsyncThunk<INocCode, string>(
    'noc-codes/fetchSingleNocCodeWithArgsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.noc_codes.get_noc_codes}?crs_draws_uuid=${uuid}`)
            return thunkAPI.fulfillWithValue(response.data.data.result[0])
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertSingleNocCodeWithCallback {
    payload: INocCode,
    onSuccess: (isSuccess: boolean, data?: INocCode) => void
}
export const upsertSingleNocCodeWithCallbackAsync = createAsyncThunk<INocCode, IUpsertSingleNocCodeWithCallback>(
    'noc-codes/upsertSingleNocCodeWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        try {
            const response = await axios_base_api.post(server_base_endpoints.leads.noc_codes.upsert_noc_codes, payload)
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onSuccess(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)