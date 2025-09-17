import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { IStudyProgram } from "./study-program.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSearchQueryParamsV2 } from "src/redux/store.utils";
import { ISearchQueryParamsV2 } from "src/redux/store.types";




export const fetchMultipleStudyProgramsWithArgsAsync = createAsyncThunk<{ count: number, data: IStudyProgram[] }, ISearchQueryParamsV2>(
    'study_program/fetchMultipleStudyProgramsWithArgsAsync', async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${server_base_endpoints.leads.study_program.get_study_programs}${searchQuery}`)
            const { data } = response.data;
            const count = response.data.totalRecords
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


export const fetchSingleStudyProgramWithArgsAsync = createAsyncThunk<IStudyProgram, string>(
    'study_program/fetchSingleStudyProgramWithArgsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.study_program.get_study_programs}?crs_draws_uuid=${uuid}`)
            return thunkAPI.fulfillWithValue(response.data.data.result[0])
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertSingleStudyProgramWithCallback {
    payload: IStudyProgram,
    onSuccess: (isSuccess: boolean, data?: IStudyProgram) => void
}
export const upsertSingleStudyProgramWithCallbackAsync = createAsyncThunk<IStudyProgram, IUpsertSingleStudyProgramWithCallback>(
    'study_program/upsertSingleStudyProgramWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        try {
            const response = await axios_base_api.post(server_base_endpoints.leads.study_program.upsert_study_programs, payload)
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