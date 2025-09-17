import { ILoadState } from "src/redux/store.enums";
import { IService, IServiceDetails, IServiceState } from "./services.types";


export const defaultServiceDetails: IServiceDetails = {
    title: "",
    amount: 0,
}


export const defaultService: IService = {
    services_uuid: null,
    services_type: "",
    services_sub_type: "",
    country: "",
    state_or_province: "",
    questionnaire_name: "",
    questionnaire_uuid: "",
    status: "ACTIVE",
    service_details: [defaultServiceDetails]
}


export const defaultServiceState: IServiceState = {
    services_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    single_service: {
        loading: ILoadState.idle,
        data: defaultService,
        error: null
    },
}