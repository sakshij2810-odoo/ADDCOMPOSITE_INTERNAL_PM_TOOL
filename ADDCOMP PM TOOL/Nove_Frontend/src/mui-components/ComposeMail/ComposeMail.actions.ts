import {
  IComposeMail,
  IEmailAttachment,
  IEmailDocument,
} from "./ComposeMail.types";
import axios_base_api from "src/utils/axios-base-api";
import { useAuthContext } from "src/auth/hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const fetchEnquiryInfoAsync = async (
  enquiry_no: string,
  onCallback: (
    isSuccess: boolean,
    data?: {
      email_subject: string;
      recipient_emails: string[];
    },
  ) => void,
) => {
  try {
    const enquiry_response = await axios_base_api.get(
      `/enquiry/get-enquiry?columns=enquiry_no&value=${enquiry_no}`,
    );
    const history_response = await axios_base_api.get(
      `/history/get-email-history?module_uuid=${enquiry_no}&pageNo=1&itemPerPage=1`,
    );

    const enquiry_info = enquiry_response.data.data.result[0];
    // const history_info: IEnquiryEmailHistory[] = history_response.data.data;
    const history_info: any[] = history_response.data.data;
    const { user: { personal_email: loggedInUserEmail } } = useAuthContext();
    const uerEmailHistory = history_info.filter(
      (his) => his.from_email === loggedInUserEmail,
    );

    onCallback(true, {
      email_subject: history_info.length > 0 ? history_info[0].subject : "",
      recipient_emails:
        uerEmailHistory.length > 0
          ? uerEmailHistory[uerEmailHistory.length - 1].to_mail_ids
          : enquiry_info.contact_email && enquiry_info.contact_email.length > 0
            ? [enquiry_info.contact_email]
            : [],
    });
  } catch (err: any) {
    onCallback(false);
  }
};



export interface ISendComposeMailWithCallback {
  payload: IComposeMail,
  onSuccess: (isSuccess: boolean, data?: IComposeMail) => void
}
export const sendComposeMailAsync = createAsyncThunk<IComposeMail, ISendComposeMailWithCallback>(
  'email/sendComposeMailAsync', async ({ payload, onSuccess }, thunkAPI) => {
    try {
      const response = await axios_base_api.post(`/general/send-grid-email`, payload);
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


// export const sendComposeMailAsync =
//   (
//     payload: IComposeMail,
//     onCallback: (isSuccess: boolean) => void,
//   ): ThunkAction<void, IStoreState, {}, AnyAction> =>
//     async (dispatch, getState) => {
//       let enqFiles: IEmailAttachment[] = [];

//       try {
//         await axios_base_api.post(`/general/send-grid-email`, payload);
//         // dispatch(
//         //   showMessage({
//         //     type: "success",
//         //     message: "Email is send successfully!",
//         //     displayAs: "snackbar",
//         //   }),
//         // );
//         onCallback(true);
//       } catch (err: any) {
//         onCallback(true);
//         // dispatch(
//         //   showMessage({
//         //     type: "error",
//         //     message: err.response.data.message,
//         //     displayAs: "snackbar",
//         //   }),
//         // );
//       }
//     };

export const fetchEnquiryFileInMailFormat = (files: IEmailDocument[]) =>
  new Promise<IEmailAttachment[]>(async (resolve, reject) => {
    const enqKeys = files.map((file) => file.file_url);
    axios_base_api
      .post("/general/download-files", {
        type: "json",
        keys: enqKeys,
      })
      .then((response) => {
        let enqFiles: IEmailAttachment[] =
          response?.data?.map((ele: any, index: number) => ({
            content: ele,
            filename: enqKeys[index].split("/").at(-1),
          })) || [];

        resolve(enqFiles);
      })
      .catch((error: any) => {
        console.log("Error while Download ==>", error);
        reject(false);
      });
  });
