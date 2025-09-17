import type { ChipProps } from '@mui/material/Chip';
import type { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import type { Theme, SxProps } from '@mui/material/styles';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { TextFieldProps } from '@mui/material/TextField';
import type { InputLabelProps } from '@mui/material/InputLabel';
import type { FormControlProps } from '@mui/material/FormControl';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Divider, OutlinedInput, styled } from '@mui/material';
import { ISelectOption } from 'src/types/common';
import { ba } from '@fullcalendar/core/internal-common';

// ----------------------------------------------------------------------

const CustomSelectLabel = styled(InputLabel)(({ theme }) => ({
    top: -7,
    '&.MuiInputLabel-root.MuiInputLabel-shrink': {
        top: 0,
        backgroundColor: theme.palette.mode === "light" ? "#FFFFFF" : "#1c252e",
    },
}));
// const CustomSelectLabel = styled(InputLabel)(({ theme }) => ({
//   '&.MuiInputLabel-outlined': {
//     transform: 'translate(14px, 12px) scale(1)',  // normal state
//   },
//   '&.MuiInputLabel-shrink': {
//     transform: 'translate(14px, -9px) scale(0.75)',  // floated state
//   },
// }));

const CustomSelect = styled(Select)(({ theme }) => (theme.palette.mode === "light" && {
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#00000082', // Default border color
    },
    // '&:hover .MuiOutlinedInput-notchedOutline': {
    //     borderColor: 'green', // Border color on hover
    // },
    // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //     borderColor: 'red', // Border color when focused
    // },
}));



//##############################################################################################
//###################################  Single Option Select ####################################
//##############################################################################################
export type IMuiSelectProps = {
    sx?: SelectProps["sx"]
    name: string
    label?: string
    value?: unknown
    placeholder?: string
    disabled?: boolean
    options: ISelectOption[];
    onChange?: SelectProps["onChange"]
    error?: string
}

export const MuiSelect: React.FC<IMuiSelectProps> = ({
    name, options, label, sx, value, placeholder, error, disabled, onChange
}) => {
    const selectLabelId = `${name}-select-label-id`;
    return (
        <FormControl sx={{ width: "100%" }} error={!!error} fullWidth>
            {label && <CustomSelectLabel shrink={value ? true : undefined} id={selectLabelId}>{label}</CustomSelectLabel>}
            <CustomSelect
                sx={sx}
                fullWidth
                labelId={selectLabelId}
                id={name}
                name={name}
                label={label}
                size="small"
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                input={<OutlinedInput label={label} />} // ✅ notch support
            >
                <MenuItem value={null as any}><em>None</em></MenuItem>
                <Divider />
                {options.map((option, o_idx) => <MenuItem key={o_idx} value={option.value}>{option.label}</MenuItem>)}
            </CustomSelect>
            {!!error && (
                <FormHelperText error={!!error}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    )
}




//##############################################################################################
//################################### Multi Option Select ######################################
//##############################################################################################

type IMuiMultiSelectProps = Omit<FormControlProps, "onChange"> & {
    name: string;

    label?: string;
    chip?: boolean;
    checkbox?: boolean;
    placeholder?: string;
    options: {
        label: string;
        value: string;
    }[];
    value?: string[]
    onChange: SelectProps["onChange"]
    slotProps?: {
        chip?: ChipProps;
        select: SelectProps;
        checkbox?: CheckboxProps;
        inputLabel?: InputLabelProps;
        formHelperText?: FormHelperTextProps;
    };
    error?: string
};

export function MuiMultiSelect({
    name,
    value = [],
    chip,
    label,
    options,
    checkbox,
    placeholder,
    slotProps,
    error,
    onChange,
    ...other
}: IMuiMultiSelectProps) {
    const labelId = `${name}-select-label`;

    return (
        <FormControl sx={{ width: "100%" }} error={!!error} {...other}>
            {label && (
                <CustomSelectLabel htmlFor={labelId} {...slotProps?.inputLabel}>
                    {label}
                </CustomSelectLabel>
            )}
            <CustomSelect
                fullWidth
                multiple
                displayEmpty={!!placeholder}
                placeholder={placeholder}
                label={label}
                size="small"
                value={value}
                onChange={onChange}
                renderValue={(selected) => {
                    console.log("selected ==>", selected);
                    const selectedItems = options.filter((item) =>
                        (selected as string[]).includes(item.value)
                    );

                    if (!selectedItems.length && placeholder) {
                        return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                    }

                    if (chip) {
                        return (
                            <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                                {selectedItems.map((item) => (
                                    <Chip
                                        key={item.value}
                                        size="small"
                                        variant="soft"
                                        label={item.label}
                                        {...slotProps?.chip}
                                    />
                                ))}
                            </Box>
                        );
                    }

                    return selectedItems.map((item) => item.label).join(', ');
                }}
                {...slotProps?.select}
                inputProps={{ id: labelId, ...slotProps?.select?.inputProps }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {checkbox && (
                            <Checkbox
                                size="small"
                                disableRipple
                                checked={value?.includes(option.value)}
                                {...slotProps?.checkbox}
                            />
                        )}
                        {option.label}
                    </MenuItem>
                ))}
            </CustomSelect>

            {!!error && (<FormHelperText error={!!error}> {error}  </FormHelperText>)}
        </FormControl>
    );
}









