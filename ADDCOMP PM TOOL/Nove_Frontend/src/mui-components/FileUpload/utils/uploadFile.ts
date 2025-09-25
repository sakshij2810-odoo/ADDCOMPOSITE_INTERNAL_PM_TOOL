import axios from 'axios';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';

export const uploadFile = async (
  file: File | null,
  module_name: string,
  defaultReturn: string,
  asPayload: {
    [key: string]: string | number | null;
  },
  options?: {
    [key: string]: any;
  }
) => {
  if (file) {
    const formdata = new FormData();
    formdata.append('files', file);
    formdata.append('module_name', module_name);
    formdata.append('as_payload', JSON.stringify(asPayload));
    if (options) {
      formdata.append('options', JSON.stringify(options));
    }
    const res = await axios_base_api.post(server_base_endpoints.general.upload_files, formdata, {});
    const responseData = res.data.data;
    if (responseData && responseData.file_url) {
      return responseData.file_url;
    }
  }
  return defaultReturn;
};
