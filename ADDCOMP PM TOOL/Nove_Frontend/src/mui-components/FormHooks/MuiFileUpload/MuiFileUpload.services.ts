import { FILE_UPLOAD_KEYS } from "src/constants/enums";
import { uploadFile } from "src/mui-components/FileUpload/utils";
import { IDynamicStringObject } from "src/types/IDynamicObject";
import { convertFileBufferToPreviewableUrl, getFileExtension, IFileExtension } from "src/utils";
import axios_base_api from "src/utils/axios-base-api";






export const uplaodGeneralFileAsync = async (file: File, moduleKey: FILE_UPLOAD_KEYS, payload: IDynamicStringObject): Promise<string> => new Promise<string>((resolve, reject) => {
    const asPayload = {
        ...payload,
        file_name: file.name
    }
    return uploadFile(
        file,
        moduleKey,
        "",
        asPayload).then((filePath) => {
            resolve(filePath)
        }).catch((error) => reject(error));
})



export const downloadSingleGeneralFileAsync = async (fileUrl: string) =>
    new Promise<string>(
        (resolve, reject) => {
            const payload = {
                type: "json",
                keys: [fileUrl],
            };
            axios_base_api.post("/general/download-files", payload).then((res) => {
                const previewableUrl = convertFileBufferToPreviewableUrl(res.data[0]?.data, getFileExtension(fileUrl));
                resolve(previewableUrl);
            }).catch((err) => {
                reject(err);
            });
        },
    );

export const downloadSingleGeneralFile = async (fileUrl: string) => {

}
