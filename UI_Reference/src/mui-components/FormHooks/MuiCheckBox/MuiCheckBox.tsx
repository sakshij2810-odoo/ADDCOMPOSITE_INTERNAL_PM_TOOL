import type { Theme, SxProps } from '@mui/material/styles';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { FormGroupProps } from '@mui/material/FormGroup';
import type { FormLabelProps } from '@mui/material/FormLabel';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ISelectOption } from 'src/types/common';

// ----------------------------------------------------------------------

type IMuiCheckboxProps = Omit<FormControlLabelProps, 'control' | "label"> & {
    label?: string
    name: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        checkbox?: CheckboxProps;
        formHelperText?: FormHelperTextProps;
    };
    error?: string
};

export const MuiCheckBox: React.FC<IMuiCheckboxProps> = (props) => {
    const { name, checked, label, error, slotProps } = props
    const ariaLabel = `Checkbox ${name}`;

    return (
        <Box sx={slotProps?.wrap}>
            <FormControlLabel
                {...props}
                control={
                    <Checkbox
                        checked={checked}
                        {...slotProps?.checkbox}
                        inputProps={{
                            ...(!label && { 'aria-label': ariaLabel }),
                            ...slotProps?.checkbox?.inputProps,
                        }}
                    />
                }
                label={label || ""}
                sx={{
                    ".MuiFormControlLabel-label": {
                        fontSize: "1rem"
                    }
                }}
            />

            {(!!error) && (
                <FormHelperText error={!!error}>
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

type IMuiMultiCheckboxPropsV2 = Omit<FormGroupProps, "onChange"> & {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        checkbox?: CheckboxProps;
        formLabel?: FormLabelProps;
        formHelperText?: FormHelperTextProps;
    };
    options: ISelectOption[];
    value?: string[]
    error?: string
    onChange?: (value: string[]) => void
};

export const MuiMultiCheckBoxV2: React.FC<IMuiMultiCheckboxProps> = (props) => {
    const { name, label, options, value, error, slotProps, helperText, ...other } = props

    const getSelected = (selectedItems: string[], item: string) =>
        selectedItems.includes(item)
            ? selectedItems.filter((value) => value !== item)
            : [...selectedItems, item];

    const accessibility = (val: string) => val;
    const ariaLabel = (val: string) => `Checkbox ${val}`;

    return (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
            {label && (
                <FormLabel
                    component="legend"
                    {...slotProps?.formLabel}
                    sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel?.sx }}
                >
                    {label}
                </FormLabel>
            )}

            <FormGroup {...props as FormGroupProps}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={value?.includes(option.value as string)}
                                onChange={(evt) => props.onChange && props.onChange(getSelected(value ? value : [], option.value as string))}
                                name={accessibility(option.label)}
                                {...slotProps?.checkbox}
                                inputProps={{
                                    ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                                    ...slotProps?.checkbox?.inputProps,
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>

            {(!!error) && (
                <FormHelperText error={!!error} sx={{ mx: 0 }}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}


// ----------------------------------------------------------------------

type IMuiMultiCheckboxProps = Omit<FormGroupProps, "onChange"> & {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        checkbox?: CheckboxProps;
        formLabel?: FormLabelProps;
        formHelperText?: FormHelperTextProps;
    };
    options: ISelectOption[];
    value?: string[]
    error?: string
    onChange?: (value: string[]) => void
};
export const MuiMultiCheckBox: React.FC<IMuiMultiCheckboxProps> = (props) => {
    const { name, label, options, value, error, slotProps, helperText, ...other } = props

    const getSelected = (selectedItems: string[], item: string) =>
        selectedItems.includes(item)
            ? selectedItems.filter((value) => value !== item)
            : [...selectedItems, item];

    const accessibility = (val: string) => val;
    const ariaLabel = (val: string) => `Checkbox ${val}`;


    return (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
            {label && (
                <FormLabel
                    component="legend"
                    {...slotProps?.formLabel}
                    sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel?.sx }}
                >
                    {label}
                </FormLabel>
            )}

            <FormGroup {...props as FormGroupProps}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={value?.includes(option.value as string)}
                                onChange={(evt, checked) => props.onChange && props.onChange(getSelected(value ? value : [], option.value as string))}
                                name={accessibility(option.label)}
                                {...slotProps?.checkbox}
                                inputProps={{
                                    ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                                    ...slotProps?.checkbox?.inputProps,
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>

            {(!!error) && (
                <FormHelperText error={!!error} sx={{ mx: 0 }}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}




type IMuiMultiCheckSingleSelectProps = Omit<IMuiMultiCheckboxProps, "onChange" | "value"> & {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        checkbox?: CheckboxProps;
        formLabel?: FormLabelProps;
        formHelperText?: FormHelperTextProps;
    };
    options: ISelectOption[];
    value?: string
    error?: string
    onChange?: (value: string) => void
};

export const MuiMultiCheckSingleSelect: React.FC<IMuiMultiCheckSingleSelectProps> = (props) => {
    const { name, label, options, value, error, slotProps, helperText, ...other } = props

    const getSelected = (selectedItems: string[], item: string) =>
        selectedItems.includes(item)
            ? selectedItems.filter((value) => value !== item)
            : [...selectedItems, item];

    const accessibility = (val: string) => val;
    const ariaLabel = (val: string) => `Checkbox ${val}`;


    return (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
            {label && (
                <FormLabel
                    component="legend"
                    {...slotProps?.formLabel}
                    sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel?.sx }}
                >
                    {label}
                </FormLabel>
            )}

            <FormGroup {...props as FormGroupProps}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Checkbox
                                checked={option.value === value}
                                onChange={(evt, checked) => props.onChange && props.onChange(option.value as string)}
                                name={accessibility(option.label)}
                                {...slotProps?.checkbox}
                                inputProps={{
                                    ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                                    ...slotProps?.checkbox?.inputProps,
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup>

            {(!!error) && (
                <FormHelperText error={!!error} sx={{ mx: 0 }}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}
