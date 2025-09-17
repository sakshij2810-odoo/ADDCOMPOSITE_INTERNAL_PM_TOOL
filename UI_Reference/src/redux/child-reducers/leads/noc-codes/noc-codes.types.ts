import { ILoadState } from "src/redux/store.enums";


export interface INocCode {
    noc_codes_id?: number,
    noc_codes_unique_id?: number,
    noc_codes_uuid: string | null,
    teer_categoery: string | null,
    noc_unit_groups_code: string | null,
    noc_codes_groups_title: string,
    status: "ACTIVE" | "INACTIVE",

    created_by_uuid?: string | null,
    created_by_name?: string | null,
    modified_by_uuid?: string | null,
    modified_by_name?: string | null,
    create_ts?: string,
    insert_ts?: string
}


export interface INocCodeState {
    noc_codes_list: {
        loading: ILoadState
        data: INocCode[];
        count: number;
        error: string | null;
    },
    single_noc_code: {
        loading: ILoadState
        data: INocCode;
        error: string | null;
    },
}