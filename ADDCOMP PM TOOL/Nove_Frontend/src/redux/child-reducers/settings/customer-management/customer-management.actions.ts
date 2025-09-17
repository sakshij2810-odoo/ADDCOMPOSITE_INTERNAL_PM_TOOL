import { createAsyncThunk } from "@reduxjs/toolkit"
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api"
import { ICustomerAutomation } from "./customer-management.types";
import { createAsyncThunkPostWrapper } from "src/redux/store.wrapper";




export const fetchCustomerAutomationWithArgsAsync = createAsyncThunk<ICustomerAutomation>(
    'customer-automation/fetchCustomerAutomationWithArgsAsync', async (module_uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customer_automation}`)
            const { data } = response.data;
            return thunkAPI.fulfillWithValue(data[0])
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)



interface IUpsertCustomerAutomationWithCallback {
    payload: ICustomerAutomation,
    onSuccess: (isSuccess: boolean, data?: ICustomerAutomation) => void
}

export const upsertCustomerAutomationWithCallbackAsync = createAsyncThunkPostWrapper<ICustomerAutomation, IUpsertCustomerAutomationWithCallback>(
    'customer-automation/upsertCustomerAutomationWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.customers.upsert_customer_automation, payload);
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            return thunkAPI.fulfillWithValue(response.data.data)
        }
        onSuccess(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)