import { IDynamicFileObject } from "src/types/IDynamicObject";
import { IPublicLead } from "./public-leads.types";
import { createAsyncThunkPostWrapper } from "src/redux/store.wrapper";
import { openLoadingDialog } from "../../loading-and-snackbar";
import { isNullObjectKeys, uplaodLeadDocuments } from "../private-leads/private-leads.helpers";
import { axios_Loading_messages, axios_public_api, server_base_endpoints } from "src/utils/axios-base-api";
import axios from "axios";



interface IUpsertSinglePublicLeadWithCallback {
    payload: IPublicLead,
    documents: IDynamicFileObject,
    onSuccess: (isSuccess: boolean, data?: IPublicLead) => void
}
export const upsertSinglePublicLeadWithCallbackAsync = createAsyncThunkPostWrapper<IPublicLead, IUpsertSinglePublicLeadWithCallback>(
    'public_leads/upsertSinglePublicLeadWithCallbackAsync', async ({ payload, documents, onSuccess }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        let { applicant_crs_points, ...lead_payload } = payload;
        if (!isNullObjectKeys(documents)) {
            lead_payload = await uplaodLeadDocuments(documents, lead_payload)
        }

        const response = await axios_public_api.post(server_base_endpoints.leads.leads.upsert_public_leads, lead_payload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)