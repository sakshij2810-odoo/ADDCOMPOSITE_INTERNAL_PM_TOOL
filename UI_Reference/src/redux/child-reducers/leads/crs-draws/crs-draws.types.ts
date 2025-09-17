import { ILoadState } from "src/redux/store.enums";


export interface ICRSDraw {
    crs_draws_uuid: string | null,
    crs_draws_portal_id: string | null,
    issue_date: string | null,
    round_type: string | null,
    invitations_issued: string | null,
    minimun_crs_score: string | null,
    status: "ACTIVE" | "INACTIVE"
}


export interface ICRSDrawState {
    crs_draws_list: {
        loading: ILoadState
        data: ICRSDraw[];
        count: number;
        error: string | null;
    },
    single_crs_draw: {
        loading: ILoadState
        data: ICRSDraw;
        error: string | null;
    },
}