import type { RadioProps } from '@mui/material/Radio';
import type { Theme, SxProps } from '@mui/material/styles';
import type { FormLabelProps } from '@mui/material/FormLabel';
import type { RadioGroupProps } from '@mui/material/RadioGroup';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ISelectOption } from 'src/types/common';

// ----------------------------------------------------------------------

type IMuiRadioGroupProps = RadioGroupProps & {
    name: string;
    label?: string;
    slotProps?: {
        wrap?: SxProps<Theme>;
        radio: RadioProps;
        formLabel: FormLabelProps;
        formHelperText: FormHelperTextProps;
    };
    options: ISelectOption[];
    error?: string
};

export const MuiRadioGroup: React.FC<IMuiRadioGroupProps> = (props) => {

    const { name, label, options, slotProps, error, ...rest } = props

    const labelledby = `${name}-radio-buttons-group-label`;
    const ariaLabel = (val: string) => `Radio ${val}`;

    return (
        <FormControl component="fieldset" sx={slotProps?.wrap}>
            {label && (
                <FormLabel
                    id={labelledby}
                    component="legend"
                    {...slotProps?.formLabel}
                    sx={{ typography: 'subtitle2', ...slotProps?.formLabel.sx }}
                >
                    {label}
                </FormLabel>
            )}

            <RadioGroup {...props} aria-labelledby={labelledby}>
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                            <Radio
                                {...slotProps?.radio}
                                inputProps={{
                                    ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                                    ...slotProps?.radio?.inputProps,
                                }}
                            />
                        }
                        label={option.label}
                    />
                ))}
            </RadioGroup>

            {(!!error) && (
                <FormHelperText error={!!error}>
                    {error}
                </FormHelperText>
            )}
        </FormControl>
    );
}
