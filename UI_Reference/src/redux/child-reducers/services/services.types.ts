import { ILoadState } from "src/redux/store.enums";



export interface IServiceDetails {
    title: string,
    amount: number,
}


export interface IService {
    services_uuid: string | null,
    services_type: string,
    services_sub_type: string,
    country: string,
    state_or_province: string,
    service_details: IServiceDetails[],
    questionnaire_name: string,
    questionnaire_uuid: string,
    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}


export interface IServiceState {
    services_list: {
        loading: ILoadState
        data: IService[]
        count: number;
        error: string | null;
    },
    single_service: {
        loading: ILoadState
        data: IService
        error: string | null;
    },
}