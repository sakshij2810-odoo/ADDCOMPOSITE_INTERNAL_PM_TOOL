import { ISelectOption } from "src/types/common"
import { capitalizeWords } from "src/utils/format-word"



export const VALID_OPTION_TYPES = [
  "SELECT",
  "RADIO_GROUP",
  "MULTI_CHECK_SINGLE_SELECT",
  "MULTI_CHECK_SELECT",
  // "SINGLE_IMAGE_SELECT",
  // "MULTI_IMAGES_SELECT",
];

export const MUI_MULTI_LEVEL_FIELD_TYPES = [
  "TEXT",
  "NUMBER",
  "EMAIL",
  "CHECKBOX",
  "FILE",
  "BUTTON",
  "TIME",
  "DATE",
  "PHONE",
  // "PASSWORD",
  ...VALID_OPTION_TYPES
] as const



export const muiMultiLevelFieldTypes: ISelectOption[] = MUI_MULTI_LEVEL_FIELD_TYPES.map((option) => ({ label: capitalizeWords(option), value: option }))