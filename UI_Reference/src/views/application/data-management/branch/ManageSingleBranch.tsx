import { Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearSingleBranchStateSync, clearSingleQuestionnaireStateSync, fetchSingleBranchWithArgsAsync, fetchSingleQuestionnaireWithArgsAsync, IStoreState, upsertSingleBranchWithCallbackAsync, upsertSingleQuestionnaireWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { useParams, useRouter } from 'src/routes/hooks'
import { ILoadState } from 'src/redux/store.enums'
import { main_app_routes } from 'src/routes/paths'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import { IMuiGoogleLocationResponse } from 'src/mui-components/FormHooks/MuiAutocomplete'


const ManageSingleBranch: React.FC<{}> = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleQuestionnaireInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.dataManagement.branch.single_branch);

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
        initialValues: singleQuestionnaireInfo,
        validate: values => {
            let errors: any = {}
            if (!values.branch_name) {
                errors.branch_name = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleBranchWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        router.push(`${main_app_routes.app.management.branch}`)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleBranchWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleQuestionnaireInfo)
    }, [singleQuestionnaireInfo])

    useEffect(() => {
        return () => {
            dispatch(clearSingleBranchStateSync())
        }
    }, [])


    const handleBranchAddressChange = useCallback(
        (data: IMuiGoogleLocationResponse) => {
            setValues((prev) => ({
                ...prev,
                branch_address_line2: data.address,
                branch_address_city: data.city,
                branch_address_state: data.state,
                branch_address_country: data.country,
                branch_address_pincode: data.postalCode,
                branch_address_district: data.district,
            }));
        },
        [setValues],
    );

    return (
        <DashboardContent metaTitle='Branch' loading={ILoadState.pending === loading}>

            <CustomBreadcrumbs
                heading={`${uuid ? "Update" : "Create"} New Branch`}
                links={[
                    { name: 'Branch', href: main_app_routes.app.management.branch },
                    { name: `${uuid ? "Update" : "Create"} New Branch` },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Branch Details' divider>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiTextField
                                name="branch_name" label="Branch Name"
                                value={values.branch_name} onChange={handleChange}
                                error={errors.branch_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_email" label="Branch Email"
                                value={values.branch_email} onChange={handleChange}
                                error={errors.branch_email}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiPhoneNumberField
                                name="branch_phone_no" label="Branch Phone Number"
                                value={values.branch_phone_no} onChange={handleChange}
                                error={errors.branch_phone_no}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} md={12} lg={12}>
                            <MuiFormFields.MuiTextField
                                name="description" label="Description"
                                multiline minRows={4}
                                value={values.description} onChange={handleChange}
                                error={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12} ><Typography variant="h6" >{"Address Details"}</Typography></Grid>
                        {/* <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiGoogleLocationAutoComplete
                                value={values.branch_address_line2 || undefined}
                                onLocationChange={handleBranchAddressChange}
                            />
                        </Grid> */}
                        <Grid xs={12} />
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_line1" label="Address Line 1"
                                value={values.branch_address_line1} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_line2" label="Address Line 2"
                                value={values.branch_address_line2} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_city" label="City"
                                value={values.branch_address_city} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_district" label="District"
                                value={values.branch_address_district} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_state" label="State/Province"
                                value={values.branch_address_state} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_country" label="Country"
                                value={values.branch_address_country} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="branch_address_pincode" label="Postal Code"
                                value={values.branch_address_pincode} onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <Stack flexDirection="row" alignItems="flex-end" sx={{ gap: 2 }}>
                        <MuiFormFields.MuiSelect
                            sx={{ maxWidth: 150 }}
                            label="Status"
                            name="status"
                            value={values.status}
                            onChange={handleChange}
                            placeholder="Select One"
                            options={["ACTIVE", "INACTIVE"].map((template) => {
                                return { label: template, value: template };
                            })}
                        />

                        <LoadingButton type="submit" variant="contained" size='large'
                            loading={isSubmitting}
                            sx={{ minWidth: 150 }}
                        >
                            {'Save changes'}
                        </LoadingButton>
                    </Stack>

                </Stack>
            </form>
        </DashboardContent>
    )
}

export default ManageSingleBranch