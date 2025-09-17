import { LoadingButton } from '@mui/lab'
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearSingleUserProfileStateSync, fetchSingleUserProfileWithArgsAsync, ILoadState, IStoreState, upsertSingleUserProfileWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { useParams, useRouter } from 'src/routes/hooks'
import { main_app_routes, paths } from 'src/routes/paths'
import { fData } from 'src/utils/format-number'
import { UserBranchAutoSearch } from '../auto-search/UserBranchAutoSearch'
import { DashboardContent } from 'src/layouts/dashboard'
import { SecurityRoleAutoSearch } from '../auto-search'
import { ButtonWithWriteAccess } from 'src/security/components/ButtonWithWriteAccess'
import { MODULE_KEYS } from 'src/constants/enums'

export const AccountGeneralnformation = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleUserInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.management.userProfiles.single_user_profile);

    const {
        values,
        errors,
        isSubmitting,
        setSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: singleUserInfo,
        validate: values => {
            let errors: any = {}
            if (!values.first_name) {
                errors.first_name = "*This is required field"
            }
            else if (!values.personal_email) {
                errors.personal_email = "*This is required field";
            } else if (
                values.personal_email !== "" &&
                !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                    values.personal_email,
                )
            ) {
                errors.personal_email = "*Invalid email address.";
            }
            if (!values.branch_uuid) {
                errors.branch_uuid = "*This is required field"
            }
            if (!values.role_uuid) {
                errors.role_uuid = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleUserProfileWithCallbackAsync({
                payload: values,
                onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        router.push(main_app_routes.app.users)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleUserProfileWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleUserInfo)
    }, [singleUserInfo])


    useEffect(() => {
        return () => {
            dispatch(clearSingleUserProfileStateSync())
        }
    }, [])

    return (
        <DashboardContent disablePadding loading={loading === ILoadState.pending}>
            <Box component={"form"} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <MuiStandardCard
                            sx={{
                                pt: 10,
                                pb: 5,
                                px: 3,
                                textAlign: 'center',
                            }}
                        >
                            <MuiFormFields.MuiUploadAvatar
                                name="photoURL"
                                maxSize={3145728}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                                value={values.photo}
                            />
                        </MuiStandardCard>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <MuiStandardCard title='General Information'>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="first_name" label="First Name"
                                        value={values.first_name} onChange={handleChange}
                                        error={errors.first_name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="last_name" label="Last Name"
                                        value={values.last_name} onChange={handleChange}
                                        error={errors.last_name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiDatePicker
                                        name="date_of_birth" label="Date of birth"
                                        value={values.date_of_birth} onChange={(value) => setFieldValue("date_of_birth", value)}
                                        error={errors.date_of_birth}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="mother_maiden_name" label="Mother's Maiden Name"
                                        value={values.mother_maiden_name} onChange={handleChange}
                                        error={errors.mother_maiden_name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="mobile" label="Mobile"
                                        value={values.mobile} onChange={handleChange}
                                        error={errors.mobile}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="linkedin_profile" label="Linkedin Profile"
                                        value={values.linkedin_profile} onChange={handleChange}
                                        error={errors.linkedin_profile}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <MuiFormFields.MuiTextField
                                        name="personal_email" label="Personal Email"
                                        value={values.personal_email} onChange={handleChange}
                                        error={errors.personal_email}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <UserBranchAutoSearch
                                        label="User Branch"

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
                                        error={errors.branch_uuid}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} lg={4}>
                                    <SecurityRoleAutoSearch
                                        label='User Role'
                                        value={values.role_uuid}
                                        onSelect={(newValue) => {
                                            setValues({
                                                ...values,
                                                role_uuid: newValue.role_uuid,
                                                role_value: newValue.role_value
                                            });
                                        }}
                                        error={errors.role_uuid}
                                    />
                                </Grid>
                            </Grid>

                        </MuiStandardCard>
                    </Grid>
                </Grid>

                <MuiStandardCard title='Address Details' sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="street_address" label="Address"
                                value={values.street_address} onChange={handleChange}
                                error={errors.street_address}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="unit_or_suite" label="Unit/Suite"
                                value={values.unit_or_suite} onChange={handleChange}
                                error={errors.unit_or_suite}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="city" label="City"
                                value={values.city} onChange={handleChange}
                                error={errors.city}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="province_or_state" label="Province or State"
                                value={values.province_or_state} onChange={handleChange}
                                error={errors.province_or_state}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="postal_code" label="Postal Code"
                                value={values.postal_code} onChange={handleChange}
                                error={errors.postal_code}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <MuiFormFields.MuiTextField
                                name="country" label="Country"
                                value={values.country} onChange={handleChange}
                                error={errors.country}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>


                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                    <ButtonWithWriteAccess module={MODULE_KEYS.USERS} type="submit" variant="contained" disabled={isSubmitting}>
                        Save changes
                    </ButtonWithWriteAccess>
                </Stack>
            </Box >
        </DashboardContent>
    )
}
