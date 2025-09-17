import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { useAppDispatch } from 'src/redux'
import { createNewUserWithCallbackAsync, defaultCreateNewUser, defaultEducationProfile, IEducationProfile } from 'src/redux/child-reducers'
import { UserBranchAutoSearch } from '../auto-search/UserBranchAutoSearch'
import { SecurityRoleAutoSearch } from '../../../security/auto-search/SecurityRoleAutoSearch'
import { object, ref, string } from 'yup'
import { validation_error_messages } from 'src/constants/constants'

const ValidationSchema = object().shape({
    first_name: string().required(validation_error_messages.required),
    email: string().required(validation_error_messages.email).email(validation_error_messages.valid_email),
    user_password: string().required(validation_error_messages.password).min(6, validation_error_messages.password_min_length),
    confirm_password: string().required("Confirm Password is required")
        .oneOf([ref('user_password')], "Passwords are not matching!"),
    branch_uuid: string().required(validation_error_messages.required),
    role_uuid: string().required(validation_error_messages.required)
});

interface ICreateNewUserDialogProps {
    open: boolean
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: IEducationProfile) => void
}
export const CreateNewUserDialog: React.FC<ICreateNewUserDialogProps> = ({
    open, onClose, onSaveSuccess
}) => {

    const dispatch = useAppDispatch()
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
            ...defaultCreateNewUser,
            confirm_password: ""
        },
        validationSchema: ValidationSchema,
        onSubmit: values => {
            const { confirm_password, ...restPayload } = values
            dispatch(createNewUserWithCallbackAsync({
                payload: restPayload,
                onCallback(isSuccess, data) {
                    onClose()
                },
            }))

        },
    });


    return (
        <MuiStandardDialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            contentWrappedWithForm={{ onSubmit: handleSubmit }}
            title='Create New User'
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose
                },
                {
                    label: 'Save',
                    variant: "contained",
                    type: "submit"
                }
            ]}
        >
            <Grid container spacing={2} >

                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="first_name" label="First Name"
                        value={values.first_name} onChange={handleChange}
                        error={errors.first_name}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="last_name" label="Last Name"
                        value={values.last_name} onChange={handleChange}
                        error={errors.last_name}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="email" label="Email"
                        value={values.email} onChange={handleChange}
                        error={errors.email}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiPasswordField
                        name="user_password" label="Password" type="password"
                        value={values.user_password} onChange={handleChange}
                        error={errors.user_password}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiPasswordField
                        name="confirm_password" label="Confirm Password" type='password'
                        value={values.confirm_password} onChange={handleChange}
                        error={errors.confirm_password}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <UserBranchAutoSearch
                        label="User Branch"
                        error={errors.branch_uuid}
                        value={{
                            branch_uuid: values.branch_uuid,
                            branch_name: values.branch_name,
                        }}
                        onSelect={(value) => {
                            setValues({
                                ...values,
                                branch_uuid: value.branch_uuid as string,
                                branch_name: value.branch_name as string,
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <SecurityRoleAutoSearch
                        label='User Role'
                        value={values.role_uuid}
                        onSelect={(newValue) => {
                            setValues({
                                ...values,
                                role_uuid: newValue.role_uuid,
                                role_value: newValue.role_value
                            })
                        }}
                        error={errors.role_uuid}
                    />
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
