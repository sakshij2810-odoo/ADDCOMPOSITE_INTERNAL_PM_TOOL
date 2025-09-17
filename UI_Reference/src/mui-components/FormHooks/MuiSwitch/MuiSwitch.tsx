import type { SwitchProps } from '@mui/material/Switch';
import type { Theme, SxProps } from '@mui/material/styles';
import type { FormGroupProps } from '@mui/material/FormGroup';
import type { FormLabelProps } from '@mui/material/FormLabel';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export type IMuiSwitchProps = Omit<FormControlLabelProps, 'control'> & {
    name: string;
    helperText?: React.ReactNode;
    slotProps?: {
        wrap?: SxProps<Theme>;
        switch: SwitchProps;
        formHelperText?: FormHelperTextProps;
    };
    error?: string
};

export function MuiSwitch({ name, value, checked, error, label, slotProps, ...other }: IMuiSwitchProps) {

    const ariaLabel = `Switch ${name}`;

    return (
        <Box sx={slotProps?.wrap}>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        {...slotProps?.switch}
                        inputProps={{
                            ...(!label && { 'aria-label': ariaLabel }),
                            ...slotProps?.switch?.inputProps,
                        }}
                    />
                }
                label={label}
                {...other}
            />

            {(!!error) && (
                <FormHelperText
                    error={!!error}
                    {...slotProps?.formHelperText}
                    sx={slotProps?.formHelperText?.sx}
                >
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
}

// ----------------------------------------------------------------------

type RHFMultiSwitchProps = FormGroupProps & {
    name: string;
    label?: string;
    helperText?: React.ReactNode;
    options: {
        label: string;
        value: string;
    }[];
    slotProps?: {
        wrap?: SxProps<Theme>;
        switch: SwitchProps;
        formLabel?: FormLabelProps;
        formHelperText?: FormHelperTextProps;
    };
    error?: string
};

export function MuiMultiSwitch({
    name,
    label,
    options,
    helperText,
    slotProps,
    onChange,
    error,
    ...other
}: RHFMultiSwitchProps) {

    const getSelected = (selectedItems: string[], item: string) =>
        selectedItems.includes(item)
            ? selectedItems.filter((value) => value !== item)
            : [...selectedItems, item];

    const accessibility = (val: string) => val;
    const ariaLabel = (val: string) => `Switch ${val}`;

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

            {/* <FormGroup {...other}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        control={
                            <Switch
                                checked={field.value.includes(option.value)}
                                onChange={() => onChange(getSelected(field.value, option.value))}
                                name={accessibility(option.label)}
                                {...slotProps?.switch}
                                inputProps={{
                                    ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                                    ...slotProps?.switch?.inputProps,
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </FormGroup> */}

            {(!!error) && (
                <FormHelperText error={!!error} sx={{ mx: 0 }} {...slotProps?.formHelperText}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}
