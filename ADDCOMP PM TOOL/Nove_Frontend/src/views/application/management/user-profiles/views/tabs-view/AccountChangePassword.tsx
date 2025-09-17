import React from 'react'
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { MuiFormFields } from 'src/mui-components';
import { useFormik } from 'formik';
import { Box } from '@mui/material';
import { ButtonWithWriteAccess } from 'src/security/components/ButtonWithWriteAccess';
import { MODULE_KEYS } from 'src/constants/enums';


export function AccountChangePassword() {
    const password = useBoolean();


    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            confirm_new_password: "",
        },
        validate: values => {
            let errors: any = {}
            if (!values.old_password) {
                errors.old_password = "*This is required field"
            }
            if (!values.new_password) {
                errors.new_password = "*This is required field";
            } else if (values.new_password.length < 6) {
                errors.new_password = "Password must be at least 6 characters long.";
            } else if (!values.confirm_new_password) {
                errors.confirm_new_password = "*This is required field";
            } else if (values.new_password !== values.confirm_new_password) {
                errors.confirm_new_password = "Passwords are not matching.";
            }
            return errors
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            // dispatch(upsertSingleUserProfileWithCallbackAsync({
            //     payload: values,
            //     onSuccess(isSuccess, data) {
            //         if (isSuccess) {
            //             router.push(paths.dashboard.users)
            //         }
            //     },
            // }))
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
                <MuiFormFields.MuiTextField
                    name="old_password"
                    type={password.value ? 'text' : 'password'}
                    label="Old password"
                    value={values.old_password}
                    onChange={handleChange}
                    error={errors.old_password}
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

                <MuiFormFields.MuiTextField
                    name="new_password"
                    label="New password"
                    type={password.value ? 'text' : 'password'}
                    value={values.new_password}
                    onChange={handleChange}
                    error={errors.new_password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={password.onToggle} edge="end">
                                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    helperText={
                        <Stack component="span" direction="row" alignItems="center">
                            <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be minimum
                            6+
                        </Stack>
                    }
                />

                <MuiFormFields.MuiTextField
                    name="confirm_new_password"
                    type={password.value ? 'text' : 'password'}
                    label="Confirm new password"
                    value={values.confirm_new_password}
                    onChange={handleChange}
                    error={errors.confirm_new_password}
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

                <ButtonWithWriteAccess module={MODULE_KEYS.USERS} type="submit" variant="contained" disabled={isSubmitting} sx={{ ml: 'auto' }}>
                    Save changes
                </ButtonWithWriteAccess>
            </Card>
        </Box>
    );
}