// ================================================================
type IBasicSelectProps = Omit<TextFieldProps, "error"> & {
    name: string;
    native?: boolean;
    children: React.ReactNode;
    slotProps?: {
        paper?: SxProps<Theme>;
    };
    error?: string
};

export const BasicSelect: React.FC<IBasicSelectProps> = (props) => {
    const { name, native, children, slotProps, helperText, inputProps, InputLabelProps, error } = props
    const labelId = `${name}-select-label`;
    return (
        <TextField
            {...props}
            select
            fullWidth
            SelectProps={{
                native,
                MenuProps: { PaperProps: { sx: { maxHeight: 220, ...slotProps?.paper } } },
                sx: { textTransform: 'capitalize' },
            }}
            InputLabelProps={{ htmlFor: labelId, ...InputLabelProps }}
            inputProps={{ id: labelId, ...inputProps }}
            error={!!error}
            helperText={error}
        >
            {children}
        </TextField>
    );
}

// type IMuiSelectProps = {
//     name: string
//     label: string
//     value?: string | number | null
//     placeholder?: string
//     disabled?: boolean
//     options: ISelectOption[];
//     onChange?: (event: SelectChangeEvent) => void
//     error?: string
// }

// export const MuiSelect: React.FC<IMuiSelectProps> = ({
//     name, options, label, value, placeholder, error, disabled, onChange
// }) => {
//     return (
//         <BasicSelect
//             name={`items[${name}].service`}
//             size="small"
//             label={label}
//             placeholder={placeholder}
//             InputLabelProps={{ shrink: true }}
//             // sx={{ maxWidth: { md: 160 } }}
//             disabled={disabled}
//             error={error}
//             value={value}
//         >
//             <MenuItem
//                 value=""
//                 onClick={() => {
//                     let event: any = {
//                         target: {
//                             name,
//                             value: null
//                         }
//                     }
//                     if (onChange) {
//                         onChange(event)
//                     }
//                 }}
//                 sx={{ fontStyle: 'italic', color: 'text.secondary' }}
//             >
//                 None
//             </MenuItem>

//             <Divider sx={{ borderStyle: 'dashed' }} />

//             {options.map((option, m_idx) => (
//                 <MenuItem
//                     key={`${m_idx}-${option.value}`}
//                     value={option.value}
//                     onClick={() => {
//                         let event: any = {
//                             target: {
//                                 name,
//                                 value: option.value
//                             }
//                         }
//                         if (onChange) {
//                             onChange(event)
//                         }
//                     }}
//                 >
//                     {option.label}
//                 </MenuItem>
//             ))}
//         </BasicSelect>
//     )
// }

