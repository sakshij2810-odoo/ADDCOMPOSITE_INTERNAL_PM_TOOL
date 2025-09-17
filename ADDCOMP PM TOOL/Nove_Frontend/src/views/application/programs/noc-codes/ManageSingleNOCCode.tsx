import { LoadingButton } from '@mui/lab';
import { Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSingleNocCodestateSync, clearSingleStudyProgramtateSync, fetchSingleNocCodeWithArgsAsync, fetchSingleStudyProgramWithArgsAsync, IStoreState, upsertSingleNocCodeWithCallbackAsync, upsertSingleStudyProgramWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux';
import { ILoadState } from 'src/redux/store.enums';
import { useParams, useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';

const ManageSingleNOCCode = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.nocCodes.single_noc_code);

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: singleleadInfo,
        validate: values => {
            let errors: any = {}
            if (!values.noc_unit_groups_code) {
                errors.noc_unit_groups_code = "*This is required field"
            }
            if (!values.noc_codes_groups_title) {
                errors.noc_codes_groups_title = "*This is required field"
            }
            // if (!values.noc_codes_groups_description) {
            //     errors.noc_codes_groups_description = "*This is required field"
            // }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleNocCodeWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        router.push(main_app_routes.app.programs.nocCodes)
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleNocCodeWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleleadInfo)
    }, [singleleadInfo])


    useEffect(() => {
        return () => {
            dispatch(clearSingleNocCodestateSync())
        }
    }, [])

    return (
        <DashboardContent metaTitle='NOC Code Details' loading={ILoadState.pending === loading}>
            <CustomBreadcrumbs
                heading="Manage NOC Code "
                links={[
                    { name: 'NOC Codes', href: main_app_routes.app.programs.studyProgram },
                    { name: 'Manage' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='NOC Code Details' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} lg={4}>
                            <MuiFormFields.MuiTextField
                                name="noc_unit_groups_code" label="NOC Unit Groups Code" value={values.noc_unit_groups_code}
                                onChange={handleChange} error={errors.noc_unit_groups_code}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} lg={4}>
                            <MuiFormFields.MuiTextField
                                name="noc_codes_groups_title" label="NOC Codes Groups Title" value={values.noc_codes_groups_title}
                                onChange={handleChange} error={errors.noc_codes_groups_title}
                            />
                        </Grid>
                        {/* <Grid item xs={12} md={12} lg={12}>
                            <MuiFormFields.MuiTextField
                                name="noc_codes_groups_description" label="NOC Codes Groups Description" value={values.noc_codes_groups_description}
                                onChange={handleChange} error={errors.noc_codes_groups_description}
                                multiline minRows={3}
                            />
                        </Grid> */}
                    </Grid>
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained">
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </form>

        </DashboardContent>
    )
}

export default ManageSingleNOCCode