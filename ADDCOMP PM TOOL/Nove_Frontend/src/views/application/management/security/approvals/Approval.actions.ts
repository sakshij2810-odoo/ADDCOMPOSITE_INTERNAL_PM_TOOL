import axios_base_api from "src/utils/axios-base-api";

export interface IApproveStatusList {
  approval_raise_status: string[];
  previous_status: string[];
  next_status: string[];
}

export const getApprovalStatusListAsync = (table_name: string) =>
  new Promise<string[]>((resolve, reject) => {
    axios_base_api
      .get(`/general/get-table-info?table_name=${table_name}`)
      .then((res) => {
        const data: string[] = res.data.data[0].table_status;
        resolve(data ? data : []);
      })
      .catch((error) => {
        reject(error.message);
      });
  });

export const getTableDescriptionListAsync = (table_name: string) =>
  new Promise<string[]>((resolve, reject) => {
    axios_base_api
      .get(`/general/get-table-description?table_name=${table_name}`)
      .then((res) => {
        const data: string[] = res.data.data;
        resolve(data ? data : []);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
