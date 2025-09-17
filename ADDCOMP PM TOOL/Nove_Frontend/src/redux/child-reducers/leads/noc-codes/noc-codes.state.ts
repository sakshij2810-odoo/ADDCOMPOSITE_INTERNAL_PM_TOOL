import { ILoadState } from "src/redux/store.enums"
import { INocCode, INocCodeState } from "./noc-codes.types"



export const defaultNocCode: INocCode = {
    noc_codes_uuid: null,
    noc_unit_groups_code: null,
    teer_categoery: "5",
    noc_codes_groups_title: "",

    status: "ACTIVE"
}


export const defaultNocCodeState: INocCodeState = {
    noc_codes_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_noc_code: {
        loading: ILoadState.idle,
        data: defaultNocCode,
        error: null,
    },
}