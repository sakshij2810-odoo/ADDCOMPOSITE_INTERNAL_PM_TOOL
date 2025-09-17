import { createAsyncThunk } from "@reduxjs/toolkit";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { IRole, ISecurityApproval, ISecurityGroup, ISecurityNestedGroup } from "./app-security.types";
import { createNestedSecurityGroup, parseNestedSecurityGroups } from "./app-security.helpers";
import { ISelectOption } from "src/types/common";

// #########################################################################################################
export const fetchMultipleSecurityRolesAsync = createAsyncThunk<{ count: number, data: IRole[] }>(
    'security/fetchMultipleSecurityRolesAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.security.get_roles);
        const { data, totalRecords: count } = response.data;
        return { count, data }
    },
)

export const fetchRecordDropdownWithArgsAsync = createAsyncThunk<ISelectOption[], {
    apiUrl: string,
    columnKey: string,
    columnLabel: string,
    onCallback: (isSuccess: boolean, data: ISelectOption[]) => void
}>(
    'security/fetchRecordDropdownWithArgsAsync', async ({ apiUrl, columnKey, columnLabel, onCallback }) => {
        const res = await axios_base_api.get(`${apiUrl}`);
        const data: any[] = res.data.data;
        const options: ISelectOption[] = [
            { label: "Self", value: columnKey },
            { label: "All", value: "*" },
            { label: "Self Zone", value: "self_zone" },
        ];
        for (let item of data) {
            options.push({ label: item[columnLabel], value: item[columnKey] });
        }
        onCallback(true, options);
        return options
    },
)

interface IFetchSecurityGroupAsync {
    data: ISecurityNestedGroup,
    role: string | null,
    roleGroup: string | null,
    status: string | null,
}
export const fetchSecurityGroupAsync = createAsyncThunk<IFetchSecurityGroupAsync, string | undefined>(
    'security/fetchSecurityGroupAsync', async (role_uuid, thunkAPI) => {
        try {
            let url = "/security/get-role-module-content-access-permission";
            if (role_uuid) {
                url = `/security/get-role-module-content-access-permission?role_uuid=${role_uuid}`;
            }
            const res = await axios_base_api.get(url);
            const data: ISecurityGroup[] = role_uuid
                ? res.data.data.data
                : res.data.data;
            const roleName = role_uuid ? res.data.data.role_name : null;
            const roleGroup = role_uuid ? res.data.data.role_group : null;
            const roleStatus = role_uuid ? res.data.data.status : "ACTIVE";

            if (data.length > 0) {
                const nested = createNestedSecurityGroup(data);
                return thunkAPI.fulfillWithValue({ data: nested, role: roleName, roleGroup, status: roleStatus })
            } else {
                return thunkAPI.rejectWithValue("Oops! We couldn't find any records.")
            }

        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertSecurityGroup {
    data: ISecurityNestedGroup,
    roleId: string | null,
    role_group: string,
    roleName: string,
    status: string,
    onCallback: (isSuccess: boolean, roleId?: number) => void,
    isDuplicate?: boolean,
}
export const upsertSecurityGroupAsync = createAsyncThunk<number, IUpsertSecurityGroup>(
    'security/upsertSecurityGroupAsync', async ({ data, roleId, role_group, roleName, status, isDuplicate, onCallback }, thunkAPI) => {
        try {
            const list = parseNestedSecurityGroups(data);
            let finalRoleId = null;

            const res = await axios_base_api.post(server_base_endpoints.security.upsert_roles, {
                role_name: roleName.toUpperCase(),
                role_uuid: isDuplicate ? null : roleId,
                role_group: role_group,
                status: status,
            });
            finalRoleId = res.data.data.role_uuid;

            const finalList: ISecurityGroup[] = [];
            for (let role of list) {
                const { role_module_uuid, ...payload } = role as any;
                const finalRole = isDuplicate ? payload : role;
                finalList.push({
                    ...finalRole,
                    role_uuid: finalRoleId,
                    role_name: roleName,
                });
            }
            const response = await axios_base_api.post(server_base_endpoints.security.upsert_rmcap, finalList,);
            if (response.status === 200) {
                onCallback(true, finalRoleId);
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onCallback(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)






// #########################################################################################################
// ###################################### Security Approvals ###############################################
// #########################################################################################################

export const fetchSecurityApprovalListAsync = createAsyncThunk<{ count: number, data: ISecurityApproval[] }, { page: number, rowsPerPage: number }>(
    'security/fetchSecurityApprovalListAsync', async ({ page, rowsPerPage }) => {
        const response = await axios_base_api.get(`${server_base_endpoints.approvals.get_approvals_count}?pageNo=${page}&itemPerPage=${rowsPerPage}`);
        const { data, totalRecords: count } = response.data;
        return { count, data }
    },
)



export const fetchSingleSecurityApprovalWithArgsAsync = createAsyncThunk<ISecurityApproval, string>(
    'security/fetchSingleSecurityApprovalWithArgsAsync', async (approval_count_uuid, thunkAPI) => {
        try {
            const url = `${server_base_endpoints.approvals.get_approvals_count}?approval_count_uuid=${approval_count_uuid}&pageNo=1&itemPerPage=10`;
            const response = await axios_base_api.get(url);
            const data: ISecurityApproval[] = response.data.data;
            if (data.length > 0) {
                return thunkAPI.fulfillWithValue(data[0])
            } else {
                return thunkAPI.rejectWithValue("Oops! We couldn't find any records.")
            }

        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)



export interface IUpsertSecurityApproval {
    data: ISecurityApproval,
    onCallback: (isSuccess: boolean) => void,
}
export const upsertSecurityApprovalAsync = createAsyncThunk<number, IUpsertSecurityApproval>(
    'security/upsertSecurityApprovalAsync', async ({ data, onCallback }, thunkAPI) => {
        try {
            const { create_ts, level, insert_ts, ...rest } = data;
            const response = await axios_base_api.post(server_base_endpoints.approvals.upsert_approvals_count, rest);
            // let message = "Security approval saved successfully.";

            if (response.status === 200) {
                onCallback(true);
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onCallback(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)
