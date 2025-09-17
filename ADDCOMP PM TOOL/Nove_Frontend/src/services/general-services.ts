import { AxiosError } from "axios";
import { downloadSingleFileSync, getFileNameFromPathSync } from "src/utils";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";



export const downloadOrPreviewSingleFileAsync = async (filePath: string, download?: boolean) => new Promise<string>(async (resolve, reject) => {
    try {
        const response = await axios_base_api.post(`${server_base_endpoints.general.download_files}`, {
            type: "",
            keys: [filePath],

        }, {
            responseType: "arraybuffer", // Ensure the response is in a binary format
        })
        const blob = new Blob([response.data], {
            type: "application/pdf",
        });
        const url = window.URL.createObjectURL(blob);
        if (download) {
            downloadSingleFileSync(url, getFileNameFromPathSync(filePath))
        }
        resolve(url);
    } catch (error) {
        reject(error?.message)
    }
})




export interface IGeneralProcessStatus {
    process_records_id: number
    process_records_unique_id: number
    process_records_uuid: any
    process_records_code: string
    lead_document_code: string
    status: string
    created_by_id: number
    modified_by_id: number
    create_ts: string
    insert_ts: string
}


export const getGeneralProcessStatusAsync = async (process_code: string): Promise<IGeneralProcessStatus | null> => {
    try {
        const response = await axios_base_api.get(`${server_base_endpoints.general.get_process}?process_records_code=${process_code}`);
        return response.data?.data?.[0] as IGeneralProcessStatus;
    } catch (error) {
        const err = error as AxiosError;
        console.error("Failed to fetch process status:", err.message || err);
        return null;
    }
};