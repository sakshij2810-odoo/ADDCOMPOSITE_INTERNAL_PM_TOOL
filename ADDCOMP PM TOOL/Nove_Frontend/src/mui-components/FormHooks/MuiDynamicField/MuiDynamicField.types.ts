import { ISelectOption } from "src/types/common";
import { MUI_MULTI_LEVEL_FIELD_TYPES } from "./MuiDynamicField.constants";



export type IMuiltiLevelFieldType = (typeof MUI_MULTI_LEVEL_FIELD_TYPES)[number];

export interface IMuiltiLevelFieldProps {
    label?: string
    type: IMuiltiLevelFieldType
    value: string | number
    options?: ISelectOption[]
}