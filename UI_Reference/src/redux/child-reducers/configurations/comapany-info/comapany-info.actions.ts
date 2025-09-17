import { createAsyncThunk } from "@reduxjs/toolkit"
import { ICompanyInformation } from "./comapany-info.types"
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api"
import { uploadFile } from "src/mui-components/FileUpload/utils"
import { IDynamicFileObject } from "src/types/IDynamicObject"
import { uplaodCompanyDocuments } from "./comapany-info.helpers"
import { isNullObjectKeys } from "../../leads/private-leads/private-leads.helpers"
import { defaultCompanyInformation } from "./comapany-info.state"
import { createAsyncThunkPostWrapper } from "src/redux/store.wrapper"



export const fetchComapanyInformationAsync = createAsyncThunk<ICompanyInformation>(
    'comapny/fetchComapanyInformationAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.configurations.company.get_company_private_info}`)
            const result = response.data.data
            return thunkAPI.fulfillWithValue(result[0] || defaultCompanyInformation)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertComapanyInformationWithCallback {
    payload: ICompanyInformation,
    documents: IDynamicFileObject,
    // logo_file: File | null,
    // fav_icon_file: File | null,
    onSuccess: (isSuccess: boolean, data?: ICompanyInformation) => void
}
export const upsertComapanyInformationWithCallbackAsync = createAsyncThunkPostWrapper<ICompanyInformation, IUpsertComapanyInformationWithCallback>(
    'comapny/upsertComapanyInformationWithCallbackAsync', async ({ payload, documents, onSuccess }, thunkAPI) => {
        let { create_ts, insert_ts, ...restPayload } = payload
        if (!isNullObjectKeys(documents)) {
            restPayload = await uplaodCompanyDocuments(documents, restPayload)
        }

        const response = await axios_base_api.post(server_base_endpoints.configurations.company.upsert_company_private_info, restPayload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)