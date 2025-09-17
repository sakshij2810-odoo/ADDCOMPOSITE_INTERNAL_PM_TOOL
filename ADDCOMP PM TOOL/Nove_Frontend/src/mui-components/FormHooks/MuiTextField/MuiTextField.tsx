import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import React, { useCallback } from 'react';
import { Box, IconButton, InputAdornment, styled } from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { IMuiTextFieldProps } from './MuiTextField.types';


export const MuiCustomTextField = styled(TextField)(({ theme }) => ({
    ...(theme.palette.mode === "light" && {
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
    }),
    '& .MuiOutlinedInput-input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
        // WebkitTextFillColor: "inherit !important",
        borderRadius: 0
    },
    "& input:-internal-autofill-selected": {
        backgroundColor: "light-dark(rgb(232, 240, 254), rgba(70, 90, 126, 0.4)) !important"
    }
}));


//##############################################################################################
//################################### Mui Text Filed ######################################
//##############################################################################################

export const MuiTextField: React.FC<IMuiTextFieldProps> = (props) => {

    const { name, value, size, error, type, onChange } = props
    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            type={type}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error}
            autoComplete="nope"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
            InputProps={props.adornment ? {
                [props.adornmentPosition === "end" ? "endAdornment" : "startAdornment"]: (
                    <InputAdornment position={props.adornmentPosition === "end" ? "end" : "start"}>
                        {typeof props.adornment === "string" ?
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {props.adornment}
                            </Box>
                            : props.adornment
                        }
                        {/* <Iconify icon={props.adornment as React.ReactNode} /> */}
                    </InputAdornment>
                ),
            } : props.InputProps}
        />
    );
}




//##############################################################################################
//################################### Mui Number Field ######################################
//##############################################################################################
interface IMuiNumberFieldProps
    extends Omit<IMuiTextFieldProps, "value"> {
    value?: string | number;
}
export const MuiNumberField: React.FC<IMuiNumberFieldProps> = (props) => {
    const { name, value, size, error, placeholder, type, onChange } = props

    // Process Initial Value
    const processedValue = useCallback(() => {
        if (value === undefined || value === null || value === "") return "";
        const valStr = value.toString();

        if (valStr.startsWith("0.") || valStr === "0") {
            return valStr; // Keep "0." and "0"
        }

        return valStr.replace(/^0+/, ""); // Remove leading zeros from integers
    }, [value])();

    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            value={processedValue}
            placeholder={placeholder ? placeholder : "0"}
            onChange={(event) => {
                if (!props.onChange) return;

                let newValue = event.target.value
                    .replace(/[^0-9.]/g, "")           // Allow digits and dot
                    .replace(/(\..*)\./g, "$1");       // Prevent multiple dots

                // If value starts with '0.' or is exactly "0", keep as is. Else, strip leading zeros.
                if (!newValue.startsWith("0.") && newValue !== "0") {
                    newValue = newValue.replace(/^0+/, "");
                }

                props.onChange({ ...event, target: { ...event.target, name, value: newValue } });
            }}
            error={!!error}
            helperText={error}
            autoComplete="nope"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
            InputProps={props.adornment ? {
                [props.adornmentPosition === "end" ? "endAdornment" : "startAdornment"]: (
                    <InputAdornment position={props.adornmentPosition === "end" ? "end" : "start"}>
                        {typeof props.adornment === "string" ?
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {props.adornment}
                            </Box>
                            : props.adornment
                        }
                        {/* <Iconify icon={props.adornment as React.ReactNode} /> */}
                    </InputAdornment>
                ),
            } : props.InputProps}
        />

    );
}

export const MuiNumberFieldOld: React.FC<IMuiNumberFieldProps> = (props) => {
    const { name, value, size, error, placeholder, type, onChange } = props

    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            type={!props.value || !props.onChange ? "number" : "text"}
            value={props.value?.toString() === "0" ? "" : props.value?.toString()}
            placeholder={placeholder ? placeholder : "0"}
            onChange={(evt) => {
                if (!props.onChange) return
                if (props.value?.toString().includes(".") && evt.target.value === ".") return;
                let newEvt = { ...evt }
                const onlyNums = newEvt.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                newEvt.target.value = onlyNums
                props.onChange(newEvt)
            }}
            error={!!error}
            helperText={error}
            autoComplete="nope"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
            InputProps={props.adornment ? {
                [props.adornmentPosition === "end" ? "endAdornment" : "startAdornment"]: (
                    <InputAdornment position={props.adornmentPosition === "end" ? "end" : "start"}>
                        {typeof props.adornment === "string" ?
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {props.adornment}
                            </Box>
                            : props.adornment
                        }
                        {/* <Iconify icon={props.adornment as React.ReactNode} /> */}
                    </InputAdornment>
                ),
            } : props.InputProps}
        />

    );
}

//##############################################################################################
//################################# Mui Password Field #########################################
//##############################################################################################
export const MuiPasswordField: React.FC<IMuiTextFieldProps> = (props) => {
    const { name, value, size, error, type, onChange } = props
    const password = useBoolean();

    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            placeholder='6+ Characters'
            type={password.value ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            error={!!error}
            helperText={error}
            autoComplete="off"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={password.onToggle} edge="end">
                            <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}



//##############################################################################################
//################################# Mui Phone Number Field #########################################
//##############################################################################################
export const MuiPhoneNumberField: React.FC<IMuiTextFieldProps> = (props) => {
    const { name, value, size, error } = props

    // Process Initial Value
    const processedValue = useCallback(() => {
        if (!value) return ""
        const digits = (value as string).replace(/\D/g, '').substring(0, 10);
        const parts = [];

        if (digits.length > 0) parts.push('(' + digits.substring(0, 3));
        if (digits.length >= 4) parts.push(') ' + digits.substring(3, 6));
        if (digits.length >= 7) parts.push('-' + digits.substring(6, 10));

        return parts.join('').trim();
    }, [value])();

    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            placeholder="(123) 456-7890"
            value={processedValue}
            onChange={(evt) => {
                if (!props.onChange) return
                let newEvt = { ...evt }
                let onlyNums = newEvt.target.value.replace(/\D/g, ""); // Remove non-digits
                if (onlyNums.length > 10) onlyNums = onlyNums.slice(0, 10); // Limit to 10 digits
                newEvt.target.value = onlyNums
                props.onChange(newEvt)
            }}
            error={!!error}
            helperText={error}
            autoComplete="off"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
        />
    );
}

export const MuiPhoneNumberFieldOld: React.FC<IMuiTextFieldProps> = (props) => {
    const { name, value, size, error } = props

    return (
        <MuiCustomTextField
            {...props}
            name={name}
            size={size ? size : "small"}
            fullWidth
            placeholder="(123) 456-7890"
            value={value}
            onChange={(evt) => {
                if (!props.onChange) return
                let newEvt = { ...evt }
                let onlyNums = newEvt.target.value.replace(/\D/g, ""); // Remove non-digits
                if (onlyNums.length > 10) onlyNums = onlyNums.slice(0, 10); // Limit to 10 digits
                newEvt.target.value = onlyNums.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")  // Format (123) 456-7890
                props.onChange(newEvt)
            }}
            error={!!error}
            helperText={error}
            autoComplete="off"
            InputLabelProps={{
                shrink: props.value ? true : undefined
            }}
        />
    );
}