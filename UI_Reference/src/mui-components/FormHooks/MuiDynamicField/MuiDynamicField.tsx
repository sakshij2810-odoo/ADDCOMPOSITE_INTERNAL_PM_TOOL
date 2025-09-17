import React, { useCallback } from 'react'
import { IMuiltiLevelFieldProps, IMuiltiLevelFieldType } from './MuiDynamicField.types'
import { MuiFormFields } from '..'
import { ISelectOption } from 'src/types/common'
import { Checkbox, FormControlLabel } from '@mui/material'
import { FILE_UPLOAD_KEYS } from 'src/constants/enums'
import { IDynamicStringObject } from 'src/types/IDynamicObject'
import { isArray, isString } from 'lodash'

export const MuiMultiLevelField: React.FC<IMuiltiLevelFieldProps> = (props) => {
  const { type, options, label, value } = props

  switch (type) {
    case "TEXT":
      return <MuiFormFields.MuiTextField name='' label={label} />
    case "NUMBER":
      return <MuiFormFields.MuiNumberField name='' label={label} />
    case "PASSWORD":
      return <MuiFormFields.MuiPasswordField name='' label={label} />
    case "EMAIL":
      return <MuiFormFields.MuiTextField name='' label={label} />
    case "SELECT":
      return <MuiFormFields.MuiSelect name='' label={label} options={options || []} />
    case "RADIO_GROUP":
      return <MuiFormFields.MuiRadioGroup name='' label={label} options={options || []} />

    case "CHECKBOX":
      return <MuiFormFields.MuiCheckBox name='' label={label} />
    case "CHECKBOX_WITH_IMAGE":
      return <MuiFormFields.MuiCheckBox name='' label={label} />

    case "DATE":
      return <MuiFormFields.MuiDatePicker name='' label={label} />
    case "TIME":
      return <MuiFormFields.MuiMobileDateTimePicker name='' label={label} />

    case "FILE":
      return <MuiFormFields.MuiSingleFileUploadButton name='upload' label="Upload" />
    case "BUTTON":
      return <MuiFormFields.MuiCheckBox name='' label={label} />
    default:
      return <MuiFormFields.MuiTextField name='' label={label} />
  }
}

interface IMuiDynamicFieldProps {
  type: IMuiltiLevelFieldType,
  label?: string,
  options?: ISelectOption[],
  uplaodConfig?: {
    moduleKey: FILE_UPLOAD_KEYS
    payload: IDynamicStringObject
  }
  value: string[];
  onChange: (data: string[]) => void;
}

export const MuiDynamicField: React.FC<IMuiDynamicFieldProps> = ({ type, label, options, value, onChange, uplaodConfig }) => {

  const processedValue: string | string[] = useCallback(() => {
    if (type === "MULTI_CHECK_SELECT") return value || []
    return isArray(value) ? value[0] as string : ""
  }, [value])()

  const handleTextFieldChange = (evt: React.ChangeEvent<any>) => {
    onChange([evt.target.value])
  }

  if (type === "FILE") {
    console.log("FILE value ==>", processedValue)
  }

  switch (type) {
    case "TEXT":
      return <MuiFormFields.MuiTextField name='' label={label} value={processedValue}
        onChange={handleTextFieldChange} />
    case "NUMBER":
      return <MuiFormFields.MuiNumberField name='' label={label} value={processedValue as any}
        onChange={handleTextFieldChange} />
    case "PHONE":
      return <MuiFormFields.MuiPhoneNumberField name='' label={label} value={processedValue as any}
        onChange={handleTextFieldChange} />
    case "PASSWORD":
      return <MuiFormFields.MuiPasswordField name='' label={label} value={processedValue}
        onChange={handleTextFieldChange} />
    case "EMAIL":
      return <MuiFormFields.MuiTextField name='' label={label} value={processedValue}
        onChange={handleTextFieldChange} />
    case "CHECKBOX":
      return <MuiFormFields.MuiCheckBox
        name=''
        label={label} checked={Number(processedValue) === 1 ? true : false}
        onChange={(evt, checked) => onChange([checked ? "1" : "0"])} />
    case "RADIO_GROUP":
      return <MuiFormFields.MuiRadioGroup name='' label={label}
        options={options || []} value={processedValue} onChange={(evt, value) => onChange([value])} />
    case "DATE":
      return <MuiFormFields.MuiDatePicker name=''
        label={label}
        value={processedValue as string}
        onChange={(value) => onChange([value as string])}
      />
    case "TIME":
      return <MuiFormFields.MuiMobileDateTimePicker name='' label={label} />

    case "SELECT":
      return <MuiFormFields.MuiSelect name='' label={label} options={options || []} value={processedValue}
        onChange={(evt) => onChange([evt.target.value as string])} />

    case "MULTI_CHECK_SELECT":
      return <MuiFormFields.MuiMultiCheckBox name=''
        label={label} options={options || []}
        value={processedValue as string[]}
        onChange={(data) => {
          if (!isArray(data)) return
          console.log("MULTI_CHECK_SELECT values ==>", data)
          onChange(data)
        }} />
    case "MULTI_CHECK_SINGLE_SELECT":
      return <MuiFormFields.MuiMultiCheckSingleSelect name=''
        label={label} options={options || []}
        value={processedValue as string}
        onChange={(data) => {
          if (!isString(data)) return
          console.log("MULTI_CHECK_SINGLE_SELECT values ==>", data)
          onChange([data])
        }} />


    // case "SINGLE_IMAGE_SELECT":
    //   return (
    //     <div>
    //       {options?.map((option) => (
    //         <FormControlLabel
    //           key={option.value}
    //           control={<Checkbox checked={(options.map((opt) => opt.value)).includes(value as string)}
    //             value={option.value}
    //             onChange={(evt, checked) => onChange(checked)}
    //           />
    //           }
    //           label={<img src={option.label} alt={option.label} style={{ width: 50, height: 50 }} />}
    //         />
    //       ))}
    //     </div>)

    case "FILE":
      return <MuiFormFields.MuiSingleFileUploadButtonAsync
        name='question_option'
        label='Upload Image'
        moduleKey={uplaodConfig?.moduleKey as any}
        payload={uplaodConfig?.payload as any}
        value={processedValue as string}
        onChange={(newUrl) => onChange([newUrl as string])}
      />
    default:
      return <MuiFormFields.MuiTextField name='' label={label} value={processedValue}
        onChange={handleTextFieldChange} />
  }
};

