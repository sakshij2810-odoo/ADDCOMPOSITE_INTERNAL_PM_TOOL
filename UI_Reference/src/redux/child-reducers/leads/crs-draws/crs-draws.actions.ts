import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { ICRSDraw } from "./crs-draws.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSearchQueryParamsV2 } from "src/redux/store.utils";
import { ISearchQueryParamsV2 } from "src/redux/store.types";




export const fetchMultipleCrsDrawsWithArgsAsync = createAsyncThunk<{ count: number, data: ICRSDraw[] }, ISearchQueryParamsV2>(
    'crs-draw/fetchMultipleCrsDrawsWithArgsAsync', async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${server_base_endpoints.leads.crs_draws.get_crs_draws}${searchQuery}`)
            const { data } = response.data;
            const count = response.data.totalRecords
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


export const fetchSingleCrsDrawWithArgsAsync = createAsyncThunk<ICRSDraw, string>(
    'crs-draw/fetchSingleCrsDrawWithArgsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.crs_draws.get_crs_draws}?crs_draws_uuid=${uuid}`)
            return thunkAPI.fulfillWithValue(response.data.data.result[0])
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertSingleCrsDrawWithCallback {
    payload: ICRSDraw,
    onSuccess: (isSuccess: boolean, data?: ICRSDraw) => void
}
export const upsertSingleCrsDrawWithCallbackAsync = createAsyncThunk<ICRSDraw, IUpsertSingleCrsDrawWithCallback>(
    'crs-draw/upsertSingleCrsDrawWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        try {
            const response = await axios_base_api.post(server_base_endpoints.leads.crs_draws.upsert_crs_draws, payload)
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