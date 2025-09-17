import { ILoadState } from "src/redux/store.enums"
import { ICRSDraw, ICRSDrawState } from "./crs-draws.types"



export const defaultCRSDraw: ICRSDraw = {
    crs_draws_uuid: null,
    crs_draws_portal_id: null,
    issue_date: null,
    round_type: null,
    invitations_issued: null,
    minimun_crs_score: null,
    status: "ACTIVE"
}


export const defaultCRSDrawState: ICRSDrawState = {
    crs_draws_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_crs_draw: {
        loading: ILoadState.idle,
        data: defaultCRSDraw,
        error: null,
    },
}