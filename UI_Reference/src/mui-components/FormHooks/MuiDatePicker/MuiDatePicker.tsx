import type { Dayjs } from 'dayjs';
import type { TextFieldProps } from '@mui/material/TextField';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { MobileDateTimePickerProps } from '@mui/x-date-pickers/MobileDateTimePicker';

import dayjs from 'dayjs';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { formatStr } from 'src/utils/format-time';
import { STANDARD_APP_DATE_FORMAT, STANDARD_APP_DATE_TIME_FORMAT, STANDARD_APP_TIME_FORMAT } from 'src/utils/format-date-time';
import { styled } from '@mui/material';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';



const CustomDatePicker = styled(DatePicker)(({ theme }) => (theme.palette.mode === "light" && {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#00000082', // Default border color
        },
        // '&:hover fieldset': {
        //     borderColor: 'green', // Border color on hover
        // },
        // '&.Mui-focused fieldset': {
        //     borderColor: 'red', // Border color when focused
        // },
    },
}));

// ----------------------------------------------------------------------
// console.log("date onChage ==> ", {
//     standard_output: newValue,
//     dayjs_standard_output: dayjs(newValue),
//     dayjs_iso_format: dayjs(newValue).toISOString(),
//     dayjs_custom_format: dayjs(newValue).format(STANDARD_APP_DATE_FORMAT),
// })
// ===== Output ==========
// {
//     "standard_output": "2025-01-14T18:30:00.000Z",
//     "dayjs_standard_output": "2025-01-14T18:30:00.000Z",
//     "dayjs_iso_format": "2025-01-14T18:30:00.000Z",
//     "dayjs_custom_format": "01/15/2025"
// }
type IMuiDatePickerProps = Omit<DatePickerProps<Dayjs>, "value"> & {
    name: string;
    size?: TextFieldProps["size"]
    error?: string
    onChange?: (value: string) => void
    format?: string
    value?: Dayjs | null | string
    formattedOutput?: boolean
};

export const MuiDatePicker: React.FC<IMuiDatePickerProps> = (props) => {
    const { name, size, slotProps, error, format, formattedOutput } = props;

    return (
        <DatePicker
            {...props}
            value={dayjs(props.value)}
            onChange={(newValue) => props.onChange && (formattedOutput ? props.onChange(dayjs(newValue).format(format || STANDARD_APP_DATE_FORMAT)) : props.onChange(dayjs(newValue).toISOString()))}
            format={format || STANDARD_APP_DATE_FORMAT}
            slotProps={{
                ...slotProps,
                textField: {
                    fullWidth: true,
                    size: size ? size : "small",
                    error: !!error,
                    helperText: error ?? (slotProps?.textField as TextFieldProps)?.error,
                    ...slotProps?.textField,
                },
            }}
        />
    );
}

// ----------------------------------------------------------------------

type IMuiMobileDateTimePickerProps = MobileDateTimePickerProps<Dayjs> & {
    name: string;
    size?: TextFieldProps["size"]
    error?: string
    onChange?: (value: string) => void
    format?: string
    value?: Dayjs | null | string
    formattedOutput?: boolean
};

export const MuiMobileDateTimePicker: React.FC<IMuiMobileDateTimePickerProps> = (props) => {
    const { name, value, size, format, error, formattedOutput, slotProps } = props
    return (
        <MobileDateTimePicker
            {...props}
            name={name}
            value={dayjs(value)}
            onChange={(newValue) => props.onChange && (formattedOutput ? props.onChange(dayjs(newValue).format(format || STANDARD_APP_DATE_FORMAT)) : props.onChange(dayjs(newValue).toISOString()))}
            format={format || STANDARD_APP_DATE_TIME_FORMAT}
            slotProps={{
                textField: {
                    fullWidth: true,
                    size: size ? size : "small",
                    error: !!error,
                    helperText: error ?? (slotProps?.textField as TextFieldProps)?.error,
                    ...slotProps?.textField,
                },
                ...slotProps,
            }}
        />
    );
}


type IMuiTimePickerProps = TimePickerProps<Dayjs> & {
    name: string;
    size?: TextFieldProps["size"]
    error?: string
    onChange?: (value: string) => void
    format?: string
    value?: Dayjs | null | string
    formattedOutput?: boolean
};


export const MuiTimePicker: React.FC<IMuiTimePickerProps> = (props) => {
    const { name, value, size, format, error, formattedOutput, slotProps } = props
    return (
        <TimePicker
            {...props}
            name={name}
            format={format || STANDARD_APP_TIME_FORMAT}
            value={dayjs(value)}
            onChange={(newValue) => props.onChange && (formattedOutput ? props.onChange(dayjs(newValue).format(format || STANDARD_APP_TIME_FORMAT)) : props.onChange(dayjs(newValue).toISOString()))}
            slotProps={{
                textField: {
                    fullWidth: true,
                    size: size ? size : "small",
                    error: !!error,
                    helperText: error ?? (slotProps?.textField as TextFieldProps)?.error,
                    ...slotProps?.textField,
                },
                ...slotProps,
            }}
        />
    );
}